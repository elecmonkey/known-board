import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';
import path from 'path';

import { prefetchManifest } from './plugin/prefetchManifest';

export default defineConfig({
  plugins: [solidPlugin(), tailwindcss(), prefetchManifest()],
  server: {
    port: 3000,
    fs: {
      // 允许访问node_modules中的WASM文件
      allow: ['..']
    }
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
  // 确保WASM文件被正确处理
  assetsInclude: ['**/*.wasm'],
  optimizeDeps: {
    exclude: ['json-packer-wasm'], // 排除WASM模块的预构建
  }
});
