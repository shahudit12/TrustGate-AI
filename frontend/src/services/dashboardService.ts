import { request } from './api';

export interface DashboardKPIs {
  security_score: string;
  passports_issued: number;
  critical_escalations: number;
  system_availability: string;
  threat_level?: string;
}

export interface FunnelData {
  stage: string;
  count: number;
}

export interface TimelineData {
  time: string;
  legitimate: number;
  syntheticAttacks: number;
}

export interface RiskDistributionData {
  name: string;
  value: number;
  color: string;
}

export interface DeviceData {
  device: string;
  passRate: number;
}

export interface DashboardStats {
  kpis: DashboardKPIs;
  funnel: FunnelData[];
  timeline: TimelineData[];
  risk_distribution: RiskDistributionData[];
  devices: DeviceData[];
}

export interface TelemetryService {
  name: string;
  region: string;
  model: string;
  latency_ms: number;
  reqs: string;
  status: string;
}

export interface TelemetryData {
  services: TelemetryService[];
}

export class DashboardService {
  async getStats(): Promise<DashboardStats> {
    return request<DashboardStats>({
      url: '/dashboard/stats',
      method: 'GET',
    });
  }

  async getTelemetry(): Promise<TelemetryData> {
    return request<TelemetryData>({
      url: '/dashboard/telemetry',
      method: 'GET',
    });
  }
}

export const dashboardService = new DashboardService();
