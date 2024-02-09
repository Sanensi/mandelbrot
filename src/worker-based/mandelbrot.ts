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

export const WORKER_COUNT = navigator.hardwareConcurrency;

const workers = Array.from(
  { length: WORKER_COUNT },
  () => new MandelbrotWorker(),
);
let availableWorkerIndex = 0;

export function getMandelbrotColors(
  slice: CanvasMandelbrotMapping[],
  maxIteration: number,
): Promise<MandelbrotColor[]> {
  const worker = workers[availableWorkerIndex];
  availableWorkerIndex = (availableWorkerIndex + 1) % WORKER_COUNT;

  return new Promise<MandelbrotColor[]>((resolve, reject) => {
    worker.addEventListener("error", reject);
    worker.addEventListener("messageerror", reject);

    const onMessage = (e: MessageEvent<Color[]>) => {
      const colors = e.data;
      const mandelbrotColors: MandelbrotColor[] = slice.map(
        ({ canvasCoord }, i) => ({ canvasCoord, color: colors[i] }),
      );
      worker.removeEventListener("error", reject);
      worker.removeEventListener("messageerror", reject);
      worker.removeEventListener("message", onMessage);
      resolve(mandelbrotColors);
    };

    worker.addEventListener("message", onMessage);
    worker.postMessage({
      slice: slice.map((m) => m.mandelbrotCoord),
      maxIteration,
    });
  });
}
