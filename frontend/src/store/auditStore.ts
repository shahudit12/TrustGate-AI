import { create } from 'zustand';
import { AuditTimelineEntry, AuditEventType } from '../types/audit';

interface AuditState {
  timeline: AuditTimelineEntry[];
  sessionStartTime: number | null;
  
  startTimeline: () => void;
  addEvent: (
    event_type: AuditEventType, 
    description: string, 
    status: AuditTimelineEntry['status'], 
    icon: string
  ) => void;
  clearTimeline: () => void;
  getElapsedMs: () => number;
}

const generateId = () => Math.random().toString(36).substring(2, 9);

export const useAuditStore = create<AuditState>((set, get) => ({
  timeline: [],
  sessionStartTime: null,

  startTimeline: () => set({ 
    sessionStartTime: Date.now(), 
    timeline: [] 
  }),

  addEvent: (event_type, description, status, icon) => {
    const startTime = get().sessionStartTime || Date.now();
    const timestamp_ms = Date.now() - startTime;
    
    const newEntry: AuditTimelineEntry = {
      id: generateId(),
      timestamp_ms,
      event_type,
      description,
      status,
      icon,
    };

    set((state) => ({ timeline: [...state.timeline, newEntry] }));
  },

  clearTimeline: () => set({ timeline: [], sessionStartTime: null }),

  getElapsedMs: () => {
    const start = get().sessionStartTime;
    return start ? Date.now() - start : 0;
  },
}));
