import React, { useState } from 'react';
import {
  Sparkles,
  CheckCircle2,
  SlidersHorizontal,
  Download,
  Plane,
  Truck,
  Train,
  Check,
  RotateCcw,
  ArrowRight,
  TrendingDown,
  Clock,
  ShieldCheck
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Card, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { formatInrCurrency } from '../lib/calculations';
import { useNavigate } from 'react-router-dom';

export const Replenishment: React.FC = () => {
  const { recommendations, approveRecommendation, simulateRecommendation, setSelectedSku } = useApp();
  const navigate = useNavigate();
  const [successBanner, setSuccessBanner] = useState<string | null>(null);

  const handleApprove = (id: string, sku: string) => {
    approveRecommendation(id);
    setSuccessBanner(`Replenishment directive for ${sku} approved and dispatched to ERP integration pipeline.`);
    setTimeout(() => setSuccessBanner(null), 5000);
  };

  const getTransportIcon = (mode: string) => {
    switch (mode) {
      case 'Air Freight':
        return <Plane className="w-4 h-4 text-blue-400" />;
      case 'Rail Express':
        return <Train className="w-4 h-4 text-purple-400" />;
      default:
        return <Truck className="w-4 h-4 text-emerald-400" />;
    }
  };

  return (
    <div className="space-y-5">
      {/* Page Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-[#1E1E1E]">
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#F27D26]" />
            <span>Autonomous AI Replenishment Engine</span>
          </h1>
          <p className="text-xs text-[#808080] mt-0.5">
            Optimized multi-echelon inventory transfer orders, alternate supplier dispatch, and lead time buffer reallocation.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/ai-actions')}
            className="text-xs"
          >
            Audit Log
          </Button>
        </div>
      </div>

      {/* Success Banner */}
      {successBanner && (
        <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-xs text-emerald-300 flex items-center justify-between gap-3 animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{successBanner}</span>
          </div>
          <button onClick={() => setSuccessBanner(null)} className="text-emerald-400 hover:text-white">
            ✕
          </button>
        </div>
      )}

      {/* Summary KPI Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-3.5 rounded-xl bg-[#111111] border border-[#222222]">
          <span className="text-xs text-[#808080]">Pending Mitigation Orders</span>
          <p className="text-xl font-bold font-mono text-white mt-1">
            {recommendations.filter((r) => r.status === 'pending').length} Actions
          </p>
        </div>
        <div className="p-3.5 rounded-xl bg-[#111111] border border-[#222222]">
          <span className="text-xs text-[#808080]">Total Risk Mitigation Yield</span>
          <p className="text-xl font-bold font-mono text-emerald-400 mt-1">
            -84% Stockout Hazard
          </p>
        </div>
        <div className="p-3.5 rounded-xl bg-[#111111] border border-[#222222]">
          <span className="text-xs text-[#808080]">Projected Assembly Loss Avoided</span>
          <p className="text-xl font-bold font-mono text-white mt-1">
            ₹78.4 Lakhs
          </p>
        </div>
      </div>

      {/* Recommended Orders List */}
      <div className="space-y-4">
        {recommendations.map((rec) => {
          const isApproved = rec.status === 'approved';

          return (
            <Card
              key={rec.id}
              className={`p-4 sm:p-5 transition-all ${
                isApproved
                  ? 'bg-emerald-950/10 border-emerald-500/30'
                  : 'bg-[#111111] border-[#242424] hover:border-[#383838]'
              }`}
            >
              {/* Header */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#1E1E1E]">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-[#181818] border border-[#282828] text-white">
                    {getTransportIcon(rec.transportMode)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-white font-mono">{rec.sku}</h3>
                      <span className="text-xs text-[#888888]">{rec.productName}</span>
                      <span
                        className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded uppercase ${
                          isApproved
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : 'bg-[#F27D26]/20 text-[#F27D26] border border-[#F27D26]/30'
                        }`}
                      >
                        {isApproved ? 'Approved & Dispatched' : 'AI Recommendation'}
                      </span>
                    </div>
                    <p className="text-xs text-[#777777] mt-0.5">
                      Transport via {rec.transportMode} • Target: Chennai Central Depot
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-mono font-bold text-emerald-400">
                    -{rec.riskReductionPct}% Risk Reduction
                  </span>
                  <span className="text-[10px] text-[#777777] block font-mono">
                    {rec.originalStockoutProb}% → {rec.revisedStockoutProb}%
                  </span>
                </div>
              </div>

              {/* Action Directive Content */}
              <div className="my-3.5 p-3 rounded-lg bg-[#0C0C0C] border border-[#1E1E1E] text-xs leading-relaxed text-[#D1D1D1]">
                <p className="font-semibold text-white mb-1">Execution Directive:</p>
                <p>{rec.recommendedAction}</p>
                <p className="text-[11px] text-[#888888] mt-1.5">{rec.impactSummary}</p>
              </div>

              {/* Data Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 my-3 text-[11px] font-mono">
                <div className="p-2 rounded bg-[#0A0A0A] border border-[#1C1C1C]">
                  <span className="text-[#666666] block text-[10px]">Order Quantity</span>
                  <span className="text-white font-bold">{rec.orderUnits.toLocaleString()} units</span>
                </div>
                <div className="p-2 rounded bg-[#0A0A0A] border border-[#1C1C1C]">
                  <span className="text-[#666666] block text-[10px]">Expedited Cost</span>
                  <span className="text-white font-bold">{formatInrCurrency(rec.estimatedAdditionalCostInr)}</span>
                </div>
                <div className="p-2 rounded bg-[#0A0A0A] border border-[#1C1C1C]">
                  <span className="text-[#666666] block text-[10px]">Alternate Sourcing</span>
                  <span className="text-white font-bold truncate block">{rec.alternateSupplierName || 'Regional Hub'}</span>
                </div>
                <div className="p-2 rounded bg-[#0A0A0A] border border-[#1C1C1C]">
                  <span className="text-[#666666] block text-[10px]">Stockout Horizon</span>
                  <span className="text-red-400 font-bold">{rec.stockoutDays} Days remaining</span>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="mt-3.5 pt-3 border-t border-[#1E1E1E] flex flex-wrap items-center justify-between gap-3">
                <span className="text-[10px] font-mono text-[#666666]">
                  Action ID: {rec.id}
                </span>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedSku(rec.sku);
                      navigate('/simulator');
                    }}
                    icon={<SlidersHorizontal className="w-3 h-3" />}
                    className="text-xs py-1 px-3"
                  >
                    Simulate
                  </Button>

                  <Button
                    variant={isApproved ? 'secondary' : 'primary'}
                    size="sm"
                    onClick={() => handleApprove(rec.id, rec.sku)}
                    disabled={isApproved}
                    icon={isApproved ? <Check className="w-3 h-3 text-emerald-400" /> : <CheckCircle2 className="w-3 h-3" />}
                    className="text-xs py-1 px-3"
                  >
                    {isApproved ? 'Approved' : 'Approve Directive'}
                  </Button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
