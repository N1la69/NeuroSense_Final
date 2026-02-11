from ai.models.loso_trainer import (
    train_general_subject_model,
    evaluate_subject_loso
)
from pathlib import Path

def collect_train_paths():

    base = Path("../data")

    paths = []

    for subj in sorted(base.glob("SBJ*")):
        for sess in sorted(subj.glob("S*")):

            train = sess / "Train"

            if (train / "trainData.mat").exists():
                paths.append(str(train))

    return paths


if __name__ == "__main__":

    dirs = collect_train_paths()

    print("Found training sessions:", len(dirs))

    # -------- SUBJECT LOSO VALIDATION --------
    evaluate_subject_loso(dirs)

    # -------- FINAL MODEL --------
    train_general_subject_model(
        dirs,
        "ai/artifacts/general.pkl"
    )
