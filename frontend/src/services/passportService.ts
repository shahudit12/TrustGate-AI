import { request } from './api';
import { PassportItem } from '../types/passport';

export interface PassportListResponse {
  passports: PassportItem[];
  total: number;
}

export interface ReportResponse {
  session_id: string;
  passport_id: string;
  trust_score: number;
  risk_level: string;
  issued_date: string;
  xai_reasoning: string;
  vector_matrix: { module: string; status: string; score: number }[];
  signature_hash: string;
}

export class PassportService {
  async listPassports(query?: string, risk?: string): Promise<PassportListResponse> {
    const params: Record<string, string> = {};
    if (query) params.query = query;
    if (risk && risk !== 'ALL') params.risk = risk;

    return request<PassportListResponse>({
      url: '/passport/list',
      method: 'GET',
      params,
    });
  }

  async getPassport(passportId: string): Promise<{ passport_id: string; passport: PassportItem }> {
    return request<{ passport_id: string; passport: PassportItem }>({
      url: `/passport/${passportId}`,
      method: 'GET',
    });
  }

  async getReport(sessionId: string): Promise<ReportResponse> {
    return request<ReportResponse>({
      url: `/reports/${sessionId}`,
      method: 'GET',
    });
  }
}

export const passportService = new PassportService();
