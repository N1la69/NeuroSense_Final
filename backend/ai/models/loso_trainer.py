import numpy as np
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score
import joblib
from pathlib import Path
from tqdm import tqdm

from ai.dataset.epoch_features import build_feature_matrix
from ai.dataset.mat_loader import load_subject_session


# --------------------------------------------------
# Cache features so we don't recompute 105 times
# --------------------------------------------------
def build_subject_cache(subject_dirs):

    print("\n[STEP 1] Building feature cache per session...")

    cache = {}

    for d in tqdm(subject_dirs, desc="Feature extraction"):

        X, y = load_subject_session(d)
        F = build_feature_matrix(X)

        # path example: .../SBJ02/S03/Train
        parts = Path(d).parts
        subj = [p for p in parts if p.startswith("SBJ")][0]

        if subj not in cache:
            cache[subj] = {"X": [], "y": []}

        cache[subj]["X"].append(F)
        cache[subj]["y"].append(y)

    # merge sessions of same subject
    for s in cache:
        cache[s]["X"] = np.vstack(cache[s]["X"])
        cache[s]["y"] = np.concatenate(cache[s]["y"])

        print(f"Subject {s}: samples = {cache[s]['X'].shape}")

    return cache


# --------------------------------------------------
# SUBJECT LEVEL LOSO
# --------------------------------------------------
def evaluate_subject_loso(subject_dirs):

    cache = build_subject_cache(subject_dirs)

    subjects = sorted(cache.keys())

    print("\n[STEP 2] Starting SUBJECT-LEVEL LOSO")
    print("Total subjects:", len(subjects))

    accs = []

    for test_subj in subjects:

        print(f"\n---- Test Subject: {test_subj} ----")

        # ----- TRAIN SET = all except this subject -----
        Xtr, ytr = [], []

        for s in subjects:
            if s == test_subj:
                continue

            Xtr.append(cache[s]["X"])
            ytr.append(cache[s]["y"])

        Xtr = np.vstack(Xtr)
        ytr = np.concatenate(ytr)

        print("Train shape:", Xtr.shape)

        model = LogisticRegression(max_iter=200)
        model.fit(Xtr, ytr)

        # ----- TEST -----
        Xt = cache[test_subj]["X"]
        yt = cache[test_subj]["y"]

        pred = model.predict(Xt)

        acc = accuracy_score(yt, pred)
        accs.append(acc)

        print(f"Accuracy on {test_subj}: {acc:.3f}")
        print(f"Mean so far: {np.mean(accs):.3f}")

    print("\n==== FINAL SUBJECT-LOSO RESULT ====")
    print("Mean accuracy:", np.mean(accs))

    return np.mean(accs)


# --------------------------------------------------
# Train final GENERAL model on ALL subjects
# --------------------------------------------------
def train_general_subject_model(subject_dirs, save_path):

    cache = build_subject_cache(subject_dirs)

    print("\n[STEP 3] Training FINAL GENERAL MODEL on all subjects")

    X, y = [], []

    for s in cache:
        X.append(cache[s]["X"])
        y.append(cache[s]["y"])

    X = np.vstack(X)
    y = np.concatenate(y)

    print("Final training set:", X.shape)

    model = LogisticRegression(max_iter=200)
    model.fit(X, y)

    joblib.dump(model, save_path)

    print("General model saved →", save_path)
