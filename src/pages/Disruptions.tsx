import React, { useState } from 'react';
import {
  AlertTriangle,
  Wind,
  Anchor,
  Truck,
  Globe2,
  Zap,
  Clock,
  ArrowRight,
  Sparkles,
  ExternalLink,
  ShieldAlert,
  Search
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Card, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { formatInrCurrency } from '../lib/calculations';
import { useNavigate } from 'react-router-dom';

export const Disruptions: React.FC = () => {
  const { disruptions, setSelectedDisruption, setSelectedEntity } = useApp();
  const navigate = useNavigate();

  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [search, setSearch] = useState<string>('');

  const filteredDisruptions = disruptions.filter((d) => {
    const matchesCategory = categoryFilter === 'all' || d.category === categoryFilter;
    const matchesSeverity = severityFilter === 'all' || d.severity === severityFilter;
    const matchesSearch =
      d.title.toLowerCase().includes(search.toLowerCase()) ||
      d.locationName.toLowerCase().includes(search.toLowerCase()) ||
      d.summary.toLowerCase().includes(search.toLowerCase());

    return matchesCategory && matchesSeverity && matchesSearch;
  });

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'Weather':
        return <Wind className="w-4 h-4 text-blue-400" />;
      case 'Ports':
        return <Anchor className="w-4 h-4 text-red-400" />;
      case 'Transportation':
        return <Truck className="w-4 h-4 text-amber-400" />;
      case 'Energy':
        return <Zap className="w-4 h-4 text-yellow-400" />;
      default:
        return <Globe2 className="w-4 h-4 text-purple-400" />;
    }
  };

  const handleInspect = (disruption: (typeof disruptions)[0]) => {
    setSelectedDisruption(disruption);
    setSelectedEntity({
      type: disruption.category === 'Weather' ? 'weather' : 'port',
      data: disruption,
    });
    navigate('/');
  };

  return (
    <div className="space-y-5">
      {/* Page Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-[#1E1E1E]">
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-400" />
            <span>Real-Time Disruption Intelligence & Threat Vectors</span>
          </h1>
          <p className="text-xs text-[#808080] mt-0.5">
            Active tracking of weather hazards, port congestions, geopolitical constraints, and carrier delays.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded border border-emerald-500/20">
            OpenWeather & MarineTraffic Feeds Connected
          </span>
        </div>
      </div>

      {/* Filter Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-[#111111] rounded-xl border border-[#222222]">
        <div className="flex flex-wrap items-center gap-2 flex-1">
          <div className="relative flex-1 max-w-xs">
            <Search className="w-3.5 h-3.5 text-[#666666] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search disruption event or region..."
              className="w-full bg-[#161616] text-xs text-white placeholder-[#555555] rounded-lg pl-8 pr-3 py-1.5 border border-[#2A2A2A] focus:outline-none focus:border-[#F27D26]"
            />
          </div>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-[#161616] text-xs text-[#D1D1D1] rounded-lg px-2.5 py-1.5 border border-[#2A2A2A] focus:outline-none"
          >
            <option value="all">Category: ALL</option>
            <option value="Weather">Weather / Storms</option>
            <option value="Ports">Port Hubs</option>
            <option value="Transportation">Transport & Rail</option>
            <option value="Geopolitical">Geopolitical</option>
            <option value="Energy">Energy</option>
          </select>

          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="bg-[#161616] text-xs text-[#D1D1D1] rounded-lg px-2.5 py-1.5 border border-[#2A2A2A] focus:outline-none"
          >
            <option value="all">Severity: ALL</option>
            <option value="critical">Critical</option>
            <option value="elevated">Elevated</option>
            <option value="watch">Watch</option>
          </select>
        </div>

        <span className="text-xs font-mono text-[#777777]">
          <strong>{filteredDisruptions.length}</strong> active threat events
        </span>
      </div>

      {/* Disruption Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredDisruptions.map((dis) => {
          const isCritical = dis.severity === 'critical';

          return (
            <Card
              key={dis.id}
              className={`p-4 sm:p-5 transition-all ${
                isCritical
                  ? 'border-red-500/30 bg-[#120E0E] hover:border-red-500/50'
                  : 'border-[#222222] bg-[#111111] hover:border-[#333333]'
              }`}
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-3 pb-3 border-b border-[#1E1E1E]">
                <div className="flex items-start gap-3 min-w-0">
                  <div className="p-2 rounded-lg bg-[#0F0F0F] border border-[#262626] shrink-0 mt-0.5">
                    {getCategoryIcon(dis.category)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-white tracking-tight truncate">{dis.title}</h3>
                      <Badge variant={dis.severity} size="sm">
                        {dis.severity}
                      </Badge>
                    </div>
                    <p className="text-xs text-[#777777] mt-0.5">{dis.locationName} • {dis.category}</p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-xs font-mono font-bold text-red-400">
                    {dis.expectedDelayDays}
                  </span>
                  <span className="text-[10px] text-[#666666] block font-mono">EST DELAY</span>
                </div>
              </div>

              {/* Summary Description */}
              <p className="text-xs text-[#CCCCCC] mt-3 leading-relaxed">
                {dis.summary}
              </p>

              {/* Cascade Impact Metrics */}
              <div className="grid grid-cols-3 gap-2 my-3 p-2.5 rounded-lg bg-[#0A0A0A] border border-[#1C1C1C] text-[11px] font-mono">
                <div>
                  <span className="text-[#666666] block text-[10px] uppercase">Revenue at Risk</span>
                  <span className="text-white font-bold">{formatInrCurrency(dis.revenueAtRiskInr)}</span>
                </div>
                <div>
                  <span className="text-[#666666] block text-[10px] uppercase">Affected SKUs</span>
                  <span className="text-amber-400 font-bold">
                    {Array.isArray(dis.affectedSkus) ? dis.affectedSkus.length : dis.affectedSkus} SKUs
                  </span>
                </div>
                <div>
                  <span className="text-[#666666] block text-[10px] uppercase">Confidence</span>
                  <span className="text-emerald-400 font-bold">{dis.confidence}%</span>
                </div>
              </div>

              {/* Affected Nodes Pills */}
              {Array.isArray(dis.affectedSkus) && dis.affectedSkus.length > 0 && (
                <div className="space-y-1.5 text-xs">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[10.5px] font-mono text-[#777777]">Impacted SKUs:</span>
                    {dis.affectedSkus.map((sku) => (
                      <span
                        key={sku}
                        className="text-[10.5px] font-mono bg-[#1C1C1C] text-white px-2 py-0.5 rounded border border-[#2C2C2C]"
                      >
                        {sku}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Footer Actions */}
              <div className="mt-4 pt-3 border-t border-[#1E1E1E] flex items-center justify-between">
                <span className="text-[10px] font-mono text-[#666666]">Detected: {dis.detectedAt}</span>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleInspect(dis)}
                    icon={<ArrowRight className="w-3 h-3" />}
                    className="text-xs py-1 px-3"
                  >
                    View on Map
                  </Button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
