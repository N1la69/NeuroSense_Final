import uuid
from datetime import datetime
from ai.models.subject_trainer import train_subject_model
from processing.preprocessor import EEGBuffer
from processing.features import extract_features
from server.db import sessions


class SessionRecorder:

    def __init__(self, user_id, game):

        self.session_id = str(uuid.uuid4())
        self.user_id = user_id
        self.game = game

        self.buffer = EEGBuffer()

        self.raw_cache = []
        self.feature_cache = []

        sessions.insert_one({
            "sessionId": self.session_id,
            "userId": self.user_id,
            "game": self.game,

            "startTime": datetime.utcnow(),

            "rawSamples": [],
            "features": [],

            "summary": {},
            "nsi": None
        })


    def on_sample(self, sample):

        self.raw_cache.append(sample)
        self.buffer.add(sample["value"])

        if self.buffer.ready():

            sig = self.buffer.get()
            feats = extract_features(sig)

            feats["timestamp"] = sample["timestamp"]
            self.feature_cache.append(feats)

            if len(self.feature_cache) >= 5:
                self.flush()


    def flush(self):

        if self.raw_cache:
            sessions.update_one(
                {"sessionId": self.session_id},
                {"$push": {"rawSamples": {"$each": self.raw_cache}}}
            )

        if self.feature_cache:
            sessions.update_one(
                {"sessionId": self.session_id},
                {"$push": {"features": {"$each": self.feature_cache}}}
            )

        self.raw_cache = []
        self.feature_cache = []


    def close(self):

        self.flush()

        doc = sessions.find_one({"sessionId": self.session_id})

        scores = [
            f["attention_index"]
            for f in doc.get("features", [])
        ]

        summary = {}

        if scores:
            summary = {
                "mean_attention": sum(scores) / len(scores),
                "max_attention": max(scores),
                "min_attention": min(scores),
                "windows": len(scores)
            }

        # ---- Save features for subject adaptation ----
        sessions.update_one(
            {"sessionId": self.session_id},
            {"$set": {
                "training_data": [
                    {
                        "theta_beta_ratio": f["theta_beta_ratio"],
                        "entropy": f["entropy"],
                        "engagement": f["engagement"],
                        "variability": f["variability"],
                        "label": f["attention_index"] / 100.0
                    }
                    for f in doc.get("features", [])
                ],

                "summary": summary,
                "endTime": datetime.utcnow(),
                "nsi": self.compute_nsi()
            }}
        )

        count = sessions.count_documents({"userId": doc["userId"]})
        print(f"[ADAPT] Child {doc['userId']} now has {count} sessions")

        if count >= 3:
            print("[ADAPT] Threshold reached → training subject model")
            train_subject_model(doc["userId"])
        else:
            print("[ADAPT] Waiting for more sessions (need 3)")

        return self.session_id
    

    def compute_nsi(self):

        doc = sessions.find_one({"sessionId": self.session_id})
        feats = doc.get("features", [])

        # Not enough windows for stability judgement
        if len(feats) < 5:
            return "INSUFFICIENT"

        scores = [f["attention_index"] for f in feats]

        mean = sum(scores) / len(scores)

        std = (sum((s - mean) ** 2 for s in scores) / len(scores)) ** 0.5

        cv = std / (mean + 1e-6)   # coefficient of variation

        if cv < 0.15:
            return "STABLE"

        if cv < 0.30:
            return "MODERATE"

        return "FLUCTUATING"

