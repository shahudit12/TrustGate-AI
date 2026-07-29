import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTrustStore } from '../../store/trustStore';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

interface CommandItem {
  id: string;
  label: string;
  icon: string;
  persona?: string;
  path?: string;
  action?: () => void;
}

interface CommandGroup {
  group: string;
  items: CommandItem[];
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const { isVerified, passport, setPassport, clearTrust } = useTrustStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else setQuery('');
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const commands: CommandGroup[] = [
    {
      group: 'Navigation',
      items: [
        { id: 'nav-overview', label: 'Go to Executive Overview', path: '/overview', icon: '⚡', persona: 'CISO / Executive' },
        { id: 'nav-verify', label: 'Start Identity Verification', path: '/verify', icon: '🛡️', persona: 'End User' },
        { id: 'nav-trustcenter', label: 'Open Trust Center Command', path: '/trust-center', icon: '📊', persona: 'Security Analyst' },
        { id: 'nav-copilot', label: 'Launch AI Copilot', path: '/chat', icon: '🤖', persona: 'AI Operator' },
        { id: 'nav-analytics', label: 'View Analytics Intelligence', path: '/dashboard', icon: '📈', persona: 'Security Director' },
        { id: 'nav-reports', label: 'View Passport Reports', path: `/report/${passport?.sessionId || 'demo-123'}`, icon: '📜', persona: 'Compliance Officer' },
      ],
    },
    {
      group: 'Actions & Utilities',
      items: [
        {
          id: 'act-sim-verify',
          label: isVerified ? 'Reset Verification State' : 'Simulate Instant Verification Pass',
          icon: '✨',
          action: () => {
            if (isVerified) {
              clearTrust();
            } else {
              setPassport({
                passportId: 'TP-AZURE-99842',
                sessionId: 'demo-session-99',
                subject: { id: 'usr-demo-01', type: 'human' },
                trustScore: 98.4,
                riskLevel: 'LOW' as any,
                components: {
                  faceVerified: true,
                  voiceVerified: true,
                  behaviorVerified: true,
                  challengesPassed: 3,
                },
                validFrom: new Date().toISOString(),
                expiresAt: new Date(Date.now() + 86400000).toISOString(),
                signature: '0x9948a...azure-sec',
              });
            }
            onClose();
          },
        },
        {
          id: 'act-azure-health',
          label: 'Inspect Azure AI Service Telemetry',
          icon: '☁️',
          action: () => {
            navigate('/overview');
            onClose();
          },
        },
      ],
    },
  ];

  const filteredCommands = commands.map((g) => ({
    ...g,
    items: g.items.filter((item) =>
      item.label.toLowerCase().includes(query.toLowerCase())
    ),
  })).filter(g => g.items.length > 0);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4 bg-slate-950/80 backdrop-blur-md" role="dialog" aria-modal="true" aria-label="Global Command Palette">
        <div className="absolute inset-0" onClick={onClose} aria-hidden="true" />
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -20 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-2xl bg-surface-2 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden"
        >
          {/* Search Header */}
          <div className="flex items-center px-4 py-3.5 border-b border-slate-800 bg-surface-1">
            <svg className="w-5 h-5 text-slate-400 mr-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Type a command or search platform (Press Esc to exit)..."
              aria-label="Search platform commands"
              className="w-full bg-transparent text-slate-100 placeholder-slate-500 outline-none text-base font-sans"
              autoFocus
            />
            <span className="text-2xs font-mono px-2 py-1 bg-slate-800 border border-slate-700 rounded text-slate-400 shrink-0">
              ESC
            </span>
          </div>

          {/* Command List */}
          <div className="max-h-[380px] overflow-y-auto p-2 space-y-4">
            {filteredCommands.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-sm">
                No commands matching "{query}"
              </div>
            ) : (
              filteredCommands.map((group) => (
                <div key={group.group}>
                  <div className="px-3 py-1.5 text-2xs font-semibold uppercase tracking-wider text-slate-500">
                    {group.group}
                  </div>
                  <div className="space-y-1">
                    {group.items.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => {
                          if (item.action) {
                            item.action();
                          } else if (item.path) {
                            navigate(item.path);
                            onClose();
                          }
                        }}
                        className="w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium text-slate-200 hover:bg-azure-600/20 hover:text-white flex items-center justify-between group transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-lg">{item.icon}</span>
                          <span>{item.label}</span>
                        </div>
                        {item.persona && (
                          <span className="text-2xs px-2 py-0.5 rounded bg-slate-800 text-slate-400 group-hover:bg-azure-600/30 group-hover:text-azure-200 border border-slate-700/50">
                            {item.persona}
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Telemetry */}
          <div className="px-4 py-2.5 bg-surface-1 border-t border-slate-800 text-2xs text-slate-500 flex items-center justify-between font-mono">
            <span>TrustGate AI OS v2.4 • Powered by Azure AI</span>
            <span>Use ↑ ↓ to navigate, Enter to select</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
