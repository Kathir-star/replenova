import React, { useState } from 'react';
import {
  Zap,
  CheckCircle2,
  XCircle,
  RotateCcw,
  ShieldCheck,
  AlertTriangle,
  Sparkles,
  ArrowRight,
  Clock,
  ExternalLink
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Card, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { formatInrCurrency } from '../lib/calculations';

export const AIActions: React.FC = () => {
  const { aiActions, approveAIAction } = useApp();
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const filteredActions = aiActions.filter((act) => {
    if (filterStatus === 'all') return true;
    return act.status === filterStatus;
  });

  return (
    <div className="space-y-5">
      {/* Page Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-[#1E1E1E]">
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Zap className="w-5 h-5 text-[#F27D26]" />
            <span>Autonomous AI Actions & Audit Trail</span>
          </h1>
          <p className="text-xs text-[#808080] mt-0.5">
            Supervised autonomous decisions: rerouting freight lanes, triggering supplier emergency POs, and dynamic buffer adjustments.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded border border-emerald-500/20">
            Autonomous Guardrails Active (Level 3 Supervised)
          </span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 p-1.5 bg-[#111111] rounded-xl border border-[#222222] overflow-x-auto scrollbar-thin">
        {[
          { key: 'all', label: `All Directives (${aiActions.length})` },
          { key: 'pending', label: 'Pending Approval' },
          { key: 'executed', label: 'Auto-Executed' },
          { key: 'approved', label: 'Approved' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilterStatus(tab.key)}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono whitespace-nowrap transition-colors ${
              filterStatus === tab.key
                ? 'bg-[#262626] text-white font-bold shadow-xs'
                : 'text-[#888888] hover:text-[#D1D1D1]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Action Cards */}
      <div className="space-y-4">
        {filteredActions.map((action) => {
          const isPending = action.status === 'pending';
          const isApproved = action.status === 'approved';
          const isExecuted = action.status === 'executed';

          const costDisplay = action.costInr ? formatInrCurrency(action.costInr) : '₹45,000';
          const problemText = action.description || action.problem;
          const benefitText = action.impact || action.benefit;

          return (
            <Card
              key={action.id}
              className={`p-4 sm:p-5 transition-all ${
                isPending
                  ? 'border-[#F27D26]/40 bg-[#141210]'
                  : isApproved || isExecuted
                  ? 'border-emerald-500/30 bg-[#0E1310]'
                  : 'border-[#222222] bg-[#111111]'
              }`}
            >
              {/* Header */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#1E1E1E]">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-[#1A1A1A] border border-[#2E2E2E] text-[#F27D26]">
                    <Zap className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-white">{action.title}</h3>
                      <span
                        className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded uppercase ${
                          isPending
                            ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                            : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        }`}
                      >
                        {action.status}
                      </span>
                      {action.category && (
                        <span className="text-[10px] font-mono text-[#888888]">{action.category}</span>
                      )}
                    </div>
                    <p className="text-xs text-[#777777] mt-0.5">
                      Confidence: {action.confidencePct}% • Risk Reduction: -{action.riskReductionPct}%
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-mono font-bold text-emerald-400">
                    {costDisplay}
                  </span>
                  <span className="text-[10px] text-[#777777] block font-mono">EST COST</span>
                </div>
              </div>

              {/* Action Body Description */}
              <p className="text-xs text-[#CCCCCC] mt-3 leading-relaxed">
                {problemText}
              </p>

              {/* Action Directive Box */}
              <div className="my-3 p-2.5 rounded-lg bg-[#0A0A0A] border border-[#1C1C1C] text-xs leading-relaxed text-[#D1D1D1]">
                <span className="text-[#888888] block text-[10px] font-mono uppercase mb-1">
                  Autonomous Execution Directive:
                </span>
                <p className="font-medium text-white">{action.recommendedAction}</p>
                {benefitText && (
                  <p className="text-[11px] text-emerald-400 mt-1 font-mono">{benefitText}</p>
                )}
              </div>

              {/* Action Controls */}
              <div className="mt-3.5 pt-3 border-t border-[#1E1E1E] flex flex-wrap items-center justify-between gap-3">
                <span className="text-[10px] font-mono text-[#666666]">
                  Trace ID: {action.id} • {action.timestamp}
                </span>

                {isPending && (
                  <div className="flex items-center gap-2">
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => approveAIAction(action.id)}
                      icon={<CheckCircle2 className="w-3.5 h-3.5" />}
                      className="text-xs py-1 px-3.5"
                    >
                      Approve & Execute Action
                    </Button>
                  </div>
                )}

                {(isApproved || isExecuted) && (
                  <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-mono">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Directive Successfully Dispatched</span>
                  </div>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
