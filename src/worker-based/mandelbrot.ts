import { Vec2 } from "../Vec2";
import { Color } from "../canvas-based/Color";
import MandelbrotWorker from "./mandelbrot.w?worker";

export type CanvasMandelbrotMapping = {
  canvasCoord: Vec2;
  mandelbrotCoord: Vec2;
};

export type MandelbrotColor = {
  canvasCoord: Vec2;
  color: Color;
};

export async function getMandelbrotColors(
  slice: CanvasMandelbrotMapping[],
  maxIteration: number,
): Promise<MandelbrotColor[]> {
  return new Promise<MandelbrotColor[]>((resolve, reject) => {
    const worker = new MandelbrotWorker();
    worker.addEventListener("error", reject);
    worker.addEventListener("messageerror", reject);
    worker.addEventListener("message", (e: MessageEvent<Color[]>) => {
      const colors = e.data;
      const mandelbrotColors: MandelbrotColor[] = slice.map(
        ({ canvasCoord }, i) => ({ canvasCoord, color: colors[i] }),
      );
      resolve(mandelbrotColors);
    });
    worker.postMessage({
      slice: slice.map((m) => m.mandelbrotCoord),
      maxIteration,
    });
  });
}
