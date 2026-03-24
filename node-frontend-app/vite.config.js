import { defineConfig } from "vite";

/** 静态产物在 dist/，开发时直接以 dist 为站点根目录 */
export default defineConfig({
  root: "dist",
  server: {
    port: 5173,
    open: true,
  },
});
