// DomHelpers.ts
import { AppElements } from "@/models/AppElements";
import { CameraSettings } from "@/config/CameraKitConfig";
import { Transform2D, CameraKitSession, createMediaStreamSource } from "@snap/camera-kit";

export function initializeElements(): AppElements {
  return {
    controlStart: document.getElementById('control-start') as HTMLButtonElement,
    controlBack: document.getElementById('control-back') as HTMLButtonElement,
    cameraContainer: document.getElementById('camera-container') as HTMLDivElement,
    cameraCanvas: document.getElementById('camera-canvas') as HTMLCanvasElement,
    controlClose: document.getElementById('control-close') as HTMLButtonElement,
    controlMirror: document.getElementById('control-mirror') as HTMLButtonElement,
    controlFps: document.getElementById('control-fps') as HTMLButtonElement,
    lensThumbnails: document.getElementById('lens-thumbnails') as HTMLDivElement,
    controlLensPrev: document.getElementById('control-lens-prev') as HTMLButtonElement,
    controlLensNext: document.getElementById('control-lens-next') as HTMLButtonElement,
    lensCurrent: document.getElementById('lens-current') as HTMLImageElement,
    lensControls: document.querySelector('.lens-controls') as HTMLDivElement,
  };
}

export function updateUIState(
  elements: AppElements,
  settings: CameraSettings
): void {
  // Atualiza texto do botão FPS
  if (elements.controlFps) {
    elements.controlFps.textContent = settings.fps.toString();
  }
  // Indica estado de espelhamento por classe
  if (elements.controlMirror) {
    elements.controlMirror.classList.toggle('active', settings.mirror);
  }
}

export function showError(message: string): void {
  const errorContainer = document.getElementById("error-message");
  if (errorContainer) {
    errorContainer.textContent = message;
    errorContainer.style.display = "block";
  } else {
    alert(message);
  }
}

export function applyCameraDimensions(
  canvas: HTMLCanvasElement,
  container: HTMLElement,
  settings: CameraSettings
): void {
  // Ajusta o canvas
  canvas.width = settings.width;
  canvas.height = settings.height;
  canvas.classList.remove('hidden');

  // Atualiza dimensões do container via CSS
  document.documentElement.style.setProperty(
    '--camera-width',
    `${settings.width}px`
  );
  document.documentElement.style.setProperty(
    '--camera-height',
    `${settings.height}px`
  );
}

export async function applySettings(
  session: CameraKitSession,
  elements: AppElements,
  settings: CameraSettings
): Promise<void> {
  // Garante que inputs existem
  const fps = settings.fps;
  const mirror = settings.mirror;

  // Define constraints de vídeo
  const constraints: MediaStreamConstraints = {
    video: {
      deviceId: settings.deviceId ? { exact: settings.deviceId } : undefined,
      frameRate: fps
    }
  };

  const stream = await navigator.mediaDevices.getUserMedia(constraints);

  const source = createMediaStreamSource(stream, {
    transform: mirror ? Transform2D.MirrorX : Transform2D.Identity,
    fpsLimit: fps,
  });



  await session.setSource(source);

  // Atualiza settings e UI
  updateUIState(elements, settings);
}
