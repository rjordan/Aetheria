import { defineConfig } from 'vite';
import solid from 'vite-plugin-solid';

export default defineConfig({
  plugins: [solid()],
  base: process.env.AETHERIA_BASE_PATH || '/',
  build: {
    outDir: '../docs',
    emptyOutDir: true,
  },
  define: {
    // Pass the base path to the application
    'import.meta.env.VITE_BASE_PATH': JSON.stringify(process.env.AETHERIA_BASE_PATH || '/')
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
