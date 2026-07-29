import React from 'react';
import { motion } from 'framer-motion';
import { AuditTimelineEntry } from '../../types/audit';

interface TimelineProps {
  events: AuditTimelineEntry[];
  compact?: boolean;
}

export const Timeline: React.FC<TimelineProps> = ({ events, compact = false }) => {
  if (events.length === 0) {
    return <div className="text-slate-500 text-sm italic py-4">No events recorded yet.</div>;
  }

  return (
    <div className="relative pl-6 space-y-4 before:absolute before:inset-0 before:ml-2 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-700 before:to-transparent">
      {events.map((event, index) => {
        const isSuccess = event.status === 'success';
        const isError = event.status === 'error';
        const isWarning = event.status === 'warning';
        
        let dotColor = 'bg-slate-500';
        let glowColor = '';
        
        if (isSuccess) {
          dotColor = 'bg-[#00B294]';
          glowColor = 'shadow-[0_0_10px_rgba(0,178,148,0.5)]';
        } else if (isError) {
          dotColor = 'bg-red-500';
          glowColor = 'shadow-[0_0_10px_rgba(239,68,68,0.5)]';
        } else if (isWarning) {
          dotColor = 'bg-amber-500';
          glowColor = 'shadow-[0_0_10px_rgba(245,158,11,0.5)]';
        } else {
          dotColor = 'bg-[#0078D4]';
          glowColor = 'shadow-[0_0_10px_rgba(0,120,212,0.5)]';
        }

        return (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className={`relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group ${compact ? 'py-1' : 'py-2'}`}
          >
            {/* Timeline Dot */}
            <div className={`absolute left-0 md:left-1/2 md:-translate-x-1/2 flex h-4 w-4 items-center justify-center rounded-full border-2 border-slate-900 ${dotColor} ${glowColor} -ml-2 md:ml-0 z-10`}>
              {index === events.length - 1 && (
                <span className="absolute inline-flex h-full w-full rounded-full bg-current opacity-50 animate-ping"></span>
              )}
            </div>
            
            <div className="w-full pl-6 md:w-1/2 md:pl-0 md:pr-8 md:group-odd:pr-0 md:group-odd:pl-8 flex flex-col md:group-odd:items-end">
              <div className="glass p-3 rounded-lg border border-slate-700/50 w-full md:w-11/12 hover:border-slate-500 transition-colors flex items-start gap-3">
                <span className="text-xl shrink-0">{event.icon}</span>
                <div className="flex flex-col gap-1 w-full">
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-mono font-medium ${isSuccess ? 'text-[#00B294]' : isError ? 'text-red-400' : 'text-slate-300'}`}>
                      {event.event_type}
                    </span>
                    <span className="text-[10px] font-mono text-slate-500">
                      +{event.timestamp_ms}ms
                    </span>
                  </div>
                  <p className="text-sm text-slate-300 leading-snug">{event.description}</p>
                </div>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};
