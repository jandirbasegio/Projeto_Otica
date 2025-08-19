// CameraHelperUtil.ts
import { CameraSettings } from "../models/CameraSettings";
import { getDefaultCamera } from "../config/CameraKitConfig";

export async function getCameraConstraints(
  settings: CameraSettings
): Promise<MediaStreamConstraints> {
  // agora sim esperamos o resultado
  const defaultCamera = await getDefaultCamera();

  return {
    video: {
      deviceId: settings.deviceId
        ? { exact: settings.deviceId }
        : undefined,
      width:  { ideal: defaultCamera.width  },
      height: { ideal: defaultCamera.height },
      frameRate: { ideal: settings.fps },
      facingMode: settings.cameraType
    }
  };
}
