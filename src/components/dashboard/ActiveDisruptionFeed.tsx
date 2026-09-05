import React from 'react';
import {
  Wind,
  Anchor,
  Truck,
  Globe2,
  AlertTriangle,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Card, CardHeader } from '../ui/Card';
import { DisruptionEvent } from '../../types/disruption';
import { formatInrCurrency } from '../../lib/calculations';

export const ActiveDisruptionFeed: React.FC = () => {
  const { disruptions, setSelectedDisruption, selectedDisruption, setSelectedEntity } = useApp();

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'Weather':
        return <Wind className="w-3.5 h-3.5 text-blue-400" />;
      case 'Ports':
        return <Anchor className="w-3.5 h-3.5 text-red-400" />;
      case 'Transportation':
        return <Truck className="w-3.5 h-3.5 text-amber-400" />;
      default:
        return <Globe2 className="w-3.5 h-3.5 text-purple-400" />;
    }
  };

  const handleSelect = (dis: DisruptionEvent) => {
    setSelectedDisruption(dis);
    setSelectedEntity({
      type: dis.category === 'Weather' ? 'weather' : 'port',
      data: dis,
    });
  };

  return (
    <Card className="border-[#222222]">
      <CardHeader
        title="Active Disruption Feed"
        subtitle="Real-time environmental, port & logistics intelligence"
        badge={
          <span className="text-[10px] font-mono font-bold bg-red-500/20 text-red-400 px-2 py-0.5 rounded border border-red-500/30 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-ping" />
            LIVE FEED
          </span>
        }
      />

      <div className="p-3 divide-y divide-[#1C1C1C] max-h-[440px] overflow-y-auto scrollbar-thin">
        {disruptions.map((dis) => {
          const isSelected = selectedDisruption?.id === dis.id;

          return (
            <button
              key={dis.id}
              onClick={() => handleSelect(dis)}
              className={`w-full p-3 text-left transition-all rounded-lg my-1 flex items-start justify-between gap-3 ${
                isSelected
                  ? 'bg-[#1A1A1A] border border-[#F27D26]/40 shadow-sm'
                  : 'hover:bg-[#141414] border border-transparent'
              }`}
            >
              <div className="flex items-start gap-3 min-w-0">
                <div className="p-2 rounded-lg bg-[#0F0F0F] border border-[#222222] shrink-0 mt-0.5">
                  {getCategoryIcon(dis.category)}
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-white truncate">{dis.title}</span>
                    <span
                      className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded uppercase shrink-0 ${
                        dis.severity === 'critical'
                          ? 'bg-red-500/20 text-red-400'
                          : dis.severity === 'elevated'
                          ? 'bg-amber-500/20 text-amber-400'
                          : 'bg-yellow-500/20 text-yellow-400'
                      }`}
                    >
                      {dis.severity}
                    </span>
                  </div>

                  <p className="text-[11px] text-[#8A8A8A] line-clamp-2 mt-1 leading-relaxed">
                    {dis.summary}
                  </p>

                  <div className="mt-2 flex flex-wrap items-center gap-3 text-[10px] font-mono text-[#666666]">
                    <span>Delay: <strong className="text-red-400">{dis.expectedDelayDays}</strong></span>
                    <span>•</span>
                    <span>Exposure: <strong className="text-white">{formatInrCurrency(dis.revenueAtRiskInr)}</strong></span>
                    <span>•</span>
                    <span>{dis.detectedAt}</span>
                  </div>
                </div>
              </div>

              <ChevronRight className="w-4 h-4 text-[#444444] shrink-0 self-center" />
            </button>
          );
        })}
      </div>
    </Card>
  );
};
