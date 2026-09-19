/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GOOSE_SERVICE_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}