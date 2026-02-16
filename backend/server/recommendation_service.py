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

    normalized = latest.get("normalized_nsi", 0)
    stability = latest.get("summary", {}).get("stability_score", 0)

    game_score = compute_game_score(latest)

    trend = compute_trend(history)
    velocity = compute_learning_velocity(history)

    combined_score = (
        0.6 * normalized +
        0.25 * stability +
        0.15 * game_score
    )

    # Low attention
    if combined_score < 50:
        return build(
            "follow_the_ball",
            "easy",
            0.92,
            "Low attention detected. Reinforcing foundational focus."
        )

    # Improving
    if combined_score < 65:
        return build(
            "follow_the_ball",
            "medium",
            0.93,
            "Attention improving. Strengthening sustained attention."
        )

    # Ready for selective training
    if combined_score < 80:
        return build(
            "find_the_color",
            "medium",
            0.95,
            "Ready for selective attention training."
        )

    # Advanced therapy
    return build(
        "find_the_color",
        "hard",
        0.97,
        "High performance detected. Advancing therapy difficulty."
    )


def build(game, difficulty, confidence, reason):

    return {
        "game": game,
        "difficulty": difficulty,
        "confidence": confidence,
        "reason": reason
    }


def compute_trend(history):

    if len(history) < 2:
        return 0

    values = [
        s.get("normalized_nsi", 0)
        for s in history
        if s.get("normalized_nsi") is not None
    ]

    if len(values) < 2:
        return 0

    return values[-1] - values[0]


def compute_stability(history):

    scores = [
        s.get("summary", {}).get("stability_score", 0)
        for s in history
    ]

    if not scores:
        return 0

    return sum(scores) / len(scores)


def compute_learning_velocity(history):

    if len(history) < 3:
        return 0

    first = history[0].get("normalized_nsi", 0)
    last = history[-1].get("normalized_nsi", 0)

    sessions = len(history)

    return (last - first) / sessions


def compute_game_score(latest):

    perf = latest.get("game_performance", {})

    accuracy = perf.get("accuracy") or 0
    score = perf.get("score") or 0
    mistakes = perf.get("mistakes") or 0

    return (
        0.5 * accuracy * 100 +
        0.4 * min(score / 200, 1) * 100 +
        0.1 * max(0, 100 - mistakes * 10)
    )


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
