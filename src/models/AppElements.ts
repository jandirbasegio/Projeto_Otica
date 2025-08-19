//AppElements.ts
export interface AppElements {
  // Controles principais
  controlStart: HTMLButtonElement;
  controlBack: HTMLButtonElement;
  
  // Elementos da câmera
  cameraCanvas: HTMLCanvasElement;
  cameraContainer: HTMLDivElement;
  
  // Controles da câmera
  controlClose: HTMLButtonElement;
  controlMirror: HTMLButtonElement;
  controlFps: HTMLButtonElement;
  
  // Navegação de lentes
  controlLensPrev: HTMLButtonElement;
  controlLensNext: HTMLButtonElement;
  lensCurrent: HTMLImageElement;
  
  // Thumbnails
  lensThumbnails: HTMLDivElement;
  lensControls: HTMLDivElement; 
}