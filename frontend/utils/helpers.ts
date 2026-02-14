export const interpretOverallProgress = (scores: number[]) => {
  const first = Math.round(scores[0] * 100);
  const last = Math.round(scores[scores.length - 1] * 100);

  if (scores.length < 2)
    return `Training has just started. Current focus level is ${last}%.`;

  if (last - first > 5)
    return `Positive improvement observed: Focus increased from ${first}% to ${last}%.`;

  if (last - first < -5)
    return `Some variation seen: Focus changed from ${first}% to ${last}%. This is normal during therapy.`;

  return `Focus level has remained stable around ${last}%.`;
};

export const latestLabel = (score: number) => {
  if (score >= 0.7) return { label: "Strong Focus", color: "#2e7d32" };
  if (score >= 0.55) return { label: "Improving", color: "#ed6c02" };
  return { label: "Needs Practice", color: "#d32f2f" };
};

export const interpretNSIScore = (score: number) => {
  if (score >= 75)
    return {
      label: "Very Stable Neural Response",
      color: "#2e7d32",
      explanation:
        "Neural attention patterns are consistent and well regulated.",
    };

  if (score >= 60)
    return {
      label: "Moderately Stable",
      color: "#ed6c02",
      explanation: "Developing regulation with some variability.",
    };

  return {
    label: "High Variability",
    color: "#d32f2f",
    explanation: "Attention patterns show significant fluctuation.",
  };
};
