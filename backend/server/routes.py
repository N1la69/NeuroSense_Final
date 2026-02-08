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

    user = data.get("userId", "test_user")
    game = data.get("game", "Follow the Animal")

    return jsonify(start_session(user, game))


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
