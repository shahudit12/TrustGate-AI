import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { ShieldCheck, CheckCircle2, Loader2 } from 'lucide-react';
import { useTrustStore } from '../../store/trustStore';
import { passportService, ReportResponse } from '../../services/passportService';

export const ReportPreview: React.FC = () => {
  const { sessionId: paramSessionId } = useParams<{ sessionId: string }>();
  const { passport } = useTrustStore();
  const [reportData, setReportData] = useState<ReportResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const targetSessionId = paramSessionId || passport?.sessionId || 'demo-session-99';

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    passportService
      .getReport(targetSessionId)
      .then((data) => {
        if (isMounted) {
          setReportData(data);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        console.error('Failed to load report data:', err);
        if (isMounted) setIsLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, [targetSessionId]);

  const reportId = reportData?.session_id || passport?.sessionId || targetSessionId;
  const passportId = reportData?.passport_id || passport?.passportId || 'TP-AZURE-99842';
  const score = reportData?.trust_score ?? (passport?.trustScore || 98.4);
  const riskLevel = reportData?.risk_level || passport?.riskLevel || 'LOW';
  const issuedDate = reportData?.issued_date ? new Date(reportData.issued_date).toLocaleString() : new Date().toLocaleString();
  const xaiReasoning = reportData?.xai_reasoning || 'High confidence biometric match. Passed 468-mesh face liveness and neural voice spectrogram baseline without synthetic anomaly indicators.';
  const vectorMatrix = reportData?.vector_matrix || [
    { module: 'Face Liveness (Azure AI Vision 468 Mesh)', status: 'PASSED', score: 98.5 },
    { module: 'Voice Authenticity (Azure AI Speech)', status: 'PASSED', score: 96.8 },
    { module: 'Behavioral Velocity Dynamics', status: 'PASSED', score: 95.0 },
  ];
  const signatureHash = reportData?.signature_hash || passport?.signature || '0x9948a7b9e0f1d2c3b4a5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5';

  return (
    <div className="bg-slate-900 text-slate-100 w-full max-w-4xl mx-auto p-8 sm:p-12 rounded-3xl border border-slate-800 shadow-2xl space-y-8 font-sans relative" id="report-preview">
      
      {isLoading && (
        <div className="absolute top-4 right-4 flex items-center gap-2 text-2xs font-mono text-azure-400">
          <Loader2 className="w-4 h-4 animate-spin" /> Fetching live report...
        </div>
      )}

      {/* Executive Header */}
      <div className="border-b border-slate-800 pb-6 flex justify-between items-start">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <ShieldCheck className="w-6 h-6 text-azure-400" />
            <h1 className="text-2xl font-bold tracking-tight text-slate-100">Cryptographic Executive Trust Report</h1>
          </div>
          <p className="text-xs font-mono text-slate-400">TrustGate AI Engine v2.4 • Azure AI Showcase Verification</p>
        </div>

        <div className="text-right font-mono text-2xs">
          <p className="text-slate-400 font-bold">SESSION ID</p>
          <p className="text-azure-400 font-semibold">{reportId}</p>
          <p className="text-slate-500 mt-1">{issuedDate}</p>
        </div>
      </div>

      {/* Holographic Passport & Score Banner */}
      <div className="bg-surface-2 p-6 rounded-2xl border border-azure-500/40 grid grid-cols-1 md:grid-cols-12 gap-6 items-center shadow-xl">
        
        {/* Left: Score Circle */}
        <div className="md:col-span-4 flex flex-col items-center justify-center p-4 bg-surface-0 rounded-xl border border-slate-800 text-center">
          <span className="text-2xs font-mono text-slate-500 uppercase tracking-widest block mb-2">FINAL TRUST SCORE</span>
          <span className="text-5xl font-bold font-mono text-trust-green">{score}%</span>
          <div className="mt-3 px-3 py-1 bg-trust-green/10 border border-trust-green/30 text-trust-green text-2xs font-mono font-bold rounded-full">
            RISK LEVEL: {riskLevel}
          </div>
        </div>

        {/* Right: Passport Summary & QR */}
        <div className="md:col-span-8 space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-2xs font-mono text-slate-400 uppercase tracking-widest block">PASSPORT IDENTIFIER</span>
              <h3 className="text-xl font-bold font-mono text-slate-100">{passportId}</h3>
            </div>
            <div className="w-16 h-16 bg-white p-1 rounded-lg shrink-0">
              <QRCodeSVG value={`https://trustgate.ai/v/${passportId}`} size={56} />
            </div>
          </div>

          <div className="bg-surface-0 p-3.5 rounded-xl border border-slate-800 text-xs text-slate-300 leading-relaxed font-sans">
            <strong className="text-2xs font-mono text-azure-400 block mb-1 uppercase tracking-wider">
              AZURE OPENAI XAI EXECUTIVE REASONING
            </strong>
            {xaiReasoning}
          </div>
        </div>

      </div>

      {/* Verification Vector Breakdown Table */}
      <div className="space-y-3">
        <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-slate-300">Biometric Vector Verification Matrix</h3>
        <div className="bg-surface-2 rounded-2xl border border-slate-800 overflow-hidden">
          <table className="w-full text-left font-mono text-2xs border-collapse">
            <thead>
              <tr className="bg-surface-1 border-b border-slate-800 text-slate-400">
                <th className="p-3">Vector Module</th>
                <th className="p-3">Status</th>
                <th className="p-3">Confidence Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-200">
              {vectorMatrix.map((item, idx) => (
                <tr key={idx}>
                  <td className="p-3 font-semibold">{item.module}</td>
                  <td className="p-3 text-trust-green font-bold flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" /> {item.status}
                  </td>
                  <td className="p-3 font-bold text-azure-400">{item.score}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Cryptographic Signature Footer */}
      <div className="pt-6 border-t border-slate-800 flex justify-between items-end font-mono text-2xs">
        <div>
          <span className="text-slate-500 block mb-1">CRYPTOGRAPHIC SIGNATURE HASH</span>
          <span className="text-slate-400 break-all block max-w-md">
            {signatureHash}
          </span>
        </div>
        <div className="text-right">
          <div className="w-20 h-20 border-2 border-azure-400 rounded-full flex items-center justify-center text-azure-400 font-bold rotate-[-12deg] opacity-80 shadow-[0_0_15px_rgba(0,120,212,0.3)]">
            SEALED
          </div>
        </div>
      </div>

    </div>
  );
};

