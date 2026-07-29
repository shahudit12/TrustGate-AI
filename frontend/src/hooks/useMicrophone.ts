import { useState, useRef, useEffect, useCallback } from 'react';
import { DEMO_CONFIG } from '../config/demo.config';

export function useMicrophone() {
  const [isRecording, setIsRecording] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const animationFrameRef = useRef<number>(0);
  const chunksRef = useRef<Blob[]>([]);

  const updateAudioLevel = useCallback(() => {
    if (!analyserRef.current) return;
    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
    analyserRef.current.getByteFrequencyData(dataArray);
    const average = dataArray.reduce((acc, val) => acc + val, 0) / dataArray.length;
    setAudioLevel(average);
    animationFrameRef.current = requestAnimationFrame(updateAudioLevel);
  }, []);

  const startRecording = async () => {
    setError(null);
    chunksRef.current = [];
    
    if (DEMO_CONFIG.enabled) {
      setIsRecording(true);
      setHasPermission(true);
      let level = 10;
      const interval = setInterval(() => {
        level = Math.random() * 50 + 20;
        setAudioLevel(level);
      }, 100);
      (window as any).demoAudioInterval = interval;
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      setHasPermission(true);

      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      audioContextRef.current = new AudioContextClass();
      analyserRef.current = audioContextRef.current.createAnalyser();
      const source = audioContextRef.current.createMediaStreamSource(stream);
      source.connect(analyserRef.current);
      analyserRef.current.fftSize = 256;
      updateAudioLevel();

      mediaRecorderRef.current = new MediaRecorder(stream);
      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };
      
      mediaRecorderRef.current.start(100);
      setIsRecording(true);
    } catch (err: any) {
      setError(err.message || 'Microphone access denied');
      setHasPermission(false);
    }
  };

  const stopRecording = useCallback((): Promise<Blob> => {
    return new Promise((resolve) => {
      if (DEMO_CONFIG.enabled) {
        clearInterval((window as any).demoAudioInterval);
        setIsRecording(false);
        setAudioLevel(0);
        const demoBlob = new Blob(['demo'], { type: 'audio/webm' });
        setAudioBlob(demoBlob);
        resolve(demoBlob);
        return;
      }

      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }

      if (mediaRecorderRef.current && isRecording) {
        mediaRecorderRef.current.onstop = () => {
          const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
          setAudioBlob(blob);
          setIsRecording(false);
          setAudioLevel(0);
          if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
          }
          if (audioContextRef.current) {
            audioContextRef.current.close();
          }
          resolve(blob);
        };
        mediaRecorderRef.current.stop();
      } else {
        resolve(new Blob());
      }
    });
  }, [isRecording]);

  useEffect(() => {
    return () => {
      if (isRecording) stopRecording();
    };
  }, [isRecording, stopRecording]);

  return { isRecording, audioLevel, audioBlob, error, startRecording, stopRecording, hasPermission };
}
