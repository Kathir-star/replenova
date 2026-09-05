import React, { useState } from 'react';
import { ExternalDisruptionEvent, RiskLevel } from '../types';
import {
  CloudLightning,
  Anchor,
  Truck,
  Newspaper,
  Globe,
  TrendingDown,
  Clock,
  AlertTriangle,
  ChevronRight,
  Filter
} from 'lucide-react';

interface SignalsFeedProps {
  events: ExternalDisruptionEvent[];
  onSelectEvent?: (event: ExternalDisruptionEvent) => void;
}

export const SignalsFeed: React.FC<SignalsFeedProps> = ({
  events,
  onSelectEvent
}) => {
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const categories = ['all', 'Weather', 'Ports', 'Transportation', 'News', 'Geopolitical', 'Economic'];

  const filteredEvents = categoryFilter === 'all'
    ? events
    : events.filter(e => e.category.toLowerCase() === categoryFilter.toLowerCase());

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
        return 'bg-[#221111] text-[#CC3333] border-[#CC3333]/40';
      case 'elevated':
        return 'bg-[#221A11] text-[#FF8800] border-[#FF8800]/40';
      case 'watch':
        return 'bg-[#221A11] text-[#FF8800] border-[#FF8800]/40';
      case 'healthy':
      default:
        return 'bg-[#141F14] text-green-500 border-green-800/40';
    }
  };

  return (
    <div
      id="live-external-signals-feed"
      className="p-4 sm:p-5 rounded bg-[#0A0A0A] border border-[#1F1F1F] flex flex-col h-full"
    >
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#1F1F1F]">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#CC3333] animate-pulse" />
          <h3 className="text-xs font-semibold text-white tracking-wide uppercase">
            LIVE EXTERNAL SIGNALS FEED
          </h3>
        </div>
        <span className="text-[10px] font-mono text-[#888888] bg-[#141414] px-2 py-0.5 rounded border border-[#1F1F1F]">
          Satellite & Sensor Stream
        </span>
      </div>

      {/* Category Pills Filter */}
      <div className="flex items-center gap-1.5 overflow-x-auto py-2.5 text-[10px] font-mono border-b border-[#141414]">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategoryFilter(cat)}
            className={`px-2.5 py-1 rounded transition-colors whitespace-nowrap cursor-pointer capitalize font-medium ${
              categoryFilter === cat
                ? 'bg-[#1A1A1A] text-white border border-[#2A2A2A]'
                : 'text-[#888888] hover:text-white border border-transparent'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Events List */}
      <div className="flex-1 overflow-y-auto space-y-2.5 mt-3 pr-1 max-h-[460px]">
        {filteredEvents.map((evt) => {
          const Icon = getCategoryIcon(evt.category);
          const badgeClass = getSeverityBadge(evt.severity);

          return (
            <div
              key={evt.id}
              onClick={() => onSelectEvent && onSelectEvent(evt)}
              className="p-3.5 rounded bg-[#0D0D0D] border border-[#1A1A1A] hover:bg-[#141414] hover:border-[#2A2A2A] transition-colors cursor-pointer group"
            >
              {/* Top Row: Category + Severity + Confidence */}
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <div className="flex items-center gap-2">
                  <div className="p-1 rounded bg-[#1A1A1A] text-[#D1D1D1]">
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <span className="font-mono text-[10px] uppercase tracking-wider text-[#666666] font-semibold">
                    {evt.category} &bull; {evt.locationName}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <span
                    className={`font-mono text-[9px] uppercase px-1.5 py-0.5 rounded border font-bold ${badgeClass}`}
                  >
                    {evt.severity}
                  </span>
                  <span className="font-mono text-[9px] text-[#666666] bg-[#141414] px-1.5 py-0.5 rounded border border-[#1F1F1F]">
                    {evt.confidence}% Conf.
                  </span>
                </div>
              </div>

              {/* Title */}
              <h4 className="text-xs font-medium text-white group-hover:text-[#F27D26] transition-colors">
                {evt.title}
              </h4>

              {/* Summary */}
              <p className="text-[11px] text-[#888888] mt-1 leading-relaxed line-clamp-2">
                {evt.summary}
              </p>

              {/* Metrics Bottom Row */}
              <div className="grid grid-cols-3 gap-2 mt-2.5 pt-2 border-t border-[#141414] font-mono text-[10px]">
                <div>
                  <span className="text-[#666666] block">Expected Delay</span>
                  <span className="text-[#CC3333] font-bold">{evt.expectedDelayDays}</span>
                </div>
                <div>
                  <span className="text-[#666666] block">Duration</span>
                  <span className="text-[#D1D1D1]">{evt.expectedDurationDays}</span>
                </div>
                <div>
                  <span className="text-[#666666] block">Supply Chain</span>
                  <span className="text-white font-bold">
                    {evt.affectedSkus} SKUs &bull; {evt.affectedSuppliers} Sup
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
