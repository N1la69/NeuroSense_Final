from flask import Blueprint, jsonify
from server.recommendation_service import (
    generate_recommendation,
    get_latest_recommendation
)

rec_api = Blueprint("rec_api", __name__)


@rec_api.route("/recommendation/<userId>", methods=["GET"])
def get_rec(userId):

    rec = get_latest_recommendation(userId)

    if not rec:
        rec = generate_recommendation(userId)

    if not rec:
        return jsonify({"error": "No data available"}), 404

    return jsonify(rec)


@rec_api.route("/recommendation/generate/<userId>", methods=["POST"])
def gen_rec(userId):

    rec = generate_recommendation(userId)

    if not rec:
        return jsonify({"error": "Cannot generate"}), 400

    return jsonify(rec)
