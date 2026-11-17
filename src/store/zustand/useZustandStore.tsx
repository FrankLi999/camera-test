import { loadGoogleMediapipe, MediapipeModelStatus } from "@/utils/utils";
import { FaceLandmarker, HandLandmarker } from "@mediapipe/tasks-vision";
import { create } from "zustand";


interface ZustandMediapipeState {
  mediapipeStatus: MediapipeModelStatus;
  faceLandmarker: FaceLandmarker | null;
  handLandmarker: HandLandmarker | null;
  durationToLoadModel: number;
  loadMediapipe: () => Promise<void>;
}

export const useZustandMediapipeStore = create<ZustandMediapipeState>((set, get) => ({
  mediapipeStatus: "not_loaded",
  faceLandmarker: null,
  handLandmarker: null,
  durationToLoadModel: 0,
  loadMediapipe: async () => {
    console.log("======= zustand load mediapipe.", get().mediapipeStatus)
    if (get().mediapipeStatus !== 'not_loaded') return;
    set({ mediapipeStatus: "loading" }); 

    try {
        const {faceLandmarker, handLandmarker, elapsed} = await loadGoogleMediapipe();
        set({ mediapipeStatus: "ready", durationToLoadModel: elapsed, faceLandmarker: faceLandmarker, handLandmarker: handLandmarker });
        console.log("======= zustand load mediapipe. Loaded Mediapipe")         
    } catch (err) {
        set({ mediapipeStatus: "error"}); 
        console.log("======= zustand load mediapipe. Failed to Load Mediapipe.", err)         
    }
  },
}));

