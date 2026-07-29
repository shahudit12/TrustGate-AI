/**
 * Core verification types for face, voice, and behavioral analysis.
 */

export enum VerificationStatus {
  IDLE = 'IDLE',
  PENDING_CONSENT = 'PENDING_CONSENT',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  ESCALATED = 'ESCALATED'
}

export enum VerificationModule {
  FACE = 'FACE',
  VOICE = 'VOICE',
  BEHAVIORAL = 'BEHAVIORAL',
  DOCUMENT = 'DOCUMENT'
}

export interface FaceLandmark {
  x: number;
  y: number;
  z: number;
}

export interface BlinkResult {
  blinkCount: number;
  isBlinking: boolean;
  eyeOpening: { left: number; right: number };
}

export interface HeadPoseResult {
  pitch: number;
  yaw: number;
  roll: number;
  isFrontal: boolean;
}

export interface LivenessResult {
  isLive: boolean;
  confidence: number;
  method: string;
}

export interface SpoofResult {
  isSpoof: boolean;
  score: number;
  indicators: string[];
}

export interface VirtualCameraResult {
  detected: boolean;
  confidence: number;
  softwareName?: string;
}

export interface FaceAnalysisResult {
  detected: boolean;
  confidence: number;
  landmarks: FaceLandmark[];
  blinks: BlinkResult;
  pose: HeadPoseResult;
  liveness: LivenessResult;
  spoof: SpoofResult;
  virtualCamera: VirtualCameraResult;
  multipleFaces: boolean;
}

export interface VoiceTranscriptionResult {
  text: string;
  confidence: number;
}

export interface SpeakerVerificationResult {
  isMatch: boolean;
  similarityScore: number;
}

export interface ReplayDetectionResult {
  isReplay: boolean;
  confidence: number;
}

export interface CloneDetectionResult {
  isClone: boolean;
  score: number;
  modelDetected?: string;
}

export interface NoiseAnalysisResult {
  snr: number;
  backgroundNoiseLevel: string;
}

export interface VoiceAnalysisResult {
  transcription: VoiceTranscriptionResult;
  speaker: SpeakerVerificationResult;
  replay: ReplayDetectionResult;
  clone: CloneDetectionResult;
  noise: NoiseAnalysisResult;
}

export interface MouseEvent {
  x: number;
  y: number;
  timestamp: number;
  type: string;
}

export interface KeyboardEvent {
  keyDelay: number;
  timestamp: number;
}

export interface BrowserFingerprint {
  userAgent: string;
  language: string;
  screenResolution: string;
  hardwareConcurrency: number;
  canvasHash: string;
}

export interface DeviceInfo {
  os: string;
  browser: string;
  deviceType: 'mobile' | 'desktop' | 'tablet';
}

export interface MouseAnalysisResult {
  entropyScore: number;
  isHuman: boolean;
}

export interface KeyboardAnalysisResult {
  rhythmConsistency: number;
  isHuman: boolean;
}

export interface VPNDetectionResult {
  isVpn: boolean;
  ipScore: number;
}

export interface AutomationDetectionResult {
  isBot: boolean;
  confidence: number;
  flags: string[];
}

export interface BehavioralAnalysisResult {
  mouse: MouseAnalysisResult;
  keyboard: KeyboardAnalysisResult;
  vpn: VPNDetectionResult;
  automation: AutomationDetectionResult;
}

export enum ChallengeType {
  LIVENESS_SMILE = 'LIVENESS_SMILE',
  LIVENESS_TURN_LEFT = 'LIVENESS_TURN_LEFT',
  LIVENESS_TURN_RIGHT = 'LIVENESS_TURN_RIGHT',
  VOICE_PHRASE = 'VOICE_PHRASE',
}

export interface Challenge {
  id: string;
  type: ChallengeType;
  prompt: string;
  timeoutMs: number;
}

export interface ChallengeResult {
  challengeId: string;
  passed: boolean;
  score: number;
  durationMs: number;
}

export interface VerificationSession {
  sessionId: string;
  status: VerificationStatus;
  startedAt: string;
  expiresAt: string;
  currentRiskLevel?: string;
}
