import { defineConfig } from "cypress";
import "dotenv/config";
import { E2EUser, getE2ESession } from "./cypress/tasks/auth0";

export default defineConfig({
  projectId: "ioki3q",
  viewportHeight: 820,
  viewportWidth: 1440,
  allowCypressEnv: false,
  expose: {
    api_url: process.env.VITE_API,
  },
  e2e: {
    baseUrl: process.env.VITE_BASE_URL,
    setupNodeEvents(on) {
      on("task", {
        "auth0:session": (user: E2EUser) => getE2ESession(user),
      });
    },
  },
});
