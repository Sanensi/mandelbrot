import { UserConfig, defineConfig } from "vite";
import { resolve } from "path";
import wasm from "vite-plugin-wasm";
import topLevelAwait from "vite-plugin-top-level-await";

const config: UserConfig = defineConfig({
  base: "mandelbrot",
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        canvas: resolve(__dirname, "pages", "canvas-based.html"),
        rust: resolve(__dirname, "pages", "rust-based.html"),
        webgl: resolve(__dirname, "pages", "webgl-based.html"),
        worker: resolve(__dirname, "pages", "worker-based.html"),
      },
    },
  },
  plugins: [
    wasm(),
    topLevelAwait(),
    {
      name: "prepend-base-url-to-anchor",
      transformIndexHtml: (html) => {
        return html.replace(/<a href="\//g, `<a href="/${config.base}/`);
      },
    },
  ],
});

export default config;
