/**
 * TrustGate AI — Main Application Shell
 *
 * Root architecture for AI Operating System for Trust:
 * - Code-split route pages
 * - React Query & Zustand state providers
 * - Global Ctrl+K Command Palette
 * - Persona-mapped navigation, Mobile Responsive Drawer & 3-state Demo Mode Switcher
 */
import React, { Suspense, lazy, useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Search, ShieldCheck, Home } from 'lucide-react';

import { useTrustStore } from './store/trustStore';
import { CommandPalette } from './components/ui/CommandPalette';

// Code-split route pages for optimized initial load
const LandingPage = lazy(() => import('./pages/LandingPage').then(m => ({ default: m.LandingPage })));
const OverviewPage = lazy(() => import('./pages/OverviewPage').then(m => ({ default: m.OverviewPage })));
const VerificationPage = lazy(() => import('./pages/VerificationPage').then(m => ({ default: m.VerificationPage })));
const TrustCenterPage = lazy(() => import('./pages/TrustCenterPage').then(m => ({ default: m.TrustCenterPage })));
const DashboardPage = lazy(() => import('./pages/DashboardPage').then(m => ({ default: m.DashboardPage })));
const ChatPage = lazy(() => import('./pages/ChatPage').then(m => ({ default: m.ChatPage })));
const ReportPage = lazy(() => import('./pages/ReportPage').then(m => ({ default: m.ReportPage })));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 30,
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});

const PageLoader: React.FC = () => (
  <div className="flex-1 flex items-center justify-center min-h-[400px]" role="status" aria-label="Loading AI OS Module">
    <div className="flex flex-col items-center gap-4">
      <div className="w-10 h-10 border-4 border-[#0078D4] border-t-transparent rounded-full animate-spin" />
      <span className="text-sm font-mono text-slate-400">Loading AI OS Module...</span>
    </div>
  </div>
);

interface NavBarProps {
  onOpenCommand: () => void;
}

const NavBar: React.FC<NavBarProps> = ({ onOpenCommand }) => {
  const location = useLocation();
  const { isVerified, passport } = useTrustStore();
  const [demoMode, setDemoMode] = useState<'LIVE' | 'DEMO' | 'SIMULATION'>('DEMO');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { path: '/overview', label: 'Overview', persona: 'CISO' },
    { path: '/verify', label: 'Verification', persona: 'End User' },
    { path: '/trust-center', label: 'Trust Center', persona: 'Analyst' },
    { path: '/chat', label: 'AI Copilot', persona: 'Operator' },
    { path: '/dashboard', label: 'Analytics', persona: 'Director' },
  ];

  // Mobile drawer includes a Home link at the top
  const mobileNavLinks = [
    { path: '/', label: 'Home', persona: 'Home' },
    ...navLinks,
  ];

  const isActive = (path: string) => location.pathname === path;

  const cycleDemoMode = () => {
    if (demoMode === 'LIVE') setDemoMode('DEMO');
    else if (demoMode === 'DEMO') setDemoMode('SIMULATION');
    else setDemoMode('LIVE');
  };

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <header className="sticky top-0 z-40 border-b border-slate-800/80 backdrop-blur-xl bg-surface-0/85">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
        {/* Brand */}
        <Link
          to="/"
          className="flex items-center gap-3 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azure-500 rounded-xl"
          aria-label="TrustGate AI Homepage"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#0078D4] to-[#00B294] flex items-center justify-center shadow-[0_0_15px_rgba(0,120,212,0.4)] group-hover:shadow-[0_0_20px_rgba(0,178,148,0.5)] transition-all duration-300">
            <ShieldCheck className="w-5 h-5 text-white" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-base text-slate-100 tracking-tight">TrustGate</span>
              <span className="font-bold text-base gradient-text tracking-tight">AI</span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-azure-400 border border-slate-700">OS</span>
            </div>
          </div>
        </Link>

        {/* Desktop Persona Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 bg-surface-2/60 p-1 rounded-xl border border-slate-800" aria-label="Main Navigation">
          {navLinks.map(({ path, label }) => (
            <Link
              key={path}
              to={path}
              aria-current={isActive(path) ? 'page' : undefined}
              className={`relative px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azure-500 ${
                isActive(path)
                  ? 'text-white'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              {isActive(path) && (
                <motion.div
                  layoutId="nav-indicator"
                  className="absolute inset-0 rounded-lg bg-azure-600/20 border border-azure-500/40 shadow-[inset_0_0_10px_rgba(0,120,212,0.2)]"
                  transition={{ type: 'spring', bounce: 0.15, duration: 0.35 }}
                />
              )}
              <span className="relative z-10">{label}</span>
            </Link>
          ))}
        </nav>

        {/* Action Controls & Mobile Menu Button */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Command Palette Trigger */}
          <button
            onClick={onOpenCommand}
            aria-label="Open Command Palette (Ctrl K)"
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-surface-2 border border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700 text-xs font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azure-500"
          >
            <Search className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Search Platform</span>
            <kbd className="hidden sm:inline font-mono text-2xs px-1.5 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-400">
              Ctrl K
            </kbd>
          </button>

          {/* Passport Issued Pill */}
          {isVerified && passport && (
            <Link to={`/report/${passport.sessionId}`} className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-trust-green rounded-xl">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="flex items-center gap-2 px-2.5 sm:px-3 py-1.5 rounded-xl bg-trust-green/10 border border-trust-green/30 text-trust-green text-xs font-semibold cursor-pointer hover:bg-trust-green/20 transition-colors shadow-[0_0_10px_rgba(0,178,148,0.2)]"
              >
                <div className="w-2 h-2 rounded-full bg-trust-green animate-pulse" />
                <span className="hidden xs:inline">Passport</span> Issued
              </motion.div>
            </Link>
          )}

          {/* 3-State Demo Mode Toggle Pill */}
          <button
            onClick={cycleDemoMode}
            aria-label={`Cycle platform mode (Current: ${demoMode})`}
            title="Click to cycle platform execution mode"
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-surface-2 border border-slate-800 hover:border-slate-700 text-xs font-mono font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azure-500"
          >
            <span className={`w-2 h-2 rounded-full ${demoMode === 'LIVE' ? 'bg-emerald-400 animate-pulse' : demoMode === 'DEMO' ? 'bg-amber-400' : 'bg-azure-400'}`} />
            <span className={demoMode === 'LIVE' ? 'text-emerald-400' : demoMode === 'DEMO' ? 'text-amber-400' : 'text-azure-400'}>
              {demoMode}
            </span>
          </button>

          {/* Mobile Menu Hamburger Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            className="lg:hidden p-2 rounded-xl bg-surface-2 border border-slate-800 text-slate-300 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azure-500"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Responsive Navigation Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border-t border-slate-800/80 bg-surface-1/95 backdrop-blur-2xl px-6 py-4 space-y-2 overflow-hidden"
          >
            {mobileNavLinks.map(({ path, label, persona }) => (
              <Link
                key={path}
                to={path}
                className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                  isActive(path)
                    ? 'bg-azure-600/20 text-azure-400 border border-azure-500/40'
                    : 'text-slate-300 hover:bg-slate-800/60'
                }`}
              >
                <span>{label}</span>
                <span className="text-2xs font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800">
                  {persona}
                </span>
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex-1 flex items-center justify-center p-6"
    >
      <div className="text-center max-w-md space-y-6">
        <div className="w-20 h-20 mx-auto rounded-2xl bg-azure-600/10 border border-azure-500/20 flex items-center justify-center">
          <ShieldCheck className="w-10 h-10 text-azure-400 opacity-50" />
        </div>
        <div>
          <h1 className="text-7xl font-bold gradient-text mb-2">404</h1>
          <p className="text-slate-300 text-lg font-semibold">Module Not Found</p>
          <p className="text-slate-500 text-sm mt-2">
            This route does not exist in the TrustGate AI OS. Navigate back to a known module.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => navigate('/')}
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-azure-600 hover:bg-azure-500 text-white rounded-xl font-medium text-sm transition-colors"
          >
            <Home className="w-4 h-4" />
            Return Home
          </button>
          <button
            onClick={() => navigate(-1)}
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-surface-2 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl font-medium text-sm transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    </motion.div>
  );
};

const AppShell: React.FC = () => {
  const location = useLocation();
  const [isCommandOpen, setIsCommandOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-surface-0 text-slate-100 font-sans selection:bg-azure-600/30 selection:text-slate-100">
      <NavBar onOpenCommand={() => setIsCommandOpen(true)} />
      <CommandPalette isOpen={isCommandOpen} onClose={() => setIsCommandOpen(false)} />

      <main className="flex-1 flex flex-col" id="main-content" role="main">
        <Suspense fallback={<PageLoader />}>
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<LandingPage />} />
              <Route path="/overview" element={<OverviewPage />} />
              <Route path="/verify" element={<VerificationPage />} />
              <Route path="/trust-center" element={<TrustCenterPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/chat" element={<ChatPage />} />
              <Route path="/report/:sessionId" element={<ReportPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </AnimatePresence>
        </Suspense>
      </main>

      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: '#162032',
            color: '#F1F5F9',
            border: '1px solid #334155',
            borderRadius: '0.75rem',
            boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
          },
          success: { iconTheme: { primary: '#00B294', secondary: '#F1F5F9' } },
          error: { iconTheme: { primary: '#EF4444', secondary: '#F1F5F9' } },
        }}
      />
    </div>
  );
};

const App: React.FC = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
