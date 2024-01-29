import { throwError } from "../assertions";

const vertexShaderSource = `
attribute vec4 a_position;
void main() {
  gl_Position = a_position;
}
`;

const fragmentShaderSource = `
precision mediump float;

uniform vec2 screen_size;

void main() {
  vec2 normalized = gl_FragCoord.xy / vec2(screen_size.x, screen_size.y);

  float black_to_red = smoothstep(0.0, 0.33, normalized.x);
  float red_to_blue = smoothstep(0.33, 0.66, normalized.x);
  float blue_to_white = smoothstep(0.66, 1.0, normalized.x);

  vec3 color = mix(vec3(0.0, 0.0, 0.0), vec3(1.0, 0.0, 0.0), black_to_red);
  color = mix(color, vec3(0.0, 0.0, 1.0), red_to_blue);
  color = mix(color, vec3(1.0, 1.0, 1.0), blue_to_white);

  // Set the final color
  gl_FragColor = vec4(color, 1.0);
}
`;

main();

function main() {
  const canvas = document.querySelector("canvas") ?? throwError();
  canvas.width = canvas.clientWidth;
  canvas.height = canvas.clientHeight;

  const gl = canvas.getContext("webgl") ?? throwError();
  const program = createProgram(gl);
  gl.useProgram(program);

  const screenSizeLocation = gl.getUniformLocation(program, "screen_size");
  gl.uniform2fv(screenSizeLocation, [canvas.width, canvas.height]);

  const positions = [-1.0, -1.0, 1.0, -1.0, -1.0, 1.0, 1.0, 1.0];
  const positionAttributeLocation = gl.getAttribLocation(program, "a_position");
  gl.enableVertexAttribArray(positionAttributeLocation);

  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
  gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
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
