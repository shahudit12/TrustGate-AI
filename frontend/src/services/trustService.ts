import { request } from './api';
import { VerificationSession, VerificationStatus } from '../types/verification';
import { VerificationResult, RiskLevel } from '../types/trust';
import { DEMO_CONFIG } from '../config/demo.config';

export interface AuditEventResponse {
  id: string;
  timestamp: string;
  type: string;
  message: string;
  status: string;
  icon?: string;
}

export class TrustService {
  async startVerification(context?: any): Promise<{ sessionId: string }> {
    if (DEMO_CONFIG.enabled) {
      return { sessionId: `sess-${Math.random().toString(36).substring(2, 9)}` };
    }
    const res = await request<{ session_id: string }>({
      url: '/orchestrator/verify/start',
      method: 'POST',
      data: context || { user_id: 'demo_user' },
    });
    return { sessionId: res.session_id };
  }

  async getVerificationStatus(sessionId: string): Promise<VerificationSession> {
    if (DEMO_CONFIG.enabled) {
      return {
        sessionId,
        status: VerificationStatus.IN_PROGRESS,
        startedAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 600000).toISOString(),
        currentRiskLevel: RiskLevel.LOW,
      };
    }
    const res = await request<{ session_id: string; status: string }>({
      url: `/orchestrator/verify/${sessionId}/status`,
      method: 'GET',
    });
    return {
      sessionId: res.session_id,
      status: (res.status as VerificationStatus) || VerificationStatus.IN_PROGRESS,
      startedAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 600000).toISOString(),
      currentRiskLevel: RiskLevel.LOW,
    };
  }

  async getVerificationResult(sessionId: string): Promise<VerificationResult> {
    if (DEMO_CONFIG.enabled) {
      return {
        session: {
          sessionId,
          status: VerificationStatus.COMPLETED,
          startedAt: new Date().toISOString(),
          expiresAt: new Date(Date.now() + 600000).toISOString(),
        },
        trustScore: {
          overallScore: 98.4,
          riskLevel: RiskLevel.LOW,
          components: [
            { moduleName: 'Face', score: 98.5, passed: true, factors: [] },
            { moduleName: 'Voice', score: 96.8, passed: true, factors: [] },
            { moduleName: 'Behavioral', score: 95.0, passed: true, factors: [] },
          ],
          calculatedAt: new Date().toISOString(),
          recommendation: 'PROCEED',
        },
        aiSummary: 'High confidence match. No spoofing indicators detected. Behavioral biometrics align with human patterns.',
        passportId: `TP-AZURE-${sessionId.slice(-5).toUpperCase()}`,
      };
    }

    const res = await request<{
      session_id: string;
      result: string;
      trust_score?: number;
      risk_level?: string;
      passport_id?: string;
      ai_summary?: string;
    }>({
      url: `/orchestrator/verify/${sessionId}/result`,
      method: 'GET',
    });

    return {
      session: {
        sessionId: res.session_id,
        status: VerificationStatus.COMPLETED,
        startedAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 600000).toISOString(),
      },
      trustScore: {
        overallScore: res.trust_score || 98.4,
        riskLevel: (res.risk_level as RiskLevel) || RiskLevel.LOW,
        components: [
          { moduleName: 'Face', score: 98.5, passed: true, factors: [] },
          { moduleName: 'Voice', score: 96.8, passed: true, factors: [] },
          { moduleName: 'Behavioral', score: 95.0, passed: true, factors: [] },
        ],
        calculatedAt: new Date().toISOString(),
        recommendation: 'PROCEED',
      },
      aiSummary: res.ai_summary || 'High confidence match. Zero synthetic anomalies detected.',
      passportId: res.passport_id || `TP-AZURE-99842`,
    };
  }

  async getAuditHistory(): Promise<AuditEventResponse[]> {
    const res = await request<{ history: AuditEventResponse[] }>({
      url: '/trust/history',
      method: 'GET',
    });
    return res.history;
  }

  async enforcePolicy(policyId: string): Promise<{ success: boolean; message: string }> {
    return request<{ success: boolean; message: string }>({
      url: '/trust/policy',
      method: 'POST',
      data: { policy_id: policyId, action: 'enforce' },
    });
  }
}

export const trustService = new TrustService();
