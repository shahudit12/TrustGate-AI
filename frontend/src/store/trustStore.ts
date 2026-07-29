import { create } from 'zustand';
import { TrustScoreResult } from '../types/trust';
import { TrustPassport, PassportItem } from '../types/passport';
import { passportService } from '../services/passportService';
import { trustService, AuditEventResponse } from '../services/trustService';

interface TrustState {
  trustScore: TrustScoreResult | null;
  passport: TrustPassport | null;
  aiSummary: string | null;
  isVerified: boolean;

  passports: PassportItem[];
  selectedPassport: PassportItem | null;
  searchQuery: string;
  riskFilter: 'ALL' | 'LOW' | 'MEDIUM' | 'HIGH';
  auditHistory: AuditEventResponse[];
  activePolicies: string[];

  isLoadingPassports: boolean;
  isLoadingPassportDetail: boolean;
  isLoadingHistory: boolean;
  errorPassports: string | null;

  setTrustScore: (score: TrustScoreResult) => void;
  setPassport: (passport: TrustPassport) => void;
  setAiSummary: (summary: string) => void;
  setSelectedPassport: (passport: PassportItem | null) => void;
  setSearchQuery: (query: string) => void;
  setRiskFilter: (risk: 'ALL' | 'LOW' | 'MEDIUM' | 'HIGH') => void;

  fetchPassports: (query?: string, risk?: string) => Promise<void>;
  fetchPassportDetail: (passportId: string) => Promise<void>;
  fetchAuditHistory: () => Promise<void>;
  enforcePolicyOptimistic: (policyId: string) => Promise<void>;
  clearTrust: () => void;
}

export const useTrustStore = create<TrustState>((set, get) => ({
  trustScore: null,
  passport: null,
  aiSummary: null,
  isVerified: false,

  passports: [],
  selectedPassport: null,
  searchQuery: '',
  riskFilter: 'ALL',
  auditHistory: [],
  activePolicies: [],

  isLoadingPassports: false,
  isLoadingPassportDetail: false,
  isLoadingHistory: false,
  errorPassports: null,

  setTrustScore: (trustScore) => set({ trustScore }),
  setPassport: (passport) => set({ passport, isVerified: true }),
  setAiSummary: (aiSummary) => set({ aiSummary }),
  setSelectedPassport: (selectedPassport) => set({ selectedPassport }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setRiskFilter: (riskFilter) => set({ riskFilter }),

  fetchPassports: async (query, risk) => {
    set({ isLoadingPassports: true, errorPassports: null });
    try {
      const q = query !== undefined ? query : get().searchQuery;
      const r = risk !== undefined ? risk : get().riskFilter;
      const res = await passportService.listPassports(q, r);
      set({ passports: res.passports, isLoadingPassports: false });
    } catch (err) {
      console.error('Failed to fetch passport registry:', err);
      set({
        errorPassports: err instanceof Error ? err.message : 'Failed to fetch passports',
        isLoadingPassports: false,
      });
    }
  },

  fetchPassportDetail: async (passportId) => {
    set({ isLoadingPassportDetail: true });
    try {
      const res = await passportService.getPassport(passportId);
      set({ selectedPassport: res.passport, isLoadingPassportDetail: false });
    } catch (err) {
      console.error('Failed to fetch passport detail:', err);
      set({ isLoadingPassportDetail: false });
    }
  },

  fetchAuditHistory: async () => {
    set({ isLoadingHistory: true });
    try {
      const history = await trustService.getAuditHistory();
      set({ auditHistory: history, isLoadingHistory: false });
    } catch (err) {
      console.error('Failed to fetch audit history:', err);
      set({ isLoadingHistory: false });
    }
  },

  enforcePolicyOptimistic: async (policyId) => {
    // Optimistic Update
    const current = get().activePolicies;
    if (!current.includes(policyId)) {
      set({ activePolicies: [...current, policyId] });
    }
    try {
      await trustService.enforcePolicy(policyId);
    } catch (err) {
      console.error('Policy enforcement failed, reverting optimistic update:', err);
      set({ activePolicies: current.filter((p) => p !== policyId) });
    }
  },

  clearTrust: () =>
    set({
      trustScore: null,
      passport: null,
      aiSummary: null,
      isVerified: false,
      selectedPassport: null,
    }),
}));
