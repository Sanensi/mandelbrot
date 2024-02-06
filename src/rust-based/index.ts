import { Vec2 } from "../Vec2";
import { throwError, assert } from "../assertions";
import { Color } from "../canvas-based/ColorGradient";
import { get_mandelbrot_color, create_vec2 } from "wasm";

const canvas = document.querySelector("canvas") ?? throwError();
const ctx = canvas.getContext("2d") ?? throwError();

canvas.width = canvas.clientWidth;
canvas.height = canvas.clientHeight;

const CANVAS_OFFSET = new Vec2(canvas.width / 2, canvas.height / 2);

let maxIteration = 100;
let offset = Vec2.ZERO;
let scale = Vec2.ONE.scale(250);

const imageData = ctx.createImageData(canvas.width, canvas.height);

render();

function render() {
  const start = performance.now();
  for (let y = 0; y < canvas.height; y++) {
    for (let x = 0; x < canvas.width; x++) {
      const p = new Vec2(x, y);
      const p_prime = canvasToMandelbrotCoord(p);

      const color = get_mandelbrot_color(
        create_vec2(p_prime.x, p_prime.y),
        maxIteration,
      );
      setPixel(imageData, p, color);
      color.free();
    }
  }

  ctx.putImageData(imageData, 0, 0);
  console.log(
    Intl.NumberFormat("en", {
      style: "unit",
      unit: "millisecond",
    }).format(performance.now() - start),
  );
}

function setPixel(imageData: ImageData, p: Vec2, { r, g, b }: Color, a = 255) {
  assert(0 <= r && r <= 255);
  assert(0 <= g && g <= 255);
  assert(0 <= b && b <= 255);
  assert(0 <= a && a <= 255);

  const i = 4 * (p.y * imageData.width + p.x);
  imageData.data[i] = r;
  imageData.data[i + 1] = g;
  imageData.data[i + 2] = b;
  imageData.data[i + 3] = a;
}

function canvasToMandelbrotCoord(p: Vec2) {
  return p.substract(CANVAS_OFFSET).divide(scale).substract(offset);
}
