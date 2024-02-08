export type Color = Readonly<{
  r: number;
  g: number;
  b: number;
}>;

export function colorGradient(weight: number): Color {
  if (weight < 0.0) {
    return { r: 0, g: 0, b: 0 };
  }
  if (weight < 0.33) {
    let normalized_weight = weight / 0.33;
    return {
      r: 255.0 * normalized_weight,
      g: 0,
      b: 0,
    };
  }
  if (weight < 0.66) {
    let normalized_weight = (weight - 0.33) / 0.33;
    return {
      r: 255.0 * (1.0 - normalized_weight),
      g: 0,
      b: 255.0 * normalized_weight,
    };
  }
  if (weight < 1.0) {
    let normalized_weight = (weight - 0.66) / 0.33;
    return {
      r: 255.0 * normalized_weight,
      g: 255.0 * normalized_weight,
      b: 255,
    };
  }
  return {
    r: 255,
    g: 255,
    b: 255,
  };
}
