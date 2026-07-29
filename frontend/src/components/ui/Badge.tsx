import React, { ReactNode } from 'react';
import clsx from 'clsx';

interface BadgeProps {
  variant?: 'success' | 'warning' | 'danger' | 'info' | 'neutral' | 'azure';
  size?: 'sm' | 'md';
  pulse?: boolean;
  children: ReactNode;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'neutral',
  size = 'sm',
  pulse = false,
  children,
  className
}) => {
  const baseStyles = 'inline-flex items-center font-medium rounded-full border';
  
  const sizes = {
    sm: 'px-2 py-0.5 text-xs gap-1.5',
    md: 'px-3 py-1 text-sm gap-2',
  };

  const variants = {
    success: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    warning: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    danger: 'bg-red-500/10 text-red-400 border-red-500/20',
    info: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    azure: 'bg-[#0078D4]/10 text-[#0078D4] border-[#0078D4]/20',
    neutral: 'bg-slate-500/10 text-slate-300 border-slate-500/20',
  };

  const dotColors = {
    success: 'bg-emerald-400',
    warning: 'bg-amber-400',
    danger: 'bg-red-400',
    info: 'bg-blue-400',
    azure: 'bg-[#0078D4]',
    neutral: 'bg-slate-400',
  };

  return (
    <span className={clsx(baseStyles, variants[variant], sizes[size], className)}>
      {pulse && (
        <span className="relative flex h-2 w-2">
          <span className={clsx("animate-ping absolute inline-flex h-full w-full rounded-full opacity-75", dotColors[variant])}></span>
          <span className={clsx("relative inline-flex rounded-full h-2 w-2", dotColors[variant])}></span>
        </span>
      )}
      {children}
    </span>
  );
};
