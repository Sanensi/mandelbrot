import { Image } from "./Image";
import { Vec2 } from "./Vec2";
import { throwError } from "./assertions";

const canvas = document.querySelector("canvas") ?? throwError();
const ctx = canvas.getContext("2d") ?? throwError();

canvas.width = canvas.clientWidth;
canvas.height = canvas.clientHeight;

const offset = new Vec2(canvas.width / 2, canvas.height / 2);
const scale = Vec2.ONE;

const image = new Image(ctx);

function render(ms: number) {
  for (let y = 0; y < canvas.height; y++) {
    for (let x = 0; x < canvas.width; x++) {
      const p = new Vec2(x, y);
      const p_prime = p.substract(offset).divide(scale);

      if (isInMandelbrot(p_prime)) {
        image.setPixel(p, 0, 0, 0);
      }
    }
  }

  ctx.putImageData(image.imageData, 0, 0);
}

function isInMandelbrot(p: Vec2) {
  return -5 <= p.x && p.x <= 5 && -5 <= p.y && p.y <= 5;
}

function renderLoop(ms: number) {
  canvas.width = canvas.clientWidth;
  canvas.height = canvas.clientHeight;
  render(ms);
  requestAnimationFrame(renderLoop);
}

requestAnimationFrame(renderLoop);
