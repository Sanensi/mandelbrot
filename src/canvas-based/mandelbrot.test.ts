import { describe, expect, test } from "bun:test";
import { mandelbrot, mandelbrotIterations } from "./mandelbrot";
import { Vec2 } from "../Vec2";

describe("mandelbrotIterations", () => {
  describe("Any number of iteration on the origin remains on the origin", () => {
    for (let i = 0; i <= 100; i++) {
      testMandelbrotIterations(i, Vec2.ZERO, Vec2.ZERO);
    }
  });

  describe("The 0th iteration of any imaginary number is itself", () => {
    for (let y = -2; y <= 2; y += 0.1) {
      for (let x = -2; x <= 2; x += 0.1) {
        const p = new Vec2(x, y);
        testMandelbrotIterations(0, p, p);
      }
    }
  });

  describe("The iterations of 1", () => {
    const one = Vec2.UNIT_I;

    testMandelbrotIterations(0, one, one);
    testMandelbrotIterations(1, one, new Vec2(2, 0));
    testMandelbrotIterations(2, one, new Vec2(5, 0));
    testMandelbrotIterations(3, one, new Vec2(26, 0));
  });

  describe("The iterations of i", () => {
    const i = Vec2.UNIT_J;

    testMandelbrotIterations(0, i, i);
    testMandelbrotIterations(1, i, new Vec2(-1, 1));
    testMandelbrotIterations(2, i, new Vec2(0, -1));
    testMandelbrotIterations(3, i, new Vec2(-1, 1));
  });
});

function testMandelbrotIterations(i: number, p: Vec2, expectedP: Vec2) {
  test(`${i} iterations of ${p.x} + ${p.y}i is equal to ${expectedP.x} + ${expectedP.y}i`, () => {
    expect(mandelbrotIterations(i, p)).toEqual(expectedP);
  });
}

function mandelbrotIterations(iterations: number, c: Vec2): Vec2 {
  const m = mandelbrot(c);
  let p = c;

  for (let i = 0; i < iterations; i++) {
    p = m.next().value;
  }

  return p;
}
