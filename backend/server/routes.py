from flask import Blueprint, request, jsonify
from processing.features import extract_features
from server.service import (
    start_session,
    stop_session,
    get_live
)
from server.db import sessions

api = Blueprint("api", __name__)

# INTERPRETATION
@api.route("/interpret", methods=["POST"])
def interpret():

    feats = request.json
    score = feats["attention_index"]

    if score >= 70:
        label = "Strong Attention Response"
    elif score >= 55:
        label = "Developing Attention"
    else:
        label = "Needs Support"

    return jsonify({
        "score": score,
        "label": label,
        "next_games": recommend(score)
    })


def recommend(score):

    if score < 55:
        return ["Follow the Animal", "Find the Star"]

    if score < 70:
        return ["Color Focus", "Find the Star"]

    return ["Traffic Light"]


# CONTROL ROUTES
@api.route("/session/start", methods=["POST"])
def api_start():
    data = request.json or {}

    childId = data.get("childId")
    game = data.get("game", "Follow the Animal")

    if not childId:
        return jsonify({"error": "childId required"}), 400

    return jsonify(start_session(childId, game))


@api.route("/session/stop", methods=["POST"])
def api_stop():
    return jsonify(stop_session())


@api.route("/session/live", methods=["GET"])
def api_live():
    return jsonify(get_live())


@api.route("/session/summary/<sid>", methods=["GET"])
def api_summary(sid):

    doc = sessions.find_one(
        {"sessionId": sid},
        {"_id": 0}
    )

    if not doc:
        return jsonify({"error": "not found"}), 404

    return jsonify(doc)

# LIVE INTERPRETATION
@api.route("/session/live-interpreted", methods=["GET"])
def live_interpreted():

    live = get_live()

    if "error" in live:
        return jsonify(live)

    score = live.get("attention_index", 0)

    if score >= 70:
        label = "Strong Attention Response"
    elif score >= 55:
        label = "Developing Attention"
    else:
        label = "Needs Support"

    return jsonify({
        **live,
        "label": label,
        "next_games": recommend(score)
    })


@api.route("/progress/<userId>")
def progress(userId):

    docs = list(
        sessions.find(
            {"userId": userId},
            {"_id":0, "summary":1, "startTime":1, "nsi":1}
        )
    )

    trend = []

    for d in docs:
        if d.get("summary"):
            trend.append({
                "date": d["startTime"],
                "mean": d["summary"]["mean_attention"],
                "nsi": d.get("nsi")
            })

    return jsonify(trend)

# SESSION HISTORY
@api.route("/sessions/<childId>", methods=["GET"])
def sessions_by_child(childId):

    docs = list(
        sessions.find(
            {"userId": childId},
            {"_id": 0,
             "sessionId":1,
             "game":1,
             "summary":1,
             "nsi":1,
             "startTime":1}
        )
    )

    return jsonify(docs)

@api.route("/session/detail/<sid>", methods=["GET"])
def session_detail(sid):

    doc = sessions.find_one(
        {"sessionId": sid},
        {"_id": 0}
    )

    if not doc:
        return jsonify({"error": "not found"}), 404


    # Prepare a light trend array for graph
    trend = [
        f.get("attention_index", 0) / 100
        for f in doc.get("features", [])
    ]

    return jsonify({
        "sessionId": doc["sessionId"],
        "game": doc.get("game"),
        "summary": doc.get("summary"),
        "nsi": doc.get("nsi"),
        "trend": trend,
        "startTime": doc.get("startTime"),
        "endTime": doc.get("endTime")
    })
