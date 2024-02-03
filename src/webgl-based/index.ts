import fragmentShaderSource from "./shaders/mandelbrot.glsl?raw";
import vertexShaderSource from "./shaders/screen.glsl?raw";
import { throwError } from "../assertions";
import { createProgram } from "./program";
import { setScreenGeometry, drawScreen } from "./screen";
import { Vec2 } from "../Vec2";

const canvas = document.querySelector("canvas") ?? throwError();
canvas.width = canvas.clientWidth;
canvas.height = canvas.clientHeight;

const gl = canvas.getContext("webgl") ?? throwError();

const gameState = {
  offset: new Vec2(canvas.width / 2, canvas.height / 2),
  scale: Vec2.ONE.scale(250),
};

main();

async function main() {
  const program = createProgram(gl, vertexShaderSource, fragmentShaderSource);
  gl.useProgram(program);

  const offsetLocation = gl.getUniformLocation(program, "offset");
  const scaleLocation = gl.getUniformLocation(program, "scale");

  const positionAttributeLocation = gl.getAttribLocation(program, "position");
  gl.enableVertexAttribArray(positionAttributeLocation);

  const POSITION_ATTRIBUTE_SIZE = 2;
  const screenVertices = [-1.0, -1.0, 1.0, -1.0, -1.0, 1.0, 1.0, 1.0];

  setScreenGeometry(
    gl,
    screenVertices,
    positionAttributeLocation,
    POSITION_ATTRIBUTE_SIZE,
  );

  gl.uniform2fv(offsetLocation, [gameState.offset.x, gameState.offset.y]);
  gl.uniform2fv(scaleLocation, [gameState.scale.x, gameState.scale.y]);

  drawScreen(gl, screenVertices, POSITION_ATTRIBUTE_SIZE);
}
