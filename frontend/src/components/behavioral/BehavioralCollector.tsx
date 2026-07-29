import React, { useEffect } from 'react';
import { useBehavioral } from '../../hooks/useBehavioral';
import { Tooltip } from '../ui/Tooltip';

export const BehavioralCollector: React.FC = () => {
  const { startCollecting, isCollecting, mouseEvents } = useBehavioral();

  useEffect(() => {
    startCollecting();
  }, [startCollecting]);

  if (!isCollecting) return null;

  const entropyScore = Math.min(100, Math.max(0, mouseEvents.length / 5));

  return (
    <div className="fixed bottom-4 left-4 z-40">
      <Tooltip 
        position="right"
        content={
          <div className="w-48 space-y-2">
            <p className="text-[10px] uppercase font-bold text-slate-400">Passive Analysis Live</p>
            <div className="flex justify-between items-center text-xs">
              <span>Mouse Entropy:</span>
              <span className="text-emerald-400 font-mono">{entropyScore.toFixed(0)}%</span>
            </div>
            <div className="w-full bg-slate-700 h-1 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-[#0078D4] to-[#00B294]" 
                style={{ width: `${entropyScore}%` }}
              ></div>
            </div>
          </div>
        }
      >
        <div 
          tabIndex={0} 
          role="status" 
          aria-label="Passive behavioral authentication telemetry monitor active" 
          className="glass px-3 py-1.5 rounded-full flex items-center gap-2 border border-slate-700/50 shadow-lg cursor-help focus:outline-none focus:ring-1 focus:ring-azure-500"
        >
          <div className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
          </div>
          <span className="text-[10px] font-medium text-slate-300 uppercase tracking-widest">
            Behavioral Auth
          </span>
        </div>
      </Tooltip>
    </div>
  );
};
