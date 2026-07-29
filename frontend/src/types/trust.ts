/**
 * Types related to Trust Engine scoring and XAI factors.
 */

import { VerificationSession } from './verification';

export enum RiskLevel {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

export interface XAIFactor {
  factor_id: string;
  description: string;
  impact: 'positive' | 'negative' | 'neutral' | number;
  severity: RiskLevel | 'low' | 'medium' | 'high' | 'critical';
  technical_detail: string;
}

export interface TrustComponent {
  moduleName: string;
  score: number;
  passed: boolean;
  factors: XAIFactor[];
}

export interface TrustScoreResult {
  overallScore: number; // 0-100
  riskLevel: RiskLevel;
  components: TrustComponent[];
  calculatedAt: string;
  recommendation: string;
}

export interface VerificationResult {
  session: VerificationSession;
  trustScore: TrustScoreResult;
  aiSummary: string;
  passportId?: string;
}
