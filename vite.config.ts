import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";
import path from "path";

export default defineConfig({
  plugins: [react(), svgr()],
  resolve: {
    alias: {
      app: path.resolve(__dirname, "src/app"),
    },
  },
  legacy: {
    inconsistentCjsInterop: true,
  },
  optimizeDeps: {
    include: [
      "@emotion/react",
      "@emotion/styled",
    ],
    rolldownOptions: {
      output: {
        manualChunks(id) {
          if (
            id.includes("node_modules/@mui/") ||
            id.includes("node_modules/@emotion/") ||
            id.includes("node_modules/prop-types") ||
            id.includes("node_modules/react-is") ||
            id.includes("node_modules/hoist-non-react-statics") ||
            id.includes("node_modules/react-transition-group") ||
            id.includes("node_modules/csstype") ||
            id.includes("node_modules/clsx")
          ) {
            return "mui-bundle";
          }
        },
      },
    },
  },
  server: {
    port: 3000,
    open: true,
  },
  build: {
    outDir: "build",
  },
  publicDir: "public",
});
