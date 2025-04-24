import { defineConfig, globalIgnores } from "eslint/config";
import js from "@eslint/js";
import ts from "typescript-eslint";
import packageJson from "eslint-plugin-package-json";

export default defineConfig([
  {
    linterOptions: {
      reportUnusedInlineConfigs: "error",
      reportUnusedDisableDirectives: "error",
    },
  },
  globalIgnores([".wireit/", "test-babel/**", "test-typescript/**"]),
  {
    files: ["**/package.json"],
    plugins: {
      "package-json": packageJson,
    },
    extends: ["package-json/recommended"],
  },
  {
    files: ["**/*.js", "**/*.ts"],
    plugins: {
      js,
    },
    extends: ["js/recommended"],
  },
  {
    files: ["**/*.ts"],
    plugins: {
      ts,
    },
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    extends: ["ts/recommendedTypeChecked"],
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
    },
  },
]);
