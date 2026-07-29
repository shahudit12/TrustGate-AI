/**
 * Digital Trust Passport types for verified sessions.
 */

import { RiskLevel } from './trust';

export interface TrustPassportSubject {
  id: string;
  type: 'human' | 'synthetic';
}

export interface TrustPassportComponents {
  faceVerified: boolean;
  voiceVerified: boolean;
  behaviorVerified: boolean;
  challengesPassed: number;
}

export interface TrustPassport {
  passportId: string;
  sessionId: string;
  subject: TrustPassportSubject;
  trustScore: number;
  riskLevel: RiskLevel;
  components: TrustPassportComponents;
  validFrom: string;
  expiresAt: string;
  signature: string;
}

export interface PassportItem {
  id: string;
  name: string;
  role: string;
  score: number;
  risk: 'LOW' | 'MEDIUM' | 'HIGH';
  date: string;
  device: string;
  location: string;
  validFrom?: string;
  expiresAt?: string;
  sessionId?: string;
  signature?: string;
  xai_reasoning?: string;
  timeline?: { time: string; text: string }[];
}

export interface PassportValidationResult {
  isValid: boolean;
  isExpired: boolean;
  passport?: TrustPassport;
  error?: string;
}
