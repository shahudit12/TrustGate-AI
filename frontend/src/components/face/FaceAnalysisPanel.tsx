import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWebcam } from '../../hooks/useWebcam';
import { useVerificationStore } from '../../store/verificationStore';
import { useAuditTimeline } from '../../hooks/useAuditTimeline';
import { faceService } from '../../services/faceService';
import { AuditEventType } from '../../types/audit';
import { VerificationModule } from '../../types/verification';

export const FaceAnalysisPanel: React.FC = () => {
  const { videoRef, isActive, startCamera, stopCamera, captureFrame } = useWebcam();
  const { sessionId, setFaceResult, setCurrentModule } = useVerificationStore();
  const { addEvent } = useAuditTimeline();
  const [isScanning, setIsScanning] = React.useState(false);

  useEffect(() => {
    setCurrentModule(VerificationModule.FACE);
    addEvent(AuditEventType.MODULE_INIT, 'Face analysis module initialized', 'info');
    startCamera();
    return () => {
      stopCamera();
    };
  }, [setCurrentModule, addEvent, startCamera, stopCamera]);

  useEffect(() => {
    if (!isActive || !sessionId) return;
    
    setIsScanning(true);
    addEvent(AuditEventType.DATA_COLLECTED, 'Started capturing face frames', 'info', '📷');

    const intervalId = setInterval(async () => {
      const frame = captureFrame();
      if (frame) {
        try {
          const result = await faceService.analyzeFrame(sessionId, frame);
          setFaceResult(result);
        } catch (error) {
          console.error('Face analysis error:', error);
          addEvent(AuditEventType.ERROR, 'Failed to analyze face frame', 'error');
        }
      }
    }, 500);

    return () => {
      clearInterval(intervalId);
      setIsScanning(false);
    };
  }, [isActive, sessionId, captureFrame, setFaceResult, addEvent]);

  return (
    <div className="relative w-full max-w-2xl mx-auto rounded-2xl overflow-hidden glass border-2 border-slate-700/50 shadow-2xl">
      <div className="absolute top-4 left-4 z-10 flex items-center gap-2 bg-slate-900/80 backdrop-blur px-3 py-1.5 rounded-full border border-slate-700">
        <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-[#00B294] animate-pulse' : 'bg-red-500'}`} />
        <span className="text-xs font-medium text-slate-200 uppercase tracking-wider">
          {isActive ? 'Camera Active' : 'Initializing...'}
        </span>
      </div>

      <div className="relative aspect-video bg-black flex items-center justify-center overflow-hidden">
        <video 
          ref={videoRef} 
          autoPlay 
          playsInline 
          muted 
          aria-label="Webcam live video feed for face biometric analysis"
          className="w-full h-full object-cover opacity-80"
        />
        
        <canvas aria-label="Facial liveness landmark visualizer" className="absolute inset-0 w-full h-full pointer-events-none" />

        {/* Scan Line Animation */}
        <AnimatePresence>
          {isScanning && (
            <motion.div
              className="absolute inset-0 pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="w-full h-1 bg-gradient-to-r from-transparent via-[#0078D4] to-transparent animate-scan shadow-[0_0_15px_rgba(0,120,212,0.8)]" />
              <div className="absolute inset-0 border-4 border-[#0078D4]/20 rounded-xl" />
              
              {/* Corner brackets */}
              <div className="absolute top-8 left-8 w-16 h-16 border-t-4 border-l-4 border-[#0078D4] rounded-tl-xl" />
              <div className="absolute top-8 right-8 w-16 h-16 border-t-4 border-r-4 border-[#0078D4] rounded-tr-xl" />
              <div className="absolute bottom-8 left-8 w-16 h-16 border-b-4 border-l-4 border-[#0078D4] rounded-bl-xl" />
              <div className="absolute bottom-8 right-8 w-16 h-16 border-b-4 border-r-4 border-[#0078D4] rounded-br-xl" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="p-4 bg-slate-900/90 border-t border-slate-700">
        <p className="text-sm text-slate-400 text-center font-mono">
          Ensure your face is clearly visible and well-lit. Continuous biometric analysis is active.
        </p>
      </div>
    </div>
  );
};
