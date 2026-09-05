import React, { useState } from 'react';
import {
  Search,
  CheckSquare,
  Square,
  RotateCcw,
  Maximize2,
  AlertTriangle,
  Compass,
  ArrowRight,
  Anchor,
  Factory as FactoryIcon,
  Warehouse as WhIcon,
  Navigation,
  Wind,
  ShieldAlert,
  ChevronDown
} from 'lucide-react';

interface MapLayers {
  suppliers: boolean;
  factories: boolean;
  ports: boolean;
  warehouses: boolean;
  routes: boolean;
  disruptions: boolean;
  weather: boolean;
  alternativeRoute: boolean;
}

interface MapLeftFilterPanelProps {
  layers: MapLayers;
  onToggleLayer: (layerKey: keyof MapLayers) => void;
  onSearchSelect: (query: string) => void;
  onResetView: () => void;
  onFitNetwork: () => void;
  onLiveEvents: () => void;
  onAlternativeRoute: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export const MapLeftFilterPanel: React.FC<MapLeftFilterPanelProps> = ({
  layers,
  onToggleLayer,
  onSearchSelect,
  onResetView,
  onFitNetwork,
  onLiveEvents,
  onAlternativeRoute,
  isCollapsed = false,
  onToggleCollapse
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  const searchableEntities = [
    { title: 'Chennai Port', type: 'port', label: 'Port • Critical', id: 'port-1' },
    { title: 'Shanghai Port', type: 'port', label: 'Port • Watch', id: 'port-shanghai' },
    { title: 'Supplier A (IndoSilicon)', type: 'supplier', label: 'Supplier • Elevated', id: 'sup-1' },
    { title: 'MCU-X1 (Microcontroller)', type: 'sku', label: 'Critical SKU • 87% Risk', id: 'mcu-x1' },
    { title: 'Chennai Warehouse', type: 'warehouse', label: 'Warehouse • 6.8d Supply', id: 'wh-1' },
    { title: 'Shipment #4521', type: 'shipment', label: 'Shipment • Delayed +4d', id: 'shp-4521' },
    { title: 'Cyclone Mandous', type: 'weather', label: 'Disruption • Bay of Bengal', id: 'cyclone' },
    { title: 'Singapore Hub', type: 'port', label: 'Port Hub • Watch', id: 'port-2' },
    { title: 'Mumbai Port (JNPT)', type: 'port', label: 'Alt Port • Healthy', id: 'port-5' }
  ];

  const filteredSuggestions = searchableEntities.filter(e =>
    e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelect = (title: string) => {
    setSearchQuery(title);
    setShowSuggestions(false);
    onSearchSelect(title);
  };

  return (
    <div
      id="map-left-filter-panel"
      className="w-full lg:w-64 bg-[#080808] border-b lg:border-b-0 lg:border-r border-[#1F1F1F] flex flex-col justify-between shrink-0 select-none text-xs font-mono"
    >
      <div className="p-3 space-y-3.5">
        {/* Search Field */}
        <div className="relative">
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded bg-[#111111] border border-[#262626] focus-within:border-[#F27D26] transition-colors">
            <Search className="w-3.5 h-3.5 text-[#666666]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && filteredSuggestions.length > 0) {
                  handleSelect(filteredSuggestions[0].title);
                }
              }}
              placeholder="Search Port, SKU, Supplier..."
              className="bg-transparent text-[11px] text-white placeholder-[#555555] focus:outline-none w-full font-mono"
            />
          </div>

          {/* Autocomplete Dropdown */}
          {showSuggestions && searchQuery.trim().length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 rounded bg-[#0D0D0D] border border-[#2A2A2A] shadow-2xl z-[500] max-h-48 overflow-y-auto">
              {filteredSuggestions.length > 0 ? (
                filteredSuggestions.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleSelect(item.title)}
                    className="w-full px-2.5 py-1.5 text-left hover:bg-[#1A1A1A] flex items-center justify-between border-b border-[#1A1A1A] last:border-0 cursor-pointer transition-colors"
                  >
                    <div>
                      <span className="text-white text-[11px] font-bold block truncate">{item.title}</span>
                      <span className="text-[#888888] text-[9px] block">{item.label}</span>
                    </div>
                    <ArrowRight className="w-3 h-3 text-[#F27D26] shrink-0 ml-1" />
                  </button>
                ))
              ) : (
                <div className="px-3 py-2 text-[10px] text-[#666666]">No matching entities</div>
              )}
            </div>
          )}
        </div>

        {/* Layer Checkboxes */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between pb-1 border-b border-[#1A1A1A]">
            <span className="text-[10px] uppercase font-bold text-[#888888] tracking-wider">
              DATA LAYERS
            </span>
            <span className="text-[9px] text-[#555555]">ACTIVE (8)</span>
          </div>

          <div className="space-y-1 pt-0.5">
            {/* Suppliers */}
            <button
              onClick={() => onToggleLayer('suppliers')}
              className="w-full flex items-center justify-between px-2 py-1.5 rounded hover:bg-[#111111] cursor-pointer transition-colors text-left group"
            >
              <div className="flex items-center gap-2">
                {layers.suppliers ? (
                  <CheckSquare className="w-3.5 h-3.5 text-[#22C55E]" />
                ) : (
                  <Square className="w-3.5 h-3.5 text-[#555555]" />
                )}
                <span className={`text-[11px] ${layers.suppliers ? 'text-white' : 'text-[#666666]'}`}>
                  Suppliers
                </span>
              </div>
              <span className="text-[9px] font-mono px-1 rounded bg-[#141414] text-[#888888] border border-[#1F1F1F]">
                12
              </span>
            </button>

            {/* Ports */}
            <button
              onClick={() => onToggleLayer('ports')}
              className="w-full flex items-center justify-between px-2 py-1.5 rounded hover:bg-[#111111] cursor-pointer transition-colors text-left group"
            >
              <div className="flex items-center gap-2">
                {layers.ports ? (
                  <CheckSquare className="w-3.5 h-3.5 text-[#F27D26]" />
                ) : (
                  <Square className="w-3.5 h-3.5 text-[#555555]" />
                )}
                <span className={`text-[11px] ${layers.ports ? 'text-white' : 'text-[#666666]'}`}>
                  Ports & Terminals
                </span>
              </div>
              <span className="text-[9px] font-mono px-1 rounded bg-[#141414] text-[#CC3333] border border-red-950 font-bold">
                6 (1 Crit)
              </span>
            </button>

            {/* Warehouses */}
            <button
              onClick={() => onToggleLayer('warehouses')}
              className="w-full flex items-center justify-between px-2 py-1.5 rounded hover:bg-[#111111] cursor-pointer transition-colors text-left group"
            >
              <div className="flex items-center gap-2">
                {layers.warehouses ? (
                  <CheckSquare className="w-3.5 h-3.5 text-[#3B82F6]" />
                ) : (
                  <Square className="w-3.5 h-3.5 text-[#555555]" />
                )}
                <span className={`text-[11px] ${layers.warehouses ? 'text-white' : 'text-[#666666]'}`}>
                  Warehouses
                </span>
              </div>
              <span className="text-[9px] font-mono px-1 rounded bg-[#141414] text-[#888888] border border-[#1F1F1F]">
                4
              </span>
            </button>

            {/* Shipments */}
            <button
              onClick={() => onToggleLayer('routes')}
              className="w-full flex items-center justify-between px-2 py-1.5 rounded hover:bg-[#111111] cursor-pointer transition-colors text-left group"
            >
              <div className="flex items-center gap-2">
                {layers.routes ? (
                  <CheckSquare className="w-3.5 h-3.5 text-[#22C55E]" />
                ) : (
                  <Square className="w-3.5 h-3.5 text-[#555555]" />
                )}
                <span className={`text-[11px] ${layers.routes ? 'text-white' : 'text-[#666666]'}`}>
                  Active Shipments
                </span>
              </div>
              <span className="text-[9px] font-mono px-1 rounded bg-[#141414] text-[#CC3333] border border-red-950 font-bold">
                4 (1 Delay)
              </span>
            </button>

            {/* Weather Overlay */}
            <button
              onClick={() => onToggleLayer('weather')}
              className="w-full flex items-center justify-between px-2 py-1.5 rounded hover:bg-[#111111] cursor-pointer transition-colors text-left group"
            >
              <div className="flex items-center gap-2">
                {layers.weather ? (
                  <CheckSquare className="w-3.5 h-3.5 text-[#CC3333]" />
                ) : (
                  <Square className="w-3.5 h-3.5 text-[#555555]" />
                )}
                <span className={`text-[11px] ${layers.weather ? 'text-red-400 font-semibold' : 'text-[#666666]'}`}>
                  Weather / Cyclone
                </span>
              </div>
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
            </button>

            {/* Disruption Zones */}
            <button
              onClick={() => onToggleLayer('disruptions')}
              className="w-full flex items-center justify-between px-2 py-1.5 rounded hover:bg-[#111111] cursor-pointer transition-colors text-left group"
            >
              <div className="flex items-center gap-2">
                {layers.disruptions ? (
                  <CheckSquare className="w-3.5 h-3.5 text-[#FF8800]" />
                ) : (
                  <Square className="w-3.5 h-3.5 text-[#555555]" />
                )}
                <span className={`text-[11px] ${layers.disruptions ? 'text-white' : 'text-[#666666]'}`}>
                  Disruption Zones
                </span>
              </div>
              <span className="text-[9px] font-mono px-1 rounded bg-[#141414] text-[#888888] border border-[#1F1F1F]">
                3
              </span>
            </button>

            {/* AI Alternative Route */}
            <button
              onClick={() => onToggleLayer('alternativeRoute')}
              className="w-full flex items-center justify-between px-2 py-1.5 rounded hover:bg-[#111111] cursor-pointer transition-colors text-left group"
            >
              <div className="flex items-center gap-2">
                {layers.alternativeRoute ? (
                  <CheckSquare className="w-3.5 h-3.5 text-[#F27D26]" />
                ) : (
                  <Square className="w-3.5 h-3.5 text-[#555555]" />
                )}
                <span className={`text-[11px] ${layers.alternativeRoute ? 'text-[#F27D26] font-bold' : 'text-[#666666]'}`}>
                  AI Alt Route
                </span>
              </div>
              <span className="text-[8px] font-mono px-1 rounded bg-green-950/60 text-green-400 border border-green-800">
                -68% Risk
              </span>
            </button>
          </div>
        </div>

        {/* Quick Camera Navigation Controls */}
        <div className="space-y-1.5 pt-1">
          <div className="flex items-center justify-between pb-1 border-b border-[#1A1A1A]">
            <span className="text-[10px] uppercase font-bold text-[#888888] tracking-wider">
              CAMERA PRESETS
            </span>
          </div>

          <div className="grid grid-cols-2 gap-1 pt-0.5">
            <button
              onClick={onResetView}
              className="px-2 py-1.5 rounded bg-[#111111] border border-[#1F1F1F] hover:bg-[#181818] hover:text-white text-[10px] text-[#A0A0A0] flex items-center justify-center gap-1 cursor-pointer transition-colors"
              title="Reset View to Global Network"
            >
              <RotateCcw className="w-3 h-3" />
              <span>RESET VIEW</span>
            </button>

            <button
              onClick={onFitNetwork}
              className="px-2 py-1.5 rounded bg-[#111111] border border-[#1F1F1F] hover:bg-[#181818] hover:text-white text-[10px] text-[#A0A0A0] flex items-center justify-center gap-1 cursor-pointer transition-colors"
              title="Fit Entire Supply Chain Network"
            >
              <Maximize2 className="w-3 h-3" />
              <span>FIT NETWORK</span>
            </button>

            <button
              onClick={onLiveEvents}
              className="px-2 py-1.5 rounded bg-[#1f0f0f] border border-red-900/60 hover:bg-[#2a1414] text-red-300 text-[10px] flex items-center justify-center gap-1 cursor-pointer transition-colors font-bold"
              title="Focus on Active Disruptions"
            >
              <AlertTriangle className="w-3 h-3 text-red-400" />
              <span>LIVE EVENTS</span>
            </button>

            <button
              onClick={onAlternativeRoute}
              className="px-2 py-1.5 rounded bg-[#131b14] border border-green-900/60 hover:bg-[#1a261c] text-green-300 text-[10px] flex items-center justify-center gap-1 cursor-pointer transition-colors font-bold"
              title="Activate and Focus on AI Alternative Corridor"
            >
              <Navigation className="w-3 h-3 text-green-400" />
              <span>ALT ROUTE</span>
            </button>
          </div>
        </div>
      </div>

      {/* Live System Signal Counter at Bottom of Panel */}
      <div className="p-3 border-t border-[#1F1F1F] bg-[#050505] space-y-1">
        <div className="flex items-center justify-between text-[9px] text-[#666666]">
          <span>NETWORK NODES:</span>
          <span className="text-white font-bold">22 Active</span>
        </div>
        <div className="flex items-center justify-between text-[9px] text-[#666666]">
          <span>CORRIDOR STATUS:</span>
          <span className="text-[#CC3333] font-bold">Bay of Bengal Halted</span>
        </div>
        <div className="flex items-center justify-between text-[9px] text-[#666666]">
          <span>INVENTORY EXPOSURE:</span>
          <span className="text-[#F27D26] font-bold">₹54.2L At Risk</span>
        </div>
      </div>
    </div>
  );
};
