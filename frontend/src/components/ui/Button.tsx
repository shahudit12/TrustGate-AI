/**
 * TrustGate AI — Button Component
 *
 * Reusable button with multiple variants and Framer Motion micro-interactions.
 * Extends native button props to ensure full accessibility support.
 *
 * Icon positioning:
 *   - Default (iconPosition="right"): icon renders AFTER children — use with ml-1 on icon
 *   - iconPosition="left": icon renders BEFORE children (leading icon)
 */
import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'azure';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
  children: ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  isLoading,
  icon,
  iconPosition = 'right',
  children,
  className,
  disabled,
  onClick,
  type = 'button',
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed select-none';

  const variants = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-blue-500/25 focus-visible:ring-blue-500',
    azure:
      'bg-gradient-to-r from-[#0078D4] to-[#00B294] text-white shadow-lg hover:shadow-[#0078D4]/30 hover:brightness-110 focus-visible:ring-[#0078D4]',
    secondary:
      'bg-slate-800/80 text-slate-200 border border-slate-700 hover:bg-slate-700 hover:border-slate-600 focus-visible:ring-slate-500',
    danger: 'bg-red-600 hover:bg-red-700 text-white shadow-lg hover:shadow-red-500/25 focus-visible:ring-red-500',
    ghost: 'bg-transparent text-slate-300 hover:bg-slate-800/60 hover:text-white focus-visible:ring-slate-500',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-4 py-2 text-sm gap-2',
    lg: 'px-6 py-3 text-base gap-2.5 font-semibold',
  };

  const isDisabled = disabled || isLoading;
  const isFullWidth = className?.includes('w-full');

  const spinnerEl = (
    <svg className="animate-spin h-4 w-4 text-current shrink-0" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );

  const iconEl = icon ? <span className="shrink-0">{icon}</span> : null;

  return (
    <motion.div
      whileHover={{ scale: isDisabled ? 1 : 1.015 }}
      whileTap={{ scale: isDisabled ? 1 : 0.975 }}
      className={clsx('inline-flex', isFullWidth && 'w-full')}
    >
      <button
        type={type}
        className={clsx(baseStyles, variants[variant], sizes[size], isFullWidth && 'w-full', className)}
        disabled={isDisabled}
        onClick={onClick}
        {...props}
      >
        {/* Leading spinner (replaces leading icon while loading) */}
        {isLoading ? spinnerEl : iconPosition === 'left' ? iconEl : null}

        <span>{children}</span>

        {/* Trailing icon (default — right position) */}
        {!isLoading && iconPosition === 'right' ? iconEl : null}
      </button>
    </motion.div>
  );
};
