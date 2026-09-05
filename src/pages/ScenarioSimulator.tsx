import React, { useState, useMemo } from 'react';
import {
  SlidersHorizontal,
  Play,
  RotateCcw,
  Sparkles,
  TrendingDown,
  AlertTriangle,
  ShieldCheck,
  Zap,
  ArrowRight,
  CheckCircle2
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  Line
} from 'recharts';
import { useApp } from '../context/AppContext';
import { Card, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { formatInrCurrency } from '../lib/calculations';
import { demoScenarios } from '../data/demoDisruptions';

export const ScenarioSimulator: React.FC = () => {
  const { executeEmergencyReallocation } = useApp();

  const [selectedScenarioId, setSelectedScenarioId] = useState<string>('sc-1');
  const [durationDays, setDurationDays] = useState<number>(14);
  const [demandSpikePct, setDemandSpikePct] = useState<number>(15);
  const [leadTimeDelayDays, setLeadTimeDelayDays] = useState<number>(7);
  const [simulationRun, setSimulationRun] = useState<boolean>(true);
  const [mitigationApplied, setMitigationApplied] = useState<boolean>(false);

  const activeScenario = useMemo(() => {
    return demoScenarios.find((s) => s.id === selectedScenarioId) || demoScenarios[0];
  }, [selectedScenarioId]);

  // Generate dynamic 30-day projection chart data
  const chartData = useMemo(() => {
    const data = [];
    const baseStock = 4200;
    const dailyDemand = 620 * (1 + demandSpikePct / 100);
    const safetyStockThreshold = 1860;

    let unmitigatedStock = baseStock;
    let mitigatedStock = baseStock;

    for (let day = 1; day <= 30; day++) {
      // Unmitigated consumption without replenishment arriving on time
      if (day <= leadTimeDelayDays + 6) {
        unmitigatedStock = Math.max(0, unmitigatedStock - dailyDemand);
      } else {
        // Late arrival
        unmitigatedStock = Math.max(0, unmitigatedStock - dailyDemand + 1500);
      }

      // Mitigated with REPLENOVA (Bengaluru transfer arriving day 2 + air cargo day 4)
      if (day === 2) {
        mitigatedStock += 1200; // Inter-warehouse transfer from Bengaluru
      }
      if (day === 5) {
        mitigatedStock += 2500; // Air express from alternate fab
      }
      mitigatedStock = Math.max(0, mitigatedStock - dailyDemand);

      data.push({
        day: `Day ${day}`,
        'Without REPLENOVA': Math.round(unmitigatedStock),
        'With REPLENOVA AI': Math.round(mitigatedStock),
        'Safety Buffer Threshold': safetyStockThreshold,
      });
    }

    return data;
  }, [demandSpikePct, leadTimeDelayDays]);

  // Compute calculated metrics
  const simMetrics = useMemo(() => {
    const lossMultiplier = (durationDays / 14) * (1 + demandSpikePct / 100);
    const unmitigatedLoss = Math.round(activeScenario.withoutReplenova.revenueAtRiskInr * lossMultiplier);
    const mitigatedLoss = Math.round(activeScenario.withReplenova.revenueAtRiskInr * (lossMultiplier * 0.4));
    const netSavings = unmitigatedLoss - mitigatedLoss;

    return {
      unmitigatedRisk: Math.min(99, Math.round(activeScenario.withoutReplenova.stockoutProbability * Math.sqrt(lossMultiplier))),
      unmitigatedLoss,
      mitigatedRisk: Math.round(activeScenario.withReplenova.stockoutProbability * Math.pow(lossMultiplier, 0.3)),
      mitigatedLoss,
      netSavings,
    };
  }, [activeScenario, durationDays, demandSpikePct]);

  const handleApplyMitigation = () => {
    executeEmergencyReallocation();
    setMitigationApplied(true);
  };

  return (
    <div className="space-y-5">
      {/* Page Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-[#1E1E1E]">
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <SlidersHorizontal className="w-5 h-5 text-[#F27D26]" />
            <span>Multi-Echelon Scenario Simulation Sandbox</span>
          </h1>
          <p className="text-xs text-[#808080] mt-0.5">
            Test "what-if" disruption parameters, forecast inventory buffer curves, and evaluate AI risk-mitigation strategies.
          </p>
        </div>
      </div>

      {/* Scenario Presets Selector */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {demoScenarios.map((sc) => {
          const isSelected = selectedScenarioId === sc.id;

          return (
            <button
              key={sc.id}
              onClick={() => {
                setSelectedScenarioId(sc.id);
                setDurationDays(sc.defaultDurationDays);
                setMitigationApplied(false);
              }}
              className={`p-3.5 rounded-xl text-left border transition-all ${
                isSelected
                  ? 'bg-[#181818] border-[#F27D26] ring-1 ring-[#F27D26]/40 shadow-lg'
                  : 'bg-[#111111] border-[#222222] hover:border-[#383838] hover:bg-[#141414]'
              }`}
            >
              <span className="text-[9px] font-mono uppercase font-bold text-[#F27D26] bg-[#F27D26]/10 px-2 py-0.5 rounded border border-[#F27D26]/20">
                PRESET SCENARIO
              </span>
              <h3 className="text-xs font-bold text-white mt-2 leading-tight">{sc.name}</h3>
              <p className="text-[11px] text-[#7A7A7A] mt-1 line-clamp-2 leading-relaxed">
                {sc.description}
              </p>
            </button>
          );
        })}
      </div>

      {/* Interactive Simulation Controls */}
      <Card className="p-4 sm:p-5 border-[#222222] bg-[#0E0E0E]">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#1E1E1E]">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
            <span>Simulation Parameters</span>
          </h2>
          <span className="text-xs font-mono text-[#777777]">
            Deterministic Multi-Echelon Simulation Engine
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
          {/* Slider 1: Disruption Duration */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#A0A0A0]">Disruption Duration</span>
              <span className="font-mono font-bold text-[#F27D26]">{durationDays} Days</span>
            </div>
            <input
              type="range"
              min="3"
              max="45"
              value={durationDays}
              onChange={(e) => setDurationDays(Number(e.target.value))}
              className="w-full h-1.5 bg-[#222222] rounded-lg appearance-none cursor-pointer accent-[#F27D26]"
            />
            <div className="flex justify-between text-[10px] font-mono text-[#555555]">
              <span>3 Days</span>
              <span>45 Days</span>
            </div>
          </div>

          {/* Slider 2: Demand Spike Factor */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#A0A0A0]">Surge Demand Spike</span>
              <span className="font-mono font-bold text-[#F27D26]">+{demandSpikePct}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={demandSpikePct}
              onChange={(e) => setDemandSpikePct(Number(e.target.value))}
              className="w-full h-1.5 bg-[#222222] rounded-lg appearance-none cursor-pointer accent-[#F27D26]"
            />
            <div className="flex justify-between text-[10px] font-mono text-[#555555]">
              <span>Baseline (0%)</span>
              <span>Doubled (+100%)</span>
            </div>
          </div>

          {/* Slider 3: Port / Lead Time Delay */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#A0A0A0]">Upstream Lead Time Deficit</span>
              <span className="font-mono font-bold text-[#F27D26]">+{leadTimeDelayDays} Days</span>
            </div>
            <input
              type="range"
              min="0"
              max="21"
              value={leadTimeDelayDays}
              onChange={(e) => setLeadTimeDelayDays(Number(e.target.value))}
              className="w-full h-1.5 bg-[#222222] rounded-lg appearance-none cursor-pointer accent-[#F27D26]"
            />
            <div className="flex justify-between text-[10px] font-mono text-[#555555]">
              <span>No Delay</span>
              <span>+21 Days</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Side-by-Side Impact Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {/* WITHOUT REPLENOVA */}
        <Card className="p-4 sm:p-5 border-red-500/30 bg-[#140E0E]">
          <div className="flex items-center justify-between pb-3 border-b border-[#2A1818]">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-red-400 font-mono">
                WITHOUT REPLENOVA (REACTIVE)
              </h3>
            </div>
            <span className="text-xs font-mono font-bold text-red-400 bg-red-500/15 px-2 py-0.5 rounded">
              High Disruption Risk
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 my-4">
            <div className="p-3 rounded-lg bg-[#0A0707] border border-red-500/20">
              <span className="text-[10.5px] text-[#888888] uppercase font-mono">Stockout Probability</span>
              <p className="text-2xl font-bold font-mono text-red-400 mt-1">
                {simMetrics.unmitigatedRisk}%
              </p>
            </div>
            <div className="p-3 rounded-lg bg-[#0A0707] border border-red-500/20">
              <span className="text-[10.5px] text-[#888888] uppercase font-mono">Days to Stockout Cliff</span>
              <p className="text-2xl font-bold font-mono text-red-400 mt-1">
                6.2 Days
              </p>
            </div>
            <div className="p-3 rounded-lg bg-[#0A0707] border border-red-500/20">
              <span className="text-[10.5px] text-[#888888] uppercase font-mono">Projected Assembly Loss</span>
              <p className="text-xl font-bold font-mono text-white mt-1">
                {formatInrCurrency(simMetrics.unmitigatedLoss)}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-[#0A0707] border border-red-500/20">
              <span className="text-[10.5px] text-[#888888] uppercase font-mono">Factory Line Stoppage</span>
              <p className="text-xl font-bold font-mono text-red-400 mt-1">
                4.5 Days Down
              </p>
            </div>
          </div>

          <p className="text-xs text-[#999999] leading-relaxed">
            Without proactive multi-echelon reallocation, safety stock is fully consumed by Day 6, causing assembly shutdown penalties and unfulfilled customer SLAs.
          </p>
        </Card>

        {/* WITH REPLENOVA */}
        <Card className="p-4 sm:p-5 border-emerald-500/30 bg-[#0E1511]">
          <div className="flex items-center justify-between pb-3 border-b border-[#182A20]">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 font-mono">
                WITH REPLENOVA AI MITIGATION
              </h3>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/15 px-2 py-0.5 rounded">
              Resilient Corridor
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 my-4">
            <div className="p-3 rounded-lg bg-[#070A08] border border-emerald-500/20">
              <span className="text-[10.5px] text-[#888888] uppercase font-mono">Stockout Probability</span>
              <p className="text-2xl font-bold font-mono text-emerald-400 mt-1">
                {simMetrics.mitigatedRisk}%
              </p>
            </div>
            <div className="p-3 rounded-lg bg-[#070A08] border border-emerald-500/20">
              <span className="text-[10.5px] text-[#888888] uppercase font-mono">Days to Stockout Cliff</span>
              <p className="text-2xl font-bold font-mono text-emerald-400 mt-1">
                18+ Days
              </p>
            </div>
            <div className="p-3 rounded-lg bg-[#070A08] border border-emerald-500/20">
              <span className="text-[10.5px] text-[#888888] uppercase font-mono">Net Value Preserved</span>
              <p className="text-xl font-bold font-mono text-emerald-400 mt-1">
                {formatInrCurrency(simMetrics.netSavings)}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-[#070A08] border border-emerald-500/20">
              <span className="text-[10.5px] text-[#888888] uppercase font-mono">Factory Line Stoppage</span>
              <p className="text-xl font-bold font-mono text-emerald-400 mt-1">
                0 Hours (Zero)
              </p>
            </div>
          </div>

          <p className="text-xs text-[#A0A0A0] leading-relaxed">
            Multi-echelon reallocation transfers 1,200 units from Bengaluru and expedites 2,500 units via air express, maintaining safe assembly stock throughout the disruption.
          </p>
        </Card>
      </div>

      {/* Dynamic Recharts Chart: 30-Day Inventory Trajectory */}
      <Card className="p-4 sm:p-5 border-[#222222] bg-[#0E0E0E]">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#1E1E1E]">
          <div>
            <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
              30-Day Inventory Trajectory & Buffer Depletion Curve (SKU: MCU-X1)
            </h2>
            <p className="text-xs text-[#7A7A7A] mt-0.5">
              Simulated comparison showing stock level against safety threshold over 30 days
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant={mitigationApplied ? 'secondary' : 'primary'}
              size="sm"
              onClick={handleApplyMitigation}
              disabled={mitigationApplied}
              icon={mitigationApplied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Sparkles className="w-3.5 h-3.5" />}
              className="text-xs"
            >
              {mitigationApplied ? 'Mitigation Applied to ERP' : 'Execute AI Mitigation Strategy'}
            </Button>
          </div>
        </div>

        <div className="h-72 w-full mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorUnmitigated" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#EF4444" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#EF4444" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="colorMitigated" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#222222" />
              <XAxis dataKey="day" stroke="#666666" fontSize={11} tickLine={false} />
              <YAxis stroke="#666666" fontSize={11} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#111111',
                  borderColor: '#333333',
                  borderRadius: '8px',
                  fontSize: '12px',
                  color: '#FFFFFF',
                }}
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              <Area
                type="monotone"
                dataKey="Without REPLENOVA"
                stroke="#EF4444"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorUnmitigated)"
              />
              <Area
                type="monotone"
                dataKey="With REPLENOVA AI"
                stroke="#10B981"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#colorMitigated)"
              />
              <Line
                type="monotone"
                dataKey="Safety Buffer Threshold"
                stroke="#F59E0B"
                strokeDasharray="5 5"
                strokeWidth={1.5}
                dot={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
};
