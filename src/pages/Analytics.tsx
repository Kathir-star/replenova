import React from 'react';
import {
  BarChart3,
  TrendingUp,
  ShieldCheck,
  Clock,
  Boxes,
  Download,
  Calendar
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { Card, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

const OTIF_DATA = [
  { month: 'Jan', 'Actual OTIF': 89.2, 'Target SLA': 95.0, 'AI Mitigated': 96.4 },
  { month: 'Feb', 'Actual OTIF': 88.5, 'Target SLA': 95.0, 'AI Mitigated': 95.8 },
  { month: 'Mar', 'Actual OTIF': 86.1, 'Target SLA': 95.0, 'AI Mitigated': 96.1 },
  { month: 'Apr', 'Actual OTIF': 83.4, 'Target SLA': 95.0, 'AI Mitigated': 94.9 },
  { month: 'May', 'Actual OTIF': 87.8, 'Target SLA': 95.0, 'AI Mitigated': 97.2 },
  { month: 'Jun', 'Actual OTIF': 81.2, 'Target SLA': 95.0, 'AI Mitigated': 96.8 },
];

const CORRIDOR_LEAD_TIME = [
  { corridor: 'Shanghai → Chennai', baseline: 14, actualAvg: 20.8 },
  { corridor: 'Singapore → Mumbai', baseline: 8, actualAvg: 9.2 },
  { corridor: 'Nagoya → Chennai', baseline: 16, actualAvg: 19.5 },
  { corridor: 'Taiwan → Bengaluru', baseline: 5, actualAvg: 5.6 },
  { corridor: 'Dubai → Mumbai', baseline: 6, actualAvg: 6.8 },
];

const CATEGORY_EXPOSURE = [
  { name: 'Semiconductors', value: 45, color: '#EF4444' },
  { name: 'EV Battery Cells', value: 25, color: '#F59E0B' },
  { name: 'Sensors & Displays', value: 18, color: '#10B981' },
  { name: 'Structural Raw Mat', value: 12, color: '#3B82F6' },
];

export const Analytics: React.FC = () => {
  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-[#1E1E1E]">
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-[#F27D26]" />
            <span>Supply Chain Intelligence & Performance Analytics</span>
          </h1>
          <p className="text-xs text-[#808080] mt-0.5">
            Historical SLA benchmarks, corridor lead-time variances, and multi-tier resiliency indices.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            icon={<Download className="w-3.5 h-3.5" />}
            className="text-xs"
          >
            Export Executive Report
          </Button>
        </div>
      </div>

      {/* Analytics KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-xl bg-[#111111] border border-[#222222]">
          <span className="text-xs text-[#808080]">Average OTIF SLA</span>
          <p className="text-2xl font-bold font-mono text-emerald-400 mt-1">96.4%</p>
          <span className="text-[10px] text-[#666666]">+7.8% vs unmitigated baseline</span>
        </div>
        <div className="p-3.5 rounded-xl bg-[#111111] border border-[#222222]">
          <span className="text-xs text-[#808080]">Corridor Lead Time Variance</span>
          <p className="text-2xl font-bold font-mono text-amber-400 mt-1">+3.8 Days</p>
          <span className="text-[10px] text-[#666666]">Due to Bay of Bengal storm</span>
        </div>
        <div className="p-3.5 rounded-xl bg-[#111111] border border-[#222222]">
          <span className="text-xs text-[#808080]">Stockout Prevention Value</span>
          <p className="text-2xl font-bold font-mono text-white mt-1">₹1.84 Cr</p>
          <span className="text-[10px] text-emerald-400">YTD cumulative savings</span>
        </div>
        <div className="p-3.5 rounded-xl bg-[#111111] border border-[#222222]">
          <span className="text-xs text-[#808080]">Autonomous Directives</span>
          <p className="text-2xl font-bold font-mono text-[#F27D26] mt-1">142 Executed</p>
          <span className="text-[10px] text-[#666666]">98.6% approval precision</span>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* OTIF SLA Trend */}
        <Card className="p-4 sm:p-5 border-[#222222] bg-[#111111]">
          <h3 className="text-xs font-bold text-white uppercase font-mono tracking-wider mb-1">
            On-Time In-Full (OTIF) Delivery Performance
          </h3>
          <p className="text-[11px] text-[#7A7A7A] mb-4">
            Comparison between reactive baseline and REPLENOVA AI multi-echelon routing
          </p>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={OTIF_DATA}>
                <CartesianGrid strokeDasharray="3 3" stroke="#222222" />
                <XAxis dataKey="month" stroke="#666666" fontSize={11} />
                <YAxis domain={[75, 100]} stroke="#666666" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#111111',
                    borderColor: '#333333',
                    borderRadius: '8px',
                    fontSize: '12px',
                    color: '#FFF',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Line type="monotone" dataKey="Actual OTIF" stroke="#EF4444" strokeWidth={2} />
                <Line type="monotone" dataKey="Target SLA" stroke="#F59E0B" strokeDasharray="4 4" strokeWidth={1.5} />
                <Line type="monotone" dataKey="AI Mitigated" stroke="#10B981" strokeWidth={2.5} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Lead Time Variance by Corridor */}
        <Card className="p-4 sm:p-5 border-[#222222] bg-[#111111]">
          <h3 className="text-xs font-bold text-white uppercase font-mono tracking-wider mb-1">
            Corridor Lead Time Variance (Days)
          </h3>
          <p className="text-[11px] text-[#7A7A7A] mb-4">
            Baseline expected lead time vs actual transit duration
          </p>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={CORRIDOR_LEAD_TIME} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#222222" />
                <XAxis type="number" stroke="#666666" fontSize={11} />
                <YAxis dataKey="corridor" type="category" stroke="#666666" fontSize={10} width={120} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#111111',
                    borderColor: '#333333',
                    borderRadius: '8px',
                    fontSize: '12px',
                    color: '#FFF',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Bar dataKey="baseline" fill="#3B82F6" name="Baseline Days" radius={[0, 4, 4, 0]} />
                <Bar dataKey="actualAvg" fill="#EF4444" name="Actual Active Days" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
};
