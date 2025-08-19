// src/utils/CanvasUtil.ts
import { CameraSettings } from "../config/CameraKitConfig";

/**
 * Define dimensões do canvas e variáveis CSS a partir de uma CameraSettings.
 */
export function applyCameraDimensions(
  canvas: HTMLCanvasElement,
  container: HTMLElement | null,
  settings: CameraSettings
): void {
  canvas.width = settings.width;
  canvas.height = settings.height;
  canvas.classList.remove("hidden");

  if (container) {
    container.classList.remove("hidden");
  }

  document.documentElement.style.setProperty(
    "--camera-width",
    `${settings.width}px`
  );
  document.documentElement.style.setProperty(
    "--camera-height",
    `${settings.height}px`
  );
  document.documentElement.style.setProperty(
    "--camera-aspect-ratio",
    (settings.width / settings.height).toString()
  );
}

/**
 * Inicializa o canvas e container usando as configurações da câmera.
 * Agora recebe as configurações como parâmetro.
 */
export function setupDefaultCanvas(cameraSettings: CameraSettings): void {
  const canvas = document.getElementById(
    "camera-canvas"
  ) as HTMLCanvasElement | null;
  const container = document.getElementById("camera-container");
  
  if (!canvas) return;

  applyCameraDimensions(canvas, container, cameraSettings); // Usa o parâmetro recebido
}