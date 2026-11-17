'use client'
import React from 'react';
import { useRouter } from 'next/navigation';  
import styles from './page.module.css';
import { useCameraStatus } from '@/components/hooks/useCameraSatus';

const CameraPermission = () => {
    const router = useRouter();
    const {cameraStatus, checkCameraStatus} = useCameraStatus();

    const handleUseCamera = async () => {
        const statusOK = await checkCameraStatus();
        if (statusOK) {
            router.push("/context-provider/use-camera")
        }
    };
    const handleMobxTest = () => {
       window.location.href = "/mobx";
    }
    
    const handleZustandTest = () => {
       window.location.href = "/zustand";
    }

    const handleFundamentalTest = () => {
       window.location.href = "/";
    }
    return (
      <main className={styles.container}>
        <h1 className={styles.title}>Test Camera Permiossion</h1>
        {(cameraStatus.status) &&(<p className={styles.status}>Camera Status: {cameraStatus.status}. Error Name: {cameraStatus.errorName}. Error Message: {cameraStatus.errorMsg}</p>)}
        
        <button onClick={handleUseCamera} className={styles.nextButton}>
          Check camera permission and use camera
        </button>

        <button style={{marginTop: "6px"}} onClick={handleMobxTest} className={styles.nextButton}>
          Test with mobx store
        </button>
        
        <button style={{marginTop: "6px"}} onClick={handleZustandTest} className={styles.nextButton}>
          Test with sustand store
        </button>

        <button style={{marginTop: "6px"}} onClick={handleFundamentalTest} className={styles.nextButton}>
          Fundamental Test
        </button>
      </main>
    );
}

export default CameraPermission;