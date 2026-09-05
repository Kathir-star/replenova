import React from 'react';
import {
  Wind,
  Anchor,
  Factory as FactoryIcon,
  Ship,
  Warehouse as WarehouseIcon,
  Package,
  AlertOctagon,
  Sparkles,
  ChevronRight,
  ArrowDown
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Card, CardHeader } from '../ui/Card';

export const ImpactChain: React.FC = () => {
  const {
    selectedDisruption,
    setSelectedEntity,
    selectedEntity,
    warehouses,
    ports,
    suppliers,
    shipments,
    inventory,
  } = useApp();

  const chainNodes = [
    {
      id: 'chain-cyclone',
      step: 1,
      title: 'CYCLONE MANDOUS',
      subtitle: 'Category 3 Storm System',
      icon: Wind,
      color: 'text-red-400 bg-red-500/10 border-red-500/30',
      badge: '140 km/h',
      entityType: 'weather',
      entityData: selectedDisruption,
    },
    {
      id: 'chain-port',
      step: 2,
      title: 'CHENNAI PORT',
      subtitle: 'Berth Operations Halted',
      icon: Anchor,
      color: 'text-red-400 bg-red-500/10 border-red-500/30',
      badge: '+4.8d Queue',
      entityType: 'port',
      entityData: ports.find((p) => p.id === 'port-3') || ports[0],
    },
    {
      id: 'chain-supplier',
      step: 3,
      title: 'SUPPLIER DELAY',
      subtitle: 'EastAsia SemiFab Corp',
      icon: FactoryIcon,
      color: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
      badge: 'Fab Stalled',
      entityType: 'supplier',
      entityData: suppliers.find((s) => s.id === 'sup-1') || suppliers[0],
    },
    {
      id: 'chain-shipment',
      step: 4,
      title: 'MV EVER BRAVE (#4521)',
      subtitle: '4,500 MCU-X1 Cargo',
      icon: Ship,
      color: 'text-red-400 bg-red-500/10 border-red-500/30',
      badge: 'Storm Hold',
      entityType: 'shipment',
      entityData: shipments.find((s) => s.id === 'shp-4521') || shipments[0],
    },
    {
      id: 'chain-warehouse',
      step: 5,
      title: 'CHENNAI CENTRAL HUB',
      subtitle: 'Depot Buffer Depleting',
      icon: WarehouseIcon,
      color: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
      badge: '6.8d Supply',
      entityType: 'warehouse',
      entityData: warehouses.find((w) => w.id === 'wh-1') || warehouses[0],
    },
    {
      id: 'chain-inventory',
      step: 6,
      title: 'SKU MCU-X1',
      subtitle: 'Automotive Microcontroller',
      icon: Package,
      color: 'text-red-400 bg-red-500/10 border-red-500/30',
      badge: '87% Risk',
      entityType: 'product',
      entityData: inventory.find((i) => i.sku === 'MCU-X1') || inventory[0],
    },
    {
      id: 'chain-stockout',
      step: 7,
      title: 'STOCKOUT IN 6 DAYS',
      subtitle: 'OEM Penalty ₹54.2L',
      icon: AlertOctagon,
      color: 'text-red-400 bg-red-500/10 border-red-500/30',
      badge: 'Critical Cliff',
      entityType: 'product',
      entityData: inventory.find((i) => i.sku === 'MCU-X1') || inventory[0],
    },
    {
      id: 'chain-ai',
      step: 8,
      title: 'AI REPLENISHMENT',
      subtitle: 'Multi-Echelon Bypass',
      icon: Sparkles,
      color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
      badge: '84% Loss Avoided',
      entityType: 'product',
      entityData: inventory.find((i) => i.sku === 'MCU-X1') || inventory[0],
    },
  ];

  const handleNodeClick = (node: (typeof chainNodes)[0]) => {
    setSelectedEntity({
      type: node.entityType as any,
      data: node.entityData,
    });
  };

  return (
    <Card className="overflow-hidden border-[#222222]">
      <CardHeader
        title="Disruption Cascading Impact Chain"
        subtitle="Click any node in the chain to inspect telemetry on the live map"
        badge={
          <span className="text-[10px] font-mono font-bold bg-[#F27D26]/15 text-[#F27D26] px-2 py-0.5 rounded border border-[#F27D26]/30">
            ACTIVE CASCADE
          </span>
        }
      />

      <div className="p-3 sm:p-4 bg-[#0A0A0A]/50 overflow-x-auto scrollbar-thin">
        {/* Horizontal Flow on Desktop */}
        <div className="flex items-center min-w-[900px] gap-2 py-1">
          {chainNodes.map((node, index) => {
            const Icon = node.icon;
            const isSelected =
              selectedEntity?.data?.id === (node.entityData as any)?.id ||
              (selectedEntity?.type === node.entityType && node.step === 1);

            return (
              <React.Fragment key={node.id}>
                <button
                  onClick={() => handleNodeClick(node)}
                  className={`flex-1 p-3 rounded-xl text-left border transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? 'bg-[#1C1C1C] border-[#F27D26] ring-1 ring-[#F27D26]/40 shadow-lg'
                      : 'bg-[#111111] border-[#222222] hover:border-[#383838] hover:bg-[#161616]'
                  }`}
                >
                  <div className="flex items-center justify-between gap-1.5 mb-1.5">
                    <div className={`p-1.5 rounded-lg border ${node.color}`}>
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-[#1C1C1C] text-[#A0A0A0] border border-[#2D2D2D]">
                      {node.badge}
                    </span>
                  </div>

                  <p className="text-xs font-bold text-white tracking-tight truncate">{node.title}</p>
                  <p className="text-[10px] text-[#737373] truncate mt-0.5">{node.subtitle}</p>
                </button>

                {index < chainNodes.length - 1 && (
                  <ChevronRight className="w-4 h-4 text-[#404040] shrink-0" />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </Card>
  );
};
