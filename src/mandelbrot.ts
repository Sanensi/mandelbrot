import { Color, ColorGradient } from "./ColorGradient";
import { Vec2 } from "./Vec2";

const MAX_ITERATION = 100;

const colorGradient = new ColorGradient([
  { percent: 0, color: { r: 0, g: 0, b: 0 } },
  { percent: 50, color: { r: 255, g: 0, b: 0 } },
  { percent: 75, color: { r: 128, g: 128, b: 255 } },
  { percent: 100, color: { r: 255, g: 255, b: 255 } },
]);

export function getMandelbrotColor(p: Vec2): Color {
  for (let i = 0; i <= MAX_ITERATION; i++) {
    const p_prime = mandelbrotIterations(i, p);
    if (p_prime.length() > 2) {
      return colorGradient.getValue(
        (100 * (MAX_ITERATION - i)) / MAX_ITERATION,
      );
    }
  }
  return { r: 0, g: 0, b: 0 };
}

export function isInMandelbrot(p: Vec2) {
  for (let i = 0; i <= MAX_ITERATION; i++) {
    const p_prime = mandelbrotIterations(i, p);
    if (p_prime.length() > 2) {
      return false;
    }
  }
  return true;
}

export function mandelbrotIterations(iterations: number, c: Vec2): Vec2 {
  let p = c;

  for (let i = 0; i < iterations; i++) {
    p = new Vec2(p.x * p.x - p.y * p.y, 2 * p.x * p.y).add(c);
  }

  return p;
}
