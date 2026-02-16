from datetime import datetime
from server.db import sessions, recommendations


# ===============================
# THERAPY STAGE CLASSIFIER
# ===============================
def classify_stage(latest):

    normalized = latest.get("normalized_nsi")
    stability = latest.get("summary", {}).get("stability_score", 0)
    reliability = latest.get("summary", {}).get("reliability_ratio", 0)

    if normalized is None:
        return 0

    if normalized < 40:
        return 0

    if normalized < 55:
        return 1

    if stability < 65:
        return 2

    if normalized < 70:
        return 3

    if normalized < 85:
        return 4

    return 5


# ===============================
# POLICY ENGINE
# ===============================
def select_game(stage, latest, history):

    delta = latest.get("delta_from_baseline", 0) or 0

    stability = latest.get("summary", {}).get("stability_score", 0)
    reliability = latest.get("summary", {}).get("reliability_ratio", 0)

    # stage → game mapping
    if stage == 0:
        return build("follow_the_ball", "easy", 0.95,
                     "Initial therapy stage. Building basic attention.")

    if stage == 1:
        return build("follow_the_ball", "medium", 0.90,
                     "Improving attention. Strengthening focus stability.")

    if stage == 2:
        return build("follow_the_ball", "hard", 0.88,
                     "Attention unstable. Training sustained attention.")

    if stage == 3:
        return build("find_the_color", "easy", 0.92,
                     "Attention ready for selective training.")

    if stage == 4:
        return build("find_the_color", "medium", 0.94,
                     "Strong progress. Increasing cognitive challenge.")

    return build("find_the_color", "hard", 0.96,
                 "Advanced stage. Maximizing cognitive flexibility.")


def build(game, difficulty, confidence, reason):

    return {
        "game": game,
        "difficulty": difficulty,
        "confidence": confidence,
        "reason": reason
    }


# ===============================
# MAIN ENGINE
# ===============================
def generate_recommendation(userId, sessionId=None):

    latest = sessions.find_one(
        {"userId": userId, "normalized_nsi": {"$ne": None}},
        sort=[("startTime", -1)]
    )

    if not latest:
        return None

    history = list(
        sessions.find(
            {"userId": userId, "normalized_nsi": {"$ne": None}}
        ).sort("startTime", 1)
    )

    stage = classify_stage(latest)

    rec = select_game(stage, latest, history)

    doc = {
        "userId": userId,
        "sessionId": latest["sessionId"],

        "therapy_stage": stage,

        "recommended_game": rec["game"],
        "difficulty": rec["difficulty"],

        "confidence": rec["confidence"],
        "reason": rec["reason"],

        "based_on_nsi": latest.get("normalized_nsi"),

        "createdAt": datetime.utcnow()
    }

    recommendations.insert_one(doc)

    return doc


# ===============================
# FETCH LATEST
# ===============================
def get_latest_recommendation(userId):

    rec = recommendations.find_one(
        {"userId": userId},
        sort=[("createdAt", -1)],
        projection={"_id": 0}
    )

    return rec
