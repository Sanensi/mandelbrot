import { throwError } from "../assertions";
import fragmentShaderSource from "./mandelbrot.glsl?raw";
import { measure, readMeasurement } from "./profiling";
import { createProgram } from "./program";
import { setScreenGeometry, drawScreen } from "./screen";

const vertexShaderSource = `
attribute vec4 position;
void main() {
  gl_Position = position;
}
`;

main();

async function main() {
  const canvas = document.querySelector("canvas") ?? throwError();
  canvas.width = canvas.clientWidth;
  canvas.height = canvas.clientHeight;

  const offset = [canvas.width / 2, canvas.height / 2];
  const scale = [250.0, 250.0];

  const gl = canvas.getContext("webgl2") ?? throwError();
  const program = createProgram(gl, vertexShaderSource, fragmentShaderSource);
  gl.useProgram(program);

  const screenSizeLocation = gl.getUniformLocation(program, "screen_size");
  gl.uniform2fv(screenSizeLocation, [canvas.width, canvas.height]);

  const offsetLocation = gl.getUniformLocation(program, "offset");
  gl.uniform2fv(offsetLocation, offset);

  const scaleLocation = gl.getUniformLocation(program, "scale");
  gl.uniform2fv(scaleLocation, scale);

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

  const query = measure(gl, () => {
    drawScreen(gl, screenVertices, POSITION_ATTRIBUTE_SIZE);
  });

  await wait(1000);
  readMeasurement(gl, query);
}

async function wait(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}
