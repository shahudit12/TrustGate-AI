import React from 'react';
import { motion } from 'framer-motion';
import { TrustMeter } from '../ui/TrustMeter';
import { Button } from '../ui/Button';
import { RiskLevel, XAIFactor } from '../../types/trust';
import { Badge } from '../ui/Badge';

export const TrustScoreReveal: React.FC = () => {
  const demoScore = 96;
  const demoRisk = RiskLevel.LOW;
  const aiSummary = "High confidence match. No spoofing indicators detected. Multi-modal biometrics strongly align with established human baseline patterns.";
  
  const factors: XAIFactor[] = [
    { factor_id: '1', description: 'Strong Facial Liveness', impact: 'positive', severity: 'low', technical_detail: 'Depth variance and micro-expressions match human physiology.' },
    { factor_id: '2', description: 'Voice Replay Absence', impact: 'positive', severity: 'low', technical_detail: 'No electrical artifacts or playback frequencies found.' },
    { factor_id: '3', description: 'Natural Input Cadence', impact: 'positive', severity: 'low', technical_detail: 'Keyboard/mouse rhythm entropy aligns with human interaction bounds.' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0F172A] overflow-y-auto overflow-x-hidden p-6">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-[#0F172A] to-[#0F172A]"></div>
      
      <div className="relative w-full max-w-4xl mx-auto z-10 flex flex-col items-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', damping: 20, stiffness: 100 }}
          className="mb-12"
        >
          <TrustMeter score={demoScore} riskLevel={demoRisk} size="lg" animated={true} />
        </motion.div>

        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.8 }}
          className="w-full glass rounded-3xl p-8 mb-8 border border-[#00B294]/30 shadow-[0_0_40px_rgba(0,178,148,0.1)] text-center relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#0078D4] to-[#00B294]"></div>
          
          <Badge variant="success" size="md" pulse className="mb-4">VERIFIED HUMAN</Badge>
          <h2 className="text-2xl font-bold text-white mb-4">Risk Engine Analysis Complete</h2>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto font-light leading-relaxed">
            "{aiSummary}"
          </p>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 2, duration: 0.5 }}
          className="w-full grid grid-cols-1 md:grid-cols-3 gap-4 mb-12"
        >
          {factors.map((factor, idx) => (
            <motion.div 
              key={factor.factor_id}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 2.2 + (idx * 0.2) }}
              className="bg-slate-800/50 p-5 rounded-xl border border-slate-700 hover:border-slate-500 transition-colors"
            >
              <div className="flex items-center gap-2 mb-3">
                <svg className="w-5 h-5 text-[#00B294]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h4 className="font-semibold text-slate-200">{factor.description}</h4>
              </div>
              <p className="text-xs text-slate-400 font-mono">{factor.technical_detail}</p>
              <div className="mt-3 text-right font-mono text-sm text-[#00B294] font-bold">
                +{factor.impact} pts
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 3, duration: 0.5 }}
          className="flex gap-6"
        >
          <Button size="lg" variant="azure" onClick={() => window.location.href='/chat'}>
            Access Secure AI Gateway
          </Button>
          <Button size="lg" variant="secondary" onClick={() => window.location.href='/report/demo-id'}>
            View Immutable Report
          </Button>
        </motion.div>
      </div>
    </div>
  );
};
