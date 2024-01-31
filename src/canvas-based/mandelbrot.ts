import { Color, ColorGradient } from "./ColorGradient";
import { Vec2 } from "../Vec2";

const MAX_ITERATION = 100;

const colorGradient = new ColorGradient([
  { percent: 0, color: { r: 0, g: 0, b: 0 } },
  { percent: 50, color: { r: 255, g: 0, b: 0 } },
  { percent: 75, color: { r: 128, g: 128, b: 255 } },
  { percent: 100, color: { r: 255, g: 255, b: 255 } },
]);

export function getMandelbrotColor(c: Vec2): Color {
  const m = mandelbrot(c);

  for (let i = 0; i <= MAX_ITERATION; i++) {
    const p = m.next().value;

    if (p.length() > 2) {
      return colorGradient.getValue(
        (100 * (MAX_ITERATION - i)) / MAX_ITERATION,
      );
    }
  }

  return { r: 0, g: 0, b: 0 };
}

export function* mandelbrot(c: Vec2): Generator<Vec2, never> {
  let p = c;

  while (true) {
    p = new Vec2(p.x * p.x - p.y * p.y, 2 * p.x * p.y).add(c);
    yield p;
  }
}
