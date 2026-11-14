'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation'
import { FaceLandmarker, HandLandmarker , FilesetResolver } from '@mediapipe/tasks-vision';
import { isMobileDevice } from '@/components/utils/utils';
import styles from "./overlay.module.css";
import { GOOGLE_MEDIAPIPE_FACE_LANDMARKER_URL, GOOGLE_MEDIAPIPE_HANDLE_LANDMARKER_URL, GOOGLE_MEDIAPIPE_WASM_BASE_URL } from '@/components/utils/Constants';

const Camera2 = () => {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const modelLoadingTime = useRef<number>(0);
  const [liveness, setLiveness] = useState('Checking...');
  const [videoAndCanvasElementLoaded, setVideoAndCanvasElementLoaded] = useState(false); // for iphone
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  
  useEffect(() => {
    console.log(`>>>>>>>>>>>> init. videoElementLoaded: ${videoAndCanvasElementLoaded}, videoRef set:${!!videoRef.current}, canvasRef set:${!!canvasRef.current}`);
    if (!videoAndCanvasElementLoaded && !videoRef.current) { return;}
    let animationFrameId: number;
    let stream: MediaStream | null = null;
    const startModelLoadingTime = performance.now();
    const initFaceDetectorAndStartCamera = async () => {
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
      modelLoadingTime.current = (endModelLoadingTime - startModelLoadingTime) / 1000
      // 2. Access Webcam
      const isMobile = isMobileDevice();
      stream = await navigator.mediaDevices.getUserMedia({
         
        video: {
          width: { ideal: isMobile ? 1280 : 1200, max: 1920 },
          height: { ideal: isMobile ? 720 : 720, max: 1080 },
          // facingMode: isMobile ? "environment" : "user"
          facingMode: "user",
          // Optional: Try to force minimum zoom if supported by the device hardware
          // @ts-ignore - zoom is supported in modern Chrome/Android browsers
          // zoom: { ideal: 1.0 },
        },
        audio: false
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        console.log(">>>>>>>>>>>>> paly video");
        videoRef.current.addEventListener('loadeddata', () => predict(faceLandmarker, handLandmarker));
      }
    };

    const INTERVAL = 400; // Target interval in milliseconds
    let lastTime = 0;
    const predict = (faceLandmarker: FaceLandmarker, handLandmarker: HandLandmarker) => {      
      if (!videoRef.current || !canvasRef.current) return;
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      setDimensions(() => { return {
        width: video.videoWidth * (isMobileDevice() ? 0.25 : 0.25),
        height: video.videoHeight * (isMobileDevice() ? 0.25 : 0.65)
      }});
      console.log(`>>>>>>>> setDimensions 1. ${dimensions}`);
      const detect = () => {
        animationFrameId = requestAnimationFrame(detect);
        const currentTime = performance.now();
        // Initialize lastTime on the very first frame
        if (!lastTime) {
          lastTime = currentTime;
        }
        // Calculate elapsed time since the last processed frame
        const elapsed = currentTime - lastTime; 
        if (elapsed < INTERVAL) {
          // console.log(`>>>>>>>>>>>>not 400ms yet - ${elapsed}`)
          return;
        }
        // console.log(">>>>>>>>>>>>>400ms now")
              // Adjust lastTime to prevent time drift over long periods
        lastTime = currentTime - (elapsed % INTERVAL);     

        const results = faceLandmarker.detectForVideo(video, performance.now());
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
      };
      detect();
    };

    const stopCamera = () => {
      cancelAnimationFrame(animationFrameId);
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
      console.log(">>>>>>>>>>>>> paused video");
      videoRef.current?.pause();
    };
    window.addEventListener("pagehide", stopCamera);
    initFaceDetectorAndStartCamera();
    return () => {
      window.removeEventListener("pagehide", stopCamera);
      stopCamera();
    };
  }, [videoAndCanvasElementLoaded]);

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
    router.push("/");
  }; 

return (
     <div className={styles.wrapper}>
       {/* {error && <p className={styles.error}>{error}</p>} */}
        <h1 className="text-2xl mb-4">Photo capture with Mediapipe</h1>
        <h2 className={`mt-4 text-lg ${liveness.includes('✅') ? 'text-green-500' : 'text-red-500'}`}> {liveness} - Mediapipe model loading time: {modelLoadingTime.current}</h2>
        <div className={styles.controls}>
          <button type="button" onClick={handleNavToNext} className={styles.button}>
            Home
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
              {/* <div className={styles.ovalGuide}  /> */}
              <div className={styles.ovalGuide} style={{
                  width: `${dimensions.width}px`,
                  height: `${dimensions.height}px`,
                }}  
              />
              <p className={styles.instructionText}>
                Position your face inside the oval {videoRef.current?.videoHeight}/{videoRef.current?.videoWidth}
              </p>
            </div>
        </div>

    </div>
  );
}
export default Camera2;
