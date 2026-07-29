import React, { useEffect, useState } from 'react';
import { ProgressRing } from './ProgressRing';
import { RiskLevel } from '../../types/trust';
import { RISK_COLORS } from '../../config/demo.config';

interface TrustMeterProps {
  score: number;
  riskLevel: RiskLevel;
  animated?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const TrustMeter: React.FC<TrustMeterProps> = ({
  score,
  riskLevel,
  animated = true,
  size = 'md'
}) => {
  const [displayScore, setDisplayScore] = useState(animated ? 0 : score);

  useEffect(() => {
    if (!animated) return;
    
    let start = 0;
    const duration = 1500;
    const increment = score / (duration / 16);
    
    const timer = setInterval(() => {
      start += increment;
      if (start >= score) {
        setDisplayScore(score);
        clearInterval(timer);
      } else {
        setDisplayScore(Math.floor(start));
      }
    }, 16);
    
    return () => clearInterval(timer);
  }, [score, animated]);

  const sizeMap = {
    sm: { px: 120, stroke: 8, text: 'text-3xl' },
    md: { px: 200, stroke: 12, text: 'text-5xl' },
    lg: { px: 320, stroke: 16, text: 'text-7xl' }
  };

  const currentSize = sizeMap[size];
  const color = RISK_COLORS[riskLevel] || RISK_COLORS.LOW;

  return (
    <div className="relative flex flex-col items-center justify-center">
      {animated && score > 0 && (
        <div 
          className="trust-ring" 
          style={{ 
            width: currentSize.px, 
            height: currentSize.px, 
            '--color-trust': color 
          } as React.CSSProperties} 
        />
      )}
      <ProgressRing
        progress={score}
        size={currentSize.px}
        strokeWidth={currentSize.stroke}
        color={color}
        animated={animated}
      >
        <div className="flex flex-col items-center">
          <span className={`font-bold tracking-tighter ${currentSize.text} gradient-text`}>
            {displayScore}
          </span>
          <span className="text-slate-400 text-sm font-medium tracking-widest uppercase mt-1">
            Trust Score
          </span>
        </div>
      </ProgressRing>
    </div>
  );
};
