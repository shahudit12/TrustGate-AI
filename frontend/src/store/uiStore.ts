import { create } from 'zustand';
import { DEMO_CONFIG } from '../config/demo.config';

export interface Notification {
  id: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  durationMs?: number;
}

interface UIState {
  isDemoMode: boolean;
  theme: 'dark';
  activeModal: string | null;
  sidebarOpen: boolean;
  notifications: Notification[];
  
  openModal: (modalId: string) => void;
  closeModal: () => void;
  addNotification: (notification: Omit<Notification, 'id'>) => void;
  removeNotification: (id: string) => void;
  toggleSidebar: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  isDemoMode: DEMO_CONFIG.enabled,
  theme: 'dark', // App is strictly dark mode as per requirements
  activeModal: null,
  sidebarOpen: false,
  notifications: [],

  openModal: (modalId) => set({ activeModal: modalId }),
  closeModal: () => set({ activeModal: null }),
  addNotification: (notif) => {
    const id = Math.random().toString(36).substring(2, 9);
    set((state) => ({
      notifications: [...state.notifications, { ...notif, id }],
    }));
  },
  removeNotification: (id) => set((state) => ({
    notifications: state.notifications.filter((n) => n.id !== id),
  })),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
}));
