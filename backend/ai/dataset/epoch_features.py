import numpy as np
from scipy.signal import welch
from scipy.stats import entropy

FS = 250   # dataset sampling


def bandpower(sig, low, high):
    f, pxx = welch(sig, FS, nperseg=250)

    idx = np.logical_and(f >= low, f <= high)

    if hasattr(np, "trapezoid"):
        return np.trapezoid(pxx[idx], f[idx])
    else:
        return np.trapz(pxx[idx], f[idx])


def features_one_channel(sig):

    theta = bandpower(sig, 4, 8)
    beta = bandpower(sig, 13, 30)

    tbr = theta / (beta + 1e-6)

    prob = np.abs(sig)
    prob = prob / (np.sum(prob) + 1e-6)

    return {
        "theta_beta_ratio": tbr,
        "entropy": entropy(prob),
        "engagement": beta / (theta + 1e-6),
        "variability": np.std(sig),

        # P300 proxy: mean amplitude 300–600 ms
        "p300": np.mean(sig[125:200])
    }


def epoch_to_features(epoch):
    """
    epoch: (8, 350)
    → compute features per channel
    → average → channel-agnostic
    """

    feats = []

    for ch in epoch:
        feats.append(features_one_channel(ch))

    # average across 8 channels
    out = {}

    for k in feats[0].keys():
        out[k] = float(np.mean([f[k] for f in feats]))

    return out


def build_feature_matrix(X):
    """
    X: (N, 8, 350)
    return: (N, F)
    """

    rows = []
    for ep in X:
        f = epoch_to_features(ep)
        rows.append([
            f["theta_beta_ratio"],
            f["entropy"],
            f["engagement"],
            f["variability"],
            f["p300"]
        ])

    return np.array(rows)
