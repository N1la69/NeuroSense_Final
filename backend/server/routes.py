from flask import Blueprint, request, jsonify
from processing.features import extract_features

api = Blueprint("api", __name__)

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
