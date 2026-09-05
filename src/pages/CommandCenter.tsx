import React from 'react';
import { useNavigate } from 'react-router-dom';
import { KPICards } from '../components/dashboard/KPICards';
import { SupplyChainMap } from '../components/map/SupplyChainMap';
import { ImpactChain } from '../components/dashboard/ImpactChain';
import { ActiveDisruptionFeed } from '../components/dashboard/ActiveDisruptionFeed';
import { InventoryRiskPanel } from '../components/dashboard/InventoryRiskPanel';
import { AIRecommendationPanel } from '../components/dashboard/AIRecommendationPanel';
import { Sparkles, Activity, ShieldAlert, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const CommandCenter: React.FC = () => {
  const navigate = useNavigate();
  const { kpis } = useApp();

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Top Banner Status Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 sm:p-4 rounded-xl bg-gradient-to-r from-[#141414] via-[#111111] to-[#161616] border border-[#242424] shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping shrink-0" />
          <div>
            <h1 className="text-sm sm:text-base font-bold text-white tracking-tight flex items-center gap-2">
              <span>SUPPLY CHAIN COMMAND CENTER</span>
              <span className="text-[10px] font-mono bg-red-500/20 text-red-400 px-2 py-0.5 rounded border border-red-500/30">
                ACTIVE DISRUPTION: CYCLONE MANDOUS
              </span>
            </h1>
            <p className="text-xs text-[#7A7A7A] mt-0.5">
              Predict Disruptions. Prevent Stockouts. Replenish Intelligently.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/simulator')}
            className="text-xs font-mono text-[#F27D26] hover:text-[#ff9d54] bg-[#F27D26]/10 hover:bg-[#F27D26]/20 px-3 py-1.5 rounded-lg border border-[#F27D26]/30 transition-colors flex items-center gap-1.5"
          >
            <span>Launch Simulation Sandbox</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 1. Global KPI Metrics Cards */}
      <KPICards />

      {/* 2. Global Interactive Disruption Map */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-[#F27D26]" />
            <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
              Live Geographic Threat Telemetry & Corridor Vector Map
            </h2>
          </div>
          <span className="text-[11px] font-mono text-[#666666]">
            MapLibre / Leaflet AIS Core • Updated 12s ago
          </span>
        </div>
        <SupplyChainMap height="h-[460px] lg:h-[520px]" />
      </div>

      {/* 3. Cascading Impact Chain Flow */}
      <ImpactChain />

      {/* 4. Two-Column Intelligence Grid: Active Disruptions & Multi-Echelon Inventory Risk */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <ActiveDisruptionFeed />
        <InventoryRiskPanel />
      </div>

      {/* 5. AI Multi-Echelon Replenishment Recommendation Hero Panel */}
      <AIRecommendationPanel onNavigateToSimulator={() => navigate('/simulator')} />
    </div>
  );
};
