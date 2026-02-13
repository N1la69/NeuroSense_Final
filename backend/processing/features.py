import numpy as np
from scipy.signal import welch
from scipy.stats import entropy

FS = 256

def bandpower(sig, low, high):
    f, pxx = welch(sig, FS, nperseg=256)
    idx = np.logical_and(f >= low, f <= high)
    return np.trapezoid(pxx[idx], f[idx])    # ✅ NumPy 2.x

def extract_features(sig):

    theta = bandpower(sig, 4, 8)
    beta  = bandpower(sig, 13, 30)

    tbr = theta / (beta + 1e-6)

    prob = np.abs(sig)
    prob = prob / np.sum(prob)

    return {
        "theta_beta_ratio": float(tbr),

        "entropy": float(entropy(prob)),

        "engagement": float(beta / (theta + 1e-6)),

        "variability": float(np.std(sig)),

        "biomarker_score": float(1 / (1 + tbr))

    }
