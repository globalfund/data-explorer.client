module.exports = {
  testEnvironment: "jsdom",
  roots: ["<rootDir>/src"],
  testMatch: ["**/*.test.[jt]s?(x)"],
  setupFilesAfterEnv: ["<rootDir>/jest/setup.ts"],
  transform: { "^.+\\.[jt]sx?$": "<rootDir>/jest/transform.cjs" },
  moduleNameMapper: {
    "\\.svg\\?react$": "<rootDir>/jest/svg.cjs",
    "\\.(css|scss)$": "<rootDir>/jest/style.cjs",
    "\\.(png|jpg|jpeg|gif|svg)$": "<rootDir>/jest/file.cjs",
    "^app/(.*)$": "<rootDir>/src/app/$1",
  },
  clearMocks: true,
  watchman: false,
  collectCoverageFrom: [
    "src/app/state/api/action-reducers/report-builder/sync.ts",
    "src/app/utils/reportBuilderState.ts",
    "src/app/utils/exportReport.ts",
    "src/app/pages/report-builder/component-registry/model.ts",
    "src/app/pages/report-builder/hooks/*",
    "src/app/pages/report-builder/builder/components/table/options.ts",
    "src/app/pages/report-builder/builder/components/dataset-select-modal/utils.ts",
    "src/app/pages/report-builder/builder/components/chart/utils/chart-utils.ts",
    "src/app/pages/report-builder/builder/components/chart/editable-title.tsx",
  ],
  coverageThreshold: {
    global: { statements: 90, branches: 85, functions: 90, lines: 90 },
  },
};
