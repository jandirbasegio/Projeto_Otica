// src/services/CameraService.ts

import {
  bootstrapCameraKit,
  createMediaStreamSource,
  Transform2D,
  CameraKit,
  CameraKitSession
} from "@snap/camera-kit";

import {
  API_BASE,
  LENS_GROUP_ID,
  LENS_ID,
  DEBUG
} from "../config/CameraKitConfig";
import type { CameraSettings } from "../config/CameraKitConfig";

export class CameraService {
  private cameraKitInstance: CameraKit | null = null;
  private session: CameraKitSession | null = null;

  /**
   * 1) Busca initConfig via proxy Express
   * 2) Inicializa CameraKit com o objeto completo
   * 3) Cria a sessão no canvas
   */
  public async initializeSession(canvas: HTMLCanvasElement): Promise<CameraKitSession> {
    if (DEBUG) console.log("[CameraService] Fetching init config...");

    const resp = await fetch(
      `${API_BASE}/com.snap.camerakit.v3.Metrics/GetInitializationConfig`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lensGroupId: LENS_GROUP_ID,
          lensId: LENS_ID
        })
      }
    );

    if (!resp.ok) {
      throw new Error(`Init config fetch failed: ${resp.status} ${resp.statusText}`);
    }

    const initConfig = await resp.json();
    if (DEBUG) console.log("[CameraService] Init config:", initConfig);

    // Bootstrap com toda a configuração retornada (incluindo token)
    this.cameraKitInstance = await bootstrapCameraKit(initConfig as any);
    if (DEBUG) console.log("[CameraService] Bootstrap complete");

    // Cria sessão ligada ao canvas
    this.session = await this.cameraKitInstance.createSession({
      liveRenderTarget: canvas
    });
    if (DEBUG) console.log("[CameraService] Session created");

    return this.session;
  }

  /**
   * Define webcam como fonte para a sessão
   */
  public async setVideoSource(settings: CameraSettings): Promise<void> {
    if (!this.session) {
      throw new Error("Session not initialized");
    }

    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        width: { ideal: settings.width },
        height: { ideal: settings.height },
        frameRate: { ideal: settings.fps },
        facingMode: settings.cameraType
      }
    });

    const source = await createMediaStreamSource(stream, {
      transform: settings.mirror ? Transform2D.MirrorX : Transform2D.Identity,
      cameraType: settings.cameraType,
      fpsLimit: settings.fps
    });

    await this.session.setSource(source);
    if (DEBUG) console.log("[CameraService] Video source set");
  }

  /**
   * Encerra a sessão e libera recursos
   */
  public async releaseResources(): Promise<void> {
    if (this.session) {
      await this.session.destroy();
    }
    this.cameraKitInstance = null;
    if (DEBUG) console.log("[CameraService] Resources released");
  }
}
