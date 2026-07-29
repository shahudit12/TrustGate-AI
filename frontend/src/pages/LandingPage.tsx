import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Shield, Sparkles, ArrowRight, CheckCircle2, Cpu, Building, Eye, Mic, Activity, FileCheck, Landmark, Stethoscope, ChevronUp } from 'lucide-react';
import { AppContainer } from '../components/layout/AppContainer';
import { Button } from '../components/ui/Button';
import { MiniDemoSandbox } from '../components/landing/MiniDemoSandbox';
import { FADE_UP_ITEM_VARIANTS, STAGGER_CONTAINER_VARIANTS } from '../styles/motion';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowScrollTop(window.scrollY > 400);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <div className="bg-surface-0 text-slate-100 min-h-screen space-y-28 pb-20 overflow-hidden">
      
      {/* ── SCREEN 1: KEYNOTE HERO ───────────────────────────────────────── */}
      <section className="pt-16 md:pt-24 relative">
        <AppContainer>
          <div className="grid-hero">
            {/* Hero Text */}
            <div className="lg:col-span-7 space-y-8 text-left">
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-azure-600/10 border border-azure-500/20 text-xs font-mono text-azure-400"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Microsoft Build & Azure AI Foundry Showcase
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-slate-100 leading-[1.1]"
              >
                The Enterprise <br />
                <span className="gradient-text">Trust Platform</span> <br />
                for the AI Era
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-lg sm:text-xl text-slate-400 max-w-2xl font-light leading-relaxed"
              >
                Continuous multi-modal biometric identity verification, passive liveness detection, and explainable AI risk scoring for high-stakes enterprise operations.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2"
              >
                <Button
                  size="lg"
                  variant="azure"
                  onClick={() => navigate('/verify')}
                  icon={<ArrowRight className="w-4 h-4 ml-1" />}
                >
                  Start Live Verification
                </Button>
                <Button
                  size="lg"
                  variant="secondary"
                  onClick={() => navigate('/overview')}
                  icon={<Shield className="w-4 h-4 text-azure-400" />}
                >
                  Experience TrustGate AI
                </Button>
              </motion.div>
            </div>

            {/* Hero 3D AI Node Globe */}
            <div className="lg:col-span-5 relative flex items-center justify-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
                className="relative w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-gradient-to-tr from-azure-600/20 via-trust-green/10 to-transparent p-1 flex items-center justify-center shadow-[0_0_80px_rgba(0,120,212,0.15)] border border-slate-800"
              >
                <div className="w-full h-full rounded-full border border-dashed border-azure-400/30 animate-spin-slow flex items-center justify-center relative">
                  <div className="w-4/5 h-4/5 rounded-full border border-trust-green/40 flex items-center justify-center bg-surface-1/90 backdrop-blur-xl shadow-2xl">
                    <Shield className="w-24 h-24 text-azure-400 animate-pulse" />
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </AppContainer>
      </section>

      {/* ── SCREEN 2: THE THREAT LANDSCAPE ─────────────────────────────────── */}
      <section className="py-12 border-t border-b border-slate-800/60 bg-surface-1/40">
        <AppContainer>
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <span className="text-xs font-mono uppercase tracking-widest text-red-400">THE THREAT LANDSCAPE</span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-100">
              Traditional Authentication Fails Against Generative AI
            </h2>
            <p className="text-sm text-slate-400">
              Legacy MFA passwords and SMS codes cannot distinguish between real humans and synthetic generative AI attacks.
            </p>
          </div>

          <motion.div
            variants={STAGGER_CONTAINER_VARIANTS}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid-cards"
          >
            {[
              { title: 'Real-Time Deepfakes', desc: 'Generative video diffusion models bypassing passive webcam facial filters.' },
              { title: 'Synthetic Voice Clones', desc: 'Neural audio speech synthesis tricking voice verification channels.' },
              { title: 'Behavioral Velocity Spikes', desc: 'Automated AI scripts executing high-frequency transaction exploits.' },
            ].map((threat, i) => (
              <motion.div
                key={i}
                variants={FADE_UP_ITEM_VARIANTS}
                className="bg-surface-2 p-6 rounded-2xl border border-slate-800 hover:border-red-500/40 transition-colors"
              >
                <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 font-bold mb-4">
                  0{i + 1}
                </div>
                <h3 className="text-lg font-bold text-slate-100 mb-2">{threat.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{threat.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </AppContainer>
      </section>

      {/* ── SCREEN 3: LIVE KEYNOTE DEMO SANDBOX ────────────────────────────── */}
      <section className="py-8">
        <AppContainer>
          <MiniDemoSandbox />
        </AppContainer>
      </section>

      {/* ── SCREEN 4: ARCHITECTURE DATA PIPELINE ───────────────────────────── */}
      <section className="py-12 border-t border-slate-800/60 bg-surface-1/30">
        <AppContainer>
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
            <span className="text-xs font-mono uppercase tracking-widest text-azure-400">AZURE PIPELINE</span>
            <h2 className="text-3xl font-bold tracking-tight text-slate-100">Multi-Modal Trust Architecture</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: <Eye className="w-6 h-6 text-azure-400" />, step: '01', name: 'Face Biometrics', sub: 'Azure AI Vision 468 Mesh' },
              { icon: <Mic className="w-6 h-6 text-electric-cyan" />, step: '02', name: 'Voice Spectrogram', sub: 'Azure AI Speech Match' },
              { icon: <Activity className="w-6 h-6 text-trust-green" />, step: '03', name: 'XAI Risk Engine', sub: 'Azure OpenAI GPT-4o' },
              { icon: <FileCheck className="w-6 h-6 text-amber-400" />, step: '04', name: 'Trust Passport', sub: 'Signed Session Token' },
            ].map((node, idx) => (
              <div key={idx} className="bg-surface-2 p-6 rounded-2xl border border-slate-800 text-center relative group">
                <div className="w-12 h-12 rounded-2xl bg-surface-0 border border-slate-700 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  {node.icon}
                </div>
                <span className="text-2xs font-mono text-slate-500 block mb-1">STEP {node.step}</span>
                <h4 className="text-base font-bold text-slate-100">{node.name}</h4>
                <p className="text-xs font-mono text-slate-400 mt-1">{node.sub}</p>
              </div>
            ))}
          </div>
        </AppContainer>
      </section>

      {/* ── SCREEN 5: ENTERPRISE CAPABILITIES ─────────────────────────────── */}
      <section className="py-12">
        <AppContainer>
          <div className="bg-surface-2 rounded-3xl border border-slate-800 p-8 sm:p-12">
            <div className="max-w-2xl space-y-4 mb-10">
              <span className="text-xs font-mono uppercase tracking-widest text-trust-green">COMPLIANCE & GOVERNANCE</span>
              <h2 className="text-3xl font-bold tracking-tight text-slate-100">Enterprise Capability Standards</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { name: 'SOC 2 Type II', desc: 'Continuous audit logging, immutable cryptographic session trails, and strict access controls.' },
                { name: 'HIPAA Ready', desc: 'Designed for high-compliance healthcare identity verification workflows and patient data safeguards.' },
                { name: 'ISO 27001', desc: 'Enterprise-grade information security management and zero-trust data protection policies.' },
                { name: 'Zero Trust Architecture', desc: 'Never trust, always verify biometric integrity continuously throughout active sessions.' },
                { name: 'Azure AI Powered', desc: 'Deep integration with Azure OpenAI, Azure AI Vision, and Azure AI Speech infrastructure.' },
                { name: 'XAI Transparency', desc: 'Human-readable explainability reasoning for every trust calculation and escalation.' },
              ].map((cap, i) => (
                <div key={i} className="bg-surface-1 p-5 rounded-2xl border border-slate-800 space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-trust-green shrink-0" />
                    <span className="text-sm font-bold text-slate-100">{cap.name}</span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed pl-6">{cap.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </AppContainer>
      </section>

      {/* ── SCREEN 6: INDUSTRY SCENARIOS ───────────────────────────────────── */}
      <section className="py-12 border-t border-slate-800/60">
        <AppContainer>
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
            <span className="text-xs font-mono uppercase tracking-widest text-azure-400">ENTERPRISE SCENARIOS</span>
            <h2 className="text-3xl font-bold tracking-tight text-slate-100">High-Stakes Operational Workflows</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: <Landmark className="w-5 h-5 text-azure-400" />, name: 'Corporate Banking', desc: 'Prevent synthetic identity fraud during high-value wire transfers and executive onboarding.' },
              { icon: <Stethoscope className="w-5 h-5 text-trust-green" />, name: 'Healthcare Portals', desc: 'Verify clinician identity before granting access to confidential electronic health records.' },
              { icon: <Building className="w-5 h-5 text-electric-cyan" />, name: 'Government Services', desc: 'Secure citizen identity verification for high-clearance digital administration portals.' },
              { icon: <Cpu className="w-5 h-5 text-amber-400" />, name: 'Autonomous AI Agents', desc: 'Issue cryptographic authorization passports for agent-to-agent high-stakes API invocations.' },
            ].map((domain, i) => (
              <div key={i} className="bg-surface-2 p-6 rounded-2xl border border-slate-800 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-surface-1 border border-slate-700 flex items-center justify-center">
                  {domain.icon}
                </div>
                <h3 className="text-base font-bold text-slate-100">{domain.name}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{domain.desc}</p>
              </div>
            ))}
          </div>
        </AppContainer>
      </section>

      {/* ── SCREEN 7: KEYNOTE CTA & FOOTER ─────────────────────────────────── */}
      <footer className="pt-16 border-t border-slate-800">
        <AppContainer>
          <div className="text-center max-w-2xl mx-auto space-y-6 mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-100">
              Ready to deploy the Universal AI Trust Layer?
            </h2>
            <Button
              size="lg"
              variant="azure"
              onClick={() => navigate('/verify')}
              icon={<ArrowRight className="w-4 h-4 ml-1" />}
              className="mx-auto"
            >
              Start Live Verification
            </Button>
          </div>

          <div className="pt-8 border-t border-slate-800/60 text-2xs font-mono text-slate-500 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-trust-green animate-pulse" />
              <span>TrustGate AI OS v2.4 • Microsoft Azure AI Showcase</span>
            </div>
            <span>© 2026 TrustGate AI. All rights reserved.</span>
          </div>
        </AppContainer>
      </footer>

      {/* Scroll-to-top FAB */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 z-50 w-12 h-12 rounded-full bg-azure-600 hover:bg-azure-500 text-white shadow-[0_0_20px_rgba(0,120,212,0.4)] flex items-center justify-center transition-colors"
            aria-label="Scroll to top"
          >
            <ChevronUp className="w-5 h-5" />
          </motion.button>
        )}
      </AnimatePresence>

    </div>
  );
};
