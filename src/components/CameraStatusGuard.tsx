'use client'
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';  
import { useCameraStatus } from '@/components/hooks/useCameraSatus';

interface CameraPermissionGuardProps {
    children: React.ReactNode,
    onPermissionDenied?: () => void;
    showSuccessMessage?: boolean;
}

const CameraStatusGuard: React.FC<CameraPermissionGuardProps> = ({children}) => {
    const router = useRouter();

    const { checkCameraStatus } = useCameraStatus();

    useEffect(() => {
      void(async() => {  
        const statusOK = await checkCameraStatus();
        if (!statusOK) {
            router.push("/")
        }
      })();
    }, [checkCameraStatus, router]);
    
    return <>{children}</>    
}

export default CameraStatusGuard;