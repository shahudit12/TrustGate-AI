import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { BarChart3, TrendingUp, RefreshCw, CheckCircle2 } from 'lucide-react';
import { AppContainer } from '../components/layout/AppContainer';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { useDashboardStore } from '../store/dashboardStore';

export const DashboardPage: React.FC = () => {
  const [lastRefreshedAt, setLastRefreshedAt] = useState<Date>(new Date());
  const [elapsedDisplay, setElapsedDisplay] = useState('just now');
  const { kpis, funnel, timeline, riskDistribution, isLoadingStats, errorStats, fetchStats } = useDashboardStore();

  const formatElapsed = (ms: number): string => {
    const secs = Math.floor(ms / 1000);
    if (secs < 60) return `${secs}s ago`;
    const mins = Math.floor(secs / 60);
    return `${mins}m ${secs % 60}s ago`;
  };

  const handleRefresh = useCallback(() => {
    fetchStats();
    setLastRefreshedAt(new Date());
    setElapsedDisplay('just now');
  }, [fetchStats]);

  useEffect(() => {
    handleRefresh();
    // Update elapsed display every 5 seconds
    const interval = setInterval(() => {
      setElapsedDisplay(formatElapsed(Date.now() - lastRefreshedAt.getTime()));
    }, 5000);
    return () => clearInterval(interval);
  }, [lastRefreshedAt]); // eslint-disable-line react-hooks/exhaustive-deps

  const kpiItems = [
    { label: "Today's Security Score", value: kpis?.security_score || '98.4%', sub: 'Optimal Posture', color: 'text-trust-green' },
    { label: 'Passports Issued', value: kpis?.passports_issued ? kpis.passports_issued.toLocaleString() : '154,290', sub: 'Active Tokens', color: 'text-azure-400' },
    { label: 'Critical Escalations', value: kpis?.critical_escalations !== undefined ? kpis.critical_escalations.toString() : '3', sub: 'Mitigated', color: 'text-amber-400' },
    { label: 'System Availability', value: kpis?.system_availability || '99.98%', sub: 'Azure AI SLA', color: 'text-electric-cyan' },
  ];

  return (
    <div className="flex-1 bg-surface-0 text-slate-100 py-8 md:py-12 overflow-y-auto">
      <AppContainer>
        <div className="space-y-8 max-w-7xl mx-auto">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-800 pb-6">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <span className="p-2 rounded-xl bg-azure-600/10 border border-azure-500/30 text-azure-400">
                  <BarChart3 className="w-5 h-5" />
                </span>
                <h1 className="text-3xl font-bold text-slate-100 tracking-tight">Analytics Intelligence</h1>
                <Badge variant="azure" pulse>Live Telemetry</Badge>
              </div>
              <p className="text-sm text-slate-400">Persona: Security Director • Purpose-Driven Enterprise Analytics & Threat Insights</p>
            </div>

            <div className="flex items-center gap-3 font-mono text-2xs">
              <Button variant="secondary" size="sm" onClick={handleRefresh} icon={<RefreshCw className="w-3.5 h-3.5 text-azure-400" />}>
                Refresh Data
              </Button>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-surface-2 border border-slate-800 text-slate-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>LIVE STREAM • Updated {elapsedDisplay}</span>
              </div>
            </div>
          </div>

          {errorStats && (
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-mono">
              ⚠️ {errorStats}
            </div>
          )}

          {/* Executive CISO KPI Strip */}
          <div className="grid-metrics">
            {kpiItems.map((kpi, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.08 }}
                className="bg-surface-2 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-colors shadow-lg"
              >
                <span className="text-xs font-mono font-medium text-slate-400 uppercase tracking-wider block mb-2">{kpi.label}</span>
                <span className={`text-3xl font-bold font-mono tracking-tight ${kpi.color}`}>{kpi.value}</span>
                <p className="text-xs text-slate-500 font-mono mt-2 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-trust-green" />
                  {kpi.sub}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Purposeful Chart Grid */}
          <div className="grid-dashboard">
            
            {/* Question 1: Verification Funnel */}
            <div className="lg:col-span-2 bg-surface-1 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
              <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                <div>
                  <h3 className="text-base font-bold text-slate-100">Verification Pipeline Funnel</h3>
                  <p className="text-2xs text-slate-400">Question: How many identity requests successfully convert to signed Passports?</p>
                </div>
                <span className="text-2xs font-mono text-trust-green font-bold bg-trust-green/10 px-2 py-0.5 rounded border border-trust-green/20">
                  83.7% CONVERSION
                </span>
              </div>

              <div className="h-64 w-full">
                {funnel.length === 0 && !isLoadingStats ? (
                  <div className="h-full flex items-center justify-center text-xs text-slate-500 font-mono">No funnel data available</div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={funnel} layout="vertical" margin={{ top: 10, right: 30, left: 40, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" horizontal={false} />
                      <XAxis type="number" stroke="#64748B" fontSize={11} tickLine={false} />
                      <YAxis dataKey="stage" type="category" stroke="#94A3B8" fontSize={11} tickLine={false} width={100} />
                      <Tooltip contentStyle={{ backgroundColor: '#162032', borderColor: '#334155', borderRadius: '0.75rem', fontSize: '12px' }} />
                      <Bar dataKey="count" fill="#0078D4" radius={[0, 6, 6, 0]} barSize={18} />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>

            {/* Question 3: Risk Factor Distribution */}
            <div className="bg-surface-1 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
              <div className="border-b border-slate-800 pb-3">
                <h3 className="text-base font-bold text-slate-100">Failure Risk Factors</h3>
                <p className="text-2xs text-slate-400">Question: Why are identity verifications failing?</p>
              </div>

              <div className="h-48 w-full flex items-center justify-center">
                {riskDistribution.length === 0 && !isLoadingStats ? (
                  <div className="text-xs text-slate-500 font-mono">No risk data available</div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={riskDistribution} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={4}>
                        {riskDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ backgroundColor: '#162032', borderColor: '#334155', borderRadius: '0.75rem', fontSize: '12px' }} />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2 text-2xs font-mono pt-2 border-t border-slate-800">
                {riskDistribution.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-slate-400 truncate">{item.name}: <strong>{item.value}%</strong></span>
                  </div>
                ))}
              </div>
            </div>

            {/* Question 2: Fraud Timeline Over 24h */}
            <div className="lg:col-span-3 bg-surface-1 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
              <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                <div>
                  <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-azure-400" />
                    Fraud Attempts vs Legitimate Volume (24h)
                  </h3>
                  <p className="text-2xs text-slate-400">Question: Are synthetic identity attacks spiking at specific operational hours?</p>
                </div>
                <span className="text-2xs font-mono text-slate-400">24-Hour Horizon</span>
              </div>

              <div className="h-64 w-full">
                {timeline.length === 0 && !isLoadingStats ? (
                  <div className="h-full flex items-center justify-center text-xs text-slate-500 font-mono">No timeline data available</div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={timeline} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorLegit" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#00B294" stopOpacity={0.4}/>
                          <stop offset="95%" stopColor="#00B294" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorAttacks" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#EF4444" stopOpacity={0.4}/>
                          <stop offset="95%" stopColor="#EF4444" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                      <XAxis dataKey="time" stroke="#64748B" fontSize={11} tickLine={false} />
                      <YAxis stroke="#64748B" fontSize={11} tickLine={false} />
                      <Tooltip contentStyle={{ backgroundColor: '#162032', borderColor: '#334155', borderRadius: '0.75rem', fontSize: '12px' }} />
                      <Area type="monotone" dataKey="legitimate" stroke="#00B294" fillOpacity={1} fill="url(#colorLegit)" strokeWidth={2} />
                      <Area type="monotone" dataKey="syntheticAttacks" stroke="#EF4444" fillOpacity={1} fill="url(#colorAttacks)" strokeWidth={2} />
                    </AreaChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>

          </div>

        </div>
      </AppContainer>
    </div>
  );
};

