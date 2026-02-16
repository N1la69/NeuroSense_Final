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
            "nsi": None,

            "game_performance": {
                "score": None,
                "accuracy": None,
                "mistakes": None,
                "reaction_time_avg": None
            }
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

        previous_sessions = list(
            sessions.find(
                {"userId": doc["userId"], "sessionId": {"$ne": self.session_id}, "nsi": {"$ne": None}}
            ).sort("startTime", 1)
        )

        baseline_nsi = None
        normalized_nsi = None
        delta_from_baseline = None

        if len(previous_sessions) >= 3:

            first_three = previous_sessions[:3]
            baseline_nsi = sum(s["nsi"] for s in first_three) / 3

            delta_from_baseline = nsi - baseline_nsi

            normalized_nsi = 50 + delta_from_baseline

            # clamp
            normalized_nsi = max(0, min(100, normalized_nsi))

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
                "nsi": nsi,
                "baseline_nsi": baseline_nsi,
                "normalized_nsi": normalized_nsi,
                "delta_from_baseline": delta_from_baseline,
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
        
        total_windows = len(feats)

        clean = [
            f for f in feats
            if f.get("signal_quality", 0) >= 0.6
            and f.get("model_confidence", 0) >= 2
        ]

        clean_count = len(clean)

        if clean_count == 0:
            return 0.0, {
                "error": "NO_VALID_WINDOWS",
                "windows": total_windows
            }

        reliability_ratio = clean_count / total_windows

        if reliability_ratio < 0.3:
            return 0.0, {
                "error": "LOW_SIGNAL_RELIABILITY",
                "windows": total_windows,
                "valid_windows": clean_count,
                "reliability_ratio": round(reliability_ratio, 2)
            }

        raw_mc = [f["model_confidence"] for f in clean]
        bs = [f["biomarker_score"] for f in clean]
        sq = [f["signal_quality"] for f in clean]

        raw_mean = sum(raw_mc) / len(raw_mc)

        min_c = min(raw_mc)
        max_c = max(raw_mc)

        calibrated_mc = [
            (c - min_c) / (max_c - min_c + 1e-6) * 100
            for c in raw_mc
        ]

        cal_mean = sum(calibrated_mc) / len(calibrated_mc)

        bs_mean = (sum(bs) / len(bs)) * 100
        sqi_mean = (sum(sq) / len(sq)) * 100

        std_raw = (sum((x - raw_mean) ** 2 for x in raw_mc) / len(raw_mc)) ** 0.5
        cv = std_raw / (raw_mean + 1e-6)

        stability_score = max(0, min(100, 100 * (1 - cv)))

        nsi = (
            0.45 * cal_mean +
            0.25 * bs_mean +
            0.15 * stability_score +
            0.15 * sqi_mean
        )

        summary = {
            "raw_model_confidence_mean": round(raw_mean, 2),
            "calibrated_confidence_mean": round(cal_mean, 2),
            "biomarker_score_mean": round(bs_mean, 2),
            "stability_score": round(stability_score, 2),
            "signal_quality_mean": round(sqi_mean, 2),
            "windows_total": total_windows,
            "windows_used": clean_count,
            "reliability_ratio": round(reliability_ratio, 2)
        }

        return round(max(0, min(100, nsi)), 2), summary


