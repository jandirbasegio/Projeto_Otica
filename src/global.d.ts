// src/global.d.ts
import "@snap/camera-kit";

declare module "@snap/camera-kit" {
  interface CameraKitBootstrapConfiguration {
    /** aceita lensGroupId opcionalmente */
    lensGroupId?: string;
  }
}
