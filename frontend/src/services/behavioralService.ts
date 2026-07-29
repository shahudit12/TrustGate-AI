import { request } from './api';
import { BehavioralAnalysisResult } from '../types/verification';
import { DEMO_CONFIG } from '../config/demo.config';

export class BehavioralService {
  async submitBehavioralData(data: any): Promise<BehavioralAnalysisResult> {
    if (DEMO_CONFIG.enabled) {
      return {
        mouse: { entropyScore: 0.85, isHuman: true },
        keyboard: { rhythmConsistency: 0.78, isHuman: true },
        vpn: { isVpn: false, ipScore: 0.95 },
        automation: { isBot: false, confidence: 0.99, flags: [] },
      };
    }

    return request<BehavioralAnalysisResult>({
      url: '/behavioral/submit',
      method: 'POST',
      data,
    });
  }
}

export const behavioralService = new BehavioralService();
