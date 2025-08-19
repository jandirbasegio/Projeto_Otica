import { getDynamicCameraSettings } from "../config/CameraKitConfig";
import { CameraService } from "../services/CameraService";
import { LensService } from "../services/LensService";
import { SnapLensView } from "../views/SnapLensView";
import type { CameraKitSession } from "@snap/camera-kit";

export class SnapLensController {
  private session: CameraKitSession | null = null;
  private cameraService = new CameraService();
  private lensService: LensService | null = null;
  private view: SnapLensView;

  constructor(view: SnapLensView) {
    this.view = view;
    this.setupEventHandlers();
    // opcional: já iniciar a câmera automaticamente
    // this.startCamera();
  }

  private setupEventHandlers(): void {
    this.view.onStartCamera(() => this.startCamera());
    this.view.onChangeLens(dir => this.changeLens(dir));
    this.view.onCloseCamera(() => this.closeCamera());
    this.view.onToggleMirror(() => this.toggleMirror());
    this.view.onChangeFPS(fps => this.changeFPS(fps));
  }

  private async startCamera(): Promise<void> {
    try {
      this.view.setCameraContainerVisibility(true);
      this.view.setControlButtonsVisibility(true);

      // 1) pega configuração dinâmica
      const dynamicSettings = await getDynamicCameraSettings();
      this.view.updateSettings(dynamicSettings);
      this.view.applyCanvasDimensions(dynamicSettings);

      // 2) inicializa CameraKit e session
      this.session = await this.cameraService.initializeSession(this.view.canvas);
      await this.cameraService.setVideoSource(dynamicSettings);

      // 3) carrega lentes
      this.lensService = new LensService(this.cameraService.cameraKit);
      await this.lensService.loadLenses();

      // 4) popula UI de thumbnails
      const thumbs = this.lensService.getThumbnails();
      this.view.updateThumbnails(thumbs);
      this.view.setCurrentFilterThumbnail(thumbs[0] || "");

      // 5) start rendering
      await this.session.play();

    } catch (err) {
      this.view.showError(err instanceof Error ? err.message : "Erro desconhecido");
      this.closeCamera();
    }
  }

  private async changeLens(direction: "prev" | "next"): Promise<void> {
    if (!this.session || !this.lensService) return;
    const idx = this.lensService.navigate(direction);
    try {
      const applied = await this.lensService.applyLens(this.session, idx);
      if (applied) {
        this.view.updateActiveThumbnail(idx);
        const thumbs = this.lensService.getThumbnails();
        this.view.setCurrentFilterThumbnail(thumbs[idx] || "");
      }
    } catch {
      this.view.showError("Falha ao trocar a lente");
    }
  }

  private async toggleMirror(): Promise<void> {
    if (!this.view.settings) return;
    const updated = { ...this.view.settings, mirror: !this.view.settings.mirror };
    this.view.updateSettings(updated);
    await this.cameraService.setVideoSource(updated);
  }

  private async changeFPS(fps: number): Promise<void> {
    if (!this.view.settings) return;
    const updated = { ...this.view.settings, fps };
    this.view.updateSettings(updated);
    await this.cameraService.setVideoSource(updated);
  }

  private async closeCamera(): Promise<void> {
    await this.cameraService.releaseResources();
    this.view.setCameraContainerVisibility(false);
    this.view.setControlButtonsVisibility(false);
    this.session = null;
    this.lensService = null;
  }
}
