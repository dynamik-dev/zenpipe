import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";

export default [
  {
    files: ["**/*.ts"],
    ignores: ["**/dist/**", "**/__tests__/**"],
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
      parser: tseslint.parser,
      parserOptions: {
        project: true,
        ecmaVersion: 2020,
        sourceType: "module",
      },
    },
    plugins: {
      "@typescript-eslint": tseslint.plugin,
    },
    rules: {
      ...pluginJs.configs.recommended.rules,
      ...tseslint.configs.recommended.rules,

      "no-unused-vars": ["error", {
        "varsIgnorePattern": "^(args|input)$",
        "argsIgnorePattern": "^(args|input)$",
        "ignoreRestSiblings": true
      }],
      "@typescript-eslint/no-unused-vars": ["error", {
        "varsIgnorePattern": "^(args|input)$",
        "argsIgnorePattern": "^(args|input)$",
        "ignoreRestSiblings": true
      }],
      // Add any other custom rules here
    },
  },
];