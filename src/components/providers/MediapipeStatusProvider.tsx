'use client';

import { loadGoogleMediapipe, MediapipeModelStatus } from '@/utils/utils';
import { FaceLandmarker, HandLandmarker } from '@mediapipe/tasks-vision';
import React, { createContext, useContext, useState, useEffect, useRef, RefObject, useCallback  } from 'react';



interface MediapipeModelContextType {
  mediapipeStatus: MediapipeModelStatus;
  faceLandmarkerRef: RefObject<FaceLandmarker | null>;
  handLandmarkerRef: RefObject<HandLandmarker | null>;
  timeToLoadModel: number;
  loadMediapipe: () => void;
}

const MediapipeModelContext = createContext<MediapipeModelContextType | undefined>(undefined);

export function MediapipeStatusProvider({ children }: { children: React.ReactNode }) {
  const [mediapipeStatus, setMediapipeStatus] = useState<MediapipeModelStatus>('not_loaded');
  const faceLandmarkerRef = useRef<FaceLandmarker | null>(null);
  const handLandmarkerRef = useRef<HandLandmarker | null>(null);
  const [timeToLoadModel, setTimeToLoadModel] = useState<number>(0);

  const loadMediapipe = useCallback(async () => {
    console.log("====== context provider, load mediapipe.", mediapipeStatus);
    setMediapipeStatus(() => 'loading');
    try {
      const { faceLandmarker, handLandmarker, elapsed } = await loadGoogleMediapipe();
      faceLandmarkerRef.current = faceLandmarker;
      handLandmarkerRef.current = handLandmarker;
      setTimeToLoadModel(() => elapsed);
      setMediapipeStatus(() => 'ready');
      console.log("====== context provider, loaded mediapipe.");
    } catch (err) {
      console.log("====== context provider, Failed to load mediapipe.", err);
      setMediapipeStatus(() => 'error');
    }
  }, []);

  useEffect(() => {
    void (async() => {
      loadMediapipe();
    })();
  }, [loadMediapipe]);

  return (
    <MediapipeModelContext.Provider value={{ mediapipeStatus, faceLandmarkerRef, handLandmarkerRef, timeToLoadModel, loadMediapipe }}>
      {children}
    </MediapipeModelContext.Provider>
  );
}

export function useMediapipe() {
  const context = useContext(MediapipeModelContext);
  if (!context) throw new Error('useModel must be used within a ModelProvider');
  return context;
}