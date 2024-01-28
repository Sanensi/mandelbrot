import { Vec2 } from "./Vec2";

const MAX_ITERATION = 100;

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
