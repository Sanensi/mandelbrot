import { Image } from "./Image";
import { Vec2 } from "./Vec2";
import { throwError } from "./assertions";
import { isInMandelbrot } from "./mandelbrot";

const canvas = document.querySelector("canvas") ?? throwError();
const ctx = canvas.getContext("2d") ?? throwError();

canvas.width = canvas.clientWidth;
canvas.height = canvas.clientHeight;

const offset = new Vec2(canvas.width / 2, canvas.height / 2);
const scale = Vec2.ONE.scale(200);

const image = new Image(ctx);

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
