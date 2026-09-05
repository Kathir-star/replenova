import React, { useState } from 'react';
import { ExternalDisruptionEvent, RiskLevel } from '../types';
import {
  AlertOctagon,
  CloudLightning,
  Anchor,
  Truck,
  Newspaper,
  Globe,
  TrendingDown,
  Sparkles,
  Sliders,
  Flame,
  ArrowRight,
  ShieldAlert,
  Clock
} from 'lucide-react';

interface DisruptionsViewProps {
  disruptions: ExternalDisruptionEvent[];
  onSimulateDisruption: () => void;
  isSimulatedDisruptionActive: boolean;
  onNavigateToScenario: (scenarioTitle: string) => void;
  onNavigateToReplenishment: () => void;
}

export const DisruptionsView: React.FC<DisruptionsViewProps> = ({
  disruptions,
  onSimulateDisruption,
  isSimulatedDisruptionActive,
  onNavigateToScenario,
  onNavigateToReplenishment
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all');

  const categories = ['all', 'Weather', 'Ports', 'Transportation', 'News', 'Geopolitical', 'Economic'];
  const severities = ['all', 'critical', 'elevated', 'watch'];

  const filteredDisruptions = disruptions.filter((d) => {
    const matchCat = selectedCategory === 'all' || d.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchSev = selectedSeverity === 'all' || d.severity.toLowerCase() === selectedSeverity.toLowerCase();
    return matchCat && matchSev;
  });

  const getCategoryIcon = (category: ExternalDisruptionEvent['category']) => {
    switch (category) {
      case 'Weather':
        return CloudLightning;
      case 'Ports':
        return Anchor;
      case 'Transportation':
        return Truck;
      case 'News':
        return Newspaper;
      case 'Geopolitical':
        return Globe;
      case 'Economic':
      default:
        return TrendingDown;
    }
  };

  const getSeverityBadge = (sev: RiskLevel) => {
    switch (sev) {
      case 'critical':
        return 'bg-[#221111] text-[#CC3333] border border-[#CC3333]/40';
      case 'elevated':
        return 'bg-[#221800] text-[#FF8800] border border-[#FF8800]/40';
      case 'watch':
      default:
        return 'bg-[#1F1A10] text-[#D19933] border border-[#D19933]/30';
    }
  };

  return (
    <div id="disruptions-intelligence-page" className="space-y-6">
      {/* Top Banner & Simulation Trigger */}
      <div className="p-4 sm:p-5 rounded bg-[#0A0A0A] border border-[#1F1F1F] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <AlertOctagon className="w-4 h-4 text-[#CC3333]" />
            <h2 className="text-xs sm:text-sm font-semibold text-white tracking-wide uppercase">
              GLOBAL DISRUPTION INTELLIGENCE RADAR
            </h2>
          </div>
          <p className="text-[11px] text-[#666666] mt-0.5 font-mono">
            Ingesting satellite meteorology, AIS maritime vessel transponders, customs clearance feeds, and supply chain news signals.
          </p>
        </div>

        <button
          onClick={onSimulateDisruption}
          className={`px-3 py-1.5 rounded font-mono text-xs font-bold border transition-colors cursor-pointer flex items-center gap-2 ${
            isSimulatedDisruptionActive
              ? 'bg-[#221111] border-[#CC3333]/60 text-[#CC3333] animate-pulse'
              : 'bg-[#141414] hover:bg-[#1A1A1A] border-[#1F1F1F] text-[#D1D1D1]'
          }`}
        >
          <Flame className={`w-3.5 h-3.5 ${isSimulatedDisruptionActive ? 'text-[#CC3333]' : 'text-[#F27D26]'}`} />
          <span>{isSimulatedDisruptionActive ? 'DISRUPTION INJECTED (+2d Delay)' : 'SIMULATE REAL-TIME DISRUPTION'}</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded bg-[#0A0A0A] border border-[#1F1F1F] font-mono text-xs">
        <div className="flex items-center gap-1 overflow-x-auto py-1">
          <span className="text-[#666666] text-[11px] uppercase mr-1">Category:</span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1 rounded transition-colors cursor-pointer capitalize text-[11px] ${
                selectedCategory === cat
                  ? 'bg-[#1A1A1A] text-[#F27D26] font-bold border border-[#F27D26]/40'
                  : 'text-[#888888] hover:text-white hover:bg-[#141414]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1">
          <span className="text-[#666666] text-[11px] uppercase mr-1">Severity:</span>
          {severities.map((sev) => (
            <button
              key={sev}
              onClick={() => setSelectedSeverity(sev)}
              className={`px-2.5 py-1 rounded transition-colors cursor-pointer capitalize text-[11px] ${
                selectedSeverity === sev
                  ? 'bg-[#221111] text-[#CC3333] font-bold border border-[#CC3333]/40'
                  : 'text-[#888888] hover:text-white hover:bg-[#141414]'
              }`}
            >
              {sev}
            </button>
          ))}
        </div>
      </div>

      {/* Disruptions Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredDisruptions.map((dis) => {
          const CategoryIcon = getCategoryIcon(dis.category);
          const isCritical = dis.severity === 'critical';

          return (
            <div
              key={dis.id}
              className={`p-4 sm:p-5 rounded border transition-colors flex flex-col justify-between space-y-4 ${
                isCritical
                  ? 'bg-[#0A0A0A] border-[#CC3333]/30 hover:border-[#CC3333]/60'
                  : 'bg-[#0A0A0A] border-[#1F1F1F] hover:border-[#2A2A2A]'
              }`}
            >
              <div>
                {/* Header Row */}
                <div className="flex items-center justify-between gap-2 mb-2 pb-2 border-b border-[#141414]">
                  <div className="flex items-center gap-2">
                    <div className="p-1 rounded bg-[#141414] text-[#F27D26]">
                      <CategoryIcon className="w-3.5 h-3.5" />
                    </div>
                    <span className="font-mono text-xs text-[#888888] font-bold uppercase">
                      {dis.category} &bull; {dis.locationName}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 font-mono text-[10px]">
                    <span className={`px-2 py-0.5 rounded font-bold uppercase ${getSeverityBadge(dis.severity)}`}>
                      {dis.severity}
                    </span>
                    <span className="px-1.5 py-0.5 rounded bg-[#141414] text-[#888888] border border-[#1F1F1F]">
                      {dis.confidence}% Conf.
                    </span>
                  </div>
                </div>

                {/* Title and Summary */}
                <h3 className="text-xs sm:text-sm font-semibold text-white font-sans leading-snug">
                  {dis.title}
                </h3>
                <p className="text-xs text-[#888888] mt-2 font-sans leading-relaxed">
                  {dis.summary}
                </p>

                {/* Detailed Signal Note */}
                <div className="mt-3 p-3 rounded bg-[#050505] border border-[#1F1F1F] text-[11px] font-sans text-[#D1D1D1] leading-relaxed">
                  <strong className="text-[#F27D26] font-mono text-[10px] block uppercase mb-0.5">
                    Cascade Propagation Analysis:
                  </strong>
                  {dis.details}
                </div>
              </div>

              <div>
                {/* Metrics 4-grid */}
                <div className="grid grid-cols-4 gap-2 p-2.5 rounded bg-[#0D0D0D] border border-[#141414] font-mono text-[10px] mb-3 text-center">
                  <div>
                    <span className="text-[#666666] block">Delay</span>
                    <span className="text-[#CC3333] font-bold">{dis.expectedDelayDays}</span>
                  </div>
                  <div>
                    <span className="text-[#666666] block">Duration</span>
                    <span className="text-white font-bold">{dis.expectedDurationDays}</span>
                  </div>
                  <div>
                    <span className="text-[#666666] block">Suppliers</span>
                    <span className="text-[#D1D1D1] font-bold">{dis.affectedSuppliers}</span>
                  </div>
                  <div>
                    <span className="text-[#666666] block">SKUs</span>
                    <span className="text-[#F27D26] font-bold">{dis.affectedSkus}</span>
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="flex items-center justify-between pt-1 text-xs font-mono">
                  <span className="text-[11px] text-[#666666]">
                    Detected: <strong className="text-[#888888]">{dis.detectedTime}</strong>
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onNavigateToScenario(dis.title)}
                      className="px-2.5 py-1.5 rounded bg-[#141414] hover:bg-[#1A1A1A] text-[#888888] hover:text-white text-[11px] cursor-pointer flex items-center gap-1 border border-[#1F1F1F] transition-colors"
                    >
                      <Sliders className="w-3 h-3 text-[#F27D26]" />
                      <span>Simulate Shock</span>
                    </button>
                    <button
                      onClick={onNavigateToReplenishment}
                      className="px-3 py-1.5 rounded bg-[#F27D26] hover:bg-[#FF8800] text-black font-bold text-[11px] cursor-pointer flex items-center gap-1 uppercase tracking-wider transition-colors"
                    >
                      <Sparkles className="w-3 h-3 fill-current" />
                      <span>Mitigate</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
