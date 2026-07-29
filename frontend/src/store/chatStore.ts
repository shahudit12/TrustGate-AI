import { create } from 'zustand';
import { chatService, ChatReasoning } from '../services/chatService';

export interface ChatMessageItem {
  id: string;
  role: 'ai' | 'user';
  text: string;
  codeSnippet?: string;
  reasoning?: ChatReasoning;
}

interface ChatState {
  messages: ChatMessageItem[];
  activeDomain: string;
  isSending: boolean;
  error: string | null;

  setActiveDomain: (domain: string) => void;
  sendMessageOptimistic: (text: string, sessionId?: string) => Promise<void>;
  clearChat: () => void;
}

const DEFAULT_MESSAGES: ChatMessageItem[] = [
  {
    id: 'msg-1',
    role: 'ai',
    text: 'Identity verified via TrustGate AI. Passport TP-AZURE-99842 active. How can I assist you with high-clearance operations today?',
    reasoning: {
      trustScore: 98.4,
      passportId: 'TP-AZURE-99842',
      clearanceLevel: 'HIGH_CLEARANCE',
      xaiFactor: 'Passed 468-mesh face liveness & neural vocal spectrogram baseline.',
    },
  },
];

export const useChatStore = create<ChatState>((set, get) => ({
  messages: DEFAULT_MESSAGES,
  activeDomain: 'Corporate Banking',
  isSending: false,
  error: null,

  setActiveDomain: (activeDomain) => set({ activeDomain }),

  sendMessageOptimistic: async (text, sessionId = 'TP-AZURE-99842') => {
    if (!text.trim()) return;

    const userMessage: ChatMessageItem = {
      id: `usr-${Date.now()}`,
      role: 'user',
      text,
    };

    // Optimistic Update: Append user message immediately
    set((state) => ({
      messages: [...state.messages, userMessage],
      isSending: true,
      error: null,
    }));

    try {
      const response = await chatService.sendMessage({
        message: text,
        domain: get().activeDomain,
        sessionId,
      });

      const aiMessage: ChatMessageItem = {
        id: response.id || `ai-${Date.now()}`,
        role: 'ai',
        text: response.message,
        codeSnippet: response.codeSnippet,
        reasoning: response.reasoning,
      };

      set((state) => ({
        messages: [...state.messages, aiMessage],
        isSending: false,
      }));
    } catch (err) {
      console.error('Chat error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Chat service unavailable';
      const fallbackAiMessage: ChatMessageItem = {
        id: `ai-err-${Date.now()}`,
        role: 'ai',
        text: `Error processing query: ${errorMessage}. Authorization fallback verified.`,
      };
      set((state) => ({
        messages: [...state.messages, fallbackAiMessage],
        isSending: false,
        error: errorMessage,
      }));
    }
  },

  clearChat: () => set({ messages: DEFAULT_MESSAGES, error: null }),
}));
