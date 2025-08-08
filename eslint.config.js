import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import solid from "eslint-plugin-solid";

export default tseslint.config(
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  {
    languageOptions: {
      globals: globals.browser,
      parserOptions: {
        project: ['./tsconfig.json'],
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      solid: solid,
    }
  },
);