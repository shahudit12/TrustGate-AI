import React, { useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Activity, Terminal, AlertTriangle, Search, Filter, X, FileCheck, ShieldAlert, Loader2 } from 'lucide-react';
import { AppContainer } from '../components/layout/AppContainer';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { useTrustStore } from '../store/trustStore';

export const TrustCenterPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    passports,
    selectedPassport,
    searchQuery,
    riskFilter,
    auditHistory,
    activePolicies,
    isLoadingPassports,
    errorPassports,
    setSearchQuery,
    setRiskFilter,
    setSelectedPassport,
    fetchPassports,
    fetchAuditHistory,
    enforcePolicyOptimistic,
  } = useTrustStore();

  useEffect(() => {
    fetchPassports(searchQuery, riskFilter);
    fetchAuditHistory();
  }, [fetchPassports, fetchAuditHistory, searchQuery, riskFilter]);

  // Close drawer on Escape key
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape' && selectedPassport) setSelectedPassport(null);
    },
    [selectedPassport, setSelectedPassport]
  );
  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const defaultTimeline = [
    { time: '10:14:22', text: 'Session ID created & TLS handshaked' },
    { time: '10:14:26', text: 'Face 468 mesh landmarks verified (Passive liveness OK)' },
    { time: '10:14:31', text: 'Voice spectrogram matched (96.8% similarity)' },
    { time: '10:14:36', text: 'Behavioral dynamics velocity checked' },
    { time: '10:14:38', text: 'Azure OpenAI XAI Risk Model executed' },
    { time: '10:14:39', text: 'Trust Passport signed & issued' },
  ];

  return (
    <div className="flex-1 bg-surface-0 text-slate-100 py-8 md:py-12 overflow-y-auto relative">
      <AppContainer>
        <div className="space-y-8 max-w-7xl mx-auto">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-800 pb-6">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <span className="p-2 rounded-xl bg-trust-green/10 border border-trust-green/30 text-trust-green">
                  <Activity className="w-5 h-5" />
                </span>
                <h1 className="text-3xl font-bold text-slate-100 tracking-tight">Trust Center SOC Command</h1>
                <Badge variant="success" pulse>SOC Active</Badge>
              </div>
              <p className="text-sm text-slate-400">Persona: Security Analyst • Live Session Stream, Passport Registry & Threat Audit</p>
            </div>

            <div className="flex items-center gap-3">
              <Button variant="azure" size="sm" onClick={() => navigate('/verify')} icon={<ShieldCheck className="w-4 h-4" />}>
                Trigger Biometric Verification
              </Button>
            </div>
          </div>

          {/* SOC Structured Recommendation Card */}
          <div className="bg-surface-1 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 shrink-0 mt-0.5">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-slate-400 uppercase">CISO RECOMMENDATION</span>
                  <span className="text-2xs font-mono text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded">PRIORITY HIGH</span>
                </div>
                <h4 className="text-sm font-bold text-slate-100 mt-0.5">Increase Passive Liveness Threshold to 95.0%</h4>
                <p className="text-xs text-slate-400 mt-1">
                  <strong>Reason:</strong> Voice cloning attempts increased 17% over the last 24h. • <strong>Impact:</strong> Mitigates synthetic replay attacks.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <Button
                size="sm"
                variant={activePolicies.includes('liveness_threshold_95') ? 'primary' : 'azure'}
                onClick={() => enforcePolicyOptimistic('liveness_threshold_95')}
              >
                {activePolicies.includes('liveness_threshold_95') ? 'Policy Applied' : 'Apply Policy'}
              </Button>
              <Button size="sm" variant="ghost">Dismiss</Button>
            </div>
          </div>

          {/* SOC Operational Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left: Passport Registry & Threat Stream */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* Filter Controls */}
              <div className="bg-surface-1 p-4 rounded-2xl border border-slate-800 flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search passport ID, name, or role..."
                    className="w-full bg-surface-2 border border-slate-700/80 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-100 placeholder-slate-500 outline-none"
                  />
                </div>

                <div className="flex items-center gap-2 font-mono text-2xs">
                  <Filter className="w-3.5 h-3.5 text-slate-400 mr-1" />
                  {(['ALL', 'LOW', 'MEDIUM', 'HIGH'] as const).map((r) => (
                    <button
                      key={r}
                      onClick={() => setRiskFilter(r)}
                      className={`px-2.5 py-1 rounded-lg border transition-colors ${
                        riskFilter === r
                          ? 'bg-azure-600/30 border-azure-500 text-azure-200 font-bold'
                          : 'bg-surface-2 border-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              {/* Passport Registry Table */}
              <div className="bg-surface-1 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
                <div className="px-6 py-4 border-b border-slate-800 flex justify-between items-center">
                  <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                    Digital Passport Registry
                    {isLoadingPassports && <Loader2 className="w-3.5 h-3.5 animate-spin text-azure-400" />}
                  </h3>
                  <span className="text-2xs font-mono text-slate-400">{passports.length} Records</span>
                </div>

                {errorPassports && (
                  <div className="p-4 bg-red-500/10 text-red-400 text-xs font-mono border-b border-slate-800">
                    ⚠️ {errorPassports}
                  </div>
                )}

                <div className="divide-y divide-slate-800">
                  {passports.length === 0 && !isLoadingPassports ? (
                    <div className="p-8 text-center text-slate-500 text-xs font-mono">
                      No matching passports found in registry.
                    </div>
                  ) : (
                    passports.map((p) => (
                      <div
                        key={p.id}
                        onClick={() => setSelectedPassport(p)}
                        className="p-4 sm:px-6 hover:bg-surface-2/80 transition-colors flex items-center justify-between cursor-pointer group"
                      >
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-mono font-bold text-xs border ${
                            p.risk === 'LOW' ? 'bg-trust-green/10 border-trust-green/30 text-trust-green' : p.risk === 'MEDIUM' ? 'bg-amber-500/10 border-amber-500/30 text-amber-400' : 'bg-red-500/10 border-red-500/30 text-red-400'
                          }`}>
                            {p.score}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-bold text-slate-100 group-hover:text-azure-400 transition-colors">{p.name}</span>
                              <span className="text-2xs font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">{p.role}</span>
                            </div>
                            <span className="text-2xs font-mono text-slate-500">ID: {p.id} • Issued {p.date}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <Badge variant={p.risk === 'LOW' ? 'success' : p.risk === 'MEDIUM' ? 'warning' : 'danger'}>
                            {p.risk} RISK
                          </Badge>
                          <span className="text-2xs font-mono text-azure-400 underline group-hover:translate-x-0.5 transition-transform">
                            Inspect Drawer
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

            </div>

            {/* Right: SOC Event Stream */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* High Risk Alerts */}
              <div className="bg-surface-1 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-400" />
                    SOC Active Escalations
                  </h3>
                  <span className="text-2xs font-mono text-red-400 bg-red-400/10 px-2 py-0.5 rounded border border-red-400/20 font-bold">
                    3 FLAGGED
                  </span>
                </div>

                <div className="space-y-3">
                  {[
                    { type: 'Synthetic Voice Clone', location: 'NYC Node', score: 24.1, time: '32m ago' },
                    { type: 'Face Liveness Occlusion', location: 'London Node', score: 41.5, time: '1h ago' },
                  ].map((alert, i) => (
                    <div key={i} className="bg-surface-2 p-3.5 rounded-xl border border-slate-800 space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-slate-200">{alert.type}</span>
                        <span className="text-2xs font-mono text-red-400 font-bold">{alert.score}</span>
                      </div>
                      <div className="flex justify-between items-center text-2xs font-mono text-slate-500">
                        <span>{alert.location}</span>
                        <span>{alert.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Security Telemetry Audit */}
              <div className="bg-surface-1 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-3 font-mono text-2xs">
                <div className="flex items-center gap-2 text-slate-400 font-bold border-b border-slate-800 pb-2">
                  <Terminal className="w-4 h-4 text-azure-400" />
                  REAL-TIME SOC AUDIT LOG
                </div>
                <div className="space-y-2 text-slate-400 max-h-[180px] overflow-y-auto pr-1">
                  {auditHistory.length === 0 ? (
                    <>
                      <p><span className="text-trust-green">✓</span> [05:42:10] Passport TP-AZURE-99842 verified.</p>
                      <p><span className="text-trust-green">✓</span> [05:38:44] Azure OpenAI XAI model refreshed.</p>
                      <p><span className="text-amber-400">⚠️</span> [05:12:01] Vector anomaly flagged on Tokyo Hub.</p>
                    </>
                  ) : (
                    auditHistory.map((item) => (
                      <p key={item.id}>
                        <span className={item.status === 'passed' ? 'text-trust-green' : item.status === 'warning' ? 'text-amber-400' : 'text-azure-400'}>
                          {item.status === 'passed' ? '✓' : '⚠️'}
                        </span>{' '}
                        [{item.timestamp}] {item.message}
                      </p>
                    ))
                  )}
                </div>
              </div>

            </div>

          </div>

        </div>
      </AppContainer>

      {/* Azure Portal Style Right Inspection Drawer */}
      <AnimatePresence>
        {selectedPassport && (
          <div
            className="fixed inset-0 z-50 flex justify-end bg-slate-950/70 backdrop-blur-sm"
            onClick={() => setSelectedPassport(null)}
            role="presentation"
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="drawer-title"
              initial={{ x: '100%' }}
              onClick={(e) => e.stopPropagation()}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="w-full max-w-lg bg-surface-1 border-l border-slate-800 h-full p-6 sm:p-8 overflow-y-auto space-y-6 shadow-2xl flex flex-col justify-between"
            >
              <div className="space-y-6">
                {/* Drawer Header */}
                <div className="flex justify-between items-center border-b border-slate-800 pb-4">
                  <div>
                    <span className="text-2xs font-mono text-slate-400 uppercase tracking-wider block">PASSPORT INSPECTION DRAWER</span>
                    <h3 id="drawer-title" className="text-xl font-bold text-slate-100 font-mono">{selectedPassport.id}</h3>
                  </div>
                  <button onClick={() => setSelectedPassport(null)} className="p-2 rounded-xl bg-surface-2 border border-slate-800 hover:text-white text-slate-400">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Identity Summary */}
                <div className="bg-surface-2 p-4 rounded-xl border border-slate-800 space-y-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="text-base font-bold text-slate-100">{selectedPassport.name}</h4>
                      <p className="text-2xs font-mono text-slate-400">{selectedPassport.role}</p>
                    </div>
                    <Badge variant={selectedPassport.risk === 'LOW' ? 'success' : selectedPassport.risk === 'MEDIUM' ? 'warning' : 'danger'}>
                      {selectedPassport.risk} RISK
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-2xs font-mono text-slate-400 border-t border-slate-800/80 pt-2">
                    <div>Device: <span className="text-slate-200">{selectedPassport.device}</span></div>
                    <div>Location: <span className="text-slate-200">{selectedPassport.location}</span></div>
                  </div>
                </div>

                {/* Vertical Audit Timeline */}
                <div className="space-y-3">
                  <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">SESSION TIMELINE METRICS</h4>
                  <div className="space-y-3 border-l-2 border-azure-600/30 pl-4 ml-2 font-mono text-2xs">
                    {(selectedPassport.timeline || defaultTimeline).map((step, idx) => (
                      <div key={idx} className="relative">
                        <div className="absolute -left-[21px] top-0.5 w-2.5 h-2.5 rounded-full bg-azure-500 border border-slate-900" />
                        <span className="text-slate-500 block">{step.time}</span>
                        <span className="text-slate-200 font-semibold">{step.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="pt-6 border-t border-slate-800 flex gap-3">
                <Button variant="azure" className="flex-1" onClick={() => navigate(`/report/${selectedPassport.id}`)} icon={<FileCheck className="w-4 h-4" />}>
                  View Full Report
                </Button>
                <Button variant="secondary" onClick={() => setSelectedPassport(null)}>
                  Close
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

