import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';
import path from 'path';

import { prefetchManifest } from './plugin/prefetchManifest';

export default defineConfig({
  plugins: [solidPlugin(), tailwindcss(), prefetchManifest()],
  server: {
    port: 3000,
  },
  build: {
    target: 'esnext',
  },
  esbuild: {
    drop: process.env.NODE_ENV !== 'development' ? ['console'] : [],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
