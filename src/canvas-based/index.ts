import { Vec2 } from "../Vec2";
import { assert, throwError } from "../assertions";
import { getMandelbrotColor } from "./mandelbrot";
import { Color } from "./ColorGradient";

const maxIterationInput =
  (document.getElementById("max-iteration") as HTMLInputElement) ??
  throwError();
const scaleInput =
  (document.getElementById("scale") as HTMLInputElement) ?? throwError();

const canvas = document.querySelector("canvas") ?? throwError();
const ctx = canvas.getContext("2d") ?? throwError();

canvas.width = canvas.clientWidth;
canvas.height = canvas.clientHeight;

let maxIteration = Number.parseInt(maxIterationInput.value);
const offset = new Vec2(canvas.width / 2, canvas.height / 2);
let scale = Vec2.ONE.scale(Number.parseInt(scaleInput.value));

const imageData = ctx.createImageData(canvas.width, canvas.height);

render();

maxIterationInput.addEventListener("change", () => {
  maxIteration = Number.parseInt(maxIterationInput.value);
  render();
});

scaleInput.addEventListener("change", () => {
  scale = Vec2.ONE.scale(Number.parseInt(scaleInput.value));
  render();
});

function render() {
  const start = performance.now();
  for (let y = 0; y < canvas.height; y++) {
    for (let x = 0; x < canvas.width; x++) {
      const p = new Vec2(x, y);
      const p_prime = p.substract(offset).divide(scale);
      const color = getMandelbrotColor(p_prime, maxIteration);
      setPixel(imageData, p, color);
    }
  }

  ctx.putImageData(imageData, 0, 0);
  console.log(performance.now() - start);
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
