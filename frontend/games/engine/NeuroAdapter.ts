export function normalizeAttention(attention: number) {
  return Math.max(0, Math.min(100, attention));
}

export function attentionToLift(attention: number) {
  const normalized = normalizeAttention(attention);

  return normalized / 100;
}

export function attentionToDifficulty(attention: number) {
  if (attention < 40) return 0.8;
  if (attention < 70) return 1.0;
  return 1.2;
}
