import { request } from './api';
import { FaceAnalysisResult } from '../types/verification';
import { DEMO_CONFIG, API_CONFIG } from '../config/demo.config';

export class FaceService {
  async analyzeFrame(sessionId: string, base64Frame: string): Promise<FaceAnalysisResult> {
    if (DEMO_CONFIG.enabled) {
      return {
        detected: true,
        confidence: 0.98,
        landmarks: [{ x: 0, y: 0, z: 0 }],
        blinks: { blinkCount: 2, isBlinking: false, eyeOpening: { left: 0.8, right: 0.8 } },
        pose: { pitch: 0.1, yaw: -0.2, roll: 0.05, isFrontal: true },
        liveness: { isLive: true, confidence: 0.95, method: 'passive' },
        spoof: { isSpoof: false, score: 0.02, indicators: [] },
        virtualCamera: { detected: false, confidence: 0.0 },
        multipleFaces: false,
      };
    }

    return request<FaceAnalysisResult>({
      url: '/face/analyze',
      method: 'POST',
      data: { sessionId, frame: base64Frame },
    });
  }

  createWebSocketConnection(
    sessionId: string, 
    onResult: (result: FaceAnalysisResult) => void,
    onError: (error: Error) => void
  ): WebSocket {
    const ws = new WebSocket(`${API_CONFIG.wsUrl}/v1/face/stream?sessionId=${sessionId}`);
    
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        onResult(data);
      } catch (e) {
        onError(e instanceof Error ? e : new Error('Failed to parse WS message'));
      }
    };
    
    ws.onerror = () => {
      onError(new Error('WebSocket connection error'));
    };

    return ws;
  }
}

export const faceService = new FaceService();
