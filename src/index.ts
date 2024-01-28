import { Image } from "./Image";
import { Vec2 } from "./Vec2";
import { throwError } from "./assertions";
import { getMandelbrotColor } from "./mandelbrot";

const canvas = document.querySelector("canvas") ?? throwError();
const ctx = canvas.getContext("2d") ?? throwError();

canvas.width = canvas.clientWidth;
canvas.height = canvas.clientHeight;

const offset = new Vec2(canvas.width / 2, canvas.height / 2);
const scale = Vec2.ONE.scale(200);

performance.mark("render-start");

const image = new Image(ctx);

for (let y = 0; y < canvas.height; y++) {
  for (let x = 0; x < canvas.width; x++) {
    const p = new Vec2(x, y);
    const p_prime = p.substract(offset).divide(scale);
    const color = getMandelbrotColor(p_prime);
    image.setPixel(p, color);
  }
}

ctx.putImageData(image.imageData, 0, 0);

performance.mark("render-end");

const measure = performance.measure("render", {
  start: "render-start",
  end: "render-end",
});
console.log(measure.duration);
