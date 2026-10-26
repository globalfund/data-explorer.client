import "@testing-library/jest-dom";
import { TextDecoder, TextEncoder } from "util";
// React Router 7 uses these at import time; jest-environment-jsdom lacks them.
Object.assign(globalThis, { TextDecoder, TextEncoder });
Object.assign(globalThis, {
  __VITE_TEST_ENV__: {
    VITE_API: "https://api.example.test",
    MODE: "test",
    DEV: false,
    PROD: false,
  },
});
afterEach(() => {
  localStorage.clear();
  jest.restoreAllMocks();
});
