import { create } from 'zustand';
import {
  DashboardKPIs,
  FunnelData,
  TimelineData,
  RiskDistributionData,
  DeviceData,
  TelemetryService,
  dashboardService,
} from '../services/dashboardService';

interface DashboardState {
  kpis: DashboardKPIs | null;
  funnel: FunnelData[];
  timeline: TimelineData[];
  riskDistribution: RiskDistributionData[];
  devices: DeviceData[];
  telemetryServices: TelemetryService[];
  isLoadingStats: boolean;
  isLoadingTelemetry: boolean;
  errorStats: string | null;
  errorTelemetry: string | null;

  fetchStats: () => Promise<void>;
  fetchTelemetry: () => Promise<void>;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  kpis: null,
  funnel: [],
  timeline: [],
  riskDistribution: [],
  devices: [],
  telemetryServices: [],
  isLoadingStats: false,
  isLoadingTelemetry: false,
  errorStats: null,
  errorTelemetry: null,

  fetchStats: async () => {
    set({ isLoadingStats: true, errorStats: null });
    try {
      const data = await dashboardService.getStats();
      set({
        kpis: data.kpis,
        funnel: data.funnel,
        timeline: data.timeline,
        riskDistribution: data.risk_distribution,
        devices: data.devices,
        isLoadingStats: false,
      });
    } catch (err) {
      console.error('Failed to fetch dashboard stats:', err);
      set({
        errorStats: err instanceof Error ? err.message : 'Failed to load dashboard analytics',
        isLoadingStats: false,
      });
    }
  },

  fetchTelemetry: async () => {
    set({ isLoadingTelemetry: true, errorTelemetry: null });
    try {
      const data = await dashboardService.getTelemetry();
      set({
        telemetryServices: data.services,
        isLoadingTelemetry: false,
      });
    } catch (err) {
      console.error('Failed to fetch telemetry:', err);
      set({
        errorTelemetry: err instanceof Error ? err.message : 'Failed to load telemetry',
        isLoadingTelemetry: false,
      });
    }
  },
}));
