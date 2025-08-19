/// <reference types="vite/client" />
export const API_BASE = import.meta.env.VITE_API_BASE;
export const LENS_GROUP_ID = import.meta.env.VITE_CAMERAKIT_LENS_GROUP_ID!;
export const LENS_ID = import.meta.env.VITE_CAMERAKIT_LENS_ID!;
export const DEBUG = import.meta.env.VITE_DEBUG === 'true';


if (DEBUG) {
  console.log('[DEBUG] DEBUG:', DEBUG);
  console.log('[API BASE] :', API_BASE);
  console.log('[LENS GROUP] :', LENS_GROUP_ID);
}

// Interface exportada para configurações da câmera
export interface CameraSettings {
  width: number;
  height: number;
  fps: number;
  mirror: boolean;
  cameraType: "user" | "environment";
  deviceId?: string; // opcional, usado dinamicamente
}

// Constantes padrão
const DEFAULT_CAMERA: CameraSettings = {
  width: 1280,
  height: 720,
  fps: 60,
  mirror: true,
  cameraType: "user"
};

// Retorna configuração padrão
export async function getDefaultCamera(): Promise<CameraSettings> {
  if (DEBUG) console.log("[DEBUG] Carregando configuração padrão");
  return { ...DEFAULT_CAMERA };
}

// Retorna configuração baseada no dispositivo disponível
export async function getDynamicCameraSettings(): Promise<CameraSettings> {
  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const videoDevices = devices.filter(d => d.kind === "videoinput");
    const preferred = videoDevices.find(d => d.label.toLowerCase().includes("back")) || videoDevices[0];

    const stream = await navigator.mediaDevices.getUserMedia({
      video: { deviceId: preferred.deviceId ? { exact: preferred.deviceId } : undefined }
    });

    const track = stream.getVideoTracks()[0];
    const settings = track.getSettings();
    track.stop();

    const cam: CameraSettings = {
      width: settings.width || DEFAULT_CAMERA.width,
      height: settings.height || DEFAULT_CAMERA.height,
      fps: settings.frameRate || DEFAULT_CAMERA.fps,
      mirror: true,
      cameraType: preferred.label.includes("back") ? "environment" : "user",
      deviceId: settings.deviceId
    };

    if (DEBUG) console.log("[DEBUG] Configuração dinâmica:", cam);
    return cam;

  } catch (e) {
    if (DEBUG) console.error("[DEBUG] Falha dinâmica, usando default", e);
    return { ...DEFAULT_CAMERA };
  }
}
