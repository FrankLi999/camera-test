'use client'
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';  
import { observer } from "mobx-react-lite";
import styles from './page.module.css';
import { useCameraStatus } from '@/components/hooks/useCameraSatus';
import { useMobxStore } from '@/store/mobx/useMobxStore';

const CameraPermission = observer(() => {
    const router = useRouter();
    const {cameraStatus, checkCameraStatus} = useCameraStatus();
    const { mediapipeStore } = useMobxStore();
    useEffect(() => {
      void mediapipeStore.loadMediapipe();
    }, [mediapipeStore])

    const handleUseCamera = async () => {
        const statusOK = await checkCameraStatus();
        if (statusOK) {
            router.push("/mobx/use-camera")
        }
    };

    const handleContextProviderTest = () => {
       window.location.href = "/context-provider";
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

        <button style={{marginTop: "6px"}} onClick={handleContextProviderTest} className={styles.nextButton}>
          Test with context provider
        </button>
        
        <button style={{marginTop: "6px"}} onClick={handleZustandTest} className={styles.nextButton}>
          Test with sustand store
        </button>

        <button style={{marginTop: "6px"}} onClick={handleFundamentalTest} className={styles.nextButton}>
          Fundamental Test
        </button>
      </main>
    );
});

export default CameraPermission;