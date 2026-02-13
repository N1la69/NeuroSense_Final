import joblib
import numpy as np
from ai.models.inference import predict_from_device_features


def load_subject(childId):

    path = f"ai/artifacts/subject_{childId}.pkl"

    try:
        return joblib.load(path)
    except:
        return None


def hybrid_predict(childId, feats, session_count):

    print(f"[HYBRID] Sessions for child: {session_count}")

    loso = predict_from_device_features(feats)

    # ---------- LOSO ONLY ----------
    if session_count < 3:
        print("[HYBRID] Using LOSO only")
        return {
            "hybrid_score": float(loso),
            "loso_score": float(loso),
            "subject_score": None,
            "alpha": 0.0
        }

    subj = load_subject(childId)

    if not subj:
        print("[HYBRID] No subject model found → fallback LOSO")
        return {
            "hybrid_score": float(loso),
            "loso_score": float(loso),
            "subject_score": None,
            "alpha": 0.0
        }

    x = np.array([[
        feats["theta_beta_ratio"],
        feats["entropy"],
        feats["engagement"],
        feats["variability"],
        0.0
    ]])

    p = subj.predict(x)[0] * 100 
    p = max(0, min(100, p))

    alpha = min(0.2 * (session_count - 2), 0.7)
    hybrid = alpha * p + (1 - alpha) * loso

    print(f"[HYBRID] α={alpha:.2f} | subject={p:.1f} | loso={loso:.1f}")

    return {
        "hybrid_score": float(hybrid),
        "loso_score": float(loso),
        "subject_score": float(p),
        "alpha": float(alpha)
    }
