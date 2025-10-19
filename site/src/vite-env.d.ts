/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly AETHERIA_BASE_PATH?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
