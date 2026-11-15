'use client'
import React from 'react';
import { useRouter } from 'next/navigation';  
import styles from './page.module.css';
import { useCameraStatus } from '@/hooks/useCameraSatus';

const CameraPermission = () => {
    const router = useRouter();
    const {cameraStatus, checkCameraStatus} = useCameraStatus();

    const handleUseCamera = async () => {
        const statusOK = await checkCameraStatus();
        if (statusOK) {
            router.push("/use-camera")
        }
    };
    
    return (
      <main className={styles.container}>
        <h1 className={styles.title}>Test Camera Permiossion</h1>
        {(cameraStatus.status) &&(<p className={styles.status}>Camera Status: {cameraStatus.status}. Error Name: {cameraStatus.errorName}. Error Message: {cameraStatus.errorMsg}</p>)}
        
        <button onClick={handleUseCamera} className={styles.nextButton}>
          Check camera permission and use camera
        </button>
      </main>
    );
}

export default CameraPermission;