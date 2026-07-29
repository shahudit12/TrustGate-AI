import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, ChevronDown, ChevronUp, Copy, Check, Info, Loader2, ShieldOff, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useChatStore } from '../../store/chatStore';
import { useTrustStore } from '../../store/trustStore';

export const SecureAIChat: React.FC = () => {
  const { messages, isSending, error, sendMessageOptimistic } = useChatStore();
  const { isVerified } = useTrustStore();
  const navigate = useNavigate();
  const [input, setInput] = useState('');
  const [openReasoningId, setOpenReasoningId] = useState<string | null>(null);
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);

  // Auto-scroll to bottom when new messages arrive
  const messagesEndRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isSending]);

  const suggestedPrompts = [
    'Inspect recent high-risk corporate wire transfers',
    'Verify clinician clearance for EHR patient record access',
    'Generate cryptographic audit trail summary for CISO',
  ];

  const handleSend = (textToSend?: string) => {
    const userMsgText = textToSend || input;
    if (!userMsgText.trim() || isSending) return;

    sendMessageOptimistic(userMsgText);
    if (!textToSend) setInput('');
  };

  const copyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCodeId(id);
    setTimeout(() => setCopiedCodeId(null), 2000);
  };

  return (
    <div className="flex flex-col h-[640px] bg-surface-1 rounded-2xl border border-slate-800 overflow-hidden shadow-2xl relative">
      
      {/* Header */}
      <div className="bg-surface-2 border-b border-slate-800 p-4 flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-azure-600 to-electric-cyan flex items-center justify-center shadow-lg">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-100 text-sm">TrustGate AI Copilot</h3>
            <p className="text-2xs text-trust-green font-mono tracking-widest uppercase flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-trust-green animate-pulse" />
              {isVerified ? 'Verified Session Active' : 'Demo Mode • Azure OpenAI GPT-4o'}
            </p>
          </div>
        </div>
        <div className="px-2.5 py-1 bg-surface-0 rounded-lg border border-slate-800 text-2xs text-slate-400 font-mono">
          Model: Azure OpenAI GPT-4o
        </div>
      </div>

      {/* Not-verified banner */}
      {!isVerified && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="bg-amber-500/10 border-b border-amber-500/20 px-4 py-3 flex items-center justify-between gap-4"
        >
          <div className="flex items-center gap-2 text-amber-400 text-xs">
            <ShieldOff className="w-4 h-4 shrink-0" />
            <span className="font-semibold">No active Trust Passport.</span>
            <span className="text-amber-400/70">Complete biometric verification to unlock full clearance.</span>
          </div>
          <button
            onClick={() => navigate('/verify')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 rounded-lg text-xs font-semibold transition-colors shrink-0"
          >
            Verify Now <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </motion.div>
      )}

      {/* Message List */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-surface-0/60">
        {messages.map((msg) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-azure-600 text-white rounded-tr-xs shadow-md'
                  : 'bg-surface-2 border border-slate-800 text-slate-200 rounded-tl-xs shadow-xl space-y-3'
              }`}
            >
              <p>{msg.text}</p>

              {/* Code Snippet Box */}
              {msg.codeSnippet && (
                <div className="bg-surface-0 rounded-xl p-3 border border-slate-800 font-mono text-2xs relative group">
                  <button
                    onClick={() => copyCode(msg.codeSnippet!, msg.id)}
                    className="absolute right-2 top-2 p-1.5 rounded bg-slate-800 text-slate-400 hover:text-white transition-colors"
                    aria-label="Copy code"
                  >
                    {copiedCodeId === msg.id ? <Check className="w-3.5 h-3.5 text-trust-green" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                  <pre className="text-azure-300 overflow-x-auto">{msg.codeSnippet}</pre>
                </div>
              )}

              {/* XAI Reasoning Toggle Drawer */}
              {msg.reasoning && (
                <div className="border-t border-slate-800/80 pt-2 text-2xs font-mono">
                  <button
                    onClick={() => setOpenReasoningId(openReasoningId === msg.id ? null : msg.id)}
                    className="flex items-center gap-1.5 text-azure-400 hover:text-azure-300 font-semibold"
                    aria-expanded={openReasoningId === msg.id}
                  >
                    <Info className="w-3.5 h-3.5" />
                    <span>{openReasoningId === msg.id ? 'Hide XAI Reasoning' : 'Inspect XAI Trust Clearance'}</span>
                    {openReasoningId === msg.id ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                  </button>

                  <AnimatePresence>
                    {openReasoningId === msg.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-2 p-3 bg-surface-0 rounded-xl border border-slate-800 text-slate-400 space-y-1"
                      >
                        <p className="text-slate-200"><strong>Trust Score:</strong> {msg.reasoning.trustScore}%</p>
                        <p><strong>Clearance:</strong> {msg.reasoning.clearanceLevel}</p>
                        <p className="text-slate-300 italic">{msg.reasoning.xaiFactor}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </motion.div>
        ))}

        {isSending && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
            <div className="bg-surface-2 border border-slate-800 p-4 rounded-2xl rounded-tl-xs flex gap-2 items-center">
              <div className="w-2 h-2 rounded-full bg-azure-400 animate-bounce" />
              <div className="w-2 h-2 rounded-full bg-azure-400 animate-bounce" style={{ animationDelay: '0.2s' }} />
              <div className="w-2 h-2 rounded-full bg-azure-400 animate-bounce" style={{ animationDelay: '0.4s' }} />
            </div>
          </motion.div>
        )}

        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-2xs font-mono rounded-xl">
            ⚠️ {error}
          </div>
        )}

        {/* Scroll anchor — always scroll here on new messages */}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Prompt Chips */}
      <div className="px-4 py-2 bg-surface-1 border-t border-slate-800 flex items-center gap-2 overflow-x-auto text-2xs">
        <span className="text-slate-500 font-mono shrink-0">PROMPTS:</span>
        {suggestedPrompts.map((p, i) => (
          <button
            key={i}
            onClick={() => handleSend(p)}
            className="px-3 py-1 rounded-lg bg-surface-2 border border-slate-800 text-slate-300 hover:text-white hover:border-azure-500/50 shrink-0 transition-colors"
          >
            {p}
          </button>
        ))}
      </div>

      {/* Input Box */}
      <div className="p-4 bg-surface-2 border-t border-slate-800">
        <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="relative flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask AI Copilot (Clearance level: HIGH)..."
            className="w-full bg-surface-0 border border-slate-700/80 text-slate-100 rounded-xl pl-4 pr-12 py-3 focus:outline-none focus:border-azure-500 text-sm font-sans"
            aria-label="Chat message input"
          />
          <button
            type="submit"
            disabled={!input.trim() || isSending}
            className="absolute right-2 p-2 bg-azure-600 hover:bg-azure-500 disabled:bg-slate-800 disabled:text-slate-600 text-white rounded-lg transition-colors"
            aria-label="Send message"
          >
            {isSending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </button>
        </form>
      </div>
    </div>
  );
};
