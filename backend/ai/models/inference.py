import joblib
import numpy as np

MODEL_PATH = "ai/artifacts/general.pkl"

model = None


def load():
    global model
    model = joblib.load(MODEL_PATH)

try:
    load()
except:
    print("Model not loaded yet")

def predict_from_device_features(f):

    if model is None:
        load()

    x = np.array([[
        f["theta_beta_ratio"],
        f["entropy"],
        f["engagement"],
        f["variability"],
        0.0   # p300 proxy not available on device
    ]])

    p = model.predict_proba(x)[0, 1]

    return float(p * 100)   # attention index 0–100
