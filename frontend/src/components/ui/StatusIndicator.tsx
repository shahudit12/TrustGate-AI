import React from 'react';
import clsx from 'clsx';

interface StatusIndicatorProps {
  status: 'active' | 'processing' | 'success' | 'error' | 'idle';
  label?: string;
  pulse?: boolean;
}

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({ status, label, pulse = true }) => {
  const configs = {
    active: { color: 'bg-[#0078D4]', textColor: 'text-[#0078D4]', text: 'Active' },
    processing: { color: 'bg-amber-500', textColor: 'text-amber-500', text: 'Processing' },
    success: { color: 'bg-[#00B294]', textColor: 'text-[#00B294]', text: 'Success' },
    error: { color: 'bg-red-500', textColor: 'text-red-500', text: 'Error' },
    idle: { color: 'bg-slate-500', textColor: 'text-slate-400', text: 'Idle' },
  };

  const config = configs[status];
  const displayLabel = label || config.text;

  return (
    <div className="inline-flex items-center gap-2">
      <div className="relative flex h-2.5 w-2.5">
        {(pulse && status !== 'idle') && (
          <span className={clsx("animate-ping absolute inline-flex h-full w-full rounded-full opacity-75", config.color)}></span>
        )}
        <span className={clsx("relative inline-flex rounded-full h-2.5 w-2.5", config.color)}></span>
      </div>
      <span className={clsx("text-sm font-medium", config.textColor)}>
        {displayLabel}
      </span>
    </div>
  );
};
