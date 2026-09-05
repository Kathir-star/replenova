import React, { useState } from 'react';
import {
  Settings as SettingsIcon,
  Shield,
  Key,
  Database,
  RotateCcw,
  Check,
  CheckCircle2,
  Sliders,
  SlidersHorizontal,
  BellRing
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Card, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

export const Settings: React.FC = () => {
  const { resetDemoData } = useApp();
  const [saved, setSaved] = useState(false);
  const [autoApproveLimit, setAutoApproveLimit] = useState(500000);
  const [riskTriggerPct, setRiskTriggerPct] = useState(75);
  const [aiSupervisionLevel, setAiSupervisionLevel] = useState('supervised');

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-5 max-w-4xl">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-[#1E1E1E]">
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <SettingsIcon className="w-5 h-5 text-[#F27D26]" />
            <span>Platform Configuration & Autonomous Guardrails</span>
          </h1>
          <p className="text-xs text-[#808080] mt-0.5">
            Configure telemetry data feeds, autonomous replenishment thresholds, and ERP integration parameters.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={handleSave}
          icon={saved ? <Check className="w-3.5 h-3.5" /> : null}
          className="text-xs"
        >
          {saved ? 'Saved Configuration' : 'Save Changes'}
        </Button>
      </div>

      {/* Autonomous Guardrails */}
      <Card className="p-4 sm:p-5 border-[#222222] bg-[#111111]">
        <div className="flex items-center gap-2 pb-3 border-b border-[#1E1E1E]">
          <Shield className="w-4 h-4 text-[#F27D26]" />
          <h2 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
            Autonomous Replenishment Guardrails & Approval Limits
          </h2>
        </div>

        <div className="space-y-4 mt-4 text-xs">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-white font-medium">Automatic Emergency Order Value Cap</span>
              <span className="font-mono font-bold text-[#F27D26]">₹{autoApproveLimit.toLocaleString()}</span>
            </div>
            <p className="text-[11px] text-[#7A7A7A] mb-2">
              Directives exceeding this financial threshold will mandate human supply chain manager sign-off.
            </p>
            <input
              type="range"
              min="100000"
              max="2000000"
              step="50000"
              value={autoApproveLimit}
              onChange={(e) => setAutoApproveLimit(Number(e.target.value))}
              className="w-full h-1.5 bg-[#222222] rounded-lg appearance-none cursor-pointer accent-[#F27D26]"
            />
          </div>

          <div className="pt-3 border-t border-[#1C1C1C]">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-white font-medium">Stockout Probability Trigger Threshold</span>
              <span className="font-mono font-bold text-red-400">{riskTriggerPct}% Risk</span>
            </div>
            <p className="text-[11px] text-[#7A7A7A] mb-2">
              Minimum projected stockout probability required to initiate automated multi-echelon transfer suggestions.
            </p>
            <input
              type="range"
              min="40"
              max="95"
              step="5"
              value={riskTriggerPct}
              onChange={(e) => setRiskTriggerPct(Number(e.target.value))}
              className="w-full h-1.5 bg-[#222222] rounded-lg appearance-none cursor-pointer accent-[#F27D26]"
            />
          </div>
        </div>
      </Card>

      {/* Connected Integrations & Telemetry */}
      <Card className="p-4 sm:p-5 border-[#222222] bg-[#111111]">
        <div className="flex items-center gap-2 pb-3 border-b border-[#1E1E1E]">
          <Database className="w-4 h-4 text-blue-400" />
          <h2 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
            Connected Telemetry & External Data Connectors
          </h2>
        </div>

        <div className="divide-y divide-[#1C1C1C] mt-2 text-xs">
          <div className="py-3 flex items-center justify-between">
            <div>
              <p className="font-semibold text-white">OpenWeather Severe Weather Feeds</p>
              <p className="text-[11px] text-[#777777]">Cyclone & storm isobar monitoring (Bay of Bengal, Arabian Sea, SCS)</p>
            </div>
            <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              CONNECTED
            </span>
          </div>

          <div className="py-3 flex items-center justify-between">
            <div>
              <p className="font-semibold text-white">MarineTraffic AIS Maritime Vessel Telemetry</p>
              <p className="text-[11px] text-[#777777]">Live GPS tracking for container vessels and port berthing queues</p>
            </div>
            <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              CONNECTED
            </span>
          </div>

          <div className="py-3 flex items-center justify-between">
            <div>
              <p className="font-semibold text-white">SAP / Oracle ERP & WMS Connectors</p>
              <p className="text-[11px] text-[#777777]">Multi-echelon inventory synchronization and purchase order generation</p>
            </div>
            <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              SYNCHRONIZED
            </span>
          </div>
        </div>
      </Card>

      {/* Reset Simulation State */}
      <Card className="p-4 sm:p-5 border-[#2E2222] bg-[#140F0F]">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xs font-bold text-red-400 uppercase font-mono">
              Reset Demo Scenario & Simulation State
            </h2>
            <p className="text-[11px] text-[#888888] mt-0.5">
              Restore baseline Cyclone Mandous data, SKU MCU-X1 87% stockout cliff, and pending AI recommendations.
            </p>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={resetDemoData}
            icon={<RotateCcw className="w-3.5 h-3.5 text-red-400" />}
            className="text-xs border-red-500/30 hover:border-red-500 text-red-300"
          >
            Reset All
          </Button>
        </div>
      </Card>
    </div>
  );
};
