import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';

interface CardProps {
  className?: string;
  glow?: 'azure' | 'trust' | 'danger' | 'none';
  hover?: boolean;
  children: ReactNode;
}

export const Card: React.FC<CardProps> = ({
  className,
  glow = 'none',
  hover = false,
  children,
}) => {
  const glowStyles = {
    none: '',
    azure: 'before:absolute before:inset-0 before:-z-10 before:rounded-xl before:bg-gradient-to-r before:from-[#0078D4]/50 before:to-transparent before:blur-md before:opacity-0 hover:before:opacity-100 before:transition-opacity',
    trust: 'before:absolute before:inset-0 before:-z-10 before:rounded-xl before:bg-gradient-to-r before:from-[#00B294]/50 before:to-transparent before:blur-md before:opacity-0 hover:before:opacity-100 before:transition-opacity',
    danger: 'before:absolute before:inset-0 before:-z-10 before:rounded-xl before:bg-gradient-to-r before:from-red-500/50 before:to-transparent before:blur-md before:opacity-0 hover:before:opacity-100 before:transition-opacity',
  };

  return (
    <motion.div
      whileHover={hover ? { y: -4 } : {}}
      className={clsx(
        'relative glass rounded-xl p-6 overflow-hidden transition-all duration-300',
        glowStyles[glow],
        className
      )}
    >
      {children}
    </motion.div>
  );
};
