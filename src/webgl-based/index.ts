import fragmentShaderSource from "./shaders/mandelbrot.glsl?raw";
import vertexShaderSource from "./shaders/screen.glsl?raw";
import { throwError } from "../assertions";
import { createProgram } from "./program";
import { setScreenGeometry, drawScreen } from "./screen";
import { Vec2 } from "../Vec2";

type MouseState = {
  previousPosition?: Vec2;
};

const canvas = document.querySelector("canvas") ?? throwError();
canvas.width = canvas.clientWidth;
canvas.height = canvas.clientHeight;

const gl = canvas.getContext("webgl") ?? throwError();

const mouseState: MouseState = {
  previousPosition: undefined,
};

const gameState = {
  offset: new Vec2(canvas.width / 2, canvas.height / 2),
  scale: Vec2.ONE.scale(250),
};

main();

async function main() {
  const program = createProgram(gl, vertexShaderSource, fragmentShaderSource);
  gl.useProgram(program);

  const offsetLocation = gl.getUniformLocation(program, "offset");
  gl.uniform2fv(offsetLocation, [gameState.offset.x, gameState.offset.y]);

  const scaleLocation = gl.getUniformLocation(program, "scale");
  gl.uniform2fv(scaleLocation, [gameState.scale.x, gameState.scale.y]);

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

  const onMouseDown = (e: MouseEvent) => {
    mouseState.previousPosition = new Vec2(e.clientX, e.clientY);
  };

  const onMouseMove = (e: MouseEvent) => {
    if (mouseState.previousPosition) {
      const p = new Vec2(e.clientX, e.clientY);
      const delta = p
        .substract(mouseState.previousPosition)
        .divide(gameState.scale)
        .scale(new Vec2(1, -1));
      gameState.offset = gameState.offset.add(delta);
      gl.uniform2fv(offsetLocation, [gameState.offset.x, gameState.offset.y]);
    }
  };

  const onMouseUp = () => {
    mouseState.previousPosition = undefined;
  };

  const onWheel = (e: WheelEvent) => {
    if (e.deltaY < 0) {
      gameState.scale = gameState.scale.scale(1.05);
    } else {
      gameState.scale = gameState.scale.scale(0.95);
    }
    gl.uniform2fv(scaleLocation, [gameState.scale.x, gameState.scale.y]);
  };

  const onWebglContextLost = (e: Event) => {
    e.preventDefault();
  };

  const onWebglContextRestore = () => {
    canvas.removeEventListener("mousedown", onMouseDown);
    canvas.removeEventListener("mousemove", onMouseMove);
    canvas.removeEventListener("mouseup", onMouseUp);
    canvas.removeEventListener("wheel", onWheel);
    canvas.removeEventListener("webglcontextlost", onWebglContextLost);
    canvas.removeEventListener("webglcontextrestored", onWebglContextRestore);
    main();
  };

  canvas.addEventListener("mousedown", onMouseDown);
  canvas.addEventListener("mousemove", onMouseMove);
  canvas.addEventListener("mouseup", onMouseUp);
  canvas.addEventListener("wheel", onWheel);
  canvas.addEventListener("webglcontextlost", onWebglContextLost);
  canvas.addEventListener("webglcontextrestored", onWebglContextRestore);
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
