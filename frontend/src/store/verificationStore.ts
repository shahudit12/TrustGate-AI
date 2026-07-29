import { create } from 'zustand';
import { 
  VerificationStatus, 
  VerificationModule,
  FaceAnalysisResult,
  VoiceAnalysisResult,
  BehavioralAnalysisResult,
  ChallengeResult
} from '../types/verification';

interface VerificationState {
  sessionId: string | null;
  status: VerificationStatus;
  currentModule: VerificationModule | null;
  faceResult: FaceAnalysisResult | null;
  voiceResult: VoiceAnalysisResult | null;
  behavioralResult: BehavioralAnalysisResult | null;
  challengeResults: ChallengeResult[];
  consentGiven: boolean;
  
  startSession: (sessionId: string) => void;
  updateStatus: (status: VerificationStatus) => void;
  setFaceResult: (result: FaceAnalysisResult) => void;
  setVoiceResult: (result: VoiceAnalysisResult) => void;
  setBehavioralResult: (result: BehavioralAnalysisResult) => void;
  addChallengeResult: (result: ChallengeResult) => void;
  setCurrentModule: (module: VerificationModule | null) => void;
  giveConsent: () => void;
  reset: () => void;
}

export const useVerificationStore = create<VerificationState>((set) => ({
  sessionId: null,
  status: VerificationStatus.IDLE,
  currentModule: null,
  faceResult: null,
  voiceResult: null,
  behavioralResult: null,
  challengeResults: [],
  consentGiven: false,

  startSession: (sessionId) => set({ sessionId, status: VerificationStatus.IN_PROGRESS }),
  updateStatus: (status) => set({ status }),
  setFaceResult: (faceResult) => set({ faceResult }),
  setVoiceResult: (voiceResult) => set({ voiceResult }),
  setBehavioralResult: (behavioralResult) => set({ behavioralResult }),
  addChallengeResult: (result) => set((state) => ({ 
    challengeResults: [...state.challengeResults, result] 
  })),
  setCurrentModule: (currentModule) => set({ currentModule }),
  giveConsent: () => set({ consentGiven: true }),
  reset: () => set({
    sessionId: null,
    status: VerificationStatus.IDLE,
    currentModule: null,
    faceResult: null,
    voiceResult: null,
    behavioralResult: null,
    challengeResults: [],
    consentGiven: false,
  }),
}));
