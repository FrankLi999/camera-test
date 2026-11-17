import * as Bowser from 'bowser';
import { GOOGLE_MEDIAPIPE_FACE_LANDMARKER_URL, GOOGLE_MEDIAPIPE_HANDLE_LANDMARKER_URL, GOOGLE_MEDIAPIPE_WASM_BASE_URL } from './Constants';
import { FaceLandmarker, HandLandmarker , FilesetResolver } from '@mediapipe/tasks-vision';
export type CAMERA_FACING_MODEL = "user" | "environment";
export type MediapipeModelStatus = 'not_loaded' | 'loading' | 'ready' | 'error';
export const isMobileDevice = () => {
    if (typeof window === "undefined") { return false;}
    const parser = Bowser.getParser(window.navigator.userAgent);
    // Get the platform type string (e.g., 'mobile', 'tablet', 'desktop')
    const platformType = parser.getPlatformType();

    if (platformType === 'mobile' || platformType === 'tablet') {
        console.log(`This is a mobile phone. platformType: ${platformType}`);
        return true;
    } else {
        console.log(`This is not a mobile phone. platformType: ${platformType}`);
        return false;
    }
}

export const getVideoConstraints = (facingMode: CAMERA_FACING_MODEL): MediaStreamConstraints => {
  return  {
      audio: false,
      video: {
        facingMode: { ideal: facingMode },
        width: { ideal: 1280 },
        height: { ideal: 720 },
      },
    };
}

export const loadGoogleMediapipe = async () => {
    const startModelLoadingTime = performance.now();
    const moduleWindow = window as Window & { Module?: unknown };
    const savedModule = moduleWindow.Module;
    moduleWindow.Module = null;
    try {
        // 1. Initialize MediaPipe Face Landmarker
        const filesetResolver = await FilesetResolver.forVisionTasks(
            GOOGLE_MEDIAPIPE_WASM_BASE_URL
        );
        const faceLandmarker = await FaceLandmarker.createFromOptions(filesetResolver, {
        baseOptions: { 
            modelAssetPath: GOOGLE_MEDIAPIPE_FACE_LANDMARKER_URL
        },
        runningMode: "VIDEO",
        numFaces: 1
        });

        const handLandmarker = await HandLandmarker.createFromOptions(filesetResolver, {
        baseOptions: {
            modelAssetPath: GOOGLE_MEDIAPIPE_HANDLE_LANDMARKER_URL,
            delegate: "GPU",
        },
        runningMode: "VIDEO", // Use "VIDEO" for video files or webcam loops
        numHands: 2,
        });
        const endModelLoadingTime = performance.now();
        const elapsed = (endModelLoadingTime - startModelLoadingTime) / 1000

        return {faceLandmarker, handLandmarker, elapsed}
    } finally {
        moduleWindow.Module = savedModule;
    }
}