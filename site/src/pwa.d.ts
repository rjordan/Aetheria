/// <reference types="vite-plugin-pwa/client" />

// Additional PWA types if needed
declare module 'virtual:pwa-register' {
  import type { RegisterSWOptions } from 'vite-plugin-pwa/types'

  export function registerSW(options?: RegisterSWOptions): (reloadPage?: boolean) => Promise<void>
}
