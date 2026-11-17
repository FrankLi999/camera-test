'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation'
import { observer } from "mobx-react-lite";
import { isMobileDevice } from '@/utils/utils';
import styles from "./use_camera.module.css";
import { useCamera } from '@/components/hooks/useCamera';
import { useMobxStore } from '@/store/mobx/useMobxStore';
import Loading from '@/components/loading';


const UseCamera = observer(() => {
  const router = useRouter();
  const { mediapipeStore } = useMobxStore();
  const [liveness, setLiveness] = useState('Checking...');
  const [videoAndCanvasElementLoaded, setVideoAndCanvasElementLoaded] = useState(false); // for iphone
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  
  // Custom frame processor: Convert video frame to Grayscale
  const handleFrame = useCallback((ctx: CanvasRenderingContext2D, video: HTMLVideoElement, canvas: HTMLCanvasElement) => {
    const results = mediapipeStore.faceLandmarker!.detectForVideo(video, performance.now());
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (results.faceLandmarks.length > 0) {
      // --- ANTI-SPOOFING LOGIC ---
      // Analyze depth: Real faces have variance in z-axis, 2D photos do not.
      const landmarks = results.faceLandmarks[0]; //478 points
      const zDepth = landmarks.map(l => l.z);
      const maxZ = Math.max(...zDepth);
      const minZ = Math.min(...zDepth);
      const depthDifference = maxZ - minZ;
      // console.log("Thresh hold :", depthDifference);
      // Threshold for liveness (experiment with value)
      if (depthDifference > 0.05) {           
        setLiveness(`Real Face Detected ✅`);
      } else {
        setLiveness('Spoof Attempt: 2D Photo Detected ❌');
      }
    } else {
      setLiveness('No Face Detected');
    }
  }, [mediapipeStore]);

  const { videoRef, canvasRef, startCamera, stopCamera } = useCamera({
    facingMode: "user",
    onFrame: handleFrame,
  });

  useEffect(() => {
    console.log(`>>>>>>>>>>>> init. videoElementLoaded: ${videoAndCanvasElementLoaded}, videoRef set:${!!videoRef.current}, canvasRef set:${!!canvasRef.current}`);
    if (!videoAndCanvasElementLoaded && !videoRef.current&& !canvasRef.current) { return;}
    const initFaceDetectorAndStartCamera = async () => {
      
      await mediapipeStore.loadMediapipe();
      await startCamera();
    };
    initFaceDetectorAndStartCamera();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoAndCanvasElementLoaded, mediapipeStore, startCamera]); 
  
  const videoRefCallback = useCallback((node: HTMLVideoElement | null) => {
    if (node !== null) {
        videoRef.current = node;
        setVideoAndCanvasElementLoaded(() => !!videoRef.current && !!canvasRef.current);
    }
  }, [])

  const canvasRefCallback = useCallback((node: HTMLCanvasElement | null) => {
    if (node !== null) {
        canvasRef.current = node;
        setVideoAndCanvasElementLoaded(() => !!videoRef.current && !!canvasRef.current);
    }
  }, [])

  const handleLoadedMetadata = () => {    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    console.log(`>>>>>>>> handleLoadedMetadata. ${!!video}/${!!canvas}, ${video?.videoWidth}/${video?.videoHeight}`);
    if (video && canvas) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
    }
    if (video) {
      setDimensions(() => { return {
        width: video.videoWidth * (isMobileDevice() ? 0.25 : 0.25),
        height: video.videoHeight * (isMobileDevice() ? 0.25 : 0.65)
      }});
      console.log(`>>>>>>>> setDimensions`);
    }
  };

  const handleNavToNext = () => {
    stopCamera();
    router.push("/mobx/use-camera2");
  }; 

return (
     mediapipeStore.isLoading() ? (
      <Loading />
     ) : (
      <div className={styles.wrapper}>
        {/* {error && <p className={styles.error}>{error}</p>} */}
          <h1 className="text-2xl mb-4">Photo capture with Mediapipe</h1>
          {/* eslint-disable-next-line react-hooks/refs */}
          <h2 className={`mt-4 text-lg ${liveness.includes('✅') ? 'text-green-500' : 'text-red-500'}`}> {liveness} - Mediapipe model loading time: {mediapipeStore.timeToLoadMediaPipe}</h2>
          <div className={styles.controls}>
            <button type="button" onClick={handleNavToNext} className={styles.button}>
              Next
            </button>
          </div>
          <div className={styles.mediaContainer}>
              <video 
                ref={videoRefCallback} 
                onLoadedMetadata={handleLoadedMetadata}
                autoPlay
                playsInline 
                muted 
                onPlay={() => {}} 
                className={styles.video}/>
              <canvas ref={canvasRefCallback} className={styles.canvas} />
              {/* Centered Oval Guide Overlay */}
              <div className={styles.overlay}>
                <div className={styles.ovalGuide} style={{
                    width: `${dimensions.width}px`,
                    height: `${dimensions.height}px`,
                  }}  
                />
                <p className={styles.instructionText}>
                  {/* eslint-disable-next-line react-hooks/refs */}
                  Position your face inside the oval {videoRef.current?.videoHeight}/{videoRef.current?.videoWidth}
                </p>
              </div>
          </div>
        </div>
      )
  );
});
export default UseCamera;
