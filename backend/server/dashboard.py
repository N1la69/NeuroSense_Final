from flask import Blueprint, jsonify
from server.db import sessions

dash_api = Blueprint("dash_api", __name__)

@dash_api.route("/dashboard/<childId>")
def dashboard(childId):

    docs = list(
        sessions.find(
            {"userId": childId},
            {"_id": 0, "summary": 1, "nsi": 1, "sessionId": 1}
        )
    )

    scores = []
    sessionIds = []
    nsi = None

    for d in docs:
        if d.get("summary"):
            mean = d["summary"].get("mean_attention")
            if mean is not None:
                scores.append(mean / 100)   # normalize 0–1
                sessionIds.append(d["sessionId"])
                nsi = d.get("nsi")

    return jsonify({
        "scores": scores,
        "sessions": sessionIds,
        "nsi": nsi
    })
