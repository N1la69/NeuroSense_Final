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
    quality = compute_signal_quality(sig)

    tbr = theta / (beta + 1e-6)

    prob = np.abs(sig)
    prob = prob / np.sum(prob)

    return {
        "theta_beta_ratio": float(tbr),

        "entropy": float(entropy(prob)),

        "engagement": float(beta / (theta + 1e-6)),

        "variability": float(np.std(sig)),

        "biomarker_score": float(1 / (1 + tbr)),

        "signal_quality": quality

    }

def compute_signal_quality(sig):

    amplitude = np.max(np.abs(sig))
    variance = np.var(sig)

    # Flatline detection
    if variance < 1e-6:
        return 0.0

    # Saturation detection
    if amplitude > 500:  
        return 0.2

    # Noise estimate using high frequency power
    f, pxx = welch(sig, FS, nperseg=256)
    hf_power = np.sum(pxx[f > 40])
    total_power = np.sum(pxx)

    noise_ratio = hf_power / (total_power + 1e-6)

    quality = 1.0 - noise_ratio

    return float(max(0.0, min(1.0, quality)))
