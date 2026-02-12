import numpy as np
from sklearn.linear_model import Ridge
import joblib
from server.db import sessions
import os


def build_child_dataset(childId):

    print(f"[ADAPT] Building dataset for child: {childId}")

    docs = sessions.find({"userId": childId})

    X, y = [], []

    for d in docs:
        for f in d.get("training_data", []):

            X.append([
                f["theta_beta_ratio"],
                f["entropy"],
                f["engagement"],
                f["variability"],
                0.0
            ])

            y.append(f["label"])

    print(f"[ADAPT] Total samples collected: {len(X)}")

    if len(X) < 100:
        print("[ADAPT] Not enough samples yet (<100). Skipping.")
        return None, None

    return np.array(X), np.array(y)


def train_subject_model(childId):

    X, y = build_child_dataset(childId)

    if X is None:
        return False

    print("[ADAPT] Training subject-specific regression model...")

    model = Ridge(alpha=1.0)
    model.fit(X, y)

    os.makedirs("ai/artifacts", exist_ok=True)

    path = f"ai/artifacts/subject_{childId}.pkl"

    joblib.dump(model, path)

    print(f"[ADAPT] Model saved → {path}")

    return True
