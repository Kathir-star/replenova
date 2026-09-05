import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Boxes,
  AlertTriangle,
  Sparkles,
  SlidersHorizontal,
  Bot
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const MobileNav: React.FC = () => {
  const { setCopilotOpen, copilotOpen } = useApp();

  const links = [
    { path: '/', label: 'Overview', icon: LayoutDashboard },
    { path: '/inventory', label: 'Inventory', icon: Boxes },
    { path: '/disruptions', label: 'Disruptions', icon: AlertTriangle },
    { path: '/replenishment', label: 'Replenish', icon: Sparkles },
    { path: '/simulator', label: 'Simulator', icon: SlidersHorizontal },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 h-16 bg-[#0D0D0D]/95 backdrop-blur-lg border-t border-[#1C1C1C] flex items-center justify-around px-2 z-40">
      {links.map((link) => {
        const Icon = link.icon;
        return (
          <NavLink
            key={link.path}
            to={link.path}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center gap-1 w-14 py-1 rounded-lg text-[10px] font-medium transition-colors ${
                isActive ? 'text-[#F27D26]' : 'text-[#777777] hover:text-[#CCCCCC]'
              }`
            }
          >
            <Icon className="w-4 h-4" />
            <span>{link.label}</span>
          </NavLink>
        );
      })}
      <button
        onClick={() => setCopilotOpen(!copilotOpen)}
        className={`flex flex-col items-center justify-center gap-1 w-14 py-1 rounded-lg text-[10px] font-medium ${
          copilotOpen ? 'text-[#F27D26]' : 'text-[#777777]'
        }`}
      >
        <Bot className="w-4 h-4" />
        <span>Copilot</span>
      </button>
    </nav>
  );
};
