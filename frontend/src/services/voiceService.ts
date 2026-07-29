import { request } from './api';
import { VoiceAnalysisResult } from '../types/verification';
import { DEMO_CONFIG, API_CONFIG } from '../config/demo.config';

export class VoiceService {
  async analyzeAudio(sessionId: string, base64Audio: string, expectedPhrase?: string): Promise<VoiceAnalysisResult> {
    if (DEMO_CONFIG.enabled) {
      return {
        transcription: { text: expectedPhrase || 'My voice is my cryptographic biometric passport', confidence: 0.96 },
        speaker: { isMatch: true, similarityScore: 0.89 },
        replay: { isReplay: false, confidence: 0.99 },
        clone: { isClone: false, score: 0.05 },
        noise: { snr: 30, backgroundNoiseLevel: 'LOW' },
      };
    }

    return request<VoiceAnalysisResult>({
      url: '/voice/analyze',
      method: 'POST',
      data: { sessionId, audio: base64Audio, phrase: expectedPhrase },
    });
  }

  createWebSocketConnection(
    sessionId: string, 
    onResult: (result: VoiceAnalysisResult) => void,
    onError: (error: Error) => void
  ): WebSocket {
    const ws = new WebSocket(`${API_CONFIG.wsUrl}/v1/voice/stream?sessionId=${sessionId}`);
    ws.onmessage = (e) => onResult(JSON.parse(e.data));
    ws.onerror = () => onError(new Error('Voice WS error'));
    return ws;
  }
}

export const voiceService = new VoiceService();
