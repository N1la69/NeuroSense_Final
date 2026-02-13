from flask import Blueprint, jsonify
from server.db import sessions

dash_api = Blueprint("dash_api", __name__)

@dash_api.route("/dashboard/<childId>")
def dashboard(childId):

    docs = list(
        sessions.find(
            {"userId": childId},
            {
                "_id": 0,
                "summary": 1,
                "nsi": 1,
                "sessionId": 1,
                "startTime": 1,
                "endTime": 1,
                "game": 1
            }
        )
    )

    scores = []
    sessionIds = []
    latest_summary = None
    latest_nsi = None
    latest_meta = None

    for d in docs:
        sessionIds.append(d.get("sessionId"))

        summary = d.get("summary")

        if summary:
            # USE calibrated_confidence_mean instead
            mean = summary.get("calibrated_confidence_mean")

            if mean is not None:
                scores.append(mean / 100)

        # Always update latest (last doc becomes latest)
        latest_summary = summary
        latest_nsi = d.get("nsi")
        latest_meta = {
            "sessionId": d.get("sessionId"),
            "game": d.get("game"),
            "startTime": d.get("startTime"),
            "endTime": d.get("endTime")
        }

    return jsonify({
        "scores": scores,
        "sessions": sessionIds,
        "latest_nsi": latest_nsi,
        "latest_summary": latest_summary,
        "latest_meta": latest_meta,
        "total_sessions": len(docs)  # ← IMPORTANT FIX
    })
