import {useState, useCallback} from 'react';
import {
    CAMERA_STATUS_ERROR,
    CAMERA_STATUS_NO_DEVICES,
    CAMERA_STATUS_SUCCESS,
    CameraDeviceStatus,
} from "@/components/utils/Constants";

export interface CameraPermissionResult {
  cameraStatus: CameraDeviceStatus
  checkCameraStatus: () => Promise<boolean>;
}

export const useCameraStatus = (): CameraPermissionResult => {

    const [cameraStatus, setCameraStatus] = useState<CameraDeviceStatus>({
        status: undefined,
        errorMsg: undefined,
        errorName: undefined,
    });
    const isCameraSupported = useCallback(() => {
        return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
    }, []);

    const checkCameraStatus = useCallback(async (): Promise<boolean> => {
      if (!isCameraSupported()) {
        console.log("webcam not supported");
        setCameraStatus((prev) => ({
            ...prev,
            status: CAMERA_STATUS_NO_DEVICES,
        }));
        return false;
      }
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: false,
          video: {
            facingMode: "user",
            width: { ideal: 1280 },
            height: { ideal: 960 },
          },
        });

        stream.getTracks().forEach(track => track.stop());
        setCameraStatus((prev) => ({
            ...prev,
            status: CAMERA_STATUS_SUCCESS,
        }));
        return true;
      } catch (error: any) {
        if (error instanceof Error) {
            console.log(
                "webcam error: ",
                error.cause,
                error.message,
                error.name
            );
            setCameraStatus({
                status: CAMERA_STATUS_ERROR,
                errorMsg: error.message,
                errorName: error.name,
            });
        } else {
            console.log("webcam error: ", error);
            setCameraStatus((prev) => ({
                ...prev,
                errorMsg: `${error}`,
                status: CAMERA_STATUS_ERROR,
            }));
        }
      }
      return false;
    }, [isCameraSupported]);


    return {
      cameraStatus,
      checkCameraStatus
    };
}