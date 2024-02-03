import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        canvas: resolve(__dirname, "pages", "canvas-based.html"),
        webgl: resolve(__dirname, "pages", "webgl-based.html"),
      },
    },
  },
});
