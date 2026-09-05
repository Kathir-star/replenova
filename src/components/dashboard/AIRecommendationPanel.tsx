import React, { useState } from 'react';
import {
  Sparkles,
  CheckCircle2,
  SlidersHorizontal,
  ArrowRight,
  ShieldAlert,
  TrendingDown,
  Plane,
  Truck,
  Check
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Card, CardHeader } from '../ui/Card';
import { Button } from '../ui/Button';
import { formatInrCurrency } from '../../lib/calculations';

export const AIRecommendationPanel: React.FC<{ onNavigateToSimulator?: () => void }> = ({
  onNavigateToSimulator
}) => {
  const {
    recommendations,
    approveRecommendation,
    simulateRecommendation,
    inventory,
    setSelectedSku
  } = useApp();

  const [approvedMap, setApprovedMap] = useState<Record<string, boolean>>({});

  const primaryRec = recommendations[0];
  const targetItem = inventory.find((i) => i.sku === primaryRec?.sku);

  const handleApprove = (id: string) => {
    approveRecommendation(id);
    setApprovedMap((prev) => ({ ...prev, [id]: true }));
  };

  const isApproved = approvedMap[primaryRec?.id] || primaryRec?.status === 'approved';

  return (
    <Card className="border-[#262626] bg-[#0E0E0E]">
      <CardHeader
        title="AI Replenishment Intelligence"
        subtitle="Multi-echelon automated risk mitigation strategies"
        badge={
          <span className="text-[10px] font-mono font-bold bg-[#F27D26]/20 text-[#F27D26] px-2 py-0.5 rounded border border-[#F27D26]/40 flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            HIGH CONFIDENCE 96%
          </span>
        }
      />

      <div className="p-4 sm:p-5 space-y-4">
        {/* Main Critical Card */}
        <div
          className={`p-4 rounded-xl border transition-all duration-300 ${
            isApproved
              ? 'bg-emerald-950/20 border-emerald-500/40'
              : 'bg-[#141414] border-red-500/30 ring-1 ring-red-500/20'
          }`}
        >
          {/* Header Banner */}
          <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#222222]">
            <div className="flex items-center gap-2">
              <span
                className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded uppercase ${
                  isApproved
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : 'bg-red-500/20 text-red-400 border border-red-500/30'
                }`}
              >
                {isApproved ? 'MITIGATION EXECUTED' : 'CRITICAL INVENTORY RISK'}
              </span>
              <span className="text-xs font-mono font-bold text-white">SKU: {primaryRec?.sku}</span>
            </div>

            <div className="text-right">
              <span className="text-xs text-[#888888]">Potential Loss Avoided: </span>
              <span className="text-xs font-mono font-bold text-emerald-400">₹54.2L</span>
            </div>
          </div>

          {/* Telemetry Numbers Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-3.5">
            <div className="p-2.5 rounded-lg bg-[#0A0A0A] border border-[#1E1E1E]">
              <p className="text-[10px] text-[#737373] uppercase font-mono">Current Stock</p>
              <p className="text-sm sm:text-base font-bold font-mono text-white mt-0.5">
                {targetItem?.currentStock.toLocaleString()} units
              </p>
            </div>

            <div className="p-2.5 rounded-lg bg-[#0A0A0A] border border-[#1E1E1E]">
              <p className="text-[10px] text-[#737373] uppercase font-mono">Daily Demand</p>
              <p className="text-sm sm:text-base font-bold font-mono text-white mt-0.5">
                {targetItem?.dailyDemand.toLocaleString()} units/day
              </p>
            </div>

            <div className="p-2.5 rounded-lg bg-[#0A0A0A] border border-[#1E1E1E]">
              <p className="text-[10px] text-[#737373] uppercase font-mono">Stockout Probability</p>
              <p
                className={`text-sm sm:text-base font-bold font-mono mt-0.5 ${
                  isApproved ? 'text-emerald-400' : 'text-red-400'
                }`}
              >
                {isApproved ? '13%' : `${targetItem?.stockoutProbability}%`}
              </p>
            </div>

            <div className="p-2.5 rounded-lg bg-[#0A0A0A] border border-[#1E1E1E]">
              <p className="text-[10px] text-[#737373] uppercase font-mono">Predicted Stockout</p>
              <p
                className={`text-sm sm:text-base font-bold font-mono mt-0.5 ${
                  isApproved ? 'text-emerald-400' : 'text-amber-400'
                }`}
              >
                {isApproved ? '14+ Days' : `${primaryRec?.stockoutDays} Days`}
              </p>
            </div>
          </div>

          {/* Multi-Echelon Action Plan Description */}
          <div className="p-3 rounded-lg bg-[#0C0C0C] border border-[#222222] space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-white">
              <Sparkles className="w-3.5 h-3.5 text-[#F27D26]" />
              <span>Recommended Multi-Echelon Replenishment Strategy</span>
            </div>

            <div className="space-y-1.5 text-xs text-[#D1D1D1]">
              <div className="flex items-start gap-2">
                <Truck className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Inter-Warehouse Transfer:</strong> Transfer <strong>1,200 units</strong> from Bengaluru Tech Logistics Hub (Road Express, 24h).
                </span>
              </div>
              <div className="flex items-start gap-2">
                <Plane className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Alternate Sourcing:</strong> Expedite <strong>2,500 units</strong> from Apex Silicon Tech (Bengaluru) via air express link.
                </span>
              </div>
            </div>

            <div className="pt-2 border-t border-[#1C1C1C] flex flex-wrap items-center justify-between text-[11px] text-[#888888]">
              <span>
                Expected Risk Reduction: <strong className="text-emerald-400">84%</strong>
              </span>
              <span>
                Estimated Additional Cost: <strong className="text-white">₹1.85L</strong>
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-4 flex flex-wrap items-center justify-end gap-2.5">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSelectedSku(primaryRec?.sku);
                if (onNavigateToSimulator) onNavigateToSimulator();
              }}
              icon={<SlidersHorizontal className="w-3 h-3" />}
              className="text-xs"
            >
              Simulate
            </Button>

            <Button
              variant={isApproved ? 'secondary' : 'primary'}
              size="sm"
              onClick={() => handleApprove(primaryRec?.id)}
              disabled={isApproved}
              icon={isApproved ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Sparkles className="w-3.5 h-3.5" />}
              className="text-xs"
            >
              {isApproved ? 'Approved & Dispatched' : 'Approve & Execute (₹1.85L)'}
            </Button>
          </div>
        </div>

        {/* Secondary Recommendations */}
        <div className="space-y-2">
          <p className="text-[11px] font-mono text-[#737373] uppercase tracking-wider">
            Queue Pending AI Directives ({recommendations.length - 1})
          </p>
          {recommendations.slice(1, 3).map((rec) => (
            <div
              key={rec.id}
              className="p-3 rounded-lg bg-[#111111] border border-[#222222] hover:border-[#333333] transition-all flex items-center justify-between gap-3"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-white font-mono">{rec.sku}</span>
                  <span className="text-[10px] text-[#737373] truncate">{rec.productName}</span>
                </div>
                <p className="text-[11px] text-[#A0A0A0] truncate mt-0.5">{rec.recommendedAction}</p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="text-[10px] font-mono text-emerald-400">-{rec.riskReductionPct}% risk</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleApprove(rec.id)}
                  className="text-[11px] py-1 px-2.5"
                >
                  Approve
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};
