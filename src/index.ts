const canvas = document.querySelector("canvas") ?? throwError();
const ctx = canvas.getContext("2d") ?? throwError();

canvas.width = canvas.clientWidth;
canvas.height = canvas.clientHeight;

ctx.strokeRect(100, 100, 500, 400);

function throwError(msg?: string): never {
  throw new Error(msg);
}
