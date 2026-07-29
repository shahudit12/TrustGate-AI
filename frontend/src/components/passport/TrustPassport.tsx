import React from 'react';
import { motion } from 'framer-motion';
import { TrustPassport as ITrustPassport } from '../../types/passport';
import { QRCodeSVG } from 'qrcode.react';

interface TrustPassportProps {
  passport: ITrustPassport;
}

export const TrustPassport: React.FC<TrustPassportProps> = ({ passport }) => {
  return (
    <motion.div
      initial={{ rotateY: 90, opacity: 0 }}
      animate={{ rotateY: 0, opacity: 1 }}
      transition={{ duration: 0.8, type: 'spring', damping: 15 }}
      className="relative w-full max-w-lg aspect-[1.6/1] rounded-2xl p-[2px] overflow-hidden shadow-2xl group cursor-pointer"
      style={{ perspective: 1000 }}
    >
      {/* Holographic Border Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0078D4] via-[#00B294] to-purple-600 opacity-80 animate-pulse transition-opacity group-hover:opacity-100"></div>
      
      <div className="relative h-full w-full bg-[#0F172A] rounded-2xl p-6 flex flex-col justify-between backdrop-blur-xl border border-white/10 z-10">
        
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded bg-gradient-to-br from-[#0078D4] to-[#00B294] flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div>
              <h3 className="font-bold text-white text-lg tracking-wide uppercase">Trust Passport</h3>
              <p className="text-xs font-mono text-slate-400">ID: {passport.passportId}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold gradient-text">{passport.trustScore}</div>
            <div className="text-[10px] font-bold text-emerald-400 tracking-widest uppercase mt-1">VERIFIED</div>
          </div>
        </div>

        {/* Body */}
        <div className="flex items-end justify-between mt-8">
          <div className="space-y-4">
            <div>
              <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold mb-1">Subject Type</p>
              <p className="text-sm font-medium text-slate-200 capitalize">{passport.subject.type}</p>
            </div>
            <div className="flex gap-4">
              <div>
                <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold mb-1">Valid From</p>
                <p className="text-xs font-mono text-slate-300">{new Date(passport.validFrom).toLocaleTimeString()}</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold mb-1">Expires At</p>
                <p className="text-xs font-mono text-slate-300">{new Date(passport.expiresAt).toLocaleTimeString()}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-2 rounded-lg">
            <QRCodeSVG 
              value={`https://trustgate.ai/verify/${passport.passportId}`} 
              size={72} 
              fgColor="#0F172A"
              level="M"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="mt-4 pt-4 border-t border-slate-700/50 flex justify-between items-center">
          <div className="flex gap-2">
            {passport.components.faceVerified && <span className="w-2 h-2 rounded-full bg-blue-500" title="Face Verified"></span>}
            {passport.components.voiceVerified && <span className="w-2 h-2 rounded-full bg-teal-500" title="Voice Verified"></span>}
            {passport.components.behaviorVerified && <span className="w-2 h-2 rounded-full bg-purple-500" title="Behavior Verified"></span>}
          </div>
          <div className="text-[8px] font-mono text-slate-600 truncate max-w-[200px]">
            SIG: {passport.signature}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
