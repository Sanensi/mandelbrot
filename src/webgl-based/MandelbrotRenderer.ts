import { Vec2 } from "../Vec2";
import { createProgram } from "./program";
import { setScreenGeometry, drawScreen } from "./screen";
import fragmentShaderSource from "./shaders/mandelbrot.glsl?raw";
import vertexShaderSource from "./shaders/screen.glsl?raw";

const POSITION_ATTRIBUTE_SIZE = 2;
const screenVertices = [-1.0, -1.0, 1.0, -1.0, -1.0, 1.0, 1.0, 1.0];

export class MandelbrotRenderer {
  private readonly gl: WebGLRenderingContext;

  private readonly offsetLocation: WebGLUniformLocation | null;
  private readonly scaleLocation: WebGLUniformLocation | null;

  constructor(gl: WebGLRenderingContext) {
    this.gl = gl;

    const program = createProgram(gl, vertexShaderSource, fragmentShaderSource);
    gl.useProgram(program);

    this.offsetLocation = gl.getUniformLocation(program, "offset");
    this.scaleLocation = gl.getUniformLocation(program, "scale");

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
  }

  render(offset: Vec2, scale: Vec2) {
    this.gl.uniform2fv(this.offsetLocation, [offset.x, offset.y]);
    this.gl.uniform2fv(this.scaleLocation, [scale.x, scale.y]);

    drawScreen(this.gl, screenVertices, POSITION_ATTRIBUTE_SIZE);
  }
}
