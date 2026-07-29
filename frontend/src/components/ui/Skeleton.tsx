import React from 'react';
import { twMerge } from 'tailwind-merge';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'card' | 'chart' | 'table' | 'metric' | 'avatar';
  count?: number;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className,
  variant = 'text',
  count = 1,
}) => {
  const baseClasses = 'skeleton-shimmer rounded-lg';

  const renderSkeletonItem = (index: number) => {
    switch (variant) {
      case 'avatar':
        return (
          <div
            key={index}
            className={twMerge(baseClasses, 'w-10 h-10 rounded-full', className)}
          />
        );
      case 'metric':
        return (
          <div
            key={index}
            className={twMerge(
              baseClasses,
              'h-24 w-full p-4 flex flex-col justify-between border border-slate-800/80',
              className
            )}
          >
            <div className="h-4 w-1/3 bg-slate-700/40 rounded" />
            <div className="h-8 w-1/2 bg-slate-700/60 rounded" />
          </div>
        );
      case 'card':
        return (
          <div
            key={index}
            className={twMerge(
              baseClasses,
              'h-48 w-full p-6 flex flex-col gap-4 border border-slate-800/80',
              className
            )}
          >
            <div className="h-6 w-1/4 bg-slate-700/50 rounded" />
            <div className="h-4 w-3/4 bg-slate-700/30 rounded" />
            <div className="h-4 w-1/2 bg-slate-700/30 rounded" />
            <div className="mt-auto h-8 w-28 bg-slate-700/40 rounded" />
          </div>
        );
      case 'chart':
        return (
          <div
            key={index}
            className={twMerge(
              baseClasses,
              'h-64 w-full p-6 flex flex-col justify-between border border-slate-800/80',
              className
            )}
          >
            <div className="flex justify-between items-center mb-4">
              <div className="h-5 w-1/3 bg-slate-700/50 rounded" />
              <div className="h-4 w-16 bg-slate-700/40 rounded" />
            </div>
            <div className="flex items-end gap-3 h-40 pt-6">
              {[45, 75, 30, 90, 60, 80, 50].map((h, i) => (
                <div
                  key={i}
                  className="flex-1 bg-slate-700/40 rounded-t"
                  style={{ height: `${h}%` }}
                />
              ))}
            </div>
          </div>
        );
      case 'table':
        return (
          <div
            key={index}
            className={twMerge(
              'w-full space-y-3 p-4 bg-slate-900/40 rounded-xl border border-slate-800/80',
              className
            )}
          >
            {[1, 2, 3, 4].map((row) => (
              <div key={row} className="flex items-center gap-4 py-2 border-b border-slate-800/40 last:border-0">
                <div className="w-8 h-8 rounded-full skeleton-shimmer shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-1/3 skeleton-shimmer rounded" />
                  <div className="h-3 w-1/4 skeleton-shimmer rounded opacity-60" />
                </div>
                <div className="h-6 w-16 skeleton-shimmer rounded-full" />
              </div>
            ))}
          </div>
        );
      case 'text':
      default:
        return (
          <div
            key={index}
            className={twMerge(baseClasses, 'h-4 w-full my-1', className)}
          />
        );
    }
  };

  return (
    <>
      {Array.from({ length: count }).map((_, idx) => renderSkeletonItem(idx))}
    </>
  );
};
