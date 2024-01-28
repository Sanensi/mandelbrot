export type Color = Readonly<{
  r: number;
  g: number;
  b: number;
}>;

type Gradient = Readonly<{
  percent: number;
  color: Color;
}>;

export class ColorGradient {
  private readonly gradients: ReadonlyArray<Gradient>;

  constructor(gradients: Gradient[]) {
    this.gradients = gradients.toSorted((a, b) => a.percent - b.percent);
  }

  getValue(percent: number): Color {
    if (percent < 0) percent = 0;
    if (percent > 100) percent = 100;

    let startGradient: Gradient = { percent: 0, color: { r: 0, g: 0, b: 0 } };
    let endGradient: Gradient = { percent: 100, color: { r: 0, g: 0, b: 0 } };

    for (const gradient of this.gradients) {
      if (percent <= gradient.percent) {
        endGradient = gradient;
        break;
      }
      startGradient = gradient;
    }

    const startColor = startGradient.color;
    const endColor = endGradient.color;

    const range = endGradient.percent - startGradient.percent;
    const factor = range === 0 ? 0 : (percent - startGradient.percent) / range;

    const color: Color = {
      r: Math.round(startColor.r + factor * (endColor.r - startColor.r)),
      g: Math.round(startColor.g + factor * (endColor.g - startColor.g)),
      b: Math.round(startColor.b + factor * (endColor.b - startColor.b)),
    };

    return color;
  }
}
