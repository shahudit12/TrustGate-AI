import React from 'react';
import { motion } from 'framer-motion';
import { Button } from './Button';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  secondaryActionLabel?: string;
  onSecondaryAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  secondaryActionLabel,
  onSecondaryAction,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center p-12 text-center bg-slate-900/40 rounded-2xl border border-dashed border-slate-800/80 max-w-lg mx-auto"
    >
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-azure-600/10 to-trust-green/10 flex items-center justify-center mb-6 border border-slate-700/50 shadow-inner">
        {icon || (
          <svg className="w-8 h-8 text-azure-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
        )}
      </div>

      <h3 className="text-xl font-bold text-slate-100 mb-2 tracking-tight">{title}</h3>
      <p className="text-sm text-slate-400 mb-8 max-w-sm leading-relaxed">{description}</p>

      <div className="flex items-center gap-3">
        {onAction && actionLabel && (
          <Button variant="azure" size="sm" onClick={onAction}>
            {actionLabel}
          </Button>
        )}
        {onSecondaryAction && secondaryActionLabel && (
          <Button variant="secondary" size="sm" onClick={onSecondaryAction}>
            {secondaryActionLabel}
          </Button>
        )}
      </div>
    </motion.div>
  );
};
