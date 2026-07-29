import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Cpu, Activity, Fingerprint, Sparkles, CheckCircle2, RefreshCw, Terminal, Check } from 'lucide-react';
import { Button } from '../ui/Button';

import { trustService } from '../../services/trustService';
import { faceService } from '../../services/faceService';
import { voiceService } from '../../services/voiceService';

interface LogEntry {
  id: number;
  text: string;
  time: string;
}

export const MiniDemoSandbox: React.FC = () => {
  const [step, setStep] = useState<'idle' | 'scanning' | 'voice' | 'risk' | 'complete'>('idle');
  const [trustScore, setTrustScore] = useState(0);
  const [logs, setLogs] = useState<LogEntry[]>([]);

  const addLog = (text: string) => {
    setLogs((prev: LogEntry[]) => [
      ...prev,
      { id: Date.now() + Math.random(), text, time: new Date().toLocaleTimeString().split(' ')[0] },
    ]);
  };

  const startDemo = async () => {
    setStep('scanning');
    setTrustScore(0);
    setLogs([]);

    addLog('Initializing biometric capture pipeline...');
    let sessionId = 'demo-session';
    try {
      const startRes = await trustService.startVerification();
      if (startRes.sessionId) sessionId = startRes.sessionId;
    } catch (e) {
      console.warn('Sandbox start verification fallback:', e);
    }

    setTimeout(async () => {
      try {
        await faceService.analyzeFrame(sessionId, 'sandbox-frame');
      } catch (e) {
        console.warn('Sandbox face analyze fallback:', e);
      }
      addLog('Camera feed active. Detecting facial landmarks...');
      setTrustScore(34);
    }, 900);

    setTimeout(async () => {
      setStep('voice');
      try {
        await voiceService.analyzeAudio(sessionId, 'sandbox-audio', 'My voice is my passport');
      } catch (e) {
        console.warn('Sandbox voice analyze fallback:', e);
      }
      addLog('468 facial mesh points mapped. Passive liveness verified.');
      addLog('Analyzing vocal acoustic spectrogram against registered profile...');
      setTrustScore(61);
    }, 2000);

    setTimeout(() => {
      setStep('risk');
      addLog('Voice match score: 96.2%. Synthesizing multi-modal risk vectors...');
      addLog('Evaluating cursor & behavioral velocity anomalies...');
      setTrustScore(83);
    }, 3200);

    setTimeout(async () => {
      try {
        await trustService.getVerificationResult(sessionId);
      } catch (e) {
        console.warn('Sandbox result fallback:', e);
      }
      setStep('complete');
      addLog('Zero threat vectors detected. Risk level: LOW.');
      addLog('Cryptographically signing Trust Passport TP-AZURE-99842.');
      setTrustScore(98.4);
    }, 4400);
  };

  const resetDemo = () => {
    setStep('idle');
    setTrustScore(0);
    setLogs([]);
  };

  return (
    <div className="w-full bg-surface-1 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl overflow-hidden relative">
      {/* Background Ambient Lighting */}
      <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-azure-600/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-trust-green/10 blur-3xl pointer-events-none" />

      {/* Header Telemetry */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 pb-6 border-b border-slate-800">
        <div>
          <span className="text-2xs font-mono font-semibold uppercase tracking-widest text-azure-400 block mb-1">
            KEYNOTE INTERACTIVE DEMO PIPELINE
          </span>
          <h3 className="text-2xl font-bold text-slate-100 tracking-tight">Real-Time Biometric Verification Sandbox</h3>
        </div>
        <div className="flex items-center gap-3">
          {step !== 'idle' && (
            <Button variant="ghost" size="sm" onClick={resetDemo} icon={<RefreshCw className="w-3.5 h-3.5" />}>
              Reset Sandbox
            </Button>
          )}
          <Button
            variant="azure"
            size="md"
            onClick={startDemo}
            disabled={step !== 'idle' && step !== 'complete'}
            icon={<Sparkles className="w-4 h-4 text-white" />}
          >
            {step === 'idle' ? 'Execute Live Verification' : step === 'complete' ? 'Run Pipeline Again' : 'Verification In Progress...'}
          </Button>
        </div>
      </div>

      {/* Interactive Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: HUD Visualizer */}
        <div className="lg:col-span-6 bg-surface-2 rounded-2xl border border-slate-800 p-6 relative aspect-video flex flex-col justify-between overflow-hidden shadow-inner">
          <div className="flex justify-between items-center z-10">
            <span className="text-2xs font-mono text-slate-400 flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${step === 'idle' ? 'bg-slate-500' : 'bg-trust-green animate-pulse'}`} />
              PIPELINE STATE: <strong className="text-slate-200">{step.toUpperCase()}</strong>
            </span>
            <span className="text-2xs font-mono text-azure-400">AZURE AI VISION • 468 MESH</span>
          </div>

          {/* Target HUD Center */}
          <div className="relative w-44 h-44 mx-auto my-auto flex items-center justify-center">
            {/* Brackets */}
            <div className="absolute -top-2 -left-2 w-6 h-6 border-t-2 border-l-2 border-azure-400" />
            <div className="absolute -top-2 -right-2 w-6 h-6 border-t-2 border-r-2 border-azure-400" />
            <div className="absolute -bottom-2 -left-2 w-6 h-6 border-b-2 border-l-2 border-azure-400" />
            <div className="absolute -bottom-2 -right-2 w-6 h-6 border-b-2 border-r-2 border-azure-400" />

            {step === 'idle' && (
              <div className="text-center space-y-2">
                <Fingerprint className="w-14 h-14 text-slate-600 mx-auto" />
                <p className="text-xs text-slate-500 font-mono">Click "Execute Live Verification" to begin</p>
              </div>
            )}

            {step === 'scanning' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="relative w-full h-full flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border-2 border-azure-400 animate-ping opacity-25" />
                <div className="w-32 h-32 rounded-full border border-azure-400/50 flex items-center justify-center bg-azure-600/10">
                  <Cpu className="w-10 h-10 text-azure-400 animate-pulse" />
                </div>
                <div className="absolute w-full h-0.5 bg-azure-400 animate-scan shadow-[0_0_15px_#0078D4]" />
              </motion.div>
            )}

            {step === 'voice' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center space-y-3">
                <Activity className="w-14 h-14 text-electric-cyan mx-auto animate-bounce" />
                <p className="text-xs font-mono text-electric-cyan">Matching Voice Spectrogram...</p>
              </motion.div>
            )}

            {step === 'risk' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center space-y-3">
                <ShieldCheck className="w-14 h-14 text-trust-green mx-auto animate-pulse" />
                <p className="text-xs font-mono text-trust-green">Synthesizing Risk Model Vectors...</p>
              </motion.div>
            )}

            {step === 'complete' && (
              <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center space-y-2">
                <div className="w-16 h-16 rounded-full bg-trust-green/20 border border-trust-green flex items-center justify-center mx-auto shadow-[0_0_25px_rgba(0,178,148,0.4)]">
                  <CheckCircle2 className="w-8 h-8 text-trust-green" />
                </div>
                <span className="text-xs font-mono text-trust-green font-bold block">VERIFICATION PASSED</span>
              </motion.div>
            )}
          </div>

          {/* Telemetry Footer */}
          <div className="bg-surface-0/90 p-2.5 rounded-xl border border-slate-800 font-mono text-2xs text-slate-400 flex items-center justify-between">
            <span className="truncate max-w-[280px]">
              {step === 'idle' && 'Awaiting verification trigger...'}
              {step === 'scanning' && 'Analyzing 468 facial landmark mesh coordinates...'}
              {step === 'voice' && 'Matching acoustic speaker spectrogram...'}
              {step === 'risk' && 'Cross-checking behavioral velocity vectors...'}
              {step === 'complete' && 'Trust Passport TP-AZURE-99842 Issued'}
            </span>
            <span className="text-azure-400 font-bold ml-2 shrink-0">{trustScore}%</span>
          </div>
        </div>

        {/* Right: Live Log Telemetry & Passport Panel */}
        <div className="lg:col-span-6 space-y-6">
          {/* Real-time System Log Feed */}
          <div className="bg-surface-0 border border-slate-800 rounded-2xl p-4 font-mono text-2xs space-y-3 shadow-inner min-h-[170px]">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-2 text-slate-500">
              <span className="flex items-center gap-1.5 text-slate-400 font-bold">
                <Terminal className="w-3.5 h-3.5 text-azure-400" />
                AZURE TELEMETRY LOG FEED
              </span>
              <span>LOGS: {logs.length}</span>
            </div>

            <div className="space-y-1.5 max-h-[120px] overflow-y-auto pr-1">
              {logs.length === 0 ? (
                <p className="text-slate-600 italic">No telemetry logs recorded. Start verification to inspect stream.</p>
              ) : (
                logs.map((log) => (
                  <div key={log.id} className="flex items-start gap-2 text-slate-300">
                    <Check className="w-3 h-3 text-trust-green shrink-0 mt-0.5" />
                    <span className="text-slate-500 shrink-0">{log.time}</span>
                    <span className="flex-1">{log.text}</span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Trust Passport Summary Card */}
          <div className="bg-surface-2 p-5 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <span className="text-2xs font-mono uppercase tracking-wider text-slate-400">SESSION PASSPORT STATUS</span>
              <span className="text-2xs font-mono text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded border border-emerald-400/20 font-bold">
                {step === 'complete' ? 'LOW RISK • PASSED' : 'STANDBY'}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-base font-bold text-slate-100">Trust Passport TP-AZURE-99842</h4>
                <p className="text-2xs font-mono text-slate-400 mt-0.5">Signature: 0x9948a...azure-sec</p>
              </div>
              <div className="text-right">
                <span className="text-2xs font-mono text-slate-500 block">CONFIDENCE</span>
                <span className="text-2xl font-bold font-mono text-trust-green">{trustScore}%</span>
              </div>
            </div>

            {/* Azure OpenAI Reasoning Explainability */}
            <div className="bg-surface-0 p-3.5 rounded-xl border border-slate-800/80 text-xs text-slate-300 leading-relaxed font-sans">
              <strong className="text-2xs font-mono text-azure-400 block mb-1 uppercase tracking-wider">
                AZURE OPENAI XAI REASONING
              </strong>
              {step === 'complete'
                ? 'Identity verified with 98.4% confidence. Passive liveness check confirmed zero synthetic artifacts. Voice acoustic match aligns with registered baseline.'
                : 'Execute verification to generate real-time XAI explainability reasoning.'}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
