import React, { useEffect, useState } from 'react';
import { TrendingUp, AlertTriangle, ShieldCheck, DollarSign, ArrowUpRight } from 'lucide-react';

interface KPICardProps {
  id: string;
  title: string;
  value: string | number;
  subtext: string;
  trend?: string;
  trendDirection?: 'up' | 'down' | 'neutral';
  type: 'risk' | 'disruptions' | 'prevented' | 'exposure';
  onClick?: () => void;
}

export const KPICard: React.FC<KPICardProps> = ({
  id,
  title,
  value,
  subtext,
  trend,
  trendDirection = 'up',
  type,
  onClick
}) => {
  const getTheme = () => {
    switch (type) {
      case 'risk':
        return {
          trendColor: 'text-[#CC3333]',
          badgeBg: 'bg-[#221111] text-[#CC3333] border-[#CC3333]/30',
          dotColor: 'bg-[#CC3333]'
        };
      case 'disruptions':
        return {
          trendColor: 'text-[#FF8800]',
          badgeBg: 'bg-[#221A11] text-[#FF8800] border-[#FF8800]/30',
          dotColor: 'bg-[#FF8800]'
        };
      case 'prevented':
        return {
          trendColor: 'text-green-500',
          badgeBg: 'bg-[#141F14] text-green-500 border-green-800/30',
          dotColor: 'bg-green-500'
        };
      case 'exposure':
      default:
        return {
          trendColor: 'text-[#F27D26]',
          badgeBg: 'bg-[#F27D26]/10 text-[#F27D26] border-[#F27D26]/20',
          dotColor: 'bg-[#F27D26]'
        };
    }
  };

  const theme = getTheme();

  return (
    <div
      id={id}
      onClick={onClick}
      className="bg-[#0A0A0A] border border-[#1F1F1F] p-4 rounded hover:border-[#2A2A2A] transition-colors cursor-pointer group flex flex-col justify-between"
    >
      <div>
        <div className="flex items-center justify-between">
          <span className="text-[10px] uppercase tracking-wider text-[#666666] font-bold font-mono">
            {title}
          </span>
          <ArrowUpRight className="w-3.5 h-3.5 text-[#444444] group-hover:text-white transition-colors" />
        </div>

        <div className="text-2xl sm:text-3xl font-light text-white mt-2 tracking-tight">
          {value}
        </div>
      </div>

      <div className="flex items-center justify-between text-[10px] pt-3 mt-3 border-t border-[#141414] font-mono">
        <span className={`${theme.trendColor} font-medium truncate`}>
          {subtext}
        </span>
        {trend && (
          <span
            className={`px-1.5 py-0.5 rounded font-bold shrink-0 border ${theme.badgeBg}`}
          >
            {trend}
          </span>
        )}
      </div>
    </div>
  );
};
