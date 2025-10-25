import { defineConfig, loadEnv } from 'vite';
import solid from 'vite-plugin-solid';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [
      solid(),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
        workbox: {
          globPatterns: ['**/*.{js,css,html,ico,png,svg,json}'],
          maximumFileSizeToCacheInBytes: 5 * 1024 * 1024, // 5 MB limit instead of default 2 MB
          // Custom runtime caching for data files
          runtimeCaching: [
            {
              urlPattern: new RegExp(`^${env.AETHERIA_BASE_PATH || '/'}data/.*\\.json$`),
              handler: 'NetworkFirst',
              options: {
                cacheName: 'aetheria-data-cache',
                expiration: {
                  maxEntries: 50,
                  maxAgeSeconds: 5 * 60, // 5 minutes for fresh data
                },
                networkTimeoutSeconds: 3, // Fallback to cache after 3s
              },
            },
            {
              // Handle API endpoints if we switch from static files
              urlPattern: /^https:\/\/api\..*\/aetheria\/data\/.*$/,
              handler: 'NetworkFirst',
              options: {
                cacheName: 'aetheria-api-cache',
                expiration: {
                  maxEntries: 100,
                  maxAgeSeconds: 10 * 60, // 10 minutes for API data
                },
              },
            },
          ],
        },
        devOptions: {
          enabled: false, // Disable in development for easier debugging
        },
        manifest: {
          name: 'Aetheria World',
          short_name: 'Aetheria',
          description: 'A Rich Fantasy World - Complete with magic, politics, classes, and lore',
          theme_color: '#667eea',
          background_color: '#f8f9fa',
          display: 'standalone',
          orientation: 'portrait',
          scope: env.AETHERIA_BASE_PATH || '/',
          start_url: env.AETHERIA_BASE_PATH || '/',
          icons: [
            {
              src: 'pwa-64.png',
              sizes: '64x64',
              type: 'image/png'
            },
            {
              src: 'pwa-192.png',
              sizes: '192x192',
              type: 'image/png'
            },
            {
              src: 'pwa-512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'any'
            },
            {
              src: 'pwa-512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'maskable'
            }
          ],
        },
      }),
    ],
    base: env.AETHERIA_BASE_PATH || (mode === 'production' ? '/Aetheria/' : '/'),
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
