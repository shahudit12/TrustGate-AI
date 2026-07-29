import React, { useEffect, useState } from 'react';
import clsx from 'clsx';

interface ProgressRingProps {
  progress: number;
  size: number;
  strokeWidth: number;
  color: string;
  trailColor?: string;
  animated?: boolean;
  children?: React.ReactNode;
}

export const ProgressRing: React.FC<ProgressRingProps> = ({
  progress,
  size,
  strokeWidth,
  color,
  trailColor = '#334155',
  animated = true,
  children
}) => {
  const [offset, setOffset] = useState(0);
  const center = size / 2;
  const radius = center - strokeWidth / 2;
  const circumference = 2 * Math.PI * radius;

  useEffect(() => {
    const progressOffset = ((100 - progress) / 100) * circumference;
    if (animated) {
      const timer = setTimeout(() => setOffset(progressOffset), 100);
      return () => clearTimeout(timer);
    } else {
      setOffset(progressOffset);
    }
  }, [animated, circumference, progress]);

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90 w-full h-full">
        <circle
          className="transition-colors duration-300 ease-in-out"
          stroke={trailColor}
          fill="transparent"
          strokeWidth={strokeWidth}
          r={radius}
          cx={center}
          cy={center}
        />
        <circle
          className={clsx("transition-all duration-1000 ease-out", animated && "transition-all duration-1000")}
          stroke={color}
          fill="transparent"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={animated ? offset : ((100 - progress) / 100) * circumference}
          strokeLinecap="round"
          r={radius}
          cx={center}
          cy={center}
        />
      </svg>
      {children && (
        <div className="absolute inset-0 flex items-center justify-center">
          {children}
        </div>
      )}
    </div>
  );
};
