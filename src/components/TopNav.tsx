import React, { useState } from 'react';
import {
  Search,
  Bell,
  Sparkles,
  Play,
  CheckCircle,
  AlertTriangle,
  Flame,
  Radio,
  X,
  ExternalLink
} from 'lucide-react';
import { NotificationItem } from '../types';

interface TopNavProps {
  notifications: NotificationItem[];
  onSelectTab: (tab: string) => void;
  onStartDemo: () => void;
  onSimulateDisruption: () => void;
  isSimulatedDisruptionActive: boolean;
  onSearchSelect: (query: string) => void;
}

export const TopNav: React.FC<TopNavProps> = ({
  notifications,
  onSelectTab,
  onStartDemo,
  onSimulateDisruption,
  isSimulatedDisruptionActive,
  onSearchSelect
}) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearchSelect(searchQuery);
      setIsSearchOpen(false);
    }
  };

  const sampleSearchHits = [
    { label: 'MCU-X1 — Automotive 32-Bit Microcontroller', tab: 'inventory', tag: 'SKU' },
    { label: 'Chennai Port — Congestion & Cyclone Delays', tab: 'disruptions', tag: 'PORT' },
    { label: 'Bharat Dynamics — Alternate Domestic Supplier', tab: 'replenishment', tag: 'SUPPLIER' },
    { label: 'Simulation: Chennai Port 7-Day Closure', tab: 'simulation', tag: 'SCENARIO' }
  ];

  return (
    <header
      id="replenova-top-nav"
      className="h-16 border-b border-[#1F1F1F] bg-[#050505]/90 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30"
    >
      {/* Search Input */}
      <div className="relative flex-1 max-w-md">
        <form onSubmit={handleSearchSubmit} className="relative">
          <Search className="w-4 h-4 text-[#888888] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            id="global-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsSearchOpen(true)}
            placeholder="Search corridors, SKUs, ports, or disruptions... (e.g. MCU-X1)"
            className="w-full bg-[#0A0A0A] border border-[#1F1F1F] rounded pl-9 pr-8 py-1.5 text-xs text-white placeholder-[#666666] focus:outline-none focus:border-[#2A2A2A] transition-colors font-mono"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#666666] hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </form>

        {/* Quick Search Dropdown */}
        {isSearchOpen && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsSearchOpen(false)}
            />
            <div className="absolute left-0 right-0 top-11 bg-[#0A0A0A] border border-[#2A2A2A] rounded shadow-2xl p-2 z-50 backdrop-blur-xl">
              <div className="text-[9px] font-mono text-[#666666] uppercase tracking-wider px-2 py-1 font-semibold">
                Suggested Entities & Corridors
              </div>
              <div className="space-y-1 mt-1">
                {sampleSearchHits.map((hit, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      onSelectTab(hit.tab);
                      onSearchSelect(hit.label.split(' — ')[0]);
                      setIsSearchOpen(false);
                    }}
                    className="w-full flex items-center justify-between text-left px-2.5 py-1.5 rounded hover:bg-[#1A1A1A] text-xs text-[#D1D1D1] hover:text-white transition-colors cursor-pointer group"
                  >
                    <span>{hit.label}</span>
                    <span className="font-mono text-[9px] px-1.5 py-0.5 rounded bg-[#1A1A1A] text-[#888888] group-hover:text-[#F27D26]">
                      {hit.tag}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Right Actions & Status */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Interactive Guided Demo Button */}
        <button
          id="btn-interactive-demo"
          onClick={onStartDemo}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-bold bg-[#F27D26] hover:bg-[#FF8800] text-black shadow-md cursor-pointer transition-colors uppercase tracking-wider"
          title="Run complete 11-step end-to-end demonstration"
        >
          <Play className="w-3.5 h-3.5 fill-current text-black" />
          <span className="hidden sm:inline">DEMO STORY</span>
          <span className="px-1.5 py-0.2 text-[9px] font-mono bg-black/20 rounded text-black font-bold">11 STEPS</span>
        </button>

        {/* Real-time Disruption Simulation Trigger */}
        <button
          id="btn-simulate-disruption"
          onClick={onSimulateDisruption}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-mono border transition-colors cursor-pointer ${
            isSimulatedDisruptionActive
              ? 'bg-[#221111] border-[#CC3333] text-[#CC3333] animate-pulse'
              : 'bg-[#1A1A1A] border-[#2A2A2A] text-[#D1D1D1] hover:border-[#444444]'
          }`}
          title="Trigger or reset live Cyclone & Port disruption signal"
        >
          <Flame className={`w-3.5 h-3.5 ${isSimulatedDisruptionActive ? 'text-[#CC3333]' : 'text-[#FF8800]'}`} />
          <span className="hidden md:inline">
            {isSimulatedDisruptionActive ? 'DISRUPTION SIMULATED' : 'SIMULATE EVENT'}
          </span>
        </button>

        {/* AI Engine Status Pill */}
        <div
          id="ai-engine-status-pill"
          className="hidden lg:flex items-center gap-2 px-2.5 py-1 rounded bg-[#0A0A0A] border border-[#1F1F1F] text-[10px] font-mono text-[#888888] select-none"
        >
          <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
          <span>CONTROL TOWER</span>
          <span className="text-green-500 font-bold">LIVE</span>
        </div>

        {/* Notifications Bell & Dropdown */}
        <div className="relative">
          <button
            id="notifications-bell-btn"
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            className="relative p-2 rounded bg-[#0A0A0A] border border-[#1F1F1F] text-[#888888] hover:text-white hover:border-[#2A2A2A] transition-colors cursor-pointer"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#CC3333] text-white font-mono text-[9px] font-bold rounded-full flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          {isNotifOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setIsNotifOpen(false)}
              />
              <div
                id="notifications-dropdown-panel"
                className="absolute right-0 top-12 w-80 sm:w-96 bg-[#0A0A0A] border border-[#2A2A2A] rounded shadow-2xl p-3 z-50 backdrop-blur-xl"
              >
                <div className="flex items-center justify-between pb-2 border-b border-[#1F1F1F]">
                  <div className="flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-[#FF8800]" />
                    <span className="text-xs font-semibold text-white">Supply Chain Alerts</span>
                  </div>
                  <span className="text-[10px] font-mono text-[#F27D26] font-bold">{notifications.length} Active</span>
                </div>

                <div className="space-y-2 mt-2 max-h-80 overflow-y-auto pr-1">
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => {
                        onSelectTab(n.linkTab);
                        setIsNotifOpen(false);
                      }}
                      className="p-2.5 rounded bg-[#111111] hover:bg-[#1A1A1A] border border-[#1F1F1F] cursor-pointer transition-colors"
                    >
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span
                          className={`text-[9px] font-mono uppercase px-1.5 py-0.5 rounded font-bold ${
                            n.level === 'critical'
                              ? 'bg-[#221111] text-[#CC3333] border border-[#CC3333]/40'
                              : n.level === 'elevated'
                              ? 'bg-[#221A11] text-[#FF8800] border border-[#FF8800]/40'
                              : 'bg-[#141F14] text-green-500 border border-green-800/40'
                          }`}
                        >
                          {n.level}
                        </span>
                        <span className="text-[10px] font-mono text-[#666666]">{n.timestamp}</span>
                      </div>
                      <h4 className="text-xs font-medium text-white line-clamp-1">{n.title}</h4>
                      <p className="text-[11px] text-[#888888] mt-0.5 line-clamp-2 leading-relaxed">{n.message}</p>
                    </div>
                  ))}
                </div>

                <div className="pt-2 mt-2 border-t border-[#1F1F1F] text-center">
                  <button
                    onClick={() => {
                      onSelectTab('disruptions');
                      setIsNotifOpen(false);
                    }}
                    className="text-[11px] font-mono text-[#F27D26] hover:text-[#FF8800] flex items-center justify-center gap-1 w-full font-medium"
                  >
                    <span>View all external disruption signals</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* User Profile Badge */}
        <div className="flex items-center gap-2.5 pl-2 sm:pl-3 border-l border-[#1F1F1F]">
          <div className="w-8 h-8 rounded bg-[#1F1F1F] border border-[#2A2A2A] flex items-center justify-center text-xs font-mono text-white font-bold">
            SC
          </div>
          <div className="hidden xl:flex flex-col text-left leading-none">
            <span className="text-xs font-medium text-white">Director of SC</span>
            <span className="text-[9px] font-mono text-[#666666] mt-0.5">Enterprise Ops</span>
          </div>
        </div>
      </div>
    </header>
  );
};
