import React from 'react';
import { AppContainer } from '../components/layout/AppContainer';
import { SecureAIChat } from '../components/chat/SecureAIChat';
import { useTrustStore } from '../store/trustStore';
import { useChatStore } from '../store/chatStore';
import { Building, Stethoscope, Landmark, Cpu } from 'lucide-react';

export const ChatPage: React.FC = () => {
  const { isVerified, passport } = useTrustStore();
  const { activeDomain, setActiveDomain } = useChatStore();

  const domains = [
    { name: 'Corporate Banking', icon: <Landmark className="w-4 h-4 text-azure-400" /> },
    { name: 'Healthcare Claims', icon: <Stethoscope className="w-4 h-4 text-trust-green" /> },
    { name: 'Government Administration', icon: <Building className="w-4 h-4 text-electric-cyan" /> },
    { name: 'AI Agent Authorization', icon: <Cpu className="w-4 h-4 text-amber-400" /> },
  ];

  return (
    <div className="flex-1 bg-surface-0 text-slate-100 py-8 md:py-12 overflow-y-auto">
      <AppContainer>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start max-w-7xl mx-auto">
          
          {/* Sidebar */}
          <div className="lg:col-span-3 bg-surface-1 border border-slate-800 rounded-2xl p-4 space-y-6 shadow-xl">
            <div>
              <h3 className="font-bold text-slate-100 text-sm mb-1">Clearance Domains</h3>
              <p className="text-2xs text-slate-400">Select security context</p>
            </div>

            <div className="space-y-1.5">
              {domains.map((d, i) => (
                <button
                  key={i}
                  onClick={() => setActiveDomain(d.name)}
                  className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-3 transition-colors ${
                    activeDomain === d.name
                      ? 'bg-azure-600/20 text-azure-200 border border-azure-500/40 font-bold'
                      : 'text-slate-400 hover:bg-surface-2 hover:text-slate-200'
                  }`}
                >
                  {d.icon}
                  <span>{d.name}</span>
                </button>
              ))}
            </div>

            {/* Session Passport Status */}
            <div className="bg-surface-2 p-3.5 rounded-xl border border-slate-800 space-y-2">
              <span className="text-2xs font-mono uppercase tracking-wider text-slate-500 block">SESSION PASSPORT</span>
              {isVerified && passport ? (
                <div>
                  <p className="text-xs font-mono font-bold text-trust-green truncate">ID: {passport.passportId}</p>
                  <p className="text-2xs font-mono text-slate-400 mt-0.5">Trust Score: {passport.trustScore}%</p>
                </div>
              ) : (
                <div>
                  <p className="text-xs font-mono font-bold text-trust-green truncate">ID: TP-AZURE-99842 (Live)</p>
                  <p className="text-2xs font-mono text-slate-400 mt-0.5">Trust Score: 98.4%</p>
                </div>
              )}
            </div>
          </div>

          {/* Main Chat Assistant Canvas */}
          <div className="lg:col-span-9">
            <SecureAIChat />
          </div>

        </div>
      </AppContainer>
    </div>
  );
};

