import tseslint from "typescript-eslint";
import js from "@eslint/js";
import globals from "globals";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import importPlugin from "eslint-plugin-import";
import jsxA11y from "eslint-plugin-jsx-a11y";
import prettier from "eslint-plugin-prettier/recommended";
import prettierPlugin from "eslint-plugin-prettier";

export default tseslint.config(
  { ignores: ["dist", "cypress", "cypress.config.js"] },
  {
    ignores: ["dist", "cypress", "cypress.config.js"],
    // specify the formats on which to apply the rules below
    files: ["**/*.{ts,tsx}"],
    // use predefined configs in installed eslint plugins
    extends: [
      // js
      js.configs.recommended,
      // ts
      ...tseslint.configs.recommended,
      // react
      react.configs.flat.recommended,
      // import
      importPlugin.flatConfigs.recommended,
      // a11y (accessibility
      jsxA11y.flatConfigs.recommended,
      // prettier
      prettier,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    // specify used plugins
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
      prettierPlugin,
    },
    settings: {
      // for eslint-plugin-react to auto detect react version
      react: {
        version: "detect",
      },
      // for eslint-plugin-import to use import alias
      "import/resolver": {
        typescript: {
          project: "./tsconfig.json",
        },
      },
    },
    rules: {
      // set of custom rules
      "no-console": "off",
      "react/button-has-type": "error",
      "react/react-in-jsx-scope": "off",
      "react-refresh/only-export-components": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-require-imports": "off",
      "no-case-declarations": "off",
      "jsx-a11y/no-autofocus": "off",
    },
  },
);
