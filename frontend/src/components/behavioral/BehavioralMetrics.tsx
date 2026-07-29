import React from 'react';
import { useVerificationStore } from '../../store/verificationStore';
import { Badge } from '../ui/Badge';
import { Card } from '../ui/Card';

export const BehavioralMetrics: React.FC = () => {
  const { behavioralResult } = useVerificationStore();

  if (!behavioralResult) return null;

  return (
    <Card glow="azure" className="w-full max-w-md">
      <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-b border-slate-700 pb-2">
        Behavioral Intelligence
      </h3>
      
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-slate-400 text-sm">Input Entropy (Mouse)</span>
          <div className="flex items-center gap-2">
            <div className="w-24 h-2 bg-slate-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-[#00B294]" 
                style={{ width: `${behavioralResult.mouse.entropyScore * 100}%` }}
              />
            </div>
            <span className="text-xs font-mono text-white">{(behavioralResult.mouse.entropyScore * 100).toFixed(0)}%</span>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-slate-400 text-sm">Keyboard Rhythm</span>
          <div className="flex items-center gap-2">
            <div className="w-24 h-2 bg-slate-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-500" 
                style={{ width: `${behavioralResult.keyboard.rhythmConsistency * 100}%` }}
              />
            </div>
            <span className="text-xs font-mono text-white">{(behavioralResult.keyboard.rhythmConsistency * 100).toFixed(0)}%</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-slate-700">
          <div className="bg-slate-900/50 p-3 rounded-lg flex flex-col gap-1">
            <span className="text-xs text-slate-500 uppercase font-semibold">Network Route</span>
            <Badge variant={behavioralResult.vpn.isVpn ? 'warning' : 'success'} size="sm">
              {behavioralResult.vpn.isVpn ? 'VPN / PROXY' : 'DIRECT IP'}
            </Badge>
          </div>
          <div className="bg-slate-900/50 p-3 rounded-lg flex flex-col gap-1">
            <span className="text-xs text-slate-500 uppercase font-semibold">Automation</span>
            <Badge variant={behavioralResult.automation.isBot ? 'danger' : 'success'} size="sm">
              {behavioralResult.automation.isBot ? 'BOT DETECTED' : 'HUMAN'}
            </Badge>
          </div>
        </div>
      </div>
    </Card>
  );
};
