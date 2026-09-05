import React from 'react';
import { Activity, Radio, AlertOctagon } from 'lucide-react';

interface MapLegendBarProps {
  lastUpdated?: string;
  signalsMonitored?: number;
  activeDisruptions?: number;
}

export const MapLegendBar: React.FC<MapLegendBarProps> = ({
  lastUpdated = 'Just now',
  signalsMonitored = 1284,
  activeDisruptions = 7
}) => {
  return (
    <div
      id="map-legend-bar"
      className="p-2.5 bg-[#050505] border-t border-[#1F1F1F] flex flex-wrap items-center justify-between gap-3 text-[10px] font-mono select-none"
    >
      {/* Node Status Legend */}
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-[#666666] uppercase font-bold text-[9px] tracking-wider">
          LEGEND:
        </span>
        <div className="flex items-center gap-1.5 text-[#22C55E]">
          <span className="w-2 h-2 rounded-full bg-[#22C55E]"></span>
          <span>Healthy</span>
        </div>
        <div className="flex items-center gap-1.5 text-[#EAB308]">
          <span className="w-2 h-2 rounded-full bg-[#EAB308]"></span>
          <span>Watch</span>
        </div>
        <div className="flex items-center gap-1.5 text-[#FF8800]">
          <span className="w-2 h-2 rounded-full bg-[#FF8800]"></span>
          <span>Elevated</span>
        </div>
        <div className="flex items-center gap-1.5 text-[#CC3333]">
          <span className="w-2 h-2 rounded-full bg-[#CC3333] animate-pulse"></span>
          <span className="font-bold">Critical</span>
        </div>

        <span className="text-[#333333] hidden sm:inline">|</span>

        {/* Route Types */}
        <div className="flex items-center gap-1.5 text-[#22C55E]">
          <span className="w-3.5 h-0.5 bg-[#22C55E]"></span>
          <span>Normal</span>
        </div>
        <div className="flex items-center gap-1.5 text-[#FF8800]">
          <span className="w-3.5 h-0.5 bg-[#FF8800]"></span>
          <span>At Risk</span>
        </div>
        <div className="flex items-center gap-1.5 text-[#CC3333]">
          <span className="w-3.5 h-0.5 bg-[#CC3333] border-b border-dashed"></span>
          <span>Disrupted</span>
        </div>
        <div className="flex items-center gap-1.5 text-[#3B82F6]">
          <span className="w-3.5 h-0.5 bg-[#3B82F6]"></span>
          <span>Alternative</span>
        </div>
      </div>

      {/* Live Signals Telemetry Status */}
      <div className="flex items-center gap-2 text-[#888888]">
        <div className="flex items-center gap-1 text-[#22C55E]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] animate-ping"></span>
          <span className="font-bold">LIVE SIGNALS</span>
        </div>
        <span>•</span>
        <span>Signals: <strong className="text-white font-mono">{signalsMonitored.toLocaleString()}</strong></span>
        <span>•</span>
        <span>Active Disruptions: <strong className="text-[#CC3333] font-mono">{activeDisruptions}</strong></span>
        <span>•</span>
        <span className="text-[#666666] hidden md:inline">Updated {lastUpdated}</span>
      </div>
    </div>
  );
};
