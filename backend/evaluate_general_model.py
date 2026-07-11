import os
import numpy as np
import joblib
import matplotlib.pyplot as plt
import seaborn as sns

from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    roc_auc_score,
    confusion_matrix,
    RocCurveDisplay
)

from pathlib import Path
from tqdm import tqdm

# reuse your training pipeline
from ai.dataset.mat_loader import load_subject_session
from ai.dataset.epoch_features import build_feature_matrix


# ==================================
# PATH CONFIGURATION
# ==================================

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

DATA_PATH = os.path.join(BASE_DIR, "..", "data")
MODEL_PATH = os.path.join(BASE_DIR, "ai", "artifacts", "general.pkl")

SUBJECTS = range(1, 16)
SESSIONS = range(1, 8)


# ==================================
# BUILD EVALUATION DATASET
# ==================================

print("Loading EEG dataset...")

X_all = []
y_all = []

session_dirs = []

for subj in SUBJECTS:
    for sess in SESSIONS:

        path = os.path.join(
            DATA_PATH,
            f"SBJ{subj:02d}",
            f"S{sess:02d}",
            "Train"
        )

        if os.path.exists(path):
            session_dirs.append(path)

print("Total sessions:", len(session_dirs))


for d in tqdm(session_dirs, desc="Extracting features"):

    X, y = load_subject_session(d)

    F = build_feature_matrix(X)

    X_all.append(F)
    y_all.append(y)


X = np.vstack(X_all)
y = np.concatenate(y_all)

print("Total samples:", X.shape)


# ==================================
# LOAD MODEL
# ==================================

print("Loading trained model...")

model = joblib.load(MODEL_PATH)


# ==================================
# PREDICTIONS
# ==================================

y_pred = model.predict(X)
y_prob = model.predict_proba(X)[:, 1]


# ==================================
# METRICS
# ==================================

accuracy = accuracy_score(y, y_pred)
precision = precision_score(y, y_pred, zero_division=0)
recall = recall_score(y, y_pred, zero_division=0)
f1 = f1_score(y, y_pred, zero_division=0)
roc_auc = roc_auc_score(y, y_prob)

print("\n===== MODEL PERFORMANCE =====")

print("Accuracy :", accuracy)
print("Precision:", precision)
print("Recall   :", recall)
print("F1 Score :", f1)
print("ROC AUC  :", roc_auc)


# ==================================
# CONFUSION MATRIX
# ==================================

cm = confusion_matrix(y, y_pred)

plt.figure(figsize=(6,5))

sns.heatmap(
    cm,
    annot=True,
    fmt="d",
    cmap="Blues"
)

plt.xlabel("Predicted Label")
plt.ylabel("True Label")
plt.title("Confusion Matrix")

plt.tight_layout()

cm_path = os.path.join(BASE_DIR, "confusion_matrix.png")
plt.savefig(cm_path)

print("Saved:", cm_path)


# ==================================
# ROC CURVE
# ==================================

plt.figure()

RocCurveDisplay.from_predictions(y, y_prob)

plt.title("ROC Curve")

roc_path = os.path.join(BASE_DIR, "roc_curve.png")
plt.savefig(roc_path)

print("Saved:", roc_path)

plt.show()