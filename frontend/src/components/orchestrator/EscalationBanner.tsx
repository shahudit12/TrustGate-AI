import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface EscalationBannerProps {
  isVisible: boolean;
  level: 'MEDIUM' | 'HIGH' | 'CRITICAL';
  reason: string;
  onDismiss: () => void;
}

export const EscalationBanner: React.FC<EscalationBannerProps> = ({ isVisible, level, reason, onDismiss }) => {
  const configs = {
    MEDIUM: { bg: 'bg-amber-900/90', border: 'border-amber-500', text: 'text-amber-100', icon: '⚠️' },
    HIGH: { bg: 'bg-red-900/90', border: 'border-red-500', text: 'text-red-100', icon: '🚨' },
    CRITICAL: { bg: 'bg-red-950/95', border: 'border-red-600', text: 'text-red-50', icon: '🛑' },
  };

  const config = configs[level] || configs.MEDIUM;

  React.useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(onDismiss, 8000); // auto dismiss after 8s
      return () => clearTimeout(timer);
    }
  }, [isVisible, onDismiss]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{ type: 'spring', damping: 20, stiffness: 100 }}
          className="fixed top-0 left-0 right-0 z-50 flex justify-center p-4 pointer-events-none"
        >
          <div className={`pointer-events-auto shadow-2xl backdrop-blur-md rounded-xl border-2 px-6 py-4 flex items-center gap-4 max-w-2xl w-full ${config.bg} ${config.border}`}>
            <span className="text-3xl">{config.icon}</span>
            <div className="flex-1">
              <h4 className={`font-bold uppercase tracking-wider text-sm mb-1 ${config.text}`}>
                Risk Escalation: {level}
              </h4>
              <p className={`text-sm ${config.text} opacity-90 leading-tight`}>
                {reason}
              </p>
            </div>
            <button 
              onClick={onDismiss}
              className={`p-1.5 rounded-lg hover:bg-black/20 transition-colors ${config.text}`}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
