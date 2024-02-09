import { Vec2 } from "../Vec2";
import { Color } from "../canvas-based/Color";
import MandelbrotWorker from "./mandelbrot.w?worker";

export async function getMandelbrotColor_w(c: Vec2, maxIteration: number) {
  return new Promise<Color>((resolve, reject) => {
    const worker = new MandelbrotWorker();
    worker.addEventListener("error", reject);
    worker.addEventListener("messageerror", reject);
    worker.addEventListener("message", ({ data: { r, g, b } }) =>
      resolve({ r, g, b }),
    );
    worker.postMessage({ c, maxIteration });
  });
}
