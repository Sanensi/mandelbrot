import { UserConfig, defineConfig } from "vite";
import { resolve } from "path";
import wasm from "vite-plugin-wasm";

const config: UserConfig = defineConfig({
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
    wasm(),
    {
      name: "prepend-base-url-to-anchor",
      transformIndexHtml: (html) => {
        return html.replace(/<a href="\//g, `<a href="/${config.base}/`);
      },
    },
  ],
});

export default config;
