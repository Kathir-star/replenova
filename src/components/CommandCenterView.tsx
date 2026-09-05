import React from 'react';
import { KPICard } from './KPICard';
import { DisruptionMap } from './DisruptionMap';
import { ImpactChainVisualizer } from './ImpactChainVisualizer';
import { SignalsFeed } from './SignalsFeed';
import {
  Supplier,
  Warehouse,
  PortHub,
  SupplyRoute,
  ExternalDisruptionEvent,
  Product,
  ImpactNode,
  ReplenishmentRecommendation
} from '../types';
import {
  Sparkles,
  ArrowRight,
  TrendingDown,
  AlertOctagon,
  CheckCircle2,
  Cpu,
  RotateCw
} from 'lucide-react';

interface CommandCenterViewProps {
  suppliers: Supplier[];
  warehouses: Warehouse[];
  ports: PortHub[];
  routes: SupplyRoute[];
  disruptions: ExternalDisruptionEvent[];
  products: Product[];
  impactChain: ImpactNode[];
  recommendations: ReplenishmentRecommendation[];
  onNavigateToTab: (tab: string) => void;
  onOpenCopilot: () => void;
  onSelectProductForReplenishment: (sku: string) => void;
}

export const CommandCenterView: React.FC<CommandCenterViewProps> = ({
  suppliers,
  warehouses,
  ports,
  routes,
  disruptions,
  products,
  impactChain,
  recommendations,
  onNavigateToTab,
  onOpenCopilot,
  onSelectProductForReplenishment
}) => {
  const criticalProducts = products.filter(p => p.stockoutProbability > 60);

  return (
    <div id="command-center-dashboard" className="space-y-6">
      {/* 4 Primary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          id="kpi-inventory-risk"
          title="INVENTORY RISK"
          value="18.7%"
          subtext="↑ 4.2% from yesterday"
          trend="ELEVATED"
          type="risk"
          onClick={() => onNavigateToTab('inventory')}
        />
        <KPICard
          id="kpi-active-disruptions"
          title="ACTIVE DISRUPTIONS"
          value="7"
          subtext="3 Critical severity"
          trend="HIGH ALERT"
          type="disruptions"
          onClick={() => onNavigateToTab('disruptions')}
        />
        <KPICard
          id="kpi-stockouts-prevented"
          title="STOCKOUTS PREVENTED"
          value="23"
          subtext="This quarter (96.4% success)"
          trend="+18% YoY"
          type="prevented"
          onClick={() => onNavigateToTab('analytics')}
        />
        <KPICard
          id="kpi-inventory-at-risk"
          title="INVENTORY AT RISK"
          value="₹42.8L"
          subtext="Across 37 automotive SKUs"
          trend="₹54.2L PROTECTED"
          type="exposure"
          onClick={() => onNavigateToTab('replenishment')}
        />
      </div>

      {/* Global Interactive Disruption Map */}
      <DisruptionMap
        suppliers={suppliers}
        warehouses={warehouses}
        ports={ports}
        routes={routes}
        disruptions={disruptions}
        onNavigateToTab={onNavigateToTab}
      />

      {/* AI Impact Engine: Real-time Cascade Propagation Visualizer */}
      <ImpactChainVisualizer
        chain={impactChain}
        onReviewMitigation={() => onNavigateToTab('replenishment')}
        onSimulateScenario={() => onNavigateToTab('simulation')}
      />

      {/* Two Column Grid: Signals Feed & High-Risk Critical SKUs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Signals Feed */}
        <SignalsFeed
          events={disruptions}
          onSelectEvent={() => onNavigateToTab('disruptions')}
        />

        {/* Right: Critical Inventory Watchlist */}
        <div className="p-4 sm:p-5 rounded bg-[#0A0A0A] border border-[#1F1F1F] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#1F1F1F]">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#CC3333] animate-pulse" />
                <h3 className="text-xs font-semibold text-white tracking-wide uppercase">
                  CRITICAL RUNWAY WATCHLIST ({criticalProducts.length} SKUs AT RISK)
                </h3>
              </div>
              <button
                onClick={() => onNavigateToTab('inventory')}
                className="text-[10px] font-mono text-[#F27D26] hover:text-[#FF8800] flex items-center gap-1 cursor-pointer font-medium"
              >
                <span>View All SKUs</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="space-y-2.5 mt-3">
              {criticalProducts.map((prod) => (
                <div
                  key={prod.id}
                  onClick={() => onSelectProductForReplenishment(prod.sku)}
                  className="p-3 rounded bg-[#0D0D0D] border border-[#1A1A1A] hover:bg-[#141414] hover:border-[#2A2A2A] transition-colors cursor-pointer flex items-center justify-between gap-3 group"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-white group-hover:text-[#F27D26] transition-colors">
                        {prod.sku}
                      </span>
                      <span className="text-xs text-[#D1D1D1] font-medium truncate max-w-[180px]">
                        {prod.name}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-[#666666] block">
                      Runway: <strong className="text-[#CC3333]">{prod.daysOfSupply}d supply</strong> &bull; Lead Time: {prod.normalLeadTimeDays}d &rarr; {prod.predictedLeadTimeDays}d
                    </span>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="font-mono text-xs font-bold text-[#CC3333] block">
                      {prod.stockoutProbability}% Prob
                    </span>
                    <span className="text-[9px] font-mono text-[#666666]">
                      ₹{(prod.revenueExposureInr / 100000).toFixed(1)}L At Risk
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick AI Mitigation Banner */}
          <div className="mt-4 pt-3 border-t border-[#1F1F1F] flex items-center justify-between bg-[#111111] p-3 rounded border border-[#2A2A2A] text-xs font-mono">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#F27D26]" />
              <span className="text-white font-sans text-xs">
                AI Replenishment Plan Ready for MCU-X1
              </span>
            </div>
            <button
              onClick={() => onNavigateToTab('replenishment')}
              className="px-3 py-1.5 rounded bg-[#F27D26] hover:bg-[#FF8800] text-black font-bold text-[10px] cursor-pointer uppercase tracking-wider transition-colors"
            >
              Review Plan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
