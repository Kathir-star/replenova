import React from 'react';
import {
  AlertTriangle,
  Boxes,
  ShieldCheck,
  TrendingDown,
  Clock,
  ArrowUpRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AnimatedCounter } from '../ui/AnimatedCounter';
import { formatInrCurrency } from '../../lib/calculations';

export const KPICards: React.FC = () => {
  const { kpis, inventory, disruptions } = useApp();

  const cards = [
    {
      id: 'kpi-inventory-risk',
      title: 'Global Inventory Risk',
      value: 18.7,
      decimals: 1,
      suffix: '%',
      subtitle: `${kpis.criticalSkusCount} critical SKUs breaching threshold`,
      trend: '+4.2% vs 7-day avg',
      trendType: 'negative',
      icon: Boxes,
      color: 'text-red-400',
      bgColor: 'bg-red-500/10 border-red-500/20',
    },
    {
      id: 'kpi-active-disruptions',
      title: 'Active Disruptions',
      value: kpis.activeDisruptionsCount,
      decimals: 0,
      suffix: ' Events',
      subtitle: 'Cyclone Mandous + 3 port queues',
      trend: '1 Cat-3 Storm Active',
      trendType: 'critical',
      icon: AlertTriangle,
      color: 'text-amber-400',
      bgColor: 'bg-amber-500/10 border-amber-500/20',
    },
    {
      id: 'kpi-stockouts-prevented',
      title: 'Stockouts Prevented',
      value: kpis.stockoutsPreventedCount,
      decimals: 0,
      suffix: '',
      subtitle: 'Via multi-echelon AI actions',
      trend: '99.4% On-time SLA Saved',
      trendType: 'positive',
      icon: ShieldCheck,
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-500/10 border-emerald-500/20',
    },
    {
      id: 'kpi-inventory-at-risk',
      title: 'Inventory Exposure at Risk',
      displayString: formatInrCurrency(kpis.inventoryAtRiskInr),
      subtitle: 'Downstream OEM assembly exposure',
      trend: '-₹45.6L after AI mitigation',
      trendType: 'positive',
      icon: TrendingDown,
      color: 'text-[#F27D26]',
      bgColor: 'bg-[#F27D26]/10 border-[#F27D26]/20',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.id}
            id={card.id}
            className="p-4 rounded-xl bg-[#111111] border border-[#222222] hover:border-[#333333] transition-all relative overflow-hidden group shadow-sm"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-[#888888] tracking-tight">{card.title}</span>
              <div className={`p-1.5 rounded-lg border ${card.bgColor} ${card.color}`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>

            <div className="mt-3 flex items-baseline gap-1.5">
              {card.displayString ? (
                <span className="text-2xl sm:text-3xl font-bold font-mono tracking-tight text-white">
                  {card.displayString}
                </span>
              ) : (
                <span className="text-2xl sm:text-3xl font-bold font-mono tracking-tight text-white">
                  <AnimatedCounter
                    value={card.value || 0}
                    decimals={card.decimals}
                    suffix={card.suffix}
                  />
                </span>
              )}
            </div>

            <div className="mt-2.5 pt-2.5 border-t border-[#1C1C1C] flex items-center justify-between text-[11px]">
              <span className="text-[#777777] truncate">{card.subtitle}</span>
              <span
                className={`font-mono text-[10px] font-semibold shrink-0 ${
                  card.trendType === 'positive'
                    ? 'text-emerald-400'
                    : card.trendType === 'negative' || card.trendType === 'critical'
                    ? 'text-amber-400'
                    : 'text-[#888888]'
                }`}
              >
                {card.trend}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
