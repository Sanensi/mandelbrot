import { throwError } from "../assertions";
import { Vec2 } from "../Vec2";
import { MandelbrotRenderer } from "./MandelbrotRenderer";

const canvas = document.querySelector("canvas") ?? throwError();
canvas.width = canvas.clientWidth;
canvas.height = canvas.clientHeight;

const gl = canvas.getContext("webgl") ?? throwError();

let offset = new Vec2(canvas.width / 2, canvas.height / 2);
let scale = Vec2.ONE.scale(250);

const mandelbrot = new MandelbrotRenderer(gl);

mandelbrot.render(offset, scale);
