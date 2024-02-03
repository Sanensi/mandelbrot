import { defineConfig, IndexHtmlTransformHook } from "vite";
import { resolve } from "path";

const config = defineConfig({
  base: "mandelbrot",
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        canvas: resolve(__dirname, "pages", "canvas-based.html"),
        webgl: resolve(__dirname, "pages", "webgl-based.html"),
      },
    },
  },
  plugins: [
    {
      name: "prepend-base-url-to-anchor",
      transformIndexHtml: (html) => {
        return html.replace(/<a href="\//g, `<a href="/${config.base}/`);
      },
    },
  ],
});

export default config;
