import { Color, colorGradient } from "./Color";
import { Vec2 } from "../Vec2";

export function getMandelbrotColor(c: Vec2, maxIteration: number): Color {
  const m = mandelbrot(c);

  for (let i = 0; i <= maxIteration; i++) {
    const p = m.next().value;

    if (p.length() > 2) {
      return colorGradient(1 - i / maxIteration);
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
