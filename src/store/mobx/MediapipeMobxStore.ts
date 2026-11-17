import { makeAutoObservable, runInAction } from "mobx";
import { loadGoogleMediapipe, MediapipeModelStatus } from '@/utils/utils';
import { FaceLandmarker, HandLandmarker } from "@mediapipe/tasks-vision";

export class MediapipeMobxStore {
  mediapipeStatus: MediapipeModelStatus = "not_loaded";
  faceLandmarker: FaceLandmarker | null = null;
  handLandmarker: HandLandmarker | null = null;
  timeToLoadMediaPipe = 0;
  constructor() {
    makeAutoObservable(this);
  }
  isLoading() {
    return this.mediapipeStatus === 'loading'
  }
  async loadMediapipe() {
    console.log("=== moboxStore.loadMediapipe. ", this.mediapipeStatus);
    if (this.mediapipeStatus !== 'not_loaded') return;
    runInAction(() => { this.mediapipeStatus = 'loading'; });    

    try {
      const {faceLandmarker, handLandmarker, elapsed} = await loadGoogleMediapipe();
      runInAction(() => {
        this.faceLandmarker = faceLandmarker;
        this.handLandmarker = handLandmarker;
        this.timeToLoadMediaPipe = elapsed;
        this.mediapipeStatus = 'ready';
        console.log("=== moboxStore.loadMediapipe. Model loaded",);
      });
    } catch (err) {
      runInAction(() => { 
        console.log("=== moboxStore.loadMediapipe. Failed to load models.", err);
        this.mediapipeStatus = 'error'; 
      });
    }
  };
}