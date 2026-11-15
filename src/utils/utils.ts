import * as Bowser from 'bowser';

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


const requestCameraAccess = async () => {
    // setIsLoading(true)
    // setError("")
    let hasPermission = true;
    let error = "";
    let mediaStream = null;
    try {
      mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: "user",
        },
      })

    //   setStream(mediaStream)
    //   setHasPermission(true)

    //   if (videoRef.current) {
    //     videoRef.current.srcObject = mediaStream
    //   }
    } catch (err) {
      console.error("Camera access error:", err)
      hasPermission = false;

      if (err instanceof Error) {
        if (err.name === "NotAllowedError") {
          error = "Camera access was denied. Please allow camera access and try again."
        } else if (err.name === "NotFoundError") {
          error = "No camera found on this device."
        } else if (err.name === "NotSupportedError") {
          error = "Camera is not supported on this device."
        } else {
          error = "Failed to access camera. Please try again."
        }
      }
    } 

    return {
        hasPermission,
        error,
        mediaStream
    }
  }