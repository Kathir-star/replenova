import React, { useState } from 'react';
import {
  Settings,
  Cpu,
  ShieldCheck,
  RotateCcw,
  Sliders,
  DollarSign,
  Bell,
  Database,
  Check
} from 'lucide-react';

interface SettingsViewProps {
  onResetData: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ onResetData }) => {
  const [pollingRate, setPollingRate] = useState('5s');
  const [currency, setCurrency] = useState('INR');
  const [autoApproveLimit, setAutoApproveLimit] = useState('25000');
  const [savedMessage, setSavedMessage] = useState(false);

  const handleSave = () => {
    setSavedMessage(true);
    setTimeout(() => setSavedMessage(false), 2000);
  };

  return (
    <div id="replenova-settings-page" className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="p-4 sm:p-5 rounded bg-[#0A0A0A] border border-[#1F1F1F] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Settings className="w-4 h-4 text-[#F27D26]" />
            <h2 className="text-xs sm:text-sm font-semibold text-white tracking-wide uppercase">
              SYSTEM CONFIGURATION & ENTERPRISE CONTROLS
            </h2>
          </div>
          <p className="text-[11px] text-[#666666] mt-0.5 font-mono">
            Engine thresholds, autonomous mitigation parameters, and intelligence connections.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="px-3.5 py-1.5 rounded bg-[#F27D26] hover:bg-[#FF8800] text-black font-mono text-xs font-bold cursor-pointer transition-colors flex items-center gap-1.5 self-start sm:self-auto uppercase tracking-wider"
        >
          {savedMessage ? <Check className="w-3.5 h-3.5" /> : null}
          <span>{savedMessage ? 'Saved' : 'Save Changes'}</span>
        </button>
      </div>

      {/* AI Engine Status Card */}
      <div className="p-5 rounded bg-[#0A0A0A] border border-[#1F1F1F] space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#1F1F1F]">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-[#F27D26]" />
            <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
              GEMINI HYBRID AI ENGINE ARCHITECTURE
            </h3>
          </div>
          <span className="text-[10px] font-mono text-green-500 bg-[#141F14] px-2 py-0.5 rounded border border-green-800/40">
            Active &bull; Server-Side
          </span>
        </div>

        <div className="space-y-2 text-xs font-mono">
          <div className="flex justify-between p-2.5 rounded bg-[#050505] border border-[#1F1F1F]">
            <span className="text-[#888888]">Model Deployment:</span>
            <span className="text-white font-bold">Gemini 3.8 Flash (Structured Outputs)</span>
          </div>
          <div className="flex justify-between p-2.5 rounded bg-[#050505] border border-[#1F1F1F]">
            <span className="text-[#888888]">Security Architecture:</span>
            <span className="text-green-500 font-bold">Zero Client API Key Leakage (Server Proxy)</span>
          </div>
          <div className="flex justify-between p-2.5 rounded bg-[#050505] border border-[#1F1F1F]">
            <span className="text-[#888888]">Deterministic Fallback Engine:</span>
            <span className="text-[#F27D26] font-bold">Active (100% Offline/Air-Gapped Resilient)</span>
          </div>
        </div>
      </div>

      {/* Autonomous Mitigation Limits */}
      <div className="p-5 rounded bg-[#0A0A0A] border border-[#1F1F1F] space-y-4">
        <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider pb-2 border-b border-[#1F1F1F]">
          AUTONOMOUS DISRUPTION PROTOCOL LIMITS
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs">
          <div className="space-y-1.5">
            <label className="text-[#888888] block text-[11px]">Real-Time Telemetry Polling Rate</label>
            <select
              value={pollingRate}
              onChange={(e) => setPollingRate(e.target.value)}
              className="w-full bg-[#050505] border border-[#1F1F1F] rounded p-2 text-white focus:outline-none focus:border-[#F27D26]"
            >
              <option value="5s">5 Seconds (Real-Time Control Tower)</option>
              <option value="15s">15 Seconds (Standard Operations)</option>
              <option value="60s">60 Seconds (Bandwidth Conservative)</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-[#888888] block text-[11px]">Auto-Approval Surcharge Cap (INR)</label>
            <input
              type="number"
              value={autoApproveLimit}
              onChange={(e) => setAutoApproveLimit(e.target.value)}
              className="w-full bg-[#050505] border border-[#1F1F1F] rounded p-2 text-white focus:outline-none focus:border-[#F27D26]"
              placeholder="e.g. 25000"
            />
            <span className="text-[10px] text-[#666666] block">
              Emergency expedited orders below this amount skip manual board sign-off.
            </span>
          </div>
        </div>
      </div>

      {/* Reset State / Demo Seeder */}
      <div className="p-5 rounded bg-[#0A0A0A] border border-[#1F1F1F] flex items-center justify-between">
        <div>
          <h4 className="text-xs font-bold text-white font-sans">Reset Enterprise Simulation State</h4>
          <p className="text-[11px] text-[#666666] font-mono mt-0.5">
            Restores baseline inventory levels, clears simulated scenario shocks, and resets pending action approvals.
          </p>
        </div>

        <button
          onClick={onResetData}
          className="px-3.5 py-1.5 rounded bg-[#141414] hover:bg-[#1A1A1A] text-[#CC3333] border border-[#CC3333]/40 font-mono text-xs cursor-pointer flex items-center gap-1.5 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Demo Data</span>
        </button>
      </div>
    </div>
  );
};
