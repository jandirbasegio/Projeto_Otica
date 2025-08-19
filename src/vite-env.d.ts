/// <reference types="vite/client" />

interface ImportMetaEnv {
readonly VITE_API_BASE: string;
readonly VITE_CAMERAKIT_API_TOKEN: string;
readonly VITE_CAMERAKIT_LENS_GROUP_ID: string;
readonly VITE_CAMERAKIT_LENS_ID: string;
readonly VITE_DEBUG: string;
}

interface ImportMeta {
readonly env: ImportMetaEnv;
}