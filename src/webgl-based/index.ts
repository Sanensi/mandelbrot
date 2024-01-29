import { throwError } from "../assertions";
import fragmentShaderSource from "./fragment.glsl?raw";

const vertexShaderSource = `
attribute vec4 position;
void main() {
  gl_Position = position;
}
`;

main();

function main() {
  const canvas = document.querySelector("canvas") ?? throwError();
  canvas.width = canvas.clientWidth;
  canvas.height = canvas.clientHeight;

  const offset = [canvas.width / 2, canvas.height / 2];
  const scale = [200.0, 200.0];

  const gl = canvas.getContext("webgl") ?? throwError();
  const program = createProgram(gl);
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
  drawScreen(gl, screenVertices, POSITION_ATTRIBUTE_SIZE);
}

function createProgram(gl: WebGLRenderingContext): WebGLProgram {
  const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
  const fragmentShader = createShader(
    gl,
    gl.FRAGMENT_SHADER,
    fragmentShaderSource,
  );

  const program = gl.createProgram();
  if (!program) {
    throw new Error("Unable to create shader program");
  }

  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const error = gl.getProgramInfoLog(program);
    gl.deleteProgram(program);
    throw new Error(`Program linking failed: ${error}`);
  }

  return program;
}

function createShader(
  gl: WebGLRenderingContext,
  type: number,
  source: string,
): WebGLShader {
  const shader = gl.createShader(type);
  if (!shader) {
    throw new Error(`Unable to create shader of type ${type}`);
  }

  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const error = gl.getShaderInfoLog(shader);
    gl.deleteShader(shader);
    throw new Error(`Shader compilation failed: ${error}`);
  }

  return shader;
}

function setScreenGeometry(
  gl: WebGLRenderingContext,
  positionBufferData: number[],
  positionAttributeLocation: number,
  positionAttributeSize: number,
) {
  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array(positionBufferData),
    gl.STATIC_DRAW,
  );
  gl.vertexAttribPointer(
    positionAttributeLocation,
    positionAttributeSize,
    gl.FLOAT,
    false,
    0,
    0,
  );
}

function drawScreen(
  gl: WebGLRenderingContext,
  screenVertices: number[],
  positionAttributeSize: number,
) {
  gl.drawArrays(
    gl.TRIANGLE_STRIP,
    0,
    screenVertices.length / positionAttributeSize,
  );
}
