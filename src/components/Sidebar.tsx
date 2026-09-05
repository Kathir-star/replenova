import React from 'react';
import { Logo } from './Logo';
import {
  LayoutDashboard,
  Package,
  AlertOctagon,
  Network,
  RotateCw,
  Zap,
  Sliders,
  BarChart3,
  Settings,
  Cpu,
  ShieldCheck,
  Menu,
  X
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
  isOpenMobile: boolean;
  onToggleMobile: () => void;
  criticalDisruptionsCount: number;
  criticalSkusCount: number;
  pendingActionsCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  isOpenMobile,
  onToggleMobile,
  criticalDisruptionsCount,
  criticalSkusCount,
  pendingActionsCount
}) => {
  const navItems = [
    {
      id: 'command',
      label: 'Command Center',
      icon: LayoutDashboard,
      badge: null
    },
    {
      id: 'inventory',
      label: 'Inventory',
      icon: Package,
      badge: criticalSkusCount > 0 ? `${criticalSkusCount}` : null,
      badgeColor: 'bg-[#CC3333] text-white'
    },
    {
      id: 'disruptions',
      label: 'Disruptions',
      icon: AlertOctagon,
      badge: criticalDisruptionsCount > 0 ? `${criticalDisruptionsCount}` : null,
      badgeColor: 'bg-[#CC3333] text-white'
    },
    {
      id: 'network',
      label: 'Supply Network',
      icon: Network,
      badge: 'Twin',
      badgeColor: 'bg-[#1A1A1A] text-[#888888] border border-[#2A2A2A]'
    },
    {
      id: 'replenishment',
      label: 'Replenishment',
      icon: RotateCw,
      badge: 'AI Engine',
      badgeColor: 'bg-[#1A1A1A] text-[#F27D26] border border-[#F27D26]/30'
    },
    {
      id: 'actions',
      label: 'AI Actions',
      icon: Zap,
      badge: pendingActionsCount > 0 ? `${pendingActionsCount}` : null,
      badgeColor: 'bg-[#FF8800] text-black font-bold'
    },
    {
      id: 'simulation',
      label: 'Scenario Simulator',
      icon: Sliders,
      badge: 'What-If',
      badgeColor: 'bg-[#1A1A1A] text-[#888888] border border-[#2A2A2A]'
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: BarChart3,
      badge: null
    }
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={onToggleMobile}
        />
      )}

      {/* Main Sidebar Container */}
      <aside
        id="replenova-sidebar"
        className={`fixed lg:sticky top-0 left-0 h-screen w-60 lg:w-64 bg-[#0A0A0A] border-r border-[#1F1F1F] flex flex-col justify-between z-50 transition-transform duration-300 ease-in-out ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 px-4 flex items-center justify-between border-b border-[#1F1F1F]">
          <Logo size="md" showText={true} />
          <button
            onClick={onToggleMobile}
            className="lg:hidden text-[#888888] hover:text-white p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          <div className="text-[9px] font-mono text-[#666666] uppercase tracking-widest px-3 mb-2 font-semibold">
            CONTROL TOWER NAVIGATION
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                id={`sidebar-link-${item.id}`}
                onClick={() => {
                  onSelectTab(item.id);
                  if (isOpenMobile) onToggleMobile();
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded text-xs font-medium transition-colors cursor-pointer group ${
                  isActive
                    ? 'bg-[#1A1A1A] border border-[#2A2A2A] text-white'
                    : 'text-[#888888] hover:text-white hover:bg-[#141414] border border-transparent'
                }`}
              >
                <div className="flex items-center gap-3">
                  {isActive ? (
                    <div className="w-1.5 h-1.5 rounded-full bg-[#F27D26] shrink-0"></div>
                  ) : (
                    <Icon className="w-4 h-4 text-[#888888] group-hover:text-white shrink-0 transition-colors" />
                  )}
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span
                    className={`font-mono text-[10px] px-1.5 py-0.5 rounded tracking-tight ${
                      item.badgeColor || 'bg-[#1A1A1A] text-[#888888]'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          <div className="pt-3 mt-3 border-t border-[#1F1F1F]">
            <button
              id="sidebar-link-settings"
              onClick={() => {
                onSelectTab('settings');
                if (isOpenMobile) onToggleMobile();
              }}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded text-xs font-medium transition-colors cursor-pointer ${
                activeTab === 'settings'
                  ? 'bg-[#1A1A1A] border border-[#2A2A2A] text-white'
                  : 'text-[#888888] hover:text-white hover:bg-[#141414] border border-transparent'
              }`}
            >
              {activeTab === 'settings' ? (
                <div className="w-1.5 h-1.5 rounded-full bg-[#F27D26] shrink-0"></div>
              ) : (
                <Settings className="w-4 h-4 text-[#888888]" />
              )}
              <span>Settings</span>
            </button>
          </div>
        </div>

        {/* Bottom AI Engine Status Panel */}
        <div className="p-3 border-t border-[#1F1F1F] bg-[#0A0A0A]">
          <div className="bg-[#0F140F] border border-[#1A261A] p-3 rounded flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shrink-0"></div>
            <div className="flex flex-col text-left">
              <div className="text-[10px] font-bold text-green-500 tracking-wider font-mono">
                AI ENGINE LIVE
              </div>
              <div className="text-[8px] text-green-600 font-mono tracking-tight">
                SCANNING SIGNALS &bull; GEMINI 3.8
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
