import { throwError } from "../assertions";
import { Vec2 } from "../Vec2";
import { MandelbrotRenderer } from "./MandelbrotRenderer";

const scaleInput =
  (document.getElementById("scale") as HTMLInputElement) ?? throwError();
const offsetXInput =
  (document.getElementById("offset-x") as HTMLInputElement) ?? throwError();
const offsetYInput =
  (document.getElementById("offset-y") as HTMLInputElement) ?? throwError();

const canvas = document.querySelector("canvas") ?? throwError();

canvas.width = canvas.clientWidth;
canvas.height = canvas.clientHeight;

const CANVAS_OFFSET = new Vec2(canvas.width / 2, canvas.height / 2);

const gl = canvas.getContext("webgl") ?? throwError();

let offset = Vec2.ZERO;
let scale = Vec2.ONE.scale(Number.parseInt(scaleInput.value));

const mandelbrot = new MandelbrotRenderer(gl);

render();

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
  console.log(e.key);

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

function render() {
  mandelbrot.render(offset, scale);
}

function canvasToMandelbrotCoord(p: Vec2) {
  return p.substract(CANVAS_OFFSET).divide(scale).substract(offset);
}
