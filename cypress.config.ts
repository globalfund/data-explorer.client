import { defineConfig } from "cypress";
import dotenv from "dotenv";

dotenv.config();

export default defineConfig({
  projectId: "ioki3q",
  viewportHeight: 820,
  viewportWidth: 1440,
  e2e: {
    env: {
      api_url: process.env.VITE_API,
      VITE_APP_ENV: "staging",
    },
    baseUrl: process.env.VITE_BASE_URL,
  },
});
