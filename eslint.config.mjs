import { defineConfig } from "eslint/config";
import globals from "globals";
import js from "@eslint/js";
import tseslint from 'typescript-eslint'
import { rules } from "eslint-config-prettier";


export default defineConfig([
  { files: ["**/*.{js,mjs,cjs,ts}"] },
  { files: ["**/*.{js,mjs,cjs,ts}"], languageOptions: { globals: globals.node } },
  { files: ["**/*.{js,mjs,cjs,ts}"], plugins: { js }, extends: ["js/recommended"] },
  tseslint.configs.recommended,
  { files: ["**/*.{js,mjs,cjs,ts}"], rules: { "@typescript-eslint/no-unused-vars": "off" } },
]);