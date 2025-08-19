//CameraSettings
export interface CameraSettings {
  width: number;
  height: number;
  fps: number;
  mirror: boolean;
  cameraType: 'user' | 'environment';
  deviceId?: string;
}