import "@testing-library/jest-dom";
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
