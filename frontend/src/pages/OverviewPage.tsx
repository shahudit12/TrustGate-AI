import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Cloud, Zap, Activity, FileText, Loader2 } from 'lucide-react';
import { AppContainer } from '../components/layout/AppContainer';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { useDashboardStore } from '../store/dashboardStore';
import { useTrustStore } from '../store/trustStore';

export const OverviewPage: React.FC = () => {
  const navigate = useNavigate();
  const { kpis, telemetryServices, isLoadingTelemetry, fetchStats, fetchTelemetry } = useDashboardStore();
  const { activePolicies, enforcePolicyOptimistic } = useTrustStore();

  useEffect(() => {
    fetchStats();
    fetchTelemetry();
  }, [fetchStats, fetchTelemetry]);

  const platformPosture = kpis?.security_score || "98.4%";
  const passportCount = kpis?.passports_issued ? kpis.passports_issued.toLocaleString() : "154,290";
  const escalationsCount = kpis?.critical_escalations !== undefined ? kpis.critical_escalations.toString() : "3";

  const defaultTelemetry = [
    { name: 'Azure OpenAI', region: 'East US 2', model: 'GPT-4o Risk Engine', latency_ms: 112, reqs: '1,842 req/s', status: 'Healthy' },
    { name: 'Azure AI Vision', region: 'East US 2', model: 'Face 468 Mesh', latency_ms: 94, reqs: '3,410 req/s', status: 'Healthy' },
    { name: 'Azure AI Speech', region: 'East US 2', model: 'Neural Speaker Match', latency_ms: 45, reqs: '1,290 req/s', status: 'Healthy' },
    { name: 'Azure Cosmos DB', region: 'Multi-Region', model: 'Global Passport Sync', latency_ms: 12, reqs: '99.99% SLA', status: 'Healthy' },
    { name: 'Azure Blob Storage', region: 'East US 2', model: 'Encrypted Embeddings', latency_ms: 8, reqs: '5.2 TB/d', status: 'Healthy' },
    { name: 'Microsoft Entra ID', region: 'Global', model: 'OAuth 2.0 / SAML', latency_ms: 18, reqs: '12,400 auth/s', status: 'Healthy' },
  ];

  const servicesToRender = telemetryServices.length > 0 ? telemetryServices : defaultTelemetry;

  return (
    <div className="flex-1 bg-surface-0 text-slate-100 py-8 md:py-12 overflow-y-auto">
      <AppContainer>
        <div className="space-y-8 max-w-7xl mx-auto">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-800 pb-6">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <span className="p-2 rounded-xl bg-azure-600/10 border border-azure-500/30 text-azure-400">
                  <Zap className="w-5 h-5" />
                </span>
                <h1 className="text-3xl font-bold text-slate-100 tracking-tight">Mission Control</h1>
                <Badge variant="azure" pulse>Live Telemetry</Badge>
              </div>
              <p className="text-sm text-slate-400">CISO Executive Command • Real-time Platform Posture & Azure AI Infrastructure</p>
            </div>

            <div className="flex items-center gap-3">
              <Button variant="secondary" size="sm" onClick={() => navigate('/verify')} icon={<ShieldCheck className="w-4 h-4 text-azure-400" />}>
                Launch Biometric Gate
              </Button>
              <Button variant="azure" size="sm" onClick={() => navigate('/report/demo-session-99')} icon={<FileText className="w-4 h-4" />}>
                Export CISO Summary
              </Button>
            </div>
          </div>

          {/* CISO Mission Control Metric Grid */}
          <div className="grid-metrics">
            {[
              { label: "Overall Platform Posture", value: platformPosture, status: "Optimal", change: "+2.1%", color: "text-trust-green" },
              { label: "Threat Level Status", value: kpis?.threat_level || "LOW", status: "Protected", change: "0 Spikes", color: "text-emerald-400" },
              { label: "Active Identity Passports", value: passportCount, status: "Active Sync", change: "+14.2%", color: "text-azure-400" },
              { label: "High Risk Escalations", value: escalationsCount, status: "Under Audit", change: "-25%", color: "text-amber-400" },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.08 }}
                className="bg-surface-2 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-colors shadow-lg"
              >
                <span className="text-xs font-mono font-medium text-slate-400 uppercase tracking-wider block mb-2">{item.label}</span>
                <div className="flex items-baseline justify-between">
                  <span className={`text-3xl font-bold font-mono tracking-tight ${item.color}`}>{item.value}</span>
                  <span className="text-2xs font-semibold px-2 py-0.5 rounded bg-slate-800 text-emerald-400 border border-slate-700">
                    {item.change}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-2 flex items-center gap-1.5 font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  {item.status}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Azure AI Services Infrastructure Health Panel */}
          <div className="bg-surface-1 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                  <Cloud className="w-5 h-5 text-azure-400" />
                  Azure AI Infrastructure Health Telemetry
                </h2>
                <p className="text-xs text-slate-400">Live operational status across integrated Azure microservices</p>
              </div>
              <Badge variant="success" pulse>
                {isLoadingTelemetry ? <Loader2 className="w-3.5 h-3.5 animate-spin mr-1 inline" /> : null}
                100% Microservice SLA
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {servicesToRender.map((svc, i) => (
                <div key={i} className="bg-surface-2 p-4 rounded-xl border border-slate-800/80 hover:border-azure-600/40 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-200">{svc.name}</span>
                    <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  </div>
                  <p className="text-2xs font-mono text-slate-400 mb-2">{svc.model}</p>
                  <div className="flex justify-between items-center text-2xs text-slate-500 font-mono border-t border-slate-800 pt-2">
                    <span>Latency: <strong className="text-azure-400 font-bold">{svc.latency_ms} ms</strong></span>
                    <span>{svc.reqs}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CISO AI Security Recommendations Drawer */}
          <div className="bg-surface-1 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <Activity className="w-5 h-5 text-trust-green" />
              CISO AI Security Recommendations
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-surface-2 p-4 rounded-xl border border-slate-800 flex justify-between items-center">
                <div>
                  <span className="text-xs font-bold text-slate-200 block">Enforce 60-Second Liveness Refresh</span>
                  <p className="text-2xs text-slate-400 mt-0.5">Automatically refresh biometric tokens for active financial transactions.</p>
                </div>
                <Button
                  size="sm"
                  variant={activePolicies.includes('liveness_refresh_60s') ? 'primary' : 'azure'}
                  onClick={() => enforcePolicyOptimistic('liveness_refresh_60s')}
                >
                  {activePolicies.includes('liveness_refresh_60s') ? 'Enforced' : 'Enforce Policy'}
                </Button>
              </div>

              <div className="bg-surface-2 p-4 rounded-xl border border-slate-800 flex justify-between items-center">
                <div>
                  <span className="text-xs font-bold text-slate-200 block">Flag High Velocity Voice Patterns</span>
                  <p className="text-2xs text-slate-400 mt-0.5">Route voice sessions with similarity &lt; 85% to manual review queue.</p>
                </div>
                <Button
                  size="sm"
                  variant={activePolicies.includes('voice_velocity_flag') ? 'primary' : 'secondary'}
                  onClick={() => enforcePolicyOptimistic('voice_velocity_flag')}
                >
                  {activePolicies.includes('voice_velocity_flag') ? 'Enforced' : 'Active'}
                </Button>
              </div>
            </div>
          </div>

        </div>
      </AppContainer>
    </div>
  );
};

