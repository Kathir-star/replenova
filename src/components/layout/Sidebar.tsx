import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Boxes,
  AlertTriangle,
  Globe2,
  Sparkles,
  Zap,
  SlidersHorizontal,
  BarChart3,
  Settings,
  ShieldCheck,
  Bot
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

const NAV_ITEMS = [
  { path: '/', label: 'Command Center', icon: LayoutDashboard, badge: 'LIVE' },
  { path: '/inventory', label: 'Inventory & Risk', icon: Boxes, badgeCountKey: 'criticalSkusCount' },
  { path: '/disruptions', label: 'Disruptions', icon: AlertTriangle, badgeCountKey: 'activeDisruptionsCount' },
  { path: '/network', label: 'Supply Network', icon: Globe2 },
  { path: '/replenishment', label: 'AI Replenishment', icon: Sparkles },
  { path: '/ai-actions', label: 'Autonomous Actions', icon: Zap },
  { path: '/simulator', label: 'Scenario Simulator', icon: SlidersHorizontal },
  { path: '/analytics', label: 'Analytics', icon: BarChart3 },
  { path: '/settings', label: 'Settings', icon: Settings },
];

export const Sidebar: React.FC = () => {
  const { kpis, setCopilotOpen, copilotOpen } = useApp();
  const location = useLocation();

  return (
    <aside className="hidden lg:flex flex-col w-64 h-screen sticky top-0 bg-[#0A0A0A] border-r border-[#1C1C1C] select-none shrink-0 z-30">
      {/* Brand Header */}
      <div className="p-5 border-b border-[#1C1C1C] flex items-center justify-between">
        <NavLink to="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-lg bg-[#141414] border border-[#F27D26]/50 flex items-center justify-center p-1.5 shadow-sm shadow-[#F27D26]/10 group-hover:border-[#F27D26] transition-colors">
            <svg viewBox="0 0 32 32" fill="none" className="w-full h-full">
              <path d="M7 16L16 7L25 16L16 25L7 16Z" stroke="#F27D26" strokeWidth="2.5" strokeLinejoin="round" />
              <circle cx="16" cy="16" r="3.5" fill="#F27D26" />
              <path d="M16 7V12M16 20V25M7 16H12M20 16H25" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-sans font-extrabold text-base tracking-wider text-white">REPLENOVA</span>
              <span className="text-[9px] font-mono font-bold bg-[#F27D26]/20 text-[#F27D26] px-1 rounded">PRO</span>
            </div>
            <p className="text-[10px] font-mono text-[#737373] tracking-tight">SUPPLY CHAIN INTELLIGENCE</p>
          </div>
        </NavLink>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1 scrollbar-thin">
        <div className="px-3 pb-2 text-[10px] font-mono uppercase tracking-widest text-[#525252]">Control Modules</div>
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          const badgeCount = item.badgeCountKey ? (kpis as any)[item.badgeCountKey] : null;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all group ${
                isActive
                  ? 'bg-[#181818] text-white border border-[#2D2D2D] shadow-sm'
                  : 'text-[#8A8A8A] hover:bg-[#121212] hover:text-[#D4D4D4]'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={`w-4 h-4 transition-colors ${
                    isActive ? 'text-[#F27D26]' : 'text-[#666666] group-hover:text-[#A3A3A3]'
                  }`}
                />
                <span className="tracking-tight">{item.label}</span>
              </div>

              {item.badge && (
                <span className="text-[9px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                  {item.badge}
                </span>
              )}

              {badgeCount !== null && badgeCount > 0 && (
                <span className="text-[10px] font-mono font-semibold px-1.5 py-0.2 rounded-full bg-red-500/15 text-red-400 border border-red-500/25">
                  {badgeCount}
                </span>
              )}
            </NavLink>
          );
        })}
      </div>

      {/* Copilot Trigger / Status Bottom Footer */}
      <div className="p-3 border-t border-[#1C1C1C] space-y-2">
        <button
          onClick={() => setCopilotOpen(!copilotOpen)}
          className={`w-full flex items-center justify-between p-2.5 rounded-lg border text-xs transition-all ${
            copilotOpen
              ? 'bg-[#F27D26]/10 border-[#F27D26]/40 text-white'
              : 'bg-[#121212] border-[#222222] text-[#A0A0A0] hover:bg-[#1A1A1A] hover:text-white'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-full bg-[#F27D26]/20 flex items-center justify-center text-[#F27D26]">
              <Bot className="w-3.5 h-3.5" />
            </div>
            <div className="text-left">
              <p className="text-xs font-semibold text-white leading-tight">AI Copilot</p>
              <p className="text-[10px] text-[#707070]">Active Monitoring</p>
            </div>
          </div>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        </button>

        <div className="p-2.5 rounded-lg bg-[#0F0F0F] border border-[#1C1C1C] text-[11px] text-[#7A7A7A] flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span className="font-mono">AIS AIS-284 LIVE</span>
          </div>
          <span className="text-[10px] font-mono text-[#555555]">LATENCY 18ms</span>
        </div>
      </div>
    </aside>
  );
};
