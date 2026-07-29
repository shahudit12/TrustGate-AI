import React from 'react';
import { Tooltip } from '../ui/Tooltip';
import { RiskLevel } from '../../types/trust';
import clsx from 'clsx';

interface RiskLevelBadgeProps {
  level: RiskLevel;
  className?: string;
}

export const RiskLevelBadge: React.FC<RiskLevelBadgeProps> = ({ level, className }) => {
  const configs = {
    LOW: { color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20', icon: 'ShieldCheck', desc: 'Secure profile. Standard access granted.' },
    MEDIUM: { color: 'bg-amber-500/10 text-amber-400 border-amber-500/20', icon: 'ExclamationTriangle', desc: 'Elevated risk. Additional verification required.' },
    HIGH: { color: 'bg-red-500/10 text-red-400 border-red-500/20', icon: 'ShieldExclamation', desc: 'High risk anomaly. Access restricted.' },
    CRITICAL: { color: 'bg-red-900 text-red-100 border-red-500 animate-pulse', icon: 'Ban', desc: 'Severe threat detected. Immediate lockout.' },
  };

  const config = configs[level];

  return (
    <Tooltip content={config.desc} position="top">
      <div className={clsx("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-xs font-bold tracking-widest", config.color, className)}>
        {level === 'CRITICAL' && <span className="w-2 h-2 rounded-full bg-red-400 animate-ping"></span>}
        {level}
      </div>
    </Tooltip>
  );
};
