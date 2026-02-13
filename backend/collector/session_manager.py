import uuid
from datetime import datetime
from ai.models.subject_trainer import train_subject_model
from ai.models.hybrid_inference import hybrid_predict
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

            session_count = sessions.count_documents(
                {"userId": self.user_id}
            )

            pred = hybrid_predict(
                self.user_id,
                feats,
                session_count
            )

            feats["model_confidence"] = pred["hybrid_score"]
            feats["alpha"] = pred["alpha"]

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
        
        nsi, summary = self.compute_nsi()

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
                        "label": f["model_confidence"] / 100.0
                    }
                    for f in doc.get("features", [])
                ],
                "summary": summary,
                "endTime": datetime.utcnow(),
                "nsi": nsi
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

        if len(feats) < 5:
            return None, None

        mc = [f["model_confidence"] for f in feats]
        bs = [f["biomarker_score"] for f in feats]

        mc_mean = sum(mc) / len(mc)
        bs_mean = (sum(bs) / len(bs)) * 100

        std = (sum((x - mc_mean) ** 2 for x in mc) / len(mc)) ** 0.5
        cv = std / (mc_mean + 1e-6)

        stability_score = max(0, min(100, 100 * (1 - cv)))

        nsi = (
            0.5 * mc_mean +
            0.3 * bs_mean +
            0.2 * stability_score
        )

        summary = {
            "model_confidence_mean": round(mc_mean, 2),
            "biomarker_score_mean": round(bs_mean, 2),
            "stability_score": round(stability_score, 2),
            "windows": len(mc)
        }   

        return round(max(0, min(100, nsi)), 2), summary


