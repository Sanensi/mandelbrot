import { Vec2 } from "../Vec2";
import { getMandelbrotColor } from "../canvas-based/mandelbrot";

addEventListener("message", ({ data: { c, maxIteration } }) => {
  const color = getMandelbrotColor(new Vec2(c), maxIteration);
  postMessage(color);
});
