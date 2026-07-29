import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  ShieldCheck, Activity, Sparkles, CheckCircle2, ArrowRight,
  Camera, Mic, QrCode, AlertTriangle, Check, FileCheck, Home,
} from 'lucide-react';
import { Button } from '../ui/Button';
import { useTrustStore } from '../../store/trustStore';
import { trustService } from '../../services/trustService';
import { faceService } from '../../services/faceService';
import { voiceService } from '../../services/voiceService';

export const VerificationFlow: React.FC = () => {
  const [step, setStep] = useState(0);
  const [sessionId, setSessionId] = useState<string>('sess-99842');
  // Ref keeps the latest sessionId available in async callbacks (avoids stale closure)
  const sessionIdRef = useRef<string>('sess-99842');
  const [trustScore, setTrustScore] = useState(0);
  const [challengeIndex, setChallengeIndex] = useState(0);
  const [simMode, setSimMode] = useState<'SUCCESS' | 'FAILURE_FACE' | 'FAILURE_VOICE' | 'MANUAL_REVIEW'>('SUCCESS');
  const [, setLogs] = useState<{ id: number; text: string; time: string }[]>([]);
  const { setPassport } = useTrustStore();
  const navigate = useNavigate();

  const updateSessionId = (id: string) => {
    sessionIdRef.current = id;
    setSessionId(id);
  };

  const challenges = [
    'Align face within center HUD and blink slowly',
    'Turn head slightly to the right to verify 3D depth',
    'Read aloud: "My voice is my cryptographic biometric passport"',
  ];

  const addLog = (text: string) => {
    setLogs((prev) => [
      ...prev,
      { id: Date.now() + Math.random(), text, time: new Date().toLocaleTimeString().split(' ')[0] },
    ]);
  };

  const handleStartScan = async () => {
    setStep(1);
    addLog('Initializing camera feed and Azure AI Vision 468 mesh engine...');
    try {
      const res = await trustService.startVerification();
      if (res.sessionId) updateSessionId(res.sessionId);
    } catch (e) {
      console.warn('Backend start verification fallback:', e);
    }

    setTimeout(async () => {
      // Use ref to avoid stale closure capturing the initial sessionId value
      const currentSid = sessionIdRef.current;
      try {
        await faceService.analyzeFrame(currentSid, 'frame-data');
      } catch (e) {
        console.warn('Face analyze endpoint call fallback:', e);
      }
      if (simMode === 'FAILURE_FACE') {
        addLog('⚠️ WARNING: Facial geometry partially occluded. Passive liveness reduced.');
      } else {
        addLog('Camera feed locked. 468 landmark mesh mapped successfully via FastAPI backend.');
      }
      setChallengeIndex(1);
    }, 1800);
  };

  const handleProceedToVoice = () => {
    setStep(2);
    addLog(simMode === 'FAILURE_FACE' ? 'Passive liveness check FLAGGED.' : 'Passive liveness check PASSED.');
    addLog('Initializing Azure AI Speech acoustic spectrogram analyzer...');
  };

  const handleProceedToRisk = async () => {
    setStep(3);
    addLog('Analyzing vocal acoustic spectrogram...');
    const currentSid = sessionIdRef.current;
    try {
      await voiceService.analyzeAudio(currentSid, 'audio-data', challenges[2]);
    } catch (e) {
      console.warn('Voice analyze endpoint call fallback:', e);
    }

    const stages =
      simMode === 'MANUAL_REVIEW'
        ? [18, 43, 58, 68, 74]
        : simMode === 'FAILURE_VOICE'
        ? [15, 30, 42, 48]
        : [18, 43, 67, 81, 94, 98.4];

    let currentStage = 0;
    const interval = setInterval(async () => {
      if (currentStage < stages.length) {
        const val = stages[currentStage];
        setTrustScore(val);
        if (val === 18) addLog('Collecting biometric & behavioral evidence...');
        if (val === 43) addLog('Scanning 468 facial landmark coordinates...');
        if (val === 67) addLog('Evaluating vocal acoustic spectrographic match...');
        if (val === 81) addLog('Cross-checking behavioral velocity vectors...');
        if (val === 94) addLog('Synthesizing Azure OpenAI XAI Risk Model...');
        if (val === 98.4 || val === 74 || val === 48) addLog('Trust calculation finalized.');
        currentStage++;
      } else {
        clearInterval(interval);
        const sid = sessionIdRef.current;
        let resultData: any = null;
        try {
          resultData = await trustService.getVerificationResult(sid);
        } catch (e) {
          console.warn('Get result endpoint fallback:', e);
        }

        setTimeout(() => {
          setStep(4);
          if (simMode === 'SUCCESS') {
            const pid = resultData?.passportId || `TP-AZURE-${sid.slice(-5).toUpperCase()}`;
            setPassport({
              passportId: pid,
              sessionId: sid,
              subject: { id: 'usr-ciso-01', type: 'human' },
              trustScore: resultData?.trustScore?.overallScore || 98.4,
              riskLevel: 'LOW' as any,
              components: {
                faceVerified: true,
                voiceVerified: true,
                behaviorVerified: true,
                challengesPassed: 3,
              },
              validFrom: new Date().toISOString(),
              expiresAt: new Date(Date.now() + 86400000).toISOString(),
              signature: '0x9948a7b9e0f1d2c3b4a5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5',
            });
          }
        }, 1200);
      }
    }, 900);
  };

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col items-center">
      
      {/* Breadcrumb / Back Button */}
      <div className="w-full flex items-center justify-between mb-4">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-slate-400 hover:text-slate-200 text-xs font-medium transition-colors group"
          aria-label="Return to Home"
        >
          <Home className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
          <span>Back to Home</span>
        </button>
        <span className="text-2xs font-mono text-slate-600">TRUSTGATE AI • BIOMETRIC GATEWAY</span>
      </div>

      {/* Simulation Scenario Switcher Pill */}
      <div className="mb-6 flex items-center gap-2 bg-surface-2 p-1.5 rounded-xl border border-slate-800 font-mono text-2xs">
        <span className="text-slate-400 font-bold px-2">SCENARIO:</span>
        {(['SUCCESS', 'MANUAL_REVIEW', 'FAILURE_FACE', 'FAILURE_VOICE'] as const).map((m) => (
          <button
            key={m}
            onClick={() => { setSimMode(m); setStep(0); setTrustScore(0); setChallengeIndex(0); }}
            className={`px-2.5 py-1 rounded-lg transition-all font-semibold ${
              simMode === m
                ? 'bg-azure-600/30 text-azure-200 border border-azure-500/40'
                : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            {m}
          </button>
        ))}
      </div>

      {/* Airport Security Stepper Header */}
      <div className="w-full flex items-center justify-between mb-10 px-4 sm:px-8 relative">
        <div className="absolute left-12 right-12 top-1/2 h-0.5 bg-slate-800 -z-10 -translate-y-1/2">
          <motion.div
            className="h-full bg-gradient-to-r from-azure-600 via-electric-cyan to-trust-green"
            initial={{ width: '0%' }}
            animate={{ width: `${(step / 4) * 100}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>

        {['Consent', 'Face Liveness', 'Voice Spectrogram', 'XAI Risk Engine', 'Passport Result'].map((label, idx) => {
          const isPast = idx < step;
          const isActive = idx === step;
          return (
            <div key={idx} className="flex flex-col items-center gap-2 bg-surface-0 px-2">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center font-mono font-bold text-xs transition-all duration-300 border-2 ${
                  isActive
                    ? 'border-azure-500 bg-azure-600/20 text-azure-400 shadow-[0_0_15px_rgba(0,120,212,0.4)]'
                    : isPast
                    ? 'border-trust-green bg-trust-green text-white'
                    : 'border-slate-800 bg-surface-2 text-slate-500'
                }`}
              >
                {isPast ? <Check className="w-4 h-4" /> : idx + 1}
              </div>
              <span className={`text-2xs font-mono font-semibold uppercase tracking-wider hidden sm:inline ${
                isActive ? 'text-azure-400' : isPast ? 'text-slate-300' : 'text-slate-600'
              }`}>
                {label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Main Cinematic Gateway Content */}
      <div className="w-full">
        <AnimatePresence mode="wait">
          
          {/* STEP 0: SETUP & CONSENT */}
          {step === 0 && (
            <motion.div
              key="step0"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="bg-surface-1 p-8 sm:p-12 text-center max-w-2xl mx-auto rounded-3xl border border-slate-800 shadow-2xl space-y-6"
            >
              <div className="w-20 h-20 mx-auto bg-azure-600/10 rounded-2xl border border-azure-500/30 flex items-center justify-center shadow-inner">
                <ShieldCheck className="w-10 h-10 text-azure-400" />
              </div>

              <div>
                <h2 className="text-3xl font-bold text-slate-100 tracking-tight mb-2">Airport-Grade Identity Gateway</h2>
                <p className="text-sm text-slate-400 leading-relaxed">
                  TrustGate AI performs continuous multi-modal liveness and identity verification powered by Azure AI Vision and Azure AI Speech.
                </p>
              </div>

              <div className="bg-surface-2 p-4 rounded-2xl border border-slate-800 text-left text-xs text-slate-300 space-y-2.5 font-mono">
                <div className="flex items-center gap-2.5 text-trust-green">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>468-point 3D facial landmark mesh analysis</span>
                </div>
                <div className="flex items-center gap-2.5 text-trust-green">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Neural vocal spectrogram speaker verification</span>
                </div>
                <div className="flex items-center gap-2.5 text-trust-green">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Azure OpenAI XAI explainable risk scoring</span>
                </div>
              </div>

              <Button size="lg" variant="azure" onClick={handleStartScan} className="w-full" icon={<ArrowRight className="w-4 h-4 ml-1" />}>
                I Consent — Begin Biometric Scan
              </Button>
            </motion.div>
          )}

          {/* STEP 1: FACE LIVENESS HUD */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="bg-surface-1 p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-2xl space-y-6 max-w-3xl mx-auto"
            >
              <div className="flex justify-between items-center pb-4 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Camera className="w-5 h-5 text-azure-400" />
                  <h3 className="text-lg font-bold text-slate-100">Face Liveness & 468-Point Mesh Scan</h3>
                </div>
                <span className="text-2xs font-mono text-trust-green bg-trust-green/10 px-2 py-1 rounded border border-trust-green/20">
                  CAMERA ACTIVE
                </span>
              </div>

              {/* Breathing HUD Viewport */}
              <div className="relative aspect-video bg-black rounded-2xl overflow-hidden border-2 border-azure-600/40 flex items-center justify-center shadow-inner">
                <div className="absolute inset-0 bg-[radial-gradient(#0078D4_1px,transparent_1px)] [background-size:16px_16px] opacity-30" />
                
                {/* Pulsing Corner HUD Brackets */}
                <div className="absolute top-4 left-4 w-12 h-12 border-t-2 border-l-2 border-azure-400 animate-pulse" />
                <div className="absolute top-4 right-4 w-12 h-12 border-t-2 border-r-2 border-azure-400 animate-pulse" />
                <div className="absolute bottom-4 left-4 w-12 h-12 border-b-2 border-l-2 border-azure-400 animate-pulse" />
                <div className="absolute bottom-4 right-4 w-12 h-12 border-b-2 border-r-2 border-azure-400 animate-pulse" />

                {/* Laser Sweep */}
                <div className="absolute w-full h-1 bg-azure-400 animate-scan shadow-[0_0_20px_#0078D4]" />

                {/* Challenge Prompt */}
                <div className="absolute bottom-6 inset-x-6 bg-slate-950/80 backdrop-blur-md p-3.5 rounded-xl border border-slate-700 text-center">
                  <span className="text-2xs font-mono text-azure-400 font-bold uppercase block mb-0.5">CHALLENGE PROMPT</span>
                  <p className="text-xs font-semibold text-slate-200">{challenges[challengeIndex]}</p>
                </div>
              </div>

              <div className="flex justify-between items-center pt-2">
                <span className="text-2xs font-mono text-slate-400">468 LANDMARKS OK • LIVENESS DETECTED</span>
                <Button variant="azure" onClick={handleProceedToVoice} icon={<ArrowRight className="w-4 h-4 ml-1" />}>
                  Proceed to Voice Verification
                </Button>
              </div>
            </motion.div>
          )}

          {/* STEP 2: VOICE SPECTROGRAM */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="bg-surface-1 p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-2xl space-y-6 max-w-3xl mx-auto"
            >
              <div className="flex justify-between items-center pb-4 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Mic className="w-5 h-5 text-electric-cyan" />
                  <h3 className="text-lg font-bold text-slate-100">Voice Spectrogram Verification</h3>
                </div>
                <span className="text-2xs font-mono text-electric-cyan bg-electric-cyan/10 px-2 py-1 rounded border border-electric-cyan/20">
                  MICROPHONE ACTIVE
                </span>
              </div>

              <div className="bg-surface-2 p-8 rounded-2xl border border-slate-800 text-center space-y-6">
                <div className="w-16 h-16 rounded-full bg-electric-cyan/10 border border-electric-cyan flex items-center justify-center mx-auto shadow-[0_0_20px_rgba(0,188,242,0.3)]">
                  <Activity className="w-8 h-8 text-electric-cyan animate-pulse" />
                </div>

                <div className="space-y-2 max-w-md mx-auto">
                  <span className="text-2xs font-mono text-slate-400 uppercase tracking-wider">PASSPHRASE PROMPT</span>
                  <p className="text-base font-semibold text-slate-100 italic bg-surface-0 p-3 rounded-xl border border-slate-800">
                    "{challenges[2]}"
                  </p>
                </div>

                <div className="flex items-center justify-center gap-1.5 h-16 pt-2">
                  {[40, 70, 30, 95, 60, 85, 45, 90, 50, 75, 35, 80].map((h, i) => (
                    <motion.div
                      key={i}
                      animate={{ height: ['20%', `${h}%`, '20%'] }}
                      transition={{ repeat: Infinity, duration: 0.8 + i * 0.1 }}
                      className="w-1.5 bg-electric-cyan rounded-full"
                    />
                  ))}
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <Button variant="azure" onClick={handleProceedToRisk} icon={<ArrowRight className="w-4 h-4 ml-1" />}>
                  Analyze Risk & Issue Passport
                </Button>
              </div>
            </motion.div>
          )}

          {/* STEP 3: STAGGERED RISK ENGINE EXECUTION */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-surface-1 p-12 rounded-3xl border border-slate-800 text-center max-w-xl mx-auto space-y-8 shadow-2xl"
            >
              <div className="relative w-36 h-36 mx-auto flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border-4 border-azure-600/20" />
                <div className="absolute inset-0 rounded-full border-4 border-azure-400 border-t-transparent animate-spin" />
                <span className="text-3xl font-bold font-mono text-trust-green">{trustScore}%</span>
              </div>

              <div>
                <h3 className="text-2xl font-bold text-slate-100 tracking-tight">Synthesizing Trust Vectors</h3>
                <p className="text-xs font-mono text-slate-400 mt-1">Executing Azure OpenAI XAI Risk Reasoning Model...</p>
              </div>
            </motion.div>
          )}

          {/* STEP 4: APPLE WALLET STYLE PASSPORT MATERIALIZATION */}
          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, y: 25, scale: 0.92 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ type: 'spring', stiffness: 180, damping: 22 }}
              className="bg-surface-1 p-8 sm:p-10 rounded-3xl border border-slate-800 max-w-3xl mx-auto space-y-8 shadow-2xl"
            >
              <div className="text-center space-y-2">
                {simMode === 'SUCCESS' ? (
                  <div className="w-14 h-14 rounded-full bg-trust-green/20 border border-trust-green flex items-center justify-center mx-auto shadow-[0_0_25px_rgba(0,178,148,0.4)]">
                    <CheckCircle2 className="w-8 h-8 text-trust-green" />
                  </div>
                ) : (
                  <div className="w-14 h-14 rounded-full bg-amber-500/20 border border-amber-500 flex items-center justify-center mx-auto shadow-[0_0_25px_rgba(245,158,11,0.4)]">
                    <AlertTriangle className="w-8 h-8 text-amber-400" />
                  </div>
                )}
                <h2 className="text-3xl font-bold text-slate-100 tracking-tight">
                  {simMode === 'SUCCESS' ? 'Identity Verification Successful' : 'Manual Escalation Required'}
                </h2>
                <p className="text-xs font-mono text-trust-green font-semibold">
                  {simMode === 'SUCCESS' ? 'DIGITAL TRUST PASSPORT ISSUED & SIGNED' : 'SESSION FLAGGED FOR CISO AUDIT'}
                </p>
              </div>

              {/* Apple Wallet Style Card */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="bg-gradient-to-br from-surface-2 via-surface-1 to-surface-0 p-6 rounded-2xl border border-azure-500/40 shadow-2xl space-y-6 relative overflow-hidden"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-2xs font-mono text-slate-400 uppercase tracking-widest block">TRUSTGATE AI • PASSPORT</span>
                    <h3 className="text-xl font-bold text-slate-100 font-mono">TP-AZURE-{sessionId.slice(-5).toUpperCase()}</h3>
                  </div>
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="w-14 h-14 bg-white p-1 rounded-lg shrink-0">
                    <QrCode className="w-full h-full text-black" />
                  </motion.div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-2xs font-mono border-t border-b border-slate-800 py-3">
                  <div>
                    <span className="text-slate-500 block">TRUST SCORE</span>
                    <span className={`text-base font-bold ${trustScore > 80 ? 'text-trust-green' : 'text-amber-400'}`}>{trustScore}%</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">RISK LEVEL</span>
                    <span className={`text-base font-bold ${simMode === 'SUCCESS' ? 'text-emerald-400' : 'text-amber-400'}`}>
                      {simMode === 'SUCCESS' ? 'LOW' : 'MEDIUM'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">FACE 468 MESH</span>
                    <span className="text-base font-bold text-slate-200">
                      {simMode === 'FAILURE_FACE' ? 'OCCLUDED' : 'VERIFIED'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">VOICE PROFILE</span>
                    <span className="text-base font-bold text-slate-200">
                      {simMode === 'FAILURE_VOICE' ? 'MISMATCH' : 'VERIFIED'}
                    </span>
                  </div>
                </div>

                {/* Structured XAI Explainability Section */}
                <div className="bg-surface-0/90 p-4 rounded-xl border border-slate-800 space-y-3 font-sans text-xs">
                  <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                    <span className="text-2xs font-mono text-azure-400 font-bold uppercase tracking-wider">AZURE OPENAI XAI REASONING</span>
                    <span className="text-2xs font-mono text-slate-400">CONFIDENCE: {trustScore}%</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-2xs">
                    <div>
                      <span className="text-slate-500 font-semibold block">EVIDENCE USED</span>
                      <p className="text-slate-300 mt-0.5">468 Face Mesh, Neural Vocal Spectrogram, Mouse Dynamics</p>
                    </div>
                    <div>
                      <span className="text-slate-500 font-semibold block">RISK MITIGATION</span>
                      <p className="text-slate-300 mt-0.5">Continuous liveness token auto-refreshed every 60s</p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <Button variant="azure" onClick={() => navigate('/chat')} icon={<Sparkles className="w-4 h-4" />}>
                  Access AI Copilot
                </Button>
                <Button variant="secondary" onClick={() => navigate('/overview')} icon={<Activity className="w-4 h-4" />}>
                  Open Mission Control
                </Button>
                <Button variant="ghost" onClick={() => navigate(`/report/${sessionId}`)} icon={<FileCheck className="w-4 h-4" />}>
                  View Executive Report
                </Button>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
};
