export function getGravityModifier(attention: number) {
  if (attention < 40) return 0.6;
  if (attention < 70) return 1.0;
  return 1.4;
}

export function getObstacleSpeed(attention: number) {
  if (attention < 40) return 1.0;
  if (attention < 70) return 1.5;
  return 2.0;
}
