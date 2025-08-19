// SnapLensView.ts
import { AppElements } from "../models/AppElements";
import { CameraSettings, getDefaultCamera } from "../config/CameraKitConfig";
import { applyCameraDimensions, initializeElements } from "../utils/DomHelperUtil";

export class SnapLensView {
  private elements: AppElements;
  private currentSettings: CameraSettings;

  constructor(initialSettings: CameraSettings) {  // Modificado para receber configurações
    this.elements = initializeElements();
    this.currentSettings = initialSettings;  // Usa as configurações passadas
    this.setupUI();
  }

  public get canvas(): HTMLCanvasElement {
    return this.elements.cameraCanvas;
  }

  public get settings(): CameraSettings {
    return { ...this.currentSettings };
  }

  public updateSettings(update: Partial<CameraSettings>): void {
    this.currentSettings = { ...this.currentSettings, ...update };
  }

  private setupUI(): void {
    this.setCameraContainerVisibility(false);
    this.setControlButtonsVisibility(false);
    this.elements.lensControls.classList.add('hidden');
    this.setupCanvas();
  }

  private setupCanvas(): void {
    applyCameraDimensions(
      this.elements.cameraCanvas,
      this.elements.cameraContainer,
      this.currentSettings
    );
  }

  public setCurrentFilterThumbnail(url: string): void {
    this.elements.lensCurrent.src = url;
  }

  public updateThumbnails(thumbnails: string[]): void {
    this.elements.lensThumbnails.innerHTML = '';
    thumbnails.forEach((thumb, index) => {
      const div = document.createElement('div');
      div.className = `lens-thumb ${index === 0 ? 'active' : ''}`;
      div.innerHTML = `<img src="${thumb}" alt="Lens ${index + 1}">`;
      this.elements.lensThumbnails.appendChild(div);
    });
  }

  public showError(message: string): void {
    const errorElement = document.createElement('div');
    errorElement.className = 'error-message';
    errorElement.textContent = message;
    document.body.appendChild(errorElement);
    setTimeout(() => errorElement.remove(), 3000);
  }

  public applyCanvasDimensions(settings: CameraSettings): void {
    applyCameraDimensions(
      this.elements.cameraCanvas,
      this.elements.cameraContainer,
      settings
    );
  }

  public setCameraContainerVisibility(visible: boolean): void {
    // mostra/oculta o container
    this.elements.cameraContainer.classList.toggle('hidden', !visible);

    // aplica o estilo de control-btn ao back-button apenas quando a câmera estiver visível
    this.elements.controlBack.classList.toggle('control-btn', visible);
  }

  public setControlButtonsVisibility(visible: boolean): void {
    // Atualizado para incluir todos os controles
    this.elements.lensControls.classList.toggle('hidden', !visible);
    document.querySelectorAll('.control-btn').forEach(btn =>
      btn.classList.toggle('hidden', !visible)
    );
  }

  public updateActiveThumbnail(index: number): void {
    document.querySelectorAll('.lens-thumb').forEach((thumb, i) => {
      thumb.classList.toggle('active', i === index);
    });
  }

  // Event Listeners
  public onStartCamera(callback: () => void): void {
    this.elements.controlStart.addEventListener('click', callback);
  }

  public onChangeLens(callback: (direction: 'prev' | 'next') => void): void {
    this.elements.controlLensPrev.addEventListener('click', () => callback('prev'));
    this.elements.controlLensNext.addEventListener('click', () => callback('next'));
  }

  public onCloseCamera(callback: () => void): void {
    this.elements.controlClose.addEventListener('click', callback);
  }

  public onToggleMirror(callback: () => void): void {
    this.elements.controlMirror.addEventListener('click', callback);
  }

  public onChangeFPS(callback: (fps: number) => void): void {
    this.elements.controlFps.addEventListener('click', () => {
      const input = prompt('New FPS:', String(this.currentSettings.fps));
      const fps = input ? parseInt(input) : this.currentSettings.fps;
      if (fps > 0 && fps <= 60) callback(fps);
    });
  }
}
