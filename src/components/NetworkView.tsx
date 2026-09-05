import React, { useState } from 'react';
import { Supplier, Warehouse, PortHub, SupplyRoute } from '../types';
import {
  Network,
  Factory,
  Warehouse as WhIcon,
  Anchor,
  Navigation,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Cpu
} from 'lucide-react';

interface NetworkViewProps {
  suppliers: Supplier[];
  warehouses: Warehouse[];
  ports: PortHub[];
  routes: SupplyRoute[];
  onSelectNode?: (type: string, id: string) => void;
}

export const NetworkView: React.FC<NetworkViewProps> = ({
  suppliers,
  warehouses,
  ports,
  routes,
  onSelectNode
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'suppliers' | 'ports' | 'warehouses' | 'plants'>('all');
  const [selectedEntity, setSelectedEntity] = useState<any>(suppliers[0]);

  return (
    <div id="supply-network-digital-twin-page" className="space-y-6">
      {/* Header */}
      <div className="p-4 sm:p-5 rounded bg-[#0A0A0A] border border-[#1F1F1F] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Network className="w-4 h-4 text-[#F27D26]" />
            <h2 className="text-xs sm:text-sm font-semibold text-white tracking-wide uppercase">
              SUPPLY NETWORK DIGITAL TWIN
            </h2>
          </div>
          <p className="text-[11px] text-[#666666] mt-0.5 font-mono">
            Topology map of Tier-1/Tier-2 suppliers, maritime port choke points, regional distribution centers, and manufacturing plants.
          </p>
        </div>

        {/* Tab Filters */}
        <div className="flex items-center gap-1 bg-[#050505] p-1 rounded border border-[#1F1F1F] font-mono text-xs">
          {(['all', 'suppliers', 'ports', 'warehouses'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1 rounded transition-colors cursor-pointer capitalize text-[11px] ${
                activeTab === tab
                  ? 'bg-[#1A1A1A] text-[#F27D26] font-bold border border-[#F27D26]/40'
                  : 'text-[#888888] hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Network Stats Overview */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
        <div className="p-3.5 rounded bg-[#0A0A0A] border border-[#1F1F1F]">
          <span className="text-[#666666] block text-[10px]">TOTAL TIER 1/2 SUPPLIERS</span>
          <span className="text-xl font-bold text-white">{suppliers.length} Nodes</span>
          <span className="text-[10px] text-[#FF8800] block mt-1">2 Alternate Sourcing Lines</span>
        </div>
        <div className="p-3.5 rounded bg-[#0A0A0A] border border-[#1F1F1F]">
          <span className="text-[#666666] block text-[10px]">MARITIME PORT CHOKEPOINTS</span>
          <span className="text-xl font-bold text-white">{ports.length} Hubs</span>
          <span className="text-[10px] text-[#CC3333] block mt-1">1 Critical Delay (Chennai)</span>
        </div>
        <div className="p-3.5 rounded bg-[#0A0A0A] border border-[#1F1F1F]">
          <span className="text-[#666666] block text-[10px]">REGIONAL WAREHOUSES</span>
          <span className="text-xl font-bold text-white">{warehouses.length} Hubs</span>
          <span className="text-[10px] text-green-500 block mt-1">Total Capacity: 250k Units</span>
        </div>
        <div className="p-3.5 rounded bg-[#0A0A0A] border border-[#1F1F1F]">
          <span className="text-[#666666] block text-[10px]">ACTIVE FREIGHT ROUTES</span>
          <span className="text-xl font-bold text-white">{routes.length} Corridors</span>
          <span className="text-[10px] text-[#888888] block mt-1">Multi-modal Transit</span>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Entity Cards List */}
        <div className="lg:col-span-2 space-y-4">
          {/* Suppliers Section */}
          {(activeTab === 'all' || activeTab === 'suppliers') && (
            <div className="space-y-2.5">
              <h3 className="text-xs font-mono font-bold text-[#888888] uppercase tracking-wider flex items-center gap-1.5">
                <Factory className="w-3.5 h-3.5 text-[#F27D26]" />
                Suppliers & Component Vendors
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {suppliers.map((sup) => (
                  <div
                    key={sup.id}
                    onClick={() => setSelectedEntity(sup)}
                    className={`p-3.5 rounded border transition-colors cursor-pointer ${
                      selectedEntity?.id === sup.id
                        ? 'bg-[#141414] border-[#F27D26]/70 shadow-md'
                        : 'bg-[#0A0A0A] border-[#1F1F1F] hover:border-[#2A2A2A]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <h4 className="text-xs font-bold text-white font-sans">{sup.name}</h4>
                      <span
                        className={`text-[9px] font-mono px-1.5 py-0.5 rounded font-bold uppercase ${
                          sup.currentRiskLevel === 'critical'
                            ? 'bg-[#221111] text-[#CC3333] border border-[#CC3333]/40'
                            : sup.currentRiskLevel === 'elevated'
                            ? 'bg-[#221800] text-[#FF8800] border border-[#FF8800]/40'
                            : 'bg-[#141F14] text-green-500 border border-green-800/40'
                        }`}
                      >
                        {sup.currentRiskLevel}
                      </span>
                    </div>

                    <p className="text-[11px] text-[#888888] font-mono">
                      {sup.category} &bull; {sup.location}
                    </p>

                    <div className="mt-2.5 pt-2 border-t border-[#141414] grid grid-cols-3 gap-1 font-mono text-[10px]">
                      <div>
                        <span className="text-[#666666] block">Lead Time</span>
                        <span className="text-[#D1D1D1]">{sup.leadTimeDays}d (+{sup.leadTimeVarianceDays}d var)</span>
                      </div>
                      <div>
                        <span className="text-[#666666] block">Single Source</span>
                        <span className={sup.isSingleSource ? 'text-[#CC3333] font-bold' : 'text-[#888888]'}>
                          {sup.isSingleSource ? 'YES (High)' : 'No'}
                        </span>
                      </div>
                      <div>
                        <span className="text-[#666666] block">Reliability</span>
                        <span className="text-[#F27D26] font-bold">{sup.reliabilityScore}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Ports Section */}
          {(activeTab === 'all' || activeTab === 'ports') && (
            <div className="space-y-2.5 pt-2">
              <h3 className="text-xs font-mono font-bold text-[#888888] uppercase tracking-wider flex items-center gap-1.5">
                <Anchor className="w-3.5 h-3.5 text-[#F27D26]" />
                Strategic Port Corridors
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {ports.map((port) => (
                  <div
                    key={port.id}
                    onClick={() => setSelectedEntity(port)}
                    className={`p-3.5 rounded border transition-colors cursor-pointer ${
                      selectedEntity?.id === port.id
                        ? 'bg-[#141414] border-[#F27D26]/70 shadow-md'
                        : 'bg-[#0A0A0A] border-[#1F1F1F] hover:border-[#2A2A2A]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="text-xs font-bold text-white">{port.name}</h4>
                      <span
                        className={`text-[9px] font-mono px-1.5 py-0.5 rounded font-bold uppercase ${
                          port.status === 'critical'
                            ? 'bg-[#221111] text-[#CC3333] border border-[#CC3333]/40'
                            : port.status === 'elevated'
                            ? 'bg-[#221800] text-[#FF8800] border border-[#FF8800]/40'
                            : 'bg-[#141F14] text-green-500 border border-green-800/40'
                        }`}
                      >
                        {port.status}
                      </span>
                    </div>

                    <p className="text-[11px] text-[#888888] font-mono">
                      {port.country} &bull; {port.activeVesselsQueued} Vessels Queued
                    </p>

                    <div className="mt-2 pt-2 border-t border-[#141414] flex justify-between font-mono text-[10px]">
                      <span className="text-[#666666]">Avg Dwell Time:</span>
                      <span className={port.avgDelayDays > 2 ? 'text-[#CC3333] font-bold' : 'text-[#D1D1D1]'}>
                        {port.avgDelayDays} Days Delay
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Warehouses Section */}
          {(activeTab === 'all' || activeTab === 'warehouses') && (
            <div className="space-y-2.5 pt-2">
              <h3 className="text-xs font-mono font-bold text-[#888888] uppercase tracking-wider flex items-center gap-1.5">
                <WhIcon className="w-3.5 h-3.5 text-[#F27D26]" />
                Regional Warehouses & DCs
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {warehouses.map((wh) => (
                  <div
                    key={wh.id}
                    onClick={() => setSelectedEntity(wh)}
                    className={`p-3.5 rounded border transition-colors cursor-pointer ${
                      selectedEntity?.id === wh.id
                        ? 'bg-[#141414] border-[#F27D26]/70 shadow-md'
                        : 'bg-[#0A0A0A] border-[#1F1F1F] hover:border-[#2A2A2A]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="text-xs font-bold text-white">{wh.name}</h4>
                      <span className="text-[10px] font-mono text-[#F27D26] font-bold">
                        {wh.utilizationPct}% Cap
                      </span>
                    </div>

                    <p className="text-[11px] text-[#888888] font-mono">
                      {wh.city}, {wh.state}
                    </p>

                    <div className="mt-2 pt-2 border-t border-[#141414] flex justify-between font-mono text-[10px]">
                      <span className="text-[#666666]">Inventory At Risk:</span>
                      <span className="text-[#CC3333] font-bold">
                        ₹{(wh.inventoryValueInr * 0.22 / 100000).toFixed(1)}L
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Col: Entity Telemetry Inspector */}
        <div className="space-y-4">
          <div className="p-5 rounded bg-[#0A0A0A] border border-[#1F1F1F] sticky top-20 space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-[#1F1F1F]">
              <Cpu className="w-4 h-4 text-[#F27D26]" />
              <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                NODE TELEMETRY & DIGITAL TWIN INSPECTOR
              </h3>
            </div>

            {selectedEntity ? (
              <div className="space-y-3 font-mono text-xs">
                <div>
                  <span className="text-[10px] text-[#666666] uppercase block">NODE IDENTITY</span>
                  <h4 className="text-sm font-bold text-white font-sans mt-0.5">{selectedEntity.name}</h4>
                  <span className="text-[#888888] text-[11px]">{selectedEntity.location || selectedEntity.city || selectedEntity.country}</span>
                </div>

                <div className="p-3 rounded bg-[#050505] border border-[#1F1F1F] space-y-2">
                  <div className="flex justify-between">
                    <span className="text-[#666666]">Node Status:</span>
                    <span className="text-[#F27D26] font-bold uppercase">{selectedEntity.status || selectedEntity.currentRiskLevel || 'Active'}</span>
                  </div>
                  {selectedEntity.reliabilityScore && (
                    <div className="flex justify-between">
                      <span className="text-[#666666]">Historical Reliability:</span>
                      <span className="text-white font-bold">{selectedEntity.reliabilityScore}%</span>
                    </div>
                  )}
                  {selectedEntity.activeVesselsQueued !== undefined && (
                    <div className="flex justify-between">
                      <span className="text-[#666666]">Vessels Queued:</span>
                      <span className="text-[#CC3333] font-bold">{selectedEntity.activeVesselsQueued} ships</span>
                    </div>
                  )}
                  {selectedEntity.notes && (
                    <div className="pt-2 border-t border-[#1F1F1F]">
                      <span className="text-[#666666] block text-[10px]">INTELLIGENCE BRIEF</span>
                      <p className="text-[#D1D1D1] text-[11px] font-sans mt-0.5 leading-relaxed">
                        {selectedEntity.notes}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <p className="text-xs text-[#666666]">Select any node to inspect telemetry.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
