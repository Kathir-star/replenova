import React, { useState } from 'react';
import {
  Globe2,
  Anchor,
  Warehouse,
  Factory,
  Ship,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  TrendingUp,
  MapPin
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SupplyChainMap } from '../components/map/SupplyChainMap';
import { Card, CardHeader } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { formatInrCurrency } from '../lib/calculations';

export const SupplyNetwork: React.FC = () => {
  const { suppliers, warehouses, ports, shipments, routes, setSelectedEntity } = useApp();
  const [activeTab, setActiveTab] = useState<'all' | 'suppliers' | 'warehouses' | 'ports' | 'shipments'>('all');

  return (
    <div className="space-y-5">
      {/* Page Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-[#1E1E1E]">
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Globe2 className="w-5 h-5 text-[#F27D26]" />
            <span>Global Supply Network & Multi-Tier Topology</span>
          </h1>
          <p className="text-xs text-[#808080] mt-0.5">
            End-to-end visibility across 10 global suppliers, 5 regional warehouses, 5 international ports, and active sea lanes.
          </p>
        </div>
      </div>

      {/* Embedded Interactive Map */}
      <SupplyChainMap height="h-[420px] lg:h-[480px]" />

      {/* Network Node Tabs */}
      <div className="flex items-center gap-2 p-1.5 bg-[#111111] rounded-xl border border-[#222222] overflow-x-auto scrollbar-thin">
        {[
          { key: 'all', label: 'All Network Nodes' },
          { key: 'suppliers', label: `Suppliers (${suppliers.length})` },
          { key: 'warehouses', label: `Warehouses (${warehouses.length})` },
          { key: 'ports', label: `Port Hubs (${ports.length})` },
          { key: 'shipments', label: `Active Shipments (${shipments.length})` },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono whitespace-nowrap transition-colors ${
              activeTab === tab.key
                ? 'bg-[#262626] text-white font-bold shadow-xs'
                : 'text-[#888888] hover:text-[#D1D1D1]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Dynamic Grid of Network Nodes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Suppliers */}
        {(activeTab === 'all' || activeTab === 'suppliers') &&
          suppliers.map((sup) => {
            const leadDays = sup.leadTimeDays ?? sup.averageLeadTimeDays;
            const skusList = sup.suppliedSkus ?? sup.primarySkus ?? [];

            return (
              <Card
                key={sup.id}
                className="p-4 border-[#222222] bg-[#111111] hover:border-[#383838] transition-all cursor-pointer"
                onClick={() => setSelectedEntity({ type: 'supplier', data: sup })}
              >
                <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-[#1E1E1E]">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="p-1.5 rounded-md bg-[#181818] border border-[#2D2D2D] text-[#F27D26]">
                      <Factory className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-white truncate">{sup.name}</h4>
                      <p className="text-[10.5px] text-[#777777]">{sup.city || sup.location}, {sup.country}</p>
                    </div>
                  </div>
                  <Badge variant={sup.currentRiskLevel} size="sm">
                    {sup.currentRiskLevel}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-3 text-[11px] font-mono">
                  <div className="p-2 rounded bg-[#0A0A0A] border border-[#1C1C1C]">
                    <span className="text-[#666666] block text-[10px]">Tier & Lead Time</span>
                    <span className="text-white font-semibold">{sup.tier || 'Tier 1'} • {leadDays}d std</span>
                  </div>
                  <div className="p-2 rounded bg-[#0A0A0A] border border-[#1C1C1C]">
                    <span className="text-[#666666] block text-[10px]">Reliability Score</span>
                    <span className="text-emerald-400 font-semibold">{sup.reliabilityScore}% SLA</span>
                  </div>
                </div>

                <div className="mt-2.5 flex items-center justify-between text-[11px] text-[#888888]">
                  <span className="truncate max-w-[200px]">Supplies: {skusList.join(', ')}</span>
                  <span className="text-[#F27D26] hover:underline flex items-center gap-1 shrink-0">
                    Inspect <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </Card>
            );
          })}

        {/* Warehouses */}
        {(activeTab === 'all' || activeTab === 'warehouses') &&
          warehouses.map((wh) => (
            <Card
              key={wh.id}
              className="p-4 border-[#222222] bg-[#111111] hover:border-[#383838] transition-all cursor-pointer"
              onClick={() => setSelectedEntity({ type: 'warehouse', data: wh })}
            >
              <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-[#1E1E1E]">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="p-1.5 rounded-md bg-[#181818] border border-[#2D2D2D] text-amber-400">
                    <Warehouse className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-white truncate">{wh.name}</h4>
                    <p className="text-[10.5px] text-[#777777]">{wh.city}, {wh.region || wh.country || 'India'}</p>
                  </div>
                </div>
                <Badge variant={wh.riskScore > 70 ? 'critical' : wh.riskScore > 30 ? 'elevated' : 'healthy'} size="sm">
                  {wh.riskScore > 70 ? 'Critical' : wh.riskScore > 30 ? 'Elevated' : 'Optimal'}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-2 mt-3 text-[11px] font-mono">
                <div className="p-2 rounded bg-[#0A0A0A] border border-[#1C1C1C]">
                  <span className="text-[#666666] block text-[10px]">Active SKUs</span>
                  <span className="text-white font-semibold">{wh.criticalSkusCount || 4} Critical Lines</span>
                </div>
                <div className="p-2 rounded bg-[#0A0A0A] border border-[#1C1C1C]">
                  <span className="text-[#666666] block text-[10px]">Utilization</span>
                  <span className="text-[#D1D1D1] font-semibold">{wh.utilizationPct}% Cap</span>
                </div>
              </div>
            </Card>
          ))}

        {/* Port Hubs */}
        {(activeTab === 'all' || activeTab === 'ports') &&
          ports.map((port) => (
            <Card
              key={port.id}
              className="p-4 border-[#222222] bg-[#111111] hover:border-[#383838] transition-all cursor-pointer"
              onClick={() => setSelectedEntity({ type: 'port', data: port })}
            >
              <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-[#1E1E1E]">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="p-1.5 rounded-md bg-[#181818] border border-[#2D2D2D] text-blue-400">
                    <Anchor className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-white truncate">{port.name}</h4>
                    <p className="text-[10.5px] text-[#777777]">{port.country}</p>
                  </div>
                </div>
                <Badge variant={port.status} size="sm">
                  {port.status}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-2 mt-3 text-[11px] font-mono">
                <div className="p-2 rounded bg-[#0A0A0A] border border-[#1C1C1C]">
                  <span className="text-[#666666] block text-[10px]">Avg Delay</span>
                  <span className="text-white font-semibold">{port.avgDelayDays} days</span>
                </div>
                <div className="p-2 rounded bg-[#0A0A0A] border border-[#1C1C1C]">
                  <span className="text-[#666666] block text-[10px]">Congestion</span>
                  <span className={`${port.congestionLevel === 'Critical' || port.congestionLevel === 'Severe' ? 'text-red-400' : 'text-emerald-400'} font-semibold`}>
                    {String(port.congestionLevel)}
                  </span>
                </div>
              </div>
            </Card>
          ))}
      </div>
    </div>
  );
};
