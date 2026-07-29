/**
 * Configuration for the application, including demo mode toggles and constants.
 */

export const DEMO_CONFIG = {
  enabled: import.meta.env.VITE_DEMO_MODE === 'true',
  simulatedDelays: { 
    face: 2000, 
    voice: 3000, 
    behavioral: 1500, 
    risk: 800 
  },
  defaultScenario: 'success' as 'success' | 'medium_risk' | 'high_risk' | 'critical',
  bannerText: 'LIVE BACKEND MODE — Connected to TrustGate AI FastAPI Engine',
};

export const API_CONFIG = {
  baseUrl: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  wsUrl: import.meta.env.VITE_WS_URL || 'ws://localhost:8000',
  timeout: 30000,
};

export const TRUST_THRESHOLDS = {
  LOW: 80, // Scores >= 80 are low risk
  MEDIUM: 60,
  HIGH: 40,
} as const;

export const RISK_COLORS = {
  LOW: '#00B294',      // Trust Green
  MEDIUM: '#F59E0B',   // Warning Amber
  HIGH: '#EF4444',     // Danger Red
  CRITICAL: '#991B1B', // Dark Red
} as const;
