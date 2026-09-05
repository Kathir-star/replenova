import React, { useState } from 'react';
import { SimulationScenarioPreset } from '../types';
import {
  Sliders,
  Play,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  AlertOctagon,
  ArrowRight,
  TrendingDown,
  TrendingUp,
  IndianRupee,
  Layers,
  CheckCircle2
} from 'lucide-react';

interface ScenarioSimulatorViewProps {
  scenarios: SimulationScenarioPreset[];
  onApplyMitigationPlan?: (scenario: SimulationScenarioPreset) => void;
}

export const ScenarioSimulatorView: React.FC<ScenarioSimulatorViewProps> = ({
  scenarios,
  onApplyMitigationPlan
}) => {
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>(scenarios[0].id);
  const [durationDays, setDurationDays] = useState<number>(scenarios[0].defaultDurationDays);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [hasRun, setHasRun] = useState<boolean>(true);

  const activeScenario = scenarios.find(s => s.id === selectedScenarioId) || scenarios[0];

  const handleSelectPreset = (scenario: SimulationScenarioPreset) => {
    setSelectedScenarioId(scenario.id);
    setDurationDays(scenario.defaultDurationDays);
    setHasRun(true);
  };

  const runSimulation = () => {
    setIsSimulating(true);
    setTimeout(() => {
      setIsSimulating(false);
      setHasRun(true);
    }, 600);
  };

  // Dynamically scale parameters based on duration slider
  const scale = durationDays / activeScenario.defaultDurationDays;
  const currentWithout = {
    shipments: Math.round(activeScenario.withoutReplenova.affectedShipments * Math.min(1.6, Math.max(0.6, scale))),
    skus: Math.round(activeScenario.withoutReplenova.affectedSkus * Math.min(1.5, Math.max(0.7, scale))),
    stockouts: Math.round(activeScenario.withoutReplenova.potentialStockouts * Math.min(1.8, Math.max(0.5, scale))),
    revenueAtRiskInr: Math.round(activeScenario.withoutReplenova.revenueAtRiskInr * Math.min(1.7, Math.max(0.6, scale))),
    stockoutProb: Math.min(98, Math.round(activeScenario.withoutReplenova.stockoutProbability * Math.min(1.3, Math.max(0.7, scale))))
  };

  const currentWith = {
    prob: Math.max(8, Math.round(activeScenario.withReplenova.stockoutProbability * Math.min(1.4, Math.max(0.8, scale)))),
    revenueAtRiskInr: Math.round(activeScenario.withReplenova.revenueAtRiskInr * Math.min(1.5, Math.max(0.7, scale))),
    lossAvoidedInr: Math.max(1000000, currentWithout.revenueAtRiskInr - Math.round(activeScenario.withReplenova.revenueAtRiskInr * 0.9))
  };

  return (
    <div id="what-if-scenario-simulator" className="space-y-6">
      {/* Header */}
      <div className="p-4 sm:p-5 rounded bg-[#0A0A0A] border border-[#1F1F1F] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-[#F27D26]" />
            <h2 className="text-xs sm:text-sm font-semibold text-white tracking-wide uppercase">
              SCENARIO WHAT-IF SIMULATOR
            </h2>
          </div>
          <p className="text-[11px] text-[#666666] mt-0.5 font-mono">
            Model real-world macroeconomic and logistics shocks before they breach warehouse inventory thresholds.
          </p>
        </div>

        <button
          onClick={runSimulation}
          disabled={isSimulating}
          className="px-3.5 py-1.5 rounded bg-[#F27D26] hover:bg-[#FF8800] text-black font-mono text-xs font-bold cursor-pointer uppercase tracking-wider flex items-center gap-2 transition-colors"
        >
          {isSimulating ? (
            <>
              <span className="w-3 h-3 rounded-full border-2 border-black border-t-transparent animate-spin" />
              <span>Simulating...</span>
            </>
          ) : (
            <>
              <Play className="w-3 h-3 fill-current text-black" />
              <span>RUN SIMULATION</span>
            </>
          )}
        </button>
      </div>

      {/* Preset Scenario Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {scenarios.map((sc) => {
          const isSelected = sc.id === selectedScenarioId;

          return (
            <div
              key={sc.id}
              onClick={() => handleSelectPreset(sc)}
              className={`p-3.5 rounded border transition-colors cursor-pointer select-none ${
                isSelected
                  ? 'bg-[#141414] border-[#F27D26]/70 shadow-md'
                  : 'bg-[#0A0A0A] border-[#1F1F1F] hover:border-[#2A2A2A]'
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded bg-[#141414] text-[#888888] border border-[#1F1F1F]">
                  {sc.category}
                </span>
                <span className="text-[10px] font-mono text-[#F27D26]">
                  {sc.defaultDurationDays} Days
                </span>
              </div>
              <h4 className="text-xs font-bold text-white font-sans line-clamp-2">
                {sc.title}
              </h4>
            </div>
          );
        })}
      </div>

      {/* Interactive Controls Bar */}
      <div className="p-4 rounded bg-[#0A0A0A] border border-[#1F1F1F] flex flex-col md:flex-row md:items-center justify-between gap-4 font-mono text-xs">
        <div className="flex-1 max-w-lg space-y-1.5">
          <div className="flex justify-between text-[#D1D1D1]">
            <span>Disruption Duration Parameter:</span>
            <span className="text-[#F27D26] font-bold">{durationDays} Days</span>
          </div>
          <input
            type="range"
            min={2}
            max={21}
            value={durationDays}
            onChange={(e) => setDurationDays(Number(e.target.value))}
            className="w-full accent-[#F27D26] bg-[#141414] h-1.5 rounded cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-[#666666]">
            <span>2 Days (Minor Delay)</span>
            <span>7 Days (Severe Monsoon)</span>
            <span>21 Days (Catastrophic)</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-[10px] text-[#666666] block">SELECTED BASELINE</span>
            <span className="text-[#D1D1D1] font-bold">{activeScenario.title}</span>
          </div>
        </div>
      </div>

      {/* Main Comparison: WITHOUT vs WITH REPLENOVA */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* WITHOUT INTERVENTION */}
        <div className="p-5 sm:p-6 rounded bg-[#0A0A0A] border border-[#CC3333]/30 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#CC3333]/20">
            <div className="flex items-center gap-2">
              <AlertOctagon className="w-4 h-4 text-[#CC3333]" />
              <h3 className="text-xs sm:text-sm font-semibold text-[#CC3333] tracking-wide uppercase">
                WITHOUT INTERVENTION (STATIC ERP)
              </h3>
            </div>
            <span className="text-[10px] font-mono text-[#CC3333] bg-[#221111] px-2 py-0.5 rounded border border-[#CC3333]/40">
              High Disruption Exposure
            </span>
          </div>

          <div className="space-y-2.5 font-mono text-xs">
            <div className="flex justify-between p-2.5 rounded bg-[#050505] border border-[#1F1F1F]">
              <span className="text-[#888888]">Affected Shipments:</span>
              <span className="text-[#CC3333] font-bold">{currentWithout.shipments} Shipments</span>
            </div>
            <div className="flex justify-between p-2.5 rounded bg-[#050505] border border-[#1F1F1F]">
              <span className="text-[#888888]">Affected SKUs in Network:</span>
              <span className="text-[#CC3333] font-bold">{currentWithout.skus} Products</span>
            </div>
            <div className="flex justify-between p-2.5 rounded bg-[#050505] border border-[#1F1F1F]">
              <span className="text-[#888888]">Potential Assembly Line Stockouts:</span>
              <span className="text-[#CC3333] font-bold">{currentWithout.stockouts} Line Halts</span>
            </div>
            <div className="flex justify-between p-2.5 rounded bg-[#050505] border border-[#1F1F1F]">
              <span className="text-[#888888]">Total Revenue at Risk:</span>
              <span className="text-[#CC3333] font-bold text-sm">
                ₹{(currentWithout.revenueAtRiskInr / 100000).toFixed(1)}L
              </span>
            </div>
            <div className="flex justify-between p-2.5 rounded bg-[#050505] border border-[#1F1F1F]">
              <span className="text-[#888888]">Stockout Probability:</span>
              <span className="text-[#CC3333] font-bold text-sm">
                {currentWithout.stockoutProb}%
              </span>
            </div>
          </div>
        </div>

        {/* WITH REPLENOVA */}
        <div className="p-5 sm:p-6 rounded bg-[#0A0A0A] border border-green-800/40 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-green-800/30">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-green-500" />
              <h3 className="text-xs sm:text-sm font-semibold text-green-500 tracking-wide uppercase">
                WITH REPLENOVA PREDICTIVE ENGINE
              </h3>
            </div>
            <span className="text-[10px] font-mono text-green-500 bg-[#141F14] px-2 py-0.5 rounded border border-green-800/40">
              Autonomous Mitigation
            </span>
          </div>

          <div className="space-y-2.5 font-mono text-xs">
            <div className="flex justify-between p-2.5 rounded bg-[#050505] border border-[#1F1F1F]">
              <span className="text-[#888888]">Alternative Supplier:</span>
              <span className="text-[#D1D1D1] font-bold truncate max-w-[200px]">
                {activeScenario.withReplenova.alternativeSupplier}
              </span>
            </div>
            <div className="flex justify-between p-2.5 rounded bg-[#050505] border border-[#1F1F1F]">
              <span className="text-[#888888]">Inventory Reallocation:</span>
              <span className="text-green-500 font-bold">
                {activeScenario.withReplenova.inventoryReallocationUnits.toLocaleString()} units
              </span>
            </div>
            <div className="flex justify-between p-2.5 rounded bg-[#050505] border border-[#1F1F1F]">
              <span className="text-[#888888]">Expedited Air Shipment:</span>
              <span className="text-green-500 font-bold">
                {activeScenario.withReplenova.expeditedShipmentUnits.toLocaleString()} units
              </span>
            </div>
            <div className="flex justify-between p-2.5 rounded bg-[#050505] border border-[#1F1F1F]">
              <span className="text-[#888888]">Residual Revenue at Risk:</span>
              <span className="text-white font-bold text-sm">
                ₹{(currentWith.revenueAtRiskInr / 100000).toFixed(1)}L
              </span>
            </div>
            <div className="flex justify-between p-2.5 rounded bg-[#050505] border border-[#1F1F1F]">
              <span className="text-[#888888]">Stockout Probability Collapses:</span>
              <span className="text-green-500 font-bold text-sm">
                {currentWithout.stockoutProb}% &rarr; {currentWith.prob}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Potential Loss Avoided Hero Banner */}
      <div
        id="potential-loss-avoided-banner"
        className="p-5 sm:p-6 rounded bg-[#0A0A0A] border border-green-800/40 flex flex-col sm:flex-row items-center justify-between gap-4"
      >
        <div className="space-y-1 text-center sm:text-left">
          <span className="text-[11px] font-mono tracking-widest uppercase text-green-500 font-bold block">
            AI MITIGATION VALUE CREATION
          </span>
          <h3 className="text-xl sm:text-2xl font-bold font-mono text-white flex items-center justify-center sm:justify-start gap-2">
            <span>POTENTIAL LOSS AVOIDED:</span>
            <span className="text-green-500 font-bold">
              ₹{(currentWith.lossAvoidedInr / 100000).toFixed(1)}L
            </span>
          </h3>
          <p className="text-xs text-[#888888] font-mono">
            REPLENOVA doesn't wait for the stockout. It acts before it happens.
          </p>
        </div>

        {onApplyMitigationPlan && (
          <button
            onClick={() => onApplyMitigationPlan(activeScenario)}
            className="px-4 py-2 rounded bg-green-500 hover:bg-green-400 text-black font-mono text-xs font-bold cursor-pointer uppercase tracking-wider whitespace-nowrap transition-colors"
          >
            Deploy This Mitigation Plan
          </button>
        )}
      </div>
    </div>
  );
};
