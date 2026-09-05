import React from 'react';
import { Activity, ArrowRight } from 'lucide-react';

interface ImpactChainNode {
  id: string;
  icon: string;
  title: string;
  subtitle: string;
  lat: number;
  lng: number;
  zoom: number;
  color: string;
  entityType: 'weather' | 'port' | 'supplier' | 'shipment' | 'warehouse' | 'sku' | 'ai-recommendation';
}

interface MapImpactChainBarProps {
  onNodeClick: (node: ImpactChainNode) => void;
  activeStage?: number;
}

export const MapImpactChainBar: React.FC<MapImpactChainBarProps> = ({
  onNodeClick,
  activeStage = 1
}) => {
  const chainNodes: ImpactChainNode[] = [
    {
      id: 'node-cyclone',
      icon: '🌪️',
      title: 'CYCLONE',
      subtitle: 'Mandous Cat 3',
      lat: 12.8,
      lng: 84.5,
      zoom: 5,
      color: '#CC3333',
      entityType: 'weather'
    },
    {
      id: 'node-port',
      icon: '⚓',
      title: 'CHENNAI PORT',
      subtitle: 'Berth Suspended +4d',
      lat: 13.0844,
      lng: 80.2925,
      zoom: 7,
      color: '#CC3333',
      entityType: 'port'
    },
    {
      id: 'node-supplier',
      icon: '🏭',
      title: 'SUPPLIER A',
      subtitle: 'IndoSilicon Stranded',
      lat: 13.0827,
      lng: 80.2707,
      zoom: 6,
      color: '#FF8800',
      entityType: 'supplier'
    },
    {
      id: 'node-shipment',
      icon: '🚢',
      title: 'SHIPMENT #4521',
      subtitle: 'MV EVER BRAVE (ETA Sep 12)',
      lat: 11.8,
      lng: 85.2,
      zoom: 6,
      color: '#CC3333',
      entityType: 'shipment'
    },
    {
      id: 'node-warehouse',
      icon: '▣',
      title: 'CHENNAI WAREHOUSE',
      subtitle: 'Runway: 6.8 Days',
      lat: 13.0827,
      lng: 80.2707,
      zoom: 7,
      color: '#CC3333',
      entityType: 'warehouse'
    },
    {
      id: 'node-sku',
      icon: '📦',
      title: 'MCU-X1',
      subtitle: '4,200 Units Exposed',
      lat: 13.0827,
      lng: 80.2707,
      zoom: 7,
      color: '#FF8800',
      entityType: 'sku'
    },
    {
      id: 'node-risk',
      icon: '🔴',
      title: '87% STOCKOUT RISK',
      subtitle: 'Stockout in 6 Days',
      lat: 13.0827,
      lng: 80.2707,
      zoom: 7,
      color: '#CC3333',
      entityType: 'ai-recommendation'
    }
  ];

  return (
    <div
      id="map-impact-chain-bar"
      className="p-3 bg-[#080808] border-t border-[#1F1F1F] space-y-2 select-none"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity className="w-3.5 h-3.5 text-[#F27D26]" />
          <h4 className="text-xs font-bold text-white uppercase font-sans tracking-wide">
            IMPACT CHAIN: GEOGRAPHIC CAUSAL CASCADE
          </h4>
          <span className="text-[10px] text-[#888888] font-mono hidden sm:inline">
            (Click any item to zoom camera and inspect node)
          </span>
        </div>
        <span className="text-[10px] font-mono text-[#F27D26] px-1.5 py-0.2 rounded bg-[#141414] border border-[#2A2A2A]">
          ₹54.2L At Stake
        </span>
      </div>

      {/* 7-Step Cascade Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-1.5 font-mono text-xs">
        {chainNodes.map((node, index) => (
          <button
            key={node.id}
            onClick={() => onNodeClick(node)}
            className="p-2 rounded bg-[#0D0D0D] border border-[#1A1A1A] hover:bg-[#161616] hover:border-[#F27D26] transition-all cursor-pointer text-left flex flex-col justify-between group relative overflow-hidden"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm">{node.icon}</span>
              <span
                className="w-1.5 h-1.5 rounded-full animate-pulse"
                style={{ backgroundColor: node.color }}
              ></span>
            </div>
            <div className="mt-1">
              <span className="text-[10px] font-bold text-white group-hover:text-[#F27D26] block truncate">
                {node.title}
              </span>
              <span className="text-[8px] text-[#888888] block truncate">
                {node.subtitle}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
