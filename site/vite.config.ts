import { defineConfig, loadEnv } from 'vite';
import solid from 'vite-plugin-solid';

export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [solid()],
    base: env.AETHERIA_BASE_PATH || '/',
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
    },
    // Vite will automatically serve files from public/data at /data
    publicDir: 'public',
    // Make environment variables available to the client
    define: {
      __DATA_ENDPOINT__: JSON.stringify(env.VITE_DATA_ENDPOINT || '/data'),
    },
  }
})
