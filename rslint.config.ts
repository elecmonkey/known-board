import { defineConfig, globalIgnores, ts } from '@rslint/core';

export default defineConfig([
  globalIgnores(['dist/**', 'node_modules/**']),
  ts.configs.recommended,
  {
    files: ['src/**/*.{ts,tsx}'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'error',
    },
  },
]);
