import React, { useState } from 'react';
import { ReplenishmentRecommendation } from '../types';
import {
  RotateCw,
  Sparkles,
  Plane,
  Ship,
  Truck,
  CheckCircle2,
  AlertOctagon,
  ArrowRight,
  TrendingDown,
  Layers,
  Sliders,
  Check,
  X,
  IndianRupee,
  ShieldCheck
} from 'lucide-react';

interface ReplenishmentViewProps {
  recommendations: ReplenishmentRecommendation[];
  onApproveRecommendation: (id: string) => void;
  onSimulateRecommendation?: (rec: ReplenishmentRecommendation) => void;
  preselectedSku?: string;
}

export const ReplenishmentView: React.FC<ReplenishmentViewProps> = ({
  recommendations,
  onApproveRecommendation,
  onSimulateRecommendation,
  preselectedSku
}) => {
  const [activeModalRec, setActiveModalRec] = useState<ReplenishmentRecommendation | null>(null);
  const [approvedIds, setApprovedIds] = useState<Set<string>>(new Set());

  const handleApprove = (id: string) => {
    setApprovedIds(prev => new Set(prev).add(id));
    onApproveRecommendation(id);
    setActiveModalRec(null);
  };

  const getTransportIcon = (mode: ReplenishmentRecommendation['transportMode']) => {
    switch (mode) {
      case 'Air Freight':
        return Plane;
      case 'Priority Sea':
        return Ship;
      case 'Dedicated Road':
      default:
        return Truck;
    }
  };

  return (
    <div id="ai-replenishment-page" className="space-y-6">
      {/* Header */}
      <div className="p-4 sm:p-5 rounded bg-[#0A0A0A] border border-[#1F1F1F] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <h2 className="text-xs sm:text-sm font-semibold text-white tracking-wide uppercase">
              INTELLIGENT REPLENISHMENT ENGINE
            </h2>
          </div>
          <p className="text-[11px] text-[#666666] mt-0.5 font-mono">
            Automated mitigation of predicted stockouts via multi-tier alternate suppliers, inter-facility reallocations, and expedited freight.
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="text-[#888888]">Total Potential Loss Protected:</span>
          <span className="text-green-500 font-bold px-2 py-0.5 rounded bg-[#141F14] border border-green-800/40">
            ₹54.2L
          </span>
        </div>
      </div>

      {/* Featured Primary AI Recommendation Card (MCU-X1 Showcase) */}
      {recommendations.length > 0 && (
        <div
          id="featured-replenishment-hero"
          className="p-5 sm:p-6 rounded bg-[#0A0A0A] border border-[#F27D26]/40 shadow-xl relative overflow-hidden"
        >
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
            {/* Left: SKU Problem & Urgency */}
            <div className="space-y-3 max-w-xl">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-[#221111] text-[#CC3333] border border-[#CC3333]/40 font-mono text-[10px] font-bold">
                  CRITICAL EXPEDITE
                </span>
                <span className="font-mono text-xs text-[#888888]">
                  Target SKU: <strong className="text-white font-bold">{recommendations[0].sku}</strong>
                </span>
              </div>

              <h3 className="text-base sm:text-lg font-semibold text-white">
                {recommendations[0].productName}
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-xs">
                <div className="p-2 rounded bg-[#0D0D0D] border border-[#1F1F1F]">
                  <span className="text-[#666666] block text-[10px]">CURRENT STOCK</span>
                  <span className="text-white font-bold">{recommendations[0].currentStock.toLocaleString()}</span>
                </div>
                <div className="p-2 rounded bg-[#0D0D0D] border border-[#1F1F1F]">
                  <span className="text-[#666666] block text-[10px]">DAILY DEMAND</span>
                  <span className="text-white font-bold">{recommendations[0].dailyDemand}/day</span>
                </div>
                <div className="p-2 rounded bg-[#0D0D0D] border border-[#1F1F1F]">
                  <span className="text-[#666666] block text-[10px]">PREDICTED LEAD TIME</span>
                  <span className="text-[#CC3333] font-bold">{recommendations[0].predictedLeadTimeDays} days</span>
                </div>
                <div className="p-2 rounded bg-[#0D0D0D] border border-[#1F1F1F]">
                  <span className="text-[#666666] block text-[10px]">EXPECTED STOCKOUT</span>
                  <span className="text-[#CC3333] font-bold">{recommendations[0].stockoutDays} days</span>
                </div>
              </div>

              <p className="text-xs text-[#D1D1D1] leading-relaxed font-sans pt-1">
                {recommendations[0].impactSummary}
              </p>
            </div>

            {/* Right: AI Mitigation Package & Action CTA */}
            <div className="p-4 sm:p-5 rounded bg-[#0E0E0E] border border-[#1F1F1F] lg:w-96 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between text-xs font-mono pb-2 border-b border-[#1F1F1F]">
                  <span className="text-[#F27D26] font-bold flex items-center gap-1.5 uppercase tracking-wider text-[10px]">
                    <Sparkles className="w-3.5 h-3.5 fill-current text-[#F27D26]" />
                    RECOMMENDED ACTION
                  </span>
                  <span className="text-green-500 font-bold">
                    Risk Drop: -{recommendations[0].riskReductionPct}%
                  </span>
                </div>

                <div className="space-y-2 mt-3 text-xs font-mono">
                  <div className="flex justify-between">
                    <span className="text-[#888888]">Order Quantity:</span>
                    <span className="text-white font-bold">{recommendations[0].orderUnits.toLocaleString()} units</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#888888]">Alternate Supplier:</span>
                    <span className="text-[#D1D1D1] font-bold">{recommendations[0].alternateSupplierName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#888888]">Transportation:</span>
                    <span className="text-white">{recommendations[0].transportMode}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#888888]">Expedite Surcharge:</span>
                    <span className="text-[#FF8800] font-bold">₹{recommendations[0].estimatedAdditionalCostInr.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between pt-1 border-t border-[#1F1F1F]">
                    <span className="text-[#888888]">Stockout Probability:</span>
                    <span className="text-[#CC3333] font-bold">
                      {recommendations[0].originalStockoutProb}% &rarr; <span className="text-green-500">{recommendations[0].revisedStockoutProb}%</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons: REVIEW, SIMULATE, APPROVE */}
              <div className="grid grid-cols-3 gap-2 font-mono text-xs">
                <button
                  onClick={() => setActiveModalRec(recommendations[0])}
                  className="py-2 rounded bg-[#141414] hover:bg-[#1F1F1F] text-[#888888] hover:text-white border border-[#1F1F1F] font-semibold cursor-pointer transition-colors"
                >
                  REVIEW
                </button>
                <button
                  onClick={() => onSimulateRecommendation && onSimulateRecommendation(recommendations[0])}
                  className="py-2 rounded bg-[#1A1A1A] hover:bg-[#222222] text-[#F27D26] border border-[#F27D26]/30 font-semibold cursor-pointer transition-colors"
                >
                  SIMULATE
                </button>
                <button
                  disabled={approvedIds.has(recommendations[0].id)}
                  onClick={() => handleApprove(recommendations[0].id)}
                  className={`py-2 rounded font-bold flex items-center justify-center gap-1 cursor-pointer transition-all shadow-md ${
                    approvedIds.has(recommendations[0].id)
                      ? 'bg-[#141F14] text-green-500 border border-green-800/40 cursor-default'
                      : 'bg-[#F27D26] hover:bg-[#FF8800] text-black font-bold uppercase tracking-wider'
                  }`}
                >
                  {approvedIds.has(recommendations[0].id) ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>APPROVED</span>
                    </>
                  ) : (
                    <span>APPROVE</span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Full Replenishment Queue */}
      <div className="space-y-3">
        <h3 className="text-xs font-mono font-bold text-[#888888] uppercase tracking-wider">
          ACTIVE MITIGATION QUEUE ({recommendations.length} RECOMMENDATIONS)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recommendations.map((rec) => {
            const isApproved = approvedIds.has(rec.id);
            const TransportIcon = getTransportIcon(rec.transportMode);

            return (
              <div
                key={rec.id}
                className={`p-4 rounded border transition-colors ${
                  isApproved
                    ? 'bg-[#0A0A0A] border-green-800/40'
                    : 'bg-[#0A0A0A] border-[#1F1F1F] hover:border-[#2A2A2A]'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-2 pb-2 border-b border-[#141414]">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-white">{rec.sku}</span>
                    <span className="text-xs text-[#888888] truncate max-w-[200px]">{rec.productName}</span>
                  </div>
                  <span
                    className={`font-mono text-[9px] px-2 py-0.5 rounded font-bold uppercase ${
                      isApproved
                        ? 'bg-[#141F14] text-green-500 border border-green-800/40'
                        : 'bg-[#1A1A1A] text-[#F27D26] border border-[#2A2A2A]'
                    }`}
                  >
                    {isApproved ? 'Executed' : 'Pending Review'}
                  </span>
                </div>

                <p className="text-xs text-[#D1D1D1] font-medium mb-3">
                  {rec.recommendedAction}
                </p>

                <div className="grid grid-cols-3 gap-2 p-2.5 rounded bg-[#0D0D0D] border border-[#141414] font-mono text-[10px] mb-3">
                  <div>
                    <span className="text-[#666666] block">Surcharge</span>
                    <span className="text-[#FF8800] font-bold">₹{rec.estimatedAdditionalCostInr.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-[#666666] block">Mode</span>
                    <span className="text-[#D1D1D1] flex items-center gap-1">
                      <TransportIcon className="w-3 h-3 text-[#F27D26]" />
                      {rec.transportMode}
                    </span>
                  </div>
                  <div>
                    <span className="text-[#666666] block">Risk Reduction</span>
                    <span className="text-green-500 font-bold">
                      {rec.originalStockoutProb}% &rarr; {rec.revisedStockoutProb}%
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 font-mono text-xs">
                  <button
                    onClick={() => setActiveModalRec(rec)}
                    className="px-2.5 py-1 rounded bg-[#141414] hover:bg-[#1A1A1A] text-[#888888] hover:text-white border border-[#1F1F1F] text-[11px] cursor-pointer transition-colors"
                  >
                    Details
                  </button>
                  <button
                    disabled={isApproved}
                    onClick={() => handleApprove(rec.id)}
                    className={`px-3 py-1 rounded text-[11px] font-bold cursor-pointer transition-colors ${
                      isApproved
                        ? 'bg-[#141F14] text-green-500 border border-green-800/40 cursor-default'
                        : 'bg-[#F27D26] hover:bg-[#FF8800] text-black font-bold uppercase tracking-wider'
                    }`}
                  >
                    {isApproved ? 'Approved' : 'Approve PO'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Review Modal */}
      {activeModalRec && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="max-w-md w-full bg-[#0A0A0A] border border-[#1F1F1F] rounded p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#1F1F1F]">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#F27D26] fill-current" />
                <h4 className="text-xs font-semibold text-white uppercase tracking-wider">
                  REVIEW REPLENISHMENT PLAN &bull; {activeModalRec.sku}
                </h4>
              </div>
              <button
                onClick={() => setActiveModalRec(null)}
                className="text-[#888888] hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 text-xs font-mono">
              <p className="text-[#D1D1D1] font-sans leading-relaxed">
                {activeModalRec.recommendedAction}
              </p>

              <div className="p-3 rounded bg-[#050505] border border-[#1F1F1F] space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-[#888888]">Order Quantity:</span>
                  <span className="text-white font-bold">{activeModalRec.orderUnits.toLocaleString()} units</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#888888]">Alternate Supplier:</span>
                  <span className="text-[#D1D1D1] font-bold">{activeModalRec.alternateSupplierName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#888888]">Carrier Route:</span>
                  <span className="text-white">{activeModalRec.transportMode} Direct Corridor</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#888888]">Total Mitigation Surcharge:</span>
                  <span className="text-[#FF8800] font-bold">₹{activeModalRec.estimatedAdditionalCostInr.toLocaleString()}</span>
                </div>
                <div className="flex justify-between pt-1 border-t border-[#1F1F1F]">
                  <span className="text-[#888888]">Stockout Risk Collapses:</span>
                  <span className="text-green-500 font-bold">
                    {activeModalRec.originalStockoutProb}% &rarr; {activeModalRec.revisedStockoutProb}%
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#1F1F1F] font-mono text-xs">
              <button
                onClick={() => setActiveModalRec(null)}
                className="px-3 py-1.5 rounded bg-[#141414] hover:bg-[#1A1A1A] text-[#888888] hover:text-white border border-[#1F1F1F] cursor-pointer transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleApprove(activeModalRec.id)}
                className="px-4 py-1.5 rounded bg-[#F27D26] hover:bg-[#FF8800] text-black font-bold uppercase tracking-wider cursor-pointer transition-colors shadow-md"
              >
                Confirm & Approve PO
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
