import { Color } from "./ColorGradient";
import { Vec2 } from "./Vec2";
import { assert } from "./assertions";

export class Image {
  private readonly size: Vec2;
  readonly imageData: ImageData;

  constructor(ctx: CanvasRenderingContext2D) {
    this.size = new Vec2(ctx.canvas.width, ctx.canvas.height);
    this.imageData = ctx.createImageData(this.size.x, this.size.y);
  }

  setPixel(p: Vec2, { r, g, b }: Color, a = 255) {
    assert(0 <= p.x && p.x < this.size.x && 0 <= p.y && p.y < this.size.y);
    assert(0 <= r && r <= 255);
    assert(0 <= g && g <= 255);
    assert(0 <= b && b <= 255);
    assert(0 <= a && a <= 255);

    const i = 4 * (p.y * this.size.x + p.x);
    this.imageData.data[i] = r;
    this.imageData.data[i + 1] = g;
    this.imageData.data[i + 2] = b;
    this.imageData.data[i + 3] = a;
  }
}
