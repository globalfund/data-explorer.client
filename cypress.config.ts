import { defineConfig } from "cypress";
import "dotenv/config";

export default defineConfig({
  projectId: "ioki3q",
  viewportHeight: 820,
  viewportWidth: 1440,
  expose: {
    api_url: process.env.VITE_API,
  },
  e2e: {
    baseUrl: process.env.VITE_BASE_URL,
  },
});
