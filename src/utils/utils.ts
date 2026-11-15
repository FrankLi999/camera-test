import * as Bowser from 'bowser';

export type CAMERA_FACING_MODEL = "user" | "environment";

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