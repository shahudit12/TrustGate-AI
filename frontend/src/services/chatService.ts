import { request } from './api';
import { DEMO_CONFIG } from '../config/demo.config';

export interface ChatRequest {
  message: string;
  domain: string;
  sessionId: string;
}

export interface ChatReasoning {
  trustScore: number;
  passportId: string;
  clearanceLevel: string;
  xaiFactor: string;
}

export interface ChatResponse {
  id: string;
  role: 'ai' | 'user';
  message: string;
  codeSnippet?: string;
  reasoning?: ChatReasoning;
}

export class ChatService {
  async sendMessage(chatReq: ChatRequest): Promise<ChatResponse> {
    if (DEMO_CONFIG.enabled) {
      return {
        id: `ai-${Date.now()}`,
        role: 'ai',
        message: `Executing high-clearance security query for: "${chatReq.message}". Authorization level confirmed via Trust Passport. Below is the verified diagnostic output:`,
        codeSnippet: `// TrustGate XAI Session Verification Output\nconst sessionResult = await trustEngine.evaluatePassport({\n  passportId: "${chatReq.sessionId || 'TP-AZURE-99842'}",\n  trustScore: 98.4,\n  azureOpenAIModel: "GPT-4o",\n  status: "AUTHORIZED"\n});`,
        reasoning: {
          trustScore: 98.4,
          passportId: chatReq.sessionId || 'TP-AZURE-99842',
          clearanceLevel: 'HIGH_CLEARANCE',
          xaiFactor: 'Authorized query based on 98.4% trust score. Zero synthetic anomalies detected.',
        },
      };
    }

    const res = await request<{
      id: string;
      role: string;
      message: string;
      code_snippet?: string;
      reasoning?: ChatReasoning;
    }>({
      url: '/chat/message',
      method: 'POST',
      data: {
        message: chatReq.message,
        domain: chatReq.domain,
        session_id: chatReq.sessionId,
      },
    });

    return {
      id: res.id,
      role: 'ai',
      message: res.message,
      codeSnippet: res.code_snippet,
      reasoning: res.reasoning,
    };
  }
}

export const chatService = new ChatService();
