import React, { useState } from 'react';
import {
  Search,
  Bell,
  Sliders,
  Play,
  RotateCcw,
  Sparkles,
  ChevronDown,
  X,
  Bot
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Button } from '../ui/Button';

export const TopNav: React.FC = () => {
  const {
    searchQuery,
    setSearchQuery,
    filterRiskLevel,
    setFilterRiskLevel,
    notifications,
    unreadCount,
    markNotificationsAsRead,
    demoTourActive,
    setDemoTourActive,
    setDemoTourStep,
    resetDemoData,
    copilotOpen,
    setCopilotOpen,
  } = useApp();

  const [showNotifications, setShowNotifications] = useState(false);

  const handleStartDemoTour = () => {
    setDemoTourStep(1);
    setDemoTourActive(true);
  };

  return (
    <header className="sticky top-0 z-20 h-16 bg-[#0A0A0A]/90 backdrop-blur-md border-b border-[#1C1C1C] px-4 sm:px-6 flex items-center justify-between gap-4">
      {/* Search Input */}
      <div className="flex-1 max-w-md relative">
        <Search className="w-4 h-4 text-[#666666] absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search SKU (e.g. MCU-X1), port, supplier, or disruption..."
          className="w-full bg-[#141414] text-xs text-white placeholder-[#555555] rounded-lg pl-9 pr-4 py-2 border border-[#242424] focus:outline-none focus:border-[#F27D26] focus:ring-1 focus:ring-[#F27D26] transition-all"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#666666] hover:text-white"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Action Controls */}
      <div className="flex items-center gap-2.5">
        {/* Risk Filter Selector */}
        <div className="hidden sm:flex items-center gap-1 bg-[#141414] border border-[#242424] rounded-lg p-1 text-xs">
          {['all', 'critical', 'elevated', 'watch', 'healthy'].map((lvl) => (
            <button
              key={lvl}
              onClick={() => setFilterRiskLevel(lvl)}
              className={`px-2 py-1 rounded text-[11px] font-mono capitalize transition-all ${
                filterRiskLevel === lvl
                  ? 'bg-[#262626] text-white font-medium shadow-xs'
                  : 'text-[#777777] hover:text-[#CCCCCC]'
              }`}
            >
              {lvl}
            </button>
          ))}
        </div>

        {/* Guided Story Walkthrough Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={handleStartDemoTour}
          icon={<Play className="w-3 h-3 text-[#F27D26] fill-[#F27D26]" />}
          className="hidden md:inline-flex text-xs border-[#F27D26]/40 hover:border-[#F27D26] text-[#E0E0E0]"
        >
          {demoTourActive ? 'Demo Active' : 'Guided Tour'}
        </Button>

        {/* Reset Demo Button */}
        <button
          onClick={resetDemoData}
          title="Reset Simulation Data"
          className="p-2 rounded-lg text-[#777777] hover:text-white hover:bg-[#181818] border border-transparent hover:border-[#282828] transition-all"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              if (!showNotifications) markNotificationsAsRead();
            }}
            className="p-2 rounded-lg text-[#888888] hover:text-white hover:bg-[#181818] border border-[#222222] transition-all relative"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full text-[9px] font-bold flex items-center justify-center animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-[#111111] border border-[#2A2A2A] rounded-xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="p-3.5 border-b border-[#222222] flex items-center justify-between bg-[#141414]">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-white">Live Disruption Feeds</span>
                  <span className="text-[10px] font-mono bg-red-500/20 text-red-400 px-1.5 py-0.5 rounded">
                    {notifications.length} alerts
                  </span>
                </div>
                <button
                  onClick={() => setShowNotifications(false)}
                  className="text-[#666666] hover:text-white text-xs"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-[#1C1C1C]">
                {notifications.map((n) => (
                  <div key={n.id} className="p-3.5 hover:bg-[#161616] transition-colors">
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded uppercase ${
                          n.level === 'critical'
                            ? 'bg-red-500/20 text-red-400'
                            : n.level === 'elevated'
                            ? 'bg-amber-500/20 text-amber-400'
                            : 'bg-emerald-500/20 text-emerald-400'
                        }`}
                      >
                        {n.level}
                      </span>
                      <span className="text-[10px] text-[#666666]">{n.timestamp}</span>
                    </div>
                    <p className="text-xs font-medium text-white mt-1.5">{n.title}</p>
                    <p className="text-[11px] text-[#999999] mt-0.5 leading-relaxed">{n.message}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* AI Copilot Toggle Button */}
        <Button
          variant={copilotOpen ? 'primary' : 'secondary'}
          size="sm"
          onClick={() => setCopilotOpen(!copilotOpen)}
          icon={<Bot className="w-3.5 h-3.5" />}
          className="text-xs"
        >
          Copilot
        </Button>
      </div>
    </header>
  );
};
