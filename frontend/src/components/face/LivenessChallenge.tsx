import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Challenge, ChallengeResult } from '../../types/verification';
import { ProgressRing } from '../ui/ProgressRing';

interface LivenessChallengeProps {
  challenge: Challenge;
  onComplete: (result: ChallengeResult) => void;
  onTimeout: () => void;
}

export const LivenessChallenge: React.FC<LivenessChallengeProps> = ({
  challenge,
  onComplete,
  onTimeout
}) => {
  const [timeLeft, setTimeLeft] = useState(challenge.timeoutMs);
  const [progress, setProgress] = useState(100);
  const [status, setStatus] = useState<'pending' | 'success' | 'fail'>('pending');

  useEffect(() => {
    const startTime = Date.now();
    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, challenge.timeoutMs - elapsed);
      setTimeLeft(remaining);
      setProgress((remaining / challenge.timeoutMs) * 100);

      if (remaining === 0) {
        clearInterval(timer);
        setStatus('fail');
        setTimeout(onTimeout, 1000);
      }
    }, 100);

    return () => clearInterval(timer);
  }, [challenge, onTimeout]);

  // Simulate completion for demo purposes if clicked
  const handleSimulateSuccess = () => {
    setStatus('success');
    setTimeout(() => {
      onComplete({
        challengeId: challenge.id,
        passed: true,
        score: 0.98,
        durationMs: challenge.timeoutMs - timeLeft
      });
    }, 1000);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="absolute inset-0 z-30 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm rounded-xl overflow-hidden"
    >
      {/* Background Flash */}
      <motion.div 
        animate={{ 
          backgroundColor: status === 'success' ? 'rgba(0, 178, 148, 0.3)' : status === 'fail' ? 'rgba(239, 68, 68, 0.3)' : 'rgba(0,0,0,0)'
        }}
        className="absolute inset-0 transition-colors duration-500"
      />

      <div className="relative glass p-8 rounded-2xl flex flex-col items-center shadow-2xl cursor-pointer" onClick={handleSimulateSuccess}>
        <ProgressRing 
          progress={progress} 
          size={120} 
          strokeWidth={8} 
          color={status === 'success' ? '#00B294' : status === 'fail' ? '#EF4444' : '#0078D4'}
          animated={false}
        >
          <span className="text-2xl font-bold font-mono text-white">
            {(timeLeft / 1000).toFixed(1)}s
          </span>
        </ProgressRing>

        <h2 className="mt-6 text-2xl font-bold text-white tracking-wide text-center uppercase">
          {challenge.prompt}
        </h2>
        <p className="mt-2 text-sm text-slate-300 text-center max-w-xs">
          {status === 'pending' ? 'Follow the instruction above before the timer runs out.' : 
           status === 'success' ? 'Challenge passed!' : 'Time expired. Please try again.'}
        </p>
      </div>
    </motion.div>
  );
};
