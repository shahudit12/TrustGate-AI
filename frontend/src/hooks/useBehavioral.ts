import { useState, useEffect, useRef } from 'react';
import { MouseEvent, KeyboardEvent, BrowserFingerprint, DeviceInfo } from '../types/verification';

export function useBehavioral() {
  const [isCollecting, setIsCollecting] = useState(false);
  const [mouseEvents, setMouseEvents] = useState<MouseEvent[]>([]);
  const [keyboardEvents, setKeyboardEvents] = useState<KeyboardEvent[]>([]);
  const [focusEvents, setFocusEvents] = useState<{type: string, timestamp: number}[]>([]);
  const [tabSwitches, setTabSwitches] = useState(0);
  
  const [fingerprint, setFingerprint] = useState<BrowserFingerprint | null>(null);
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo | null>(null);

  const lastKeyTime = useRef<number>(Date.now());

  useEffect(() => {
    // Generate fingerprint once on mount
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    let canvasHash = 'unknown';
    if (ctx) {
      ctx.textBaseline = 'top';
      ctx.font = '14px Arial';
      ctx.fillStyle = '#f60';
      ctx.fillRect(125,1,62,20);
      ctx.fillStyle = '#069';
      ctx.fillText('TrustGate AI', 2, 15);
      ctx.fillStyle = 'rgba(102, 204, 0, 0.7)';
      ctx.fillText('TrustGate AI', 4, 17);
      const dataUrl = canvas.toDataURL();
      let hash = 0;
      for (let i = 0; i < dataUrl.length; i++) {
        const char = dataUrl.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
      }
      canvasHash = hash.toString(16);
    }

    setFingerprint({
      userAgent: navigator.userAgent,
      language: navigator.language,
      screenResolution: `${window.screen.width}x${window.screen.height}`,
      hardwareConcurrency: navigator.hardwareConcurrency || 1,
      canvasHash
    });

    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    setDeviceInfo({
      os: navigator.platform,
      browser: navigator.userAgent.split(' ')[navigator.userAgent.split(' ').length - 1],
      deviceType: isMobile ? 'mobile' : 'desktop'
    });
  }, []);

  useEffect(() => {
    if (!isCollecting) return;

    const handleMouseMove = (e: globalThis.MouseEvent) => {
      setMouseEvents(prev => [...prev, { x: e.clientX, y: e.clientY, timestamp: Date.now(), type: 'move' }].slice(-500));
    };

    const handleClick = (e: globalThis.MouseEvent) => {
      setMouseEvents(prev => [...prev, { x: e.clientX, y: e.clientY, timestamp: Date.now(), type: 'click' }].slice(-500));
    };

    const handleKeyDown = () => {
      const now = Date.now();
      const delay = now - lastKeyTime.current;
      lastKeyTime.current = now;
      setKeyboardEvents(prev => [...prev, { keyDelay: delay, timestamp: now }].slice(-200));
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        setTabSwitches(prev => prev + 1);
        setFocusEvents(prev => [...prev, { type: 'blur', timestamp: Date.now() }]);
      } else {
        setFocusEvents(prev => [...prev, { type: 'focus', timestamp: Date.now() }]);
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('click', handleClick, { passive: true });
    window.addEventListener('keydown', handleKeyDown, { passive: true });
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('click', handleClick);
      window.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isCollecting]);

  const startCollecting = () => {
    setIsCollecting(true);
    setMouseEvents([]);
    setKeyboardEvents([]);
    setTabSwitches(0);
  };

  const stopCollecting = () => setIsCollecting(false);

  const getBehavioralData = () => ({
    mouseEvents,
    keyboardEvents,
    focusEvents,
    tabSwitches,
    fingerprint,
    deviceInfo
  });

  return { 
    isCollecting, 
    mouseEvents, 
    keyboardEvents, 
    fingerprint, 
    deviceInfo, 
    focusEvents, 
    tabSwitches, 
    startCollecting, 
    stopCollecting, 
    getBehavioralData 
  };
}
