import os
import numpy as np
import pandas as pd
import joblib

from tqdm import tqdm
from pathlib import Path

from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    roc_auc_score
)

from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier
from sklearn.svm import SVC
from sklearn.model_selection import train_test_split

from ai.dataset.mat_loader import load_subject_session
from ai.dataset.epoch_features import build_feature_matrix


# ==================================
# PATHS
# ==================================

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_PATH = os.path.join(BASE_DIR, "..", "data")

SUBJECTS = range(1,16)
SESSIONS = range(1,8)


# ==================================
# LOAD DATASET
# ==================================

print("\nLoading dataset...")

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

print("Dataset shape:", X.shape)


# ==================================
# TRAIN TEST SPLIT
# ==================================

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.25,
    stratify=y,
    random_state=42
)


# ==================================
# MODELS
# ==================================

models = {

    "Logistic Regression":
        LogisticRegression(max_iter=200),

    "Random Forest":
        RandomForestClassifier(
            n_estimators=200,
            class_weight="balanced",
            n_jobs=-1
        ),

    "SVM":
        SVC(
            kernel="rbf",
            probability=True,
            class_weight="balanced"
        )
}


results = []


# ==================================
# TRAIN & EVALUATE
# ==================================

print("\nTraining models...\n")

for name, model in models.items():

    print("Training:", name)

    model.fit(X_train, y_train)

    y_pred = model.predict(X_test)
    y_prob = model.predict_proba(X_test)[:,1]

    acc = accuracy_score(y_test, y_pred)
    prec = precision_score(y_test, y_pred, zero_division=0)
    rec = recall_score(y_test, y_pred, zero_division=0)
    f1 = f1_score(y_test, y_pred, zero_division=0)
    auc = roc_auc_score(y_test, y_prob)

    results.append({
        "Model": name,
        "Accuracy": acc,
        "Precision": prec,
        "Recall": rec,
        "F1 Score": f1,
        "ROC AUC": auc
    })


# ==================================
# RESULT TABLE
# ==================================

df = pd.DataFrame(results)

print("\n===== MODEL COMPARISON =====\n")
print(df)

df.to_csv("model_comparison_results.csv", index=False)

print("\nSaved → model_comparison_results.csv")