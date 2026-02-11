import scipy.io as sio
import numpy as np
from pathlib import Path


def load_mat(path):
    mat = sio.loadmat(path)
    # key is usually trainData / testData
    key = [k for k in mat.keys() if not k.startswith("__")][0]
    return mat[key]   # (8, 350, N)


def load_targets(txt_path):
    with open(txt_path) as f:
        return np.array([int(x.strip()) for x in f.readlines()])


def load_subject_session(base_dir):
    """
    base_dir -> path containing:
        trainData.mat
        trainTargets.txt
    """

    X = load_mat(Path(base_dir) / "trainData.mat")
    y = load_targets(Path(base_dir) / "trainTargets.txt")

    # reshape to epochs x channels x samples
    X = np.transpose(X, (2, 0, 1))   # (N, 8, 350)

    return X, y
