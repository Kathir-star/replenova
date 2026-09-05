import React from 'react';
import {
  TrendingUp,
  ShieldCheck,
  Zap,
  Clock,
  DollarSign,
  BarChart3,
  Award,
  ArrowUpRight,
  Sparkles,
  PieChart
} from 'lucide-react';

export const AnalyticsView: React.FC = () => {
  const valueMetrics = [
    {
      title: 'POTENTIAL LOSSES PREVENTED',
      value: '₹2.4Cr',
      subtitle: 'Across 23 prevented stockout incidents this quarter',
      change: '+18.4% vs last Q',
      positive: true
    },
    {
      title: 'FASTER DISRUPTION RESPONSE',
      value: '89%',
      subtitle: 'Average incident mitigation in 2.5h vs 22h manual',
      change: '14-day earlier detection',
      positive: true
    },
    {
      title: 'EMERGENCY FREIGHT SAVINGS',
      value: '31%',
      subtitle: 'Reduction in last-minute express air surcharges',
      change: '₹34.8L conserved',
      positive: true
    },
    {
      title: 'STOCKOUT AVOIDANCE RATE',
      value: '96.4%',
      subtitle: 'High-margin Tier 1 components continuously supplied',
      change: 'Target: >95%',
      positive: true
    }
  ];

  return (
    <div id="analytics-executive-page" className="space-y-6">
      {/* Header */}
      <div className="p-4 sm:p-5 rounded bg-[#0A0A0A] border border-[#1F1F1F] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-[#F27D26]" />
            <h2 className="text-xs sm:text-sm font-semibold text-white tracking-wide uppercase">
              EXECUTIVE INTELLIGENCE & ROI DASHBOARD
            </h2>
          </div>
          <p className="text-[11px] text-[#666666] mt-0.5 font-mono">
            Board-level supply chain resilience benchmarks, capital efficiency, and disruption prevention ROI.
          </p>
        </div>

        <span className="font-mono text-xs px-3 py-1 rounded bg-[#141F14] text-green-500 border border-green-800/40 flex items-center gap-1.5 self-start sm:self-auto">
          <Award className="w-3.5 h-3.5 text-green-500" />
          Enterprise Resilience Grade: A+
        </span>
      </div>

      {/* Value Creation Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {valueMetrics.map((item, idx) => (
          <div
            key={idx}
            className="p-4 sm:p-5 rounded bg-[#0A0A0A] border border-[#1F1F1F] flex flex-col justify-between"
          >
            <div>
              <span className="text-[10px] font-mono tracking-widest text-[#888888] uppercase font-semibold">
                {item.title}
              </span>
              <div className="mt-2 text-2xl sm:text-3xl font-bold font-mono text-white tracking-tight">
                {item.value}
              </div>
              <p className="text-xs text-[#888888] font-sans mt-1.5 leading-relaxed">
                {item.subtitle}
              </p>
            </div>

            <div className="mt-4 pt-2.5 border-t border-[#141414] flex items-center justify-between font-mono text-[11px]">
              <span className="text-green-500 font-bold">{item.change}</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-[#666666]" />
            </div>
          </div>
        ))}
      </div>

      {/* Comparative Visual Analytics Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Disruption Recovery Time: Traditional ERP vs REPLENOVA */}
        <div className="p-5 rounded bg-[#0A0A0A] border border-[#1F1F1F] space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#1F1F1F]">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#F27D26]" />
              <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                DISRUPTION RECOVERY TIMELINE BENCHMARK
              </h3>
            </div>
            <span className="text-[10px] font-mono text-[#F27D26]">Time-to-Mitigate</span>
          </div>

          <div className="space-y-4 font-mono text-xs pt-1">
            {/* Traditional Systems */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-[#888888]">
                <span>Traditional Static ERP (Reactive)</span>
                <span className="text-[#CC3333] font-bold">14.2 Days Avg</span>
              </div>
              <div className="w-full bg-[#050505] h-2.5 rounded overflow-hidden border border-[#1F1F1F]">
                <div className="bg-[#CC3333] h-full rounded w-[85%]" />
              </div>
              <span className="text-[10px] text-[#666666]">
                Disruption realized only when delivery fails to arrive at dock door.
              </span>
            </div>

            {/* REPLENOVA AI */}
            <div className="space-y-1.5 pt-2">
              <div className="flex justify-between text-[#D1D1D1]">
                <span className="text-white font-bold">REPLENOVA AI Control Tower</span>
                <span className="text-green-500 font-bold">2.4 Days Avg (83% Faster)</span>
              </div>
              <div className="w-full bg-[#050505] h-2.5 rounded overflow-hidden border border-[#1F1F1F]">
                <div className="bg-[#F27D26] h-full rounded w-[17%]" />
              </div>
              <span className="text-[10px] text-green-500">
                Disruption detected via satellite & port signal 14 days prior to threshold breach.
              </span>
            </div>
          </div>
        </div>

        {/* Capital Tied Up vs Protected Revenue */}
        <div className="p-5 rounded bg-[#0A0A0A] border border-[#1F1F1F] space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#1F1F1F]">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#F27D26] fill-current" />
              <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                CAPITAL OPTIMIZATION & REPLENISHMENT ACCURACY
              </h3>
            </div>
            <span className="text-[10px] font-mono text-green-500">94.8% Precision</span>
          </div>

          <div className="grid grid-cols-2 gap-3 font-mono text-xs">
            <div className="p-3.5 rounded bg-[#050505] border border-[#1F1F1F] space-y-1">
              <span className="text-[#666666] block text-[10px]">BUFFER CAPITAL CONSERVED</span>
              <span className="text-lg font-bold text-white">₹1.84Cr</span>
              <p className="text-[10px] text-[#888888] leading-relaxed pt-1">
                Dynamic safety stock prevents over-ordering obsolete components.
              </p>
            </div>

            <div className="p-3.5 rounded bg-[#050505] border border-[#1F1F1F] space-y-1">
              <span className="text-[#666666] block text-[10px]">LEAD-TIME VARIANCE REDUCTION</span>
              <span className="text-lg font-bold text-[#F27D26]">-4.6 Days</span>
              <p className="text-[10px] text-[#888888] leading-relaxed pt-1">
                Alternate corridors smooth shipping variances across monsoon cycles.
              </p>
            </div>
          </div>

          <div className="p-3 rounded bg-[#0D0D0D] border border-[#1F1F1F] text-[11px] font-mono text-[#D1D1D1] flex items-center justify-between">
            <span>Quarterly System ROI:</span>
            <span className="text-green-500 font-bold">11.4x Software Investment</span>
          </div>
        </div>
      </div>
    </div>
  );
};
