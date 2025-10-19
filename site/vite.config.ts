import { defineConfig } from 'vite';
import solid from 'vite-plugin-solid';

export default defineConfig({
  plugins: [solid()],
  base: process.env.AETHERIA_BASE_PATH || '/Aetheria/',
  build: {
    outDir: '../docs',
    emptyOutDir: true,
  },
  resolve: {
    alias: {
      '@': '/src',
      '@data': '/src/data',
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `// Global SCSS variables can go here`
      }
    }
  }
});
