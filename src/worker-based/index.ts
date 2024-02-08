import { Color } from "../canvas-based/ColorGradient";
import { Vec2 } from "../Vec2";
import { assert, throwError } from "../assertions";
import { getMandelbrotColor } from "../canvas-based/mandelbrot";

const renderDurationInput =
  (document.getElementById("render-duration") as HTMLInputElement) ??
  throwError();

const maxIterationInput =
  (document.getElementById("max-iteration") as HTMLInputElement) ??
  throwError();
const scaleInput =
  (document.getElementById("scale") as HTMLInputElement) ?? throwError();
const offsetXInput =
  (document.getElementById("offset-x") as HTMLInputElement) ?? throwError();
const offsetYInput =
  (document.getElementById("offset-y") as HTMLInputElement) ?? throwError();

const canvas = document.querySelector("canvas") ?? throwError();
const ctx = canvas.getContext("2d") ?? throwError();

canvas.width = canvas.clientWidth;
canvas.height = canvas.clientHeight;

const CANVAS_OFFSET = new Vec2(canvas.width / 2, canvas.height / 2);

let maxIteration = Number.parseInt(maxIterationInput.value);
let offset = Vec2.ZERO;
let scale = Vec2.ONE.scale(Number.parseInt(scaleInput.value));

const imageData = ctx.createImageData(canvas.width, canvas.height);

maxIterationInput.addEventListener("change", () => {
  maxIteration = Number.parseInt(maxIterationInput.value);
  render();
});

scaleInput.addEventListener("change", () => {
  scale = Vec2.ONE.scale(Number.parseInt(scaleInput.value));
  render();
});

offsetXInput.value = offset.x.toString();
offsetYInput.value = offset.y.toString();

offsetXInput.addEventListener("change", () => {
  offset = new Vec2(Number.parseFloat(offsetXInput.value), offset.y);
  render();
});

offsetYInput.addEventListener("change", () => {
  offset = new Vec2(offset.x, Number.parseFloat(offsetYInput.value));
  render();
});

canvas.addEventListener("click", (e) => {
  const p = new Vec2(e.clientX, e.clientY);
  const p_prime = canvasToMandelbrotCoord(p);
  console.log(p_prime);
});

canvas.addEventListener("contextmenu", (e) => {
  e.preventDefault();
  const p = new Vec2(e.clientX, e.clientY);
  const p_prime = canvasToMandelbrotCoord(p);

  offset = p_prime.scale(-1);
  offsetXInput.value = offset.x.toString();
  offsetYInput.value = offset.y.toString();
  render();
});

canvas.addEventListener("keypress", (e) => {
  switch (e.key) {
    case "+":
      scale = scale.scale(1.25);
      break;
    case "-":
      scale = scale.scale(0.75);
      break;
  }

  scaleInput.value = scale.x.toString();
  render();
});

render();

function render() {
  const start = performance.now();
  for (let y = 0; y < canvas.height; y++) {
    for (let x = 0; x < canvas.width; x++) {
      const p = new Vec2(x, y);
      const p_prime = canvasToMandelbrotCoord(p);
      const color = getMandelbrotColor(p_prime, maxIteration);
      setPixel(imageData, p, color);
    }
  }

  ctx.putImageData(imageData, 0, 0);
  renderDurationInput.value = Intl.NumberFormat("en", {
    style: "unit",
    unit: "millisecond",
  }).format(performance.now() - start);
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
