import fragmentShaderSource from "./shaders/mandelbrot.glsl?raw";
import vertexShaderSource from "./shaders/screen.glsl?raw";
import { throwError } from "../assertions";
import { createProgram } from "./program";
import { setScreenGeometry, drawScreen } from "./screen";

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

  startRenderLoop(() => {
    drawScreen(gl, screenVertices, POSITION_ATTRIBUTE_SIZE);
  });
}

function startRenderLoop(render: (ms: number) => void) {
  const renderLoop = (ms: number) => {
    render(ms);
    requestAnimationFrame(renderLoop);
  };
  requestAnimationFrame(renderLoop);
}

async function wait(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}
