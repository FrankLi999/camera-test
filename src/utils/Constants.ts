export const VIDEO_INPUT: string = "videoinput";

export const CAMERA_STATUS_SUCCESS = 1;
export const CAMERA_STATUS_ERROR = 2;
export const CAMERA_STATUS_NO_DEVICES = 3;

export type CameraDeviceStatus = {
    status: number | undefined;
    errorMsg: string | undefined;
    errorName: string | undefined;
};

export type CameraDeviceContext = {
    status: CameraDeviceStatus;
    webcamList: MediaDeviceInfo[];
    webcamId: string | undefined;
    setWebcamId: React.Dispatch<React.SetStateAction<string | undefined>>;
};

export const GOOGLE_MEDIAPIPE_WASM_BASE_URL = "/wasm/mediapipe"; 
// export const GOOGLE_MEDIAPIPE_WASM_BASE_URL = "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
export const GOOGLE_MEDIAPIPE_FACE_LANDMARKER_URL = "/models/mediapipe/face_landmarker.task"; 
// export const GOOGLE_MEDIAPIPE_FACE_LANDMARKER_URL = "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task"; 
export const GOOGLE_MEDIAPIPE_HANDLE_LANDMARKER_URL = "/models/mediapipe/hand_landmarker.task"; 
// export const GOOGLE_MEDIAPIPE_HANDLE_LANDMARKER_URL = "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task"; 

export const ERROR_ENABLE_CAMERA_PERMISSION_MSG =
    "Please Enable Camera Permission";
export const ERROR_NO_CAMERA_DEVICE_AVAILABLE_MSG =
    "No Camera Device Available";
