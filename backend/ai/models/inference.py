import joblib
import numpy as np

MODEL_PATH = "ai/artifacts/general.pkl"

model = None


def load():
    global model
    model = joblib.load(MODEL_PATH)


def predict_from_device_features(f):

    """
    f: dict from processing/features.py
    """

    if model is None:
        load()

    x = np.array([[
        f["theta_beta_ratio"],
        f["entropy"],
        f["engagement"],
        f["variability"],
        0.0    # no p300 in device → neutral
    ]])

    p = model.predict_proba(x)[0, 1]

    return float(p * 100)   # attention index 0–100
