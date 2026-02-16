from flask import Blueprint, request, jsonify
from server.db import sessions

game_api = Blueprint("game_api", __name__)


@game_api.route("/session/game-performance", methods=["POST"])
def save_game_performance():

    data = request.json

    sessionId = data.get("sessionId")

    if not sessionId:
        return jsonify({"error": "sessionId required"}), 400

    sessions.update_one(
        {"sessionId": sessionId},
        {
            "$set": {
                "game_performance": {
                    "score": data.get("score"),
                    "accuracy": data.get("accuracy"),
                    "mistakes": data.get("mistakes"),
                    "reaction_time_avg": data.get("reaction_time_avg")
                }
            }
        }
    )

    return jsonify({"status": "saved"})
