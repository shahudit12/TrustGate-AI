/**
 * TrustGate AI — Risk Factor List (XAI Explainability Panel)
 *
 * Renders the list of XAI factors that contributed to the trust score.
 * Each factor is expandable to show technical detail.
 */
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XAIFactor, RiskLevel } from '../../types/trust';
import { Badge } from '../ui/Badge';

interface RiskFactorListProps {
  factors: XAIFactor[];
}

// Normalize severity string to RiskLevel enum
function normalizeSeverity(severity: XAIFactor['severity']): RiskLevel {
  if (typeof severity === 'string') {
    const upper = severity.toUpperCase() as keyof typeof RiskLevel;
    return RiskLevel[upper] ?? RiskLevel.LOW;
  }
  return severity as RiskLevel;
}

// Normalize impact to number
function normalizeImpact(impact: XAIFactor['impact']): number {
  if (typeof impact === 'number') return impact;
  if (impact === 'positive') return 10;
  if (impact === 'negative') return -10;
  return 0; // neutral
}

const getSeverityColor = (severity: RiskLevel, impact: number): 'success' | 'info' | 'warning' | 'danger' => {
  if (impact > 0) return 'success';
  const norm = normalizeSeverity(severity);
  if (norm === RiskLevel.LOW) return 'info';
  if (norm === RiskLevel.MEDIUM) return 'warning';
  return 'danger';
};

export const RiskFactorList: React.FC<RiskFactorListProps> = ({ factors }) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <div className="space-y-3">
      {factors.map((factor, index) => {
        const impactNum = normalizeImpact(factor.impact);
        const isExpanded = expandedId === factor.factor_id;
        const colorVariant = getSeverityColor(normalizeSeverity(factor.severity), impactNum);
        const isPositive = impactNum >= 0;

        return (
          <motion.div
            key={factor.factor_id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="glass rounded-xl border border-slate-700/50 overflow-hidden"
          >
            <div
              className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-800/50 transition-colors"
              onClick={() => setExpandedId(isExpanded ? null : factor.factor_id)}
            >
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  isPositive ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
                }`}>
                  {isPositive ? '✓' : '!'}
                </div>
                <div>
                  <h4 className="font-semibold text-slate-200 text-sm">{factor.description}</h4>
                  <p className="text-xs text-slate-400">
                    Impact: {typeof factor.impact === 'number'
                      ? `${impactNum > 0 ? '+' : ''}${impactNum} pts`
                      : String(factor.impact)
                    }
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <Badge variant={colorVariant} size="sm">
                  {String(factor.severity).toUpperCase()}
                </Badge>
                <svg
                  className={`w-5 h-5 text-slate-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="bg-slate-900/50 border-t border-slate-800"
                >
                  <div className="p-4 font-mono text-xs text-slate-400 leading-relaxed">
                    <span className="text-slate-500 font-bold uppercase tracking-wider block mb-1">Technical Detail</span>
                    {factor.technical_detail}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}
    </div>
  );
};
