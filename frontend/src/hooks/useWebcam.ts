import { useState, useEffect, useRef, useCallback } from 'react';
import { DEMO_CONFIG } from '../config/demo.config';

export function useWebcam() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  const startCamera = async () => {
    try {
      if (DEMO_CONFIG.enabled) {
        setIsActive(true);
        setHasPermission(true);
        return;
      }
      
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480, facingMode: 'user' },
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setIsActive(true);
      setHasPermission(true);
    } catch (err: any) {
      setError(err.message);
      setHasPermission(false);
    }
  };

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
    setStream(null);
    setIsActive(false);
  }, [stream]);

  const captureFrame = (): string | null => {
    if (DEMO_CONFIG.enabled) {
      return 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAAAAAAAD/2wBDAAo...';
    }
    if (!videoRef.current || !isActive) return null;

    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0);
      return canvas.toDataURL('image/jpeg', 0.8);
    }
    return null;
  };

  useEffect(() => {
    return () => stopCamera();
  }, [stopCamera]);

  return { videoRef, stream, isActive, error, startCamera, stopCamera, captureFrame, hasPermission };
}
