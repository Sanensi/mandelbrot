import { Point, Vec2 } from "../Vec2";
import { getMandelbrotColor } from "../canvas-based/mandelbrot";

addEventListener(
  "message",
  (e: MessageEvent<{ slice: Point[]; maxIteration: number }>) => {
    const colors = e.data.slice.map((coord) =>
      getMandelbrotColor(new Vec2(coord), e.data.maxIteration),
    );
    postMessage(colors);
  },
);
