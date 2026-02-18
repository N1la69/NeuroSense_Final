from datetime import datetime
from server.db import sessions, recommendations

def safe_float(value, default=0.0):
    try:
        if value is None:
            return default
        return float(value)
    except:
        return default


# ===============================
# THERAPY STAGE CLASSIFIER
# ===============================
def classify_stage(latest):

    normalized = safe_float(
        latest.get("normalized_nsi"),
        safe_float(latest.get("nsi"), 50.0)
    )

    stability = safe_float(
        latest.get("summary", {}).get("stability_score"),
        50.0
    )

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

    normalized = safe_float(
        latest.get("normalized_nsi"),
        safe_float(latest.get("nsi"), 50.0)
    )

    stability = safe_float(
        latest.get("summary", {}).get("stability_score"),
        50.0
    )

    game_score = safe_float(
        compute_game_score(latest),
        50.0
    )

    trend = safe_float(compute_trend(history), 0.0)
    velocity = safe_float(compute_learning_velocity(history), 0.0)

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

    perf = latest.get("game_performance") or {}

    accuracy = safe_float(perf.get("accuracy"), 0.0)
    score = safe_float(perf.get("score"), 0.0)
    mistakes = safe_float(perf.get("mistakes"), 0.0)

    return (
        0.5 * accuracy * 100 +
        0.4 * min(score / 200.0, 1.0) * 100 +
        0.1 * max(0.0, 100.0 - mistakes * 10.0)
    )


# ===============================
# MAIN ENGINE
# ===============================
def generate_recommendation(userId, sessionId=None):

    latest = sessions.find_one(
        {"userId": userId},
        sort=[("startTime", -1)]
    )

    if not latest:
        return None

    history = list(
        sessions.find(
            {"userId": userId}
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
