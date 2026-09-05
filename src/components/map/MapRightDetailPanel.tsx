import React, { useState } from 'react';
import {
  X,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  Clock,
  Package,
  Anchor,
  Factory as FactoryIcon,
  Warehouse as WhIcon,
  Navigation,
  Wind,
  CheckCircle2,
  ExternalLink,
  IndianRupee,
  RefreshCw,
  Crosshair
} from 'lucide-react';
import { RiskLevel } from '../../types';

interface MapRightDetailPanelProps {
  selectedEntity: {
    type: 'supplier' | 'factory' | 'port' | 'warehouse' | 'shipment' | 'weather' | 'route' | 'ai-recommendation';
    data: any;
  } | null;
  onClose: () => void;
  onNavigateToTab?: (tab: string) => void;
  onSelectProductForReplenishment?: (sku: string) => void;
  onApplyMitigation: () => void;
  isMitigationApplied: boolean;
  onSimulateScenario: () => void;
  onFocusEntity: (lat: number, lng: number, zoom?: number) => void;
}

export const MapRightDetailPanel: React.FC<MapRightDetailPanelProps> = ({
  selectedEntity,
  onClose,
  onNavigateToTab,
  onSelectProductForReplenishment,
  onApplyMitigation,
  isMitigationApplied,
  onSimulateScenario,
  onFocusEntity
}) => {
  const [showAiRecommendation, setShowAiRecommendation] = useState(false);

  if (!selectedEntity) return null;

  const getStatusBadge = (status: string | RiskLevel) => {
    switch (status?.toLowerCase()) {
      case 'critical':
      case 'delayed':
      case 'high':
        return 'bg-red-950/80 border-red-500/50 text-red-400';
      case 'elevated':
      case 'medium':
        return 'bg-orange-950/80 border-orange-500/50 text-orange-400';
      case 'watch':
        return 'bg-yellow-950/80 border-yellow-500/50 text-yellow-400';
      case 'healthy':
      case 'normal':
      case 'on-schedule':
      default:
        return 'bg-green-950/80 border-green-500/50 text-green-400';
    }
  };

  return (
    <div
      id="map-right-context-panel"
      className="w-full lg:w-80 bg-[#0A0A0A]/95 backdrop-blur-md border-t lg:border-t-0 lg:border-l border-[#1F1F1F] flex flex-col justify-between shrink-0 text-xs font-mono shadow-2xl z-[450] overflow-y-auto max-h-[580px]"
    >
      <div className="p-4 space-y-4">
        {/* Panel Header */}
        <div className="flex items-center justify-between pb-2.5 border-b border-[#1F1F1F]">
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase px-1.5 py-0.5 rounded bg-[#141414] border border-[#262626] text-[#F27D26] font-bold">
              {showAiRecommendation ? 'AI INTELLIGENCE' : selectedEntity.type.toUpperCase()}
            </span>
            <h3 className="text-xs font-bold text-white truncate max-w-[170px]">
              {showAiRecommendation
                ? 'REPLENOVA AI MITIGATION'
                : selectedEntity.data.name || selectedEntity.data.title || 'Telemetry Dossier'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-[#666666] hover:text-white p-1 rounded hover:bg-[#1A1A1A] cursor-pointer transition-colors"
            title="Close Panel"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* VIEW 1: ROUTE & SHIPMENT INTERACTION (Shanghai -> Chennai) */}
        {/* ------------------------------------------------------------- */}
        {(selectedEntity.type === 'route' || selectedEntity.type === 'shipment') && !showAiRecommendation && (
          <div className="space-y-3">
            <div className="p-2.5 rounded bg-[#0D0D0D] border border-[#1F1F1F] space-y-1">
              <span className="text-[9px] text-[#666666] uppercase block">SHIPMENT ROUTE</span>
              <div className="flex items-center justify-between text-white font-bold text-xs">
                <span>{selectedEntity.data.from || 'Shanghai Port'}</span>
                <span className="text-[#F27D26]">→</span>
                <span>{selectedEntity.data.to || 'Chennai Central Hub'}</span>
              </div>
            </div>

            <div className="space-y-2 text-[11px]">
              <div className="flex justify-between py-1 border-b border-[#141414]">
                <span className="text-[#888888]">Shipment:</span>
                <span className="text-white font-bold">#4521 (MV EVER BRAVE)</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#141414]">
                <span className="text-[#888888]">Cargo:</span>
                <span className="text-[#F27D26] font-bold">MCU-X1 (Microcontroller)</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#141414]">
                <span className="text-[#888888]">Quantity:</span>
                <span className="text-white font-bold">4,500 units</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#141414]">
                <span className="text-[#888888]">Normal ETA:</span>
                <span className="text-white">Sep 8, 2026</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#141414]">
                <span className="text-[#888888]">Predicted ETA:</span>
                <span className="text-[#CC3333] font-bold">Sep 12, 2026</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#141414]">
                <span className="text-[#888888]">Delay:</span>
                <span className="text-[#CC3333] font-bold">+4 days</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#141414]">
                <span className="text-[#888888]">Current Risk:</span>
                <span className="px-1.5 py-0.2 rounded font-bold uppercase bg-red-950/60 border border-red-500/40 text-red-400">
                  HIGH
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#141414]">
                <span className="text-[#888888]">Inventory affected:</span>
                <span className="text-white font-bold">4,200 units</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#141414]">
                <span className="text-[#888888]">Stockout probability:</span>
                <span className="text-[#CC3333] font-bold">87%</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 space-y-1.5">
              <button
                onClick={() => onFocusEntity(11.8, 85.2, 6)}
                className="w-full py-2 rounded bg-[#141414] hover:bg-[#1F1F1F] border border-[#2A2A2A] text-white font-bold text-[10px] uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
              >
                <Navigation className="w-3 h-3 text-[#F27D26]" />
                <span>VIEW SHIPMENT</span>
              </button>

              <button
                onClick={() => {
                  onNavigateToTab?.('inventory');
                  onSelectProductForReplenishment?.('MCU-X1');
                }}
                className="w-full py-2 rounded bg-[#141414] hover:bg-[#1F1F1F] border border-[#2A2A2A] text-[#D1D1D1] hover:text-white font-bold text-[10px] uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
              >
                <Package className="w-3 h-3 text-[#3B82F6]" />
                <span>VIEW INVENTORY</span>
              </button>

              <button
                onClick={onSimulateScenario}
                className="w-full py-2 rounded bg-[#221111] hover:bg-[#2F1515] border border-red-500/40 text-red-300 font-bold text-[10px] uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
              >
                <AlertTriangle className="w-3 h-3 text-red-400" />
                <span>SIMULATE IMPACT</span>
              </button>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* VIEW 2: WAREHOUSE INTERACTION (Chennai Warehouse) */}
        {/* ------------------------------------------------------------- */}
        {selectedEntity.type === 'warehouse' && !showAiRecommendation && (
          <div className="space-y-3">
            <div className="p-2.5 rounded bg-[#0D0D0D] border border-[#1F1F1F]">
              <span className="text-[9px] text-[#666666] uppercase block">LOCATION</span>
              <div className="text-white font-bold text-xs">
                {selectedEntity.data.name || 'Chennai Central Distribution Warehouse'}
              </div>
              <span className="text-[10px] text-[#888888] font-mono block mt-0.5">
                {selectedEntity.data.city || 'Chennai, Tamil Nadu'} • Lat: 13.08° N, Lng: 80.27° E
              </span>
            </div>

            <div className="space-y-2 text-[11px]">
              <div className="flex justify-between py-1 border-b border-[#141414]">
                <span className="text-[#888888]">Inventory Value:</span>
                <span className="text-white font-bold">₹2.8Cr</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#141414]">
                <span className="text-[#888888]">SKUs:</span>
                <span className="text-white font-bold">438 items</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#141414]">
                <span className="text-[#888888]">At Risk:</span>
                <span className="text-[#FF8800] font-bold">28 SKUs</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#141414]">
                <span className="text-[#888888]">Critical:</span>
                <span className="text-[#CC3333] font-bold">7 SKUs</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#141414]">
                <span className="text-[#888888]">Daily demand:</span>
                <span className="text-white">620 units/day</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#141414]">
                <span className="text-[#888888]">Days of supply:</span>
                <span className="text-[#CC3333] font-bold">6.8 days</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#141414]">
                <span className="text-[#888888]">Incoming:</span>
                <span className="text-white">14 shipments</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#141414]">
                <span className="text-[#888888]">Delayed:</span>
                <span className="text-[#CC3333] font-bold">5 shipments</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#141414]">
                <span className="text-[#888888]">Stockout probability:</span>
                <span className="text-[#CC3333] font-bold">87%</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#141414]">
                <span className="text-[#888888]">Predicted stockout:</span>
                <span className="text-[#CC3333] font-bold">6 days</span>
              </div>
            </div>

            {/* ASK REPLENOVA AI BUTTON */}
            <div className="pt-2">
              <button
                onClick={() => setShowAiRecommendation(true)}
                className="w-full py-2.5 rounded bg-[#F27D26] hover:bg-[#FF8800] text-black font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-lg"
              >
                <Sparkles className="w-4 h-4" />
                <span>ASK REPLENOVA</span>
              </button>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* VIEW 3: AI RECOMMENDATION INTERACTION */}
        {/* ------------------------------------------------------------- */}
        {(showAiRecommendation || selectedEntity.type === 'ai-recommendation') && (
          <div className="space-y-3">
            <div className="p-3 rounded bg-[#111111] border border-[#F27D26]/40 space-y-1">
              <div className="flex items-center gap-1.5 text-[#F27D26] font-bold text-xs">
                <Sparkles className="w-3.5 h-3.5" />
                <span>AI RECOMMENDATION</span>
              </div>
              <p className="text-[11px] text-[#D1D1D1] leading-relaxed pt-1">
                MCU-X1 will stock out before Shipment #4521 arrives.
              </p>
            </div>

            <div className="space-y-2">
              <span className="text-[10px] text-[#888888] uppercase block">RECOMMENDED ACTIONS:</span>
              <div className="space-y-1.5 text-[11px]">
                <div className="p-2 rounded bg-[#0D0D0D] border border-[#1F1F1F]">
                  <span className="text-[#F27D26] font-bold">1. Transfer:</span> 1,200 units from Bengaluru Warehouse.
                </div>
                <div className="p-2 rounded bg-[#0D0D0D] border border-[#1F1F1F]">
                  <span className="text-[#F27D26] font-bold">2. Expedite:</span> 2,500 units from Supplier B.
                </div>
                <div className="p-2 rounded bg-[#0D0D0D] border border-[#1F1F1F]">
                  <span className="text-[#F27D26] font-bold">3. Alternative Route:</span> Switch shipment to alternative route via Mumbai JNPT.
                </div>
              </div>
            </div>

            <div className="p-2.5 rounded bg-[#0F1F14] border border-green-500/40 space-y-1 text-[11px]">
              <span className="text-[9px] text-green-400 uppercase font-bold block">EXPECTED OUTCOME</span>
              <div className="flex justify-between">
                <span className="text-green-300">Stockout probability:</span>
                <span className="text-green-400 font-bold">87% → 17%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-green-300">Potential loss avoided:</span>
                <span className="text-green-400 font-bold">₹54.2L</span>
              </div>
            </div>

            <div className="pt-2 grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  onApplyMitigation();
                  setShowAiRecommendation(false);
                }}
                className="py-2.5 rounded bg-[#F27D26] hover:bg-[#FF8800] text-black font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1 cursor-pointer transition-colors shadow"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>APPROVE</span>
              </button>

              <button
                onClick={() => {
                  onSimulateScenario();
                  setShowAiRecommendation(false);
                }}
                className="py-2.5 rounded bg-[#141414] hover:bg-[#1A1A1A] border border-[#2A2A2A] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1 cursor-pointer transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5 text-[#3B82F6]" />
                <span>SIMULATE</span>
              </button>
            </div>

            <button
              onClick={() => setShowAiRecommendation(false)}
              className="w-full text-center text-[10px] text-[#888888] hover:text-white pt-1 cursor-pointer"
            >
              ← Back to Details
            </button>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* VIEW 4: PORT INTERACTION (Chennai Port) */}
        {/* ------------------------------------------------------------- */}
        {selectedEntity.type === 'port' && !showAiRecommendation && (
          <div className="space-y-3">
            <div className="p-2.5 rounded bg-[#0D0D0D] border border-[#1F1F1F]">
              <span className="text-[9px] text-[#666666] uppercase block">PORT TERMINAL</span>
              <div className="text-white font-bold text-xs">
                {selectedEntity.data.name || 'Chennai Port Hub'}
              </div>
              <span className="text-[10px] text-[#888888] font-mono block mt-0.5">
                {selectedEntity.data.city || 'Chennai'}, {selectedEntity.data.country || 'India'}
              </span>
            </div>

            <div className="space-y-2 text-[11px]">
              <div className="flex justify-between py-1 border-b border-[#141414]">
                <span className="text-[#888888]">Operational Status:</span>
                <span className={`px-1.5 py-0.2 rounded font-bold uppercase ${getStatusBadge(selectedEntity.data.status || 'critical')}`}>
                  {selectedEntity.data.status || 'CRITICAL'}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#141414]">
                <span className="text-[#888888]">Congestion:</span>
                <span className="text-[#CC3333] font-bold">HIGH (94% Berth Occ.)</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#141414]">
                <span className="text-[#888888]">Estimated delay:</span>
                <span className="text-white font-bold">{selectedEntity.data.avgDelayDays || 4} days</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#141414]">
                <span className="text-[#888888]">Incoming shipments:</span>
                <span className="text-white font-bold">14 shipments</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#141414]">
                <span className="text-[#888888]">Affected suppliers:</span>
                <span className="text-[#FF8800] font-bold">3 suppliers</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#141414]">
                <span className="text-[#888888]">Affected SKUs:</span>
                <span className="text-[#CC3333] font-bold">37 SKUs</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#141414]">
                <span className="text-[#888888]">Weather:</span>
                <span className="text-[#CC3333] font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping"></span>
                  Cyclone warning
                </span>
              </div>
            </div>

            <div className="pt-2 space-y-1.5">
              <button
                onClick={() => onFocusEntity(selectedEntity.data.lat, selectedEntity.data.lng, 7)}
                className="w-full py-2 rounded bg-[#141414] hover:bg-[#1F1F1F] border border-[#2A2A2A] text-white font-bold text-[10px] uppercase flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
              >
                <Crosshair className="w-3 h-3 text-[#F27D26]" />
                <span>Focus Port Camera</span>
              </button>
              <button
                onClick={() => onNavigateToTab?.('disruptions')}
                className="w-full py-2 rounded bg-[#221111] hover:bg-[#2B1515] border border-red-500/40 text-red-300 font-bold text-[10px] uppercase flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
              >
                <span>Inspect Port Dossier</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* VIEW 5: SUPPLIER INTERACTION (Supplier A) */}
        {/* ------------------------------------------------------------- */}
        {selectedEntity.type === 'supplier' && !showAiRecommendation && (
          <div className="space-y-3">
            <div className="p-2.5 rounded bg-[#0D0D0D] border border-[#1F1F1F]">
              <span className="text-[9px] text-[#666666] uppercase block">SUPPLIER FACTORY</span>
              <div className="text-white font-bold text-xs">
                {selectedEntity.data.name || 'Supplier A (IndoSilicon Technologies)'}
              </div>
              <span className="text-[10px] text-[#888888] font-mono block mt-0.5">
                {selectedEntity.data.location}, {selectedEntity.data.country}
              </span>
            </div>

            <div className="space-y-2 text-[11px]">
              <div className="flex justify-between py-1 border-b border-[#141414]">
                <span className="text-[#888888]">Supplier reliability:</span>
                <span className="text-[#22C55E] font-bold">{selectedEntity.data.reliabilityScore || 82}%</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#141414]">
                <span className="text-[#888888]">Average lead time:</span>
                <span className="text-white font-bold">{selectedEntity.data.averageLeadTimeDays || 5.2} days</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#141414]">
                <span className="text-[#888888]">Current delay:</span>
                <span className="text-[#FF8800] font-bold">+4 days</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#141414]">
                <span className="text-[#888888]">Active shipments:</span>
                <span className="text-white font-bold">{selectedEntity.data.activeShipmentsCount || 8} shipments</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#141414]">
                <span className="text-[#888888]">Affected SKUs:</span>
                <span className="text-[#CC3333] font-bold">12 SKUs</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#141414]">
                <span className="text-[#888888]">Risk:</span>
                <span className="px-1.5 py-0.2 rounded font-bold uppercase bg-orange-950/60 border border-orange-500/40 text-orange-400">
                  HIGH
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#141414]">
                <span className="text-[#888888]">Alternative suppliers:</span>
                <span className="text-[#22C55E] font-bold">3 vetted options</span>
              </div>
            </div>

            <div className="pt-2 space-y-1.5">
              <button
                onClick={() => onNavigateToTab?.('replenishment')}
                className="w-full py-2 rounded bg-[#141414] hover:bg-[#1F1F1F] border border-[#2A2A2A] text-[#F27D26] font-bold text-[10px] uppercase flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
              >
                <span>View Supplier SKUs & Replenishment</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* VIEW 5B: FACTORY INTERACTION */}
        {/* ------------------------------------------------------------- */}
        {selectedEntity.type === 'factory' && !showAiRecommendation && (
          <div className="space-y-3">
            <div className="p-2.5 rounded bg-[#0D0D0D] border border-[#1F1F1F]">
              <span className="text-[9px] text-[#666666] uppercase block">MANUFACTURING PLANT</span>
              <div className="text-white font-bold text-xs">
                {selectedEntity.data.name || 'Precision Assembly Facility'}
              </div>
              <span className="text-[10px] text-[#888888] font-mono block mt-0.5">
                {selectedEntity.data.location || selectedEntity.data.city}, {selectedEntity.data.country}
              </span>
            </div>

            <div className="space-y-2 text-[11px]">
              <div className="flex justify-between py-1 border-b border-[#141414]">
                <span className="text-[#888888]">Health Status:</span>
                <span className={`px-1.5 py-0.2 rounded font-bold uppercase ${getStatusBadge(selectedEntity.data.status || 'healthy')}`}>
                  {selectedEntity.data.status || 'HEALTHY'}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#141414]">
                <span className="text-[#888888]">Current Output:</span>
                <span className="text-[#22C55E] font-bold">{selectedEntity.data.currentOutputPct || 91}%</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#141414]">
                <span className="text-[#888888]">Daily Capacity:</span>
                <span className="text-white font-bold">{(selectedEntity.data.capacityUnitsPerDay || 20000).toLocaleString()} units/day</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#141414]">
                <span className="text-[#888888]">Primary Products:</span>
                <span className="text-white font-mono text-[10px]">
                  {selectedEntity.data.primaryProducts?.join(', ') || 'Sensors, Controllers'}
                </span>
              </div>
            </div>

            <div className="pt-2 space-y-1.5">
              <button
                onClick={() => onFocusEntity(selectedEntity.data.lat, selectedEntity.data.lng, 7)}
                className="w-full py-2 rounded bg-[#141414] hover:bg-[#1F1F1F] border border-[#2A2A2A] text-white font-bold text-[10px] uppercase flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
              >
                <Crosshair className="w-3 h-3 text-[#F27D26]" />
                <span>Focus Factory Camera</span>
              </button>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* VIEW 6: WEATHER DISRUPTION INTERACTION */}
        {/* ------------------------------------------------------------- */}
        {selectedEntity.type === 'weather' && !showAiRecommendation && (
          <div className="space-y-3">
            <div className="p-2.5 rounded bg-[#1A0A0A] border border-red-900/60 space-y-0.5">
              <span className="text-[9px] text-red-400 uppercase font-bold block flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping"></span>
                ACTIVE METEOROLOGICAL DISRUPTION
              </span>
              <div className="text-white font-bold text-xs">
                {selectedEntity.data.title || 'Cyclone Mandous (Category 3)'}
              </div>
              <span className="text-[10px] text-[#888888] font-mono block">
                Bay of Bengal Maritime Corridor (12.8° N, 84.5° E)
              </span>
            </div>

            <div className="space-y-2 text-[11px]">
              <div className="flex justify-between py-1 border-b border-[#141414]">
                <span className="text-[#888888]">Category:</span>
                <span className="text-[#CC3333] font-bold">Category 2/3 Severe Storm</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#141414]">
                <span className="text-[#888888]">Wind speed:</span>
                <span className="text-white font-bold">110–165 km/h</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#141414]">
                <span className="text-[#888888]">Central pressure:</span>
                <span className="text-white font-mono">960 hPa</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#141414]">
                <span className="text-[#888888]">Affected radius:</span>
                <span className="text-white font-bold">380 km</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#141414]">
                <span className="text-[#888888]">Movement direction:</span>
                <span className="text-[#FF8800] font-bold">Moving NW at 18 km/h</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#141414]">
                <span className="text-[#888888]">Swell height:</span>
                <span className="text-[#FF8800]">4.2m Rough Swell</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#141414]">
                <span className="text-[#888888]">Vessels rerouted:</span>
                <span className="text-[#CC3333] font-bold">14 commercial ships</span>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => onFocusEntity(12.8, 84.5, 5)}
                className="w-full py-2 rounded bg-[#141414] hover:bg-[#1F1F1F] border border-[#2A2A2A] text-white font-bold text-[10px] uppercase flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
              >
                <Crosshair className="w-3 h-3 text-[#F27D26]" />
                <span>Focus Cyclone Radar Eye</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Footer Insight Banner */}
      <div className="p-3 border-t border-[#1F1F1F] bg-[#050505] flex items-center justify-between">
        <span className="text-[9px] text-[#666666]">REPLENOVA AI ENGINE</span>
        <span className="text-[9px] text-[#22C55E] font-bold flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] animate-pulse"></span>
          REAL-TIME TELEMETRY CONNECTED
        </span>
      </div>
    </div>
  );
};
