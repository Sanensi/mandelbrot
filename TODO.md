# Todo

## Ideas

- Refactor the application to toggle between webgl and canvas based rendering using the same base ui
  - Consider using a query parameter for the rendering type
- Try writing the main mandelbrot logic using webassembly + (rust/c++)
- Optimize the rendering logic on user action:
  - On pan, apply a translation on the previous image and rerender only the new pixels
  - On higher iteration count, rerender only the pixels which are not in the mandelbrot set

## Bugs

- There is a x5 performance penality when running the canvas-based application with the vite-bundled code.
  - Potential solution: Use bun for bundling instead of vite
