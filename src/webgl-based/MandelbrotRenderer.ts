import { Vec2 } from "../Vec2";
import { createProgram } from "./program";
import fragmentShaderSource from "./shaders/mandelbrot.glsl?raw";
import vertexShaderSource from "./shaders/screen.glsl?raw";

const POSITION_ATTRIBUTE_SIZE = 2;
const SCREEN_VERTICES = [-1.0, -1.0, 1.0, -1.0, -1.0, 1.0, 1.0, 1.0];

export class MandelbrotRenderer {
  private readonly gl: WebGLRenderingContext;

  private readonly offsetLocation: WebGLUniformLocation | null;
  private readonly scaleLocation: WebGLUniformLocation | null;
  private readonly positionAttributeLocation: number;

  constructor(gl: WebGLRenderingContext) {
    this.gl = gl;

    const program = createProgram(gl, vertexShaderSource, fragmentShaderSource);
    gl.useProgram(program);

    const canvasSizeLocation = gl.getUniformLocation(program, "CANVAS_SIZE");
    gl.uniform2fv(canvasSizeLocation, [
      this.gl.canvas.width,
      this.gl.canvas.height,
    ]);

    this.offsetLocation = gl.getUniformLocation(program, "offset");
    this.scaleLocation = gl.getUniformLocation(program, "scale");

    const positionAttributeLocation = gl.getAttribLocation(program, "position");
    this.positionAttributeLocation = positionAttributeLocation;
    gl.enableVertexAttribArray(positionAttributeLocation);

    this.setScreenGeometry();
  }

  private setScreenGeometry() {
    const positionBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, positionBuffer);
    this.gl.bufferData(
      this.gl.ARRAY_BUFFER,
      new Float32Array(SCREEN_VERTICES),
      this.gl.STATIC_DRAW,
    );
    this.gl.vertexAttribPointer(
      this.positionAttributeLocation,
      POSITION_ATTRIBUTE_SIZE,
      this.gl.FLOAT,
      false,
      0,
      0,
    );
  }

  render(offset: Vec2, scale: Vec2) {
    this.gl.uniform2fv(this.offsetLocation, [offset.x, -offset.y]);
    this.gl.uniform2fv(this.scaleLocation, [scale.x, scale.y]);
    this.drawScreen();
  }

  private drawScreen() {
    this.gl.drawArrays(
      this.gl.TRIANGLE_STRIP,
      0,
      SCREEN_VERTICES.length / POSITION_ATTRIBUTE_SIZE,
    );
  }
}
