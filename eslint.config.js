const { defineConfig, globalIgnores } = require("eslint/config");
const js = require("@eslint/js");
const tsPlugin = require("@typescript-eslint/eslint-plugin");
const importX = require("eslint-plugin-import-x");
const prettier = require("eslint-config-prettier/flat");
const globals = require("globals");

module.exports = defineConfig([
  globalIgnores(["dist/**", "src/parser/grammar.ts"]),
  {
    files: ["**/*.ts"],
    extends: [
      js.configs.recommended,
      tsPlugin.configs["flat/recommended"],
      importX.flatConfigs.recommended,
      importX.flatConfigs.typescript,
      prettier,
    ],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.es2021,
        ...globals.node,
      },
      parserOptions: {
        ecmaVersion: 2021,
        sourceType: "module",
      },
    },
    rules: {
      "no-case-declarations": "off",
      "no-useless-assignment": "off",
      "preserve-caught-error": "off",
      "linebreak-style": ["error", "unix"],
      "@typescript-eslint/ban-ts-comment": "off",
      "@typescript-eslint/no-explicit-any": "warn",
      quotes: ["error", "double"],
      semi: ["error", "always"],
      "max-len": [
        "warn",
        {
          code: 120,
        },
      ],
      "object-curly-spacing": ["error", "always"],
    },
  },
]);
