import uuid
from datetime import datetime

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

        sessions.update_one(
            {"sessionId": self.session_id},
            {"$set": {
                "summary": summary,
                "endTime": datetime.utcnow(),
                "nsi": "PENDING"
            }}
        )

        return self.session_id
