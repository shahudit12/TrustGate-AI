/**
 * Audit log and timeline types.
 */

export enum AuditEventType {
  SESSION_START = 'SESSION_START',
  MODULE_INIT = 'MODULE_INIT',
  DATA_COLLECTED = 'DATA_COLLECTED',
  ANALYSIS_COMPLETE = 'ANALYSIS_COMPLETE',
  RISK_ESCALATED = 'RISK_ESCALATED',
  CHALLENGE_ISSUED = 'CHALLENGE_ISSUED',
  CHALLENGE_RESULT = 'CHALLENGE_RESULT',
  VERIFICATION_COMPLETE = 'VERIFICATION_COMPLETE',
  PASSPORT_ISSUED = 'PASSPORT_ISSUED',
  ERROR = 'ERROR'
}

export interface AuditTimelineEntry {
  id: string;
  timestamp_ms: number;
  event_type: AuditEventType;
  description: string;
  icon: string;
  status: 'success' | 'warning' | 'error' | 'info';
}

export interface VerificationTimeline {
  sessionId: string;
  events: AuditTimelineEntry[];
}
