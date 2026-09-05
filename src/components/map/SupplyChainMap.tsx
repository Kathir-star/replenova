import React, { useEffect, useRef, useState, useCallback } from 'react';
import L from 'leaflet';
import {
  Layers,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Wind,
  Anchor,
  Warehouse,
  Factory,
  Ship,
  Sparkles,
  RotateCcw,
  Navigation,
  Eye,
  Info
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { getStatusColor } from '../../lib/utils';
import { formatInrCurrency } from '../../lib/calculations';

interface LayerVisibility {
  weather: boolean;
  ports: boolean;
  warehouses: boolean;
  suppliers: boolean;
  routes: boolean;
  vessels: boolean;
  aiAlternative: boolean;
}

export const SupplyChainMap: React.FC<{ className?: string; height?: string }> = ({
  className = '',
  height = 'h-[500px] lg:h-[600px]',
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const layerGroupRef = useRef<L.LayerGroup | null>(null);

  const {
    disruptions,
    ports,
    warehouses,
    suppliers,
    factories,
    shipments,
    routes,
    selectedEntity,
    setSelectedEntity,
  } = useApp();

  const [layers, setLayers] = useState<LayerVisibility>({
    weather: true,
    ports: true,
    warehouses: true,
    suppliers: true,
    routes: true,
    vessels: true,
    aiAlternative: true,
  });

  const [showLayerPanel, setShowLayerPanel] = useState(false);
  const [activeViewMode, setActiveViewMode] = useState<'all' | 'risk' | 'routes'>('all');

  const smoothPanTo = useCallback((lat: number, lng: number, zoomLevel: number = 6) => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([lat, lng], zoomLevel, {
        animate: true,
        duration: 1.2,
      });
    }
  }, []);

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    // Dark tile layer
    const map = L.map(mapContainerRef.current, {
      center: [16.5, 82.0],
      zoom: 4,
      minZoom: 3,
      maxZoom: 12,
      zoomControl: false,
      attributionControl: false,
    });

    // High quality Dark Matter tiles
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
      subdomains: 'abcd',
    }).addTo(map);

    const group = L.layerGroup().addTo(map);
    layerGroupRef.current = group;
    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Render Vector Layers & Markers
  useEffect(() => {
    const map = mapInstanceRef.current;
    const group = layerGroupRef.current;
    if (!map || !group) return;

    group.clearLayers();

    // 1. Weather Disruption Hazards (Cyclone Mandous)
    if (layers.weather) {
      disruptions.forEach((dis) => {
        if (dis.category === 'Weather') {
          // Storm radius outer circle
          const outerCircle = L.circle([dis.lat, dis.lng], {
            radius: 350000,
            color: '#EF4444',
            weight: 1.5,
            dashArray: '6, 6',
            fillColor: '#EF4444',
            fillOpacity: 0.12,
          });

          // Storm core
          const coreCircle = L.circle([dis.lat, dis.lng], {
            radius: 120000,
            color: '#DC2626',
            weight: 2,
            fillColor: '#DC2626',
            fillOpacity: 0.35,
          });

          // Storm icon marker
          const stormIcon = L.divIcon({
            className: 'custom-weather-icon',
            html: `
              <div class="relative flex items-center justify-center cursor-pointer group">
                <div class="absolute w-12 h-12 rounded-full bg-red-500/20 animate-ping"></div>
                <div class="w-9 h-9 rounded-full bg-red-950/90 border-2 border-red-500 flex items-center justify-center text-red-400 shadow-lg shadow-red-500/30">
                  <svg class="w-5 h-5 animate-spin" style="animation-duration: 4s;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M17.7 7.7a2.5 2.5 0 1 1 1.8 4.3H2"/>
                    <path d="M9.6 4.6A2 2 0 1 1 11 8H2"/>
                    <path d="M12.6 19.4A2 2 0 1 0 14 16H2"/>
                  </svg>
                </div>
                <div class="absolute -bottom-7 bg-[#0A0A0A]/95 text-red-400 text-[10px] font-mono font-bold px-2 py-0.5 rounded border border-red-500/40 whitespace-nowrap shadow-md">
                  CYCLONE MANDOUS (CAT-3)
                </div>
              </div>
            `,
            iconSize: [40, 40],
            iconAnchor: [20, 20],
          });

          const stormMarker = L.marker([dis.lat, dis.lng], { icon: stormIcon });
          stormMarker.on('click', () => {
            setSelectedEntity({ type: 'weather', data: dis });
            smoothPanTo(dis.lat, dis.lng, 5);
          });

          outerCircle.addTo(group);
          coreCircle.addTo(group);
          stormMarker.addTo(group);
        }
      });
    }

    // 2. Shipping Routes
    if (layers.routes) {
      // Main ocean route (Shanghai -> Chennai)
      const mainSeaLane: [number, number][] = [
        [31.23, 121.47], // Shanghai
        [22.3, 114.2],  // South China Sea
        [1.35, 103.82],  // Singapore
        [5.9, 95.2],    // Malacca exit
        [10.5, 87.5],   // Bay of Bengal
        [13.08, 80.27],  // Chennai Port
      ];

      const seaPolyline = L.polyline(mainSeaLane, {
        color: '#EF4444',
        weight: 3.5,
        dashArray: '8, 8',
        opacity: 0.85,
      });

      seaPolyline.on('click', () => {
        setSelectedEntity({ type: 'route', data: routes[0] });
      });
      seaPolyline.addTo(group);

      // AI Alternative Bypass Route (Shanghai -> Singapore -> Mumbai JNPT -> Rail to Chennai)
      if (layers.aiAlternative) {
        const altBypassLane: [number, number][] = [
          [1.35, 103.82], // Singapore
          [6.0, 80.2],    // Sri Lanka South
          [14.2, 73.1],   // Arabian Sea
          [18.95, 72.95], // Mumbai JNPT
          [18.52, 73.85], // Pune Rail
          [12.97, 77.59], // Bengaluru ICD
          [13.08, 80.27], // Chennai Depot
        ];

        const altPolyline = L.polyline(altBypassLane, {
          color: '#10B981',
          weight: 3.5,
          opacity: 0.9,
        });

        altPolyline.on('click', () => {
          setSelectedEntity({ type: 'route', data: routes[1] });
        });
        altPolyline.addTo(group);
      }
    }

    // 3. Port Hubs
    if (layers.ports) {
      ports.forEach((port) => {
        const isCritical = port.status === 'critical';
        const color = isCritical ? '#EF4444' : '#10B981';

        const portIcon = L.divIcon({
          className: 'custom-port-marker',
          html: `
            <div class="relative flex items-center justify-center cursor-pointer group">
              <div class="w-8 h-8 rounded-lg bg-[#0F0F0F] border-2 flex items-center justify-center shadow-lg transition-transform group-hover:scale-110" style="border-color: ${color}; color: ${color};">
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="5" r="3"/>
                  <line x1="12" y1="22" x2="12" y2="8"/>
                  <path d="M5 12H2a10 10 0 0 0 20 0h-3"/>
                </svg>
              </div>
              <div class="absolute -bottom-6 bg-[#080808]/95 text-white text-[9px] font-mono px-1.5 py-0.5 rounded border border-[#2D2D2D] whitespace-nowrap opacity-90 group-hover:opacity-100 shadow">
                ${port.name.split('(')[0].trim()}
              </div>
            </div>
          `,
          iconSize: [32, 32],
          iconAnchor: [16, 16],
        });

        const marker = L.marker([port.lat, port.lng], { icon: portIcon });
        marker.on('click', () => {
          setSelectedEntity({ type: 'port', data: port });
          smoothPanTo(port.lat, port.lng, 7);
        });
        marker.addTo(group);
      });
    }

    // 4. Warehouses
    if (layers.warehouses) {
      warehouses.forEach((wh) => {
        const isCritical = wh.riskScore > 70;
        const color = isCritical ? '#EF4444' : wh.riskScore > 30 ? '#F59E0B' : '#10B981';

        const whIcon = L.divIcon({
          className: 'custom-wh-marker',
          html: `
            <div class="relative flex items-center justify-center cursor-pointer group">
              <div class="w-7 h-7 rounded-md bg-[#0F0F0F] border-2 flex items-center justify-center shadow-md transition-transform group-hover:scale-110" style="border-color: ${color}; color: ${color};">
                <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M3 20v-8a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v8"/>
                  <path d="M18 10V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v6"/>
                  <path d="M10 20v-5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v5"/>
                </svg>
              </div>
              <div class="absolute -bottom-5 bg-[#080808]/95 text-white text-[9px] font-mono px-1.5 py-0.2 rounded border border-[#2D2D2D] whitespace-nowrap shadow">
                ${wh.city} Depot
              </div>
            </div>
          `,
          iconSize: [28, 28],
          iconAnchor: [14, 14],
        });

        const marker = L.marker([wh.lat, wh.lng], { icon: whIcon });
        marker.on('click', () => {
          setSelectedEntity({ type: 'warehouse', data: wh });
          smoothPanTo(wh.lat, wh.lng, 8);
        });
        marker.addTo(group);
      });
    }

    // 5. Suppliers & Factories
    if (layers.suppliers) {
      suppliers.slice(0, 6).forEach((sup) => {
        const color = getStatusColor(sup.currentRiskLevel);

        const supIcon = L.divIcon({
          className: 'custom-sup-marker',
          html: `
            <div class="relative flex items-center justify-center cursor-pointer group">
              <div class="w-6 h-6 rounded-full bg-[#0F0F0F] border-2 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform" style="border-color: ${color}; color: ${color};">
                <div class="w-2 h-2 rounded-full" style="background-color: ${color};"></div>
              </div>
              <div class="absolute -bottom-5 bg-[#080808]/90 text-[#CCCCCC] text-[8.5px] font-mono px-1 py-0.2 rounded border border-[#222222] whitespace-nowrap opacity-80 group-hover:opacity-100">
                ${sup.name.split(' ')[0]}
              </div>
            </div>
          `,
          iconSize: [24, 24],
          iconAnchor: [12, 12],
        });

        const marker = L.marker([sup.lat, sup.lng], { icon: supIcon });
        marker.on('click', () => {
          setSelectedEntity({ type: 'supplier', data: sup });
          smoothPanTo(sup.lat, sup.lng, 7);
        });
        marker.addTo(group);
      });
    }

    // 6. Active Vessels (MV EVER BRAVE)
    if (layers.vessels) {
      const primaryVessel = shipments[0];
      if (primaryVessel && primaryVessel.currentCoords) {
        const [vLat, vLng] = primaryVessel.currentCoords;

        const vesselIcon = L.divIcon({
          className: 'custom-vessel-marker',
          html: `
            <div class="relative flex items-center justify-center cursor-pointer group">
              <div class="absolute w-10 h-10 rounded-full bg-red-500/20 animate-ping"></div>
              <div class="w-8 h-8 rounded-full bg-red-950/95 border-2 border-red-500 flex items-center justify-center text-red-400 shadow-xl shadow-red-500/40">
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M2 20a2.4 2.4 0 0 0 2 1 2.4 2.4 0 0 0 2-1 2.4 2.4 0 0 1 2-1 2.4 2.4 0 0 1 2 1 2.4 2.4 0 0 0 2 1 2.4 2.4 0 0 0 2-1 2.4 2.4 0 0 1 2-1 2.4 2.4 0 0 1 2 1 2.4 2.4 0 0 0 2 1 2.4 2.4 0 0 0 2-1"/>
                  <path d="M4 18L3 12h18l-1 6"/>
                  <path d="M12 4v8"/>
                  <path d="M8 8l4-4 4 4"/>
                </svg>
              </div>
              <div class="absolute -bottom-6 bg-[#080808]/95 text-red-400 text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border border-red-500/40 whitespace-nowrap shadow">
                MV EVER BRAVE (#4521)
              </div>
            </div>
          `,
          iconSize: [32, 32],
          iconAnchor: [16, 16],
        });

        const vMarker = L.marker([vLat, vLng], { icon: vesselIcon });
        vMarker.on('click', () => {
          setSelectedEntity({ type: 'shipment', data: primaryVessel });
          smoothPanTo(vLat, vLng, 7);
        });
        vMarker.addTo(group);
      }
    }
  }, [layers, disruptions, ports, warehouses, suppliers, shipments, routes, smoothPanTo]);

  // Center on Selected Entity Changes
  useEffect(() => {
    if (!selectedEntity?.data || !mapInstanceRef.current) return;
    const { data, type } = selectedEntity;

    if (data.lat && data.lng) {
      smoothPanTo(data.lat, data.lng, 6);
    } else if (data.currentCoords) {
      smoothPanTo(data.currentCoords[0], data.currentCoords[1], 6);
    }
  }, [selectedEntity, smoothPanTo]);

  return (
    <div className={`relative rounded-xl overflow-hidden border border-[#242424] bg-[#0A0A0A] ${height} ${className}`}>
      {/* Map DOM Element */}
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* Floating Control Toolbar Top Left */}
      <div className="absolute top-3 left-3 z-10 flex items-center gap-2">
        <div className="p-1.5 rounded-lg bg-[#0F0F0F]/90 backdrop-blur-md border border-[#2A2A2A] shadow-xl flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse ml-1.5 mr-1" />
          <span className="text-[11px] font-mono font-bold text-white uppercase tracking-wider pr-2">
            GLOBAL TELEMETRY STREAM
          </span>
        </div>

        <div className="hidden sm:flex items-center gap-1 bg-[#0F0F0F]/90 backdrop-blur-md border border-[#2A2A2A] rounded-lg p-1 text-xs">
          <button
            onClick={() => setActiveViewMode('all')}
            className={`px-2.5 py-1 rounded text-[11px] font-mono transition-colors ${
              activeViewMode === 'all' ? 'bg-[#262626] text-white font-semibold' : 'text-[#777777] hover:text-white'
            }`}
          >
            All Corridors
          </button>
          <button
            onClick={() => setActiveViewMode('risk')}
            className={`px-2.5 py-1 rounded text-[11px] font-mono transition-colors ${
              activeViewMode === 'risk' ? 'bg-red-500/20 text-red-400 font-semibold' : 'text-[#777777] hover:text-white'
            }`}
          >
            Critical Only
          </button>
        </div>
      </div>

      {/* Floating Layer Toggle Button Top Right */}
      <div className="absolute top-3 right-3 z-10 flex flex-col gap-2">
        <button
          onClick={() => setShowLayerPanel(!showLayerPanel)}
          className={`p-2.5 rounded-lg border backdrop-blur-md transition-all shadow-xl ${
            showLayerPanel
              ? 'bg-[#F27D26] text-white border-[#F27D26]'
              : 'bg-[#121212]/90 text-[#CCCCCC] border-[#2A2A2A] hover:bg-[#1C1C1C]'
          }`}
          title="Toggle Map Layers"
        >
          <Layers className="w-4 h-4" />
        </button>

        <div className="flex flex-col rounded-lg overflow-hidden border border-[#2A2A2A] bg-[#121212]/90 backdrop-blur-md shadow-xl">
          <button
            onClick={() => mapInstanceRef.current?.zoomIn()}
            className="p-2 text-[#CCCCCC] hover:text-white hover:bg-[#202020] transition-colors border-b border-[#242424]"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => mapInstanceRef.current?.zoomOut()}
            className="p-2 text-[#CCCCCC] hover:text-white hover:bg-[#202020] transition-colors border-b border-[#242424]"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={() => smoothPanTo(16.5, 82.0, 4)}
            className="p-2 text-[#CCCCCC] hover:text-white hover:bg-[#202020] transition-colors"
            title="Reset Map View"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Layer Controls Dropdown */}
        {showLayerPanel && (
          <div className="absolute top-12 right-0 w-56 bg-[#111111]/95 backdrop-blur-md border border-[#2E2E2E] rounded-xl p-3 shadow-2xl space-y-2.5 z-20 animate-in fade-in zoom-in-95 duration-150">
            <p className="text-[10px] font-mono uppercase text-[#777777] tracking-wider">Active Map Layers</p>

            <div className="space-y-1.5 text-xs text-[#D1D1D1]">
              <label className="flex items-center justify-between cursor-pointer p-1 rounded hover:bg-[#1A1A1A]">
                <span className="flex items-center gap-2">
                  <Wind className="w-3.5 h-3.5 text-red-400" />
                  <span>Storms & Hazards</span>
                </span>
                <input
                  type="checkbox"
                  checked={layers.weather}
                  onChange={(e) => setLayers({ ...layers, weather: e.target.checked })}
                  className="rounded accent-[#F27D26]"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer p-1 rounded hover:bg-[#1A1A1A]">
                <span className="flex items-center gap-2">
                  <Anchor className="w-3.5 h-3.5 text-blue-400" />
                  <span>Maritime Port Hubs</span>
                </span>
                <input
                  type="checkbox"
                  checked={layers.ports}
                  onChange={(e) => setLayers({ ...layers, ports: e.target.checked })}
                  className="rounded accent-[#F27D26]"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer p-1 rounded hover:bg-[#1A1A1A]">
                <span className="flex items-center gap-2">
                  <Warehouse className="w-3.5 h-3.5 text-amber-400" />
                  <span>Warehouses & Depots</span>
                </span>
                <input
                  type="checkbox"
                  checked={layers.warehouses}
                  onChange={(e) => setLayers({ ...layers, warehouses: e.target.checked })}
                  className="rounded accent-[#F27D26]"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer p-1 rounded hover:bg-[#1A1A1A]">
                <span className="flex items-center gap-2">
                  <Ship className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Active Vessels</span>
                </span>
                <input
                  type="checkbox"
                  checked={layers.vessels}
                  onChange={(e) => setLayers({ ...layers, vessels: e.target.checked })}
                  className="rounded accent-[#F27D26]"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer p-1 rounded hover:bg-[#1A1A1A]">
                <span className="flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-[#10B981]" />
                  <span>AI Alternative Lanes</span>
                </span>
                <input
                  type="checkbox"
                  checked={layers.aiAlternative}
                  onChange={(e) => setLayers({ ...layers, aiAlternative: e.target.checked })}
                  className="rounded accent-[#F27D26]"
                />
              </label>
            </div>
          </div>
        )}
      </div>

      {/* Selected Entity Inspector Bottom Left Overlay */}
      {selectedEntity?.data && (
        <div className="absolute bottom-3 left-3 right-3 sm:right-auto sm:max-w-sm z-10 bg-[#0F0F0F]/95 backdrop-blur-xl border border-[#2D2D2D] rounded-xl p-3.5 shadow-2xl text-xs space-y-2 animate-in slide-in-from-bottom-2 duration-150">
          <div className="flex items-center justify-between gap-2 border-b border-[#222222] pb-2">
            <span className="text-[10px] font-mono uppercase text-[#F27D26] font-bold">
              {selectedEntity.type.toUpperCase()} TELEMETRY
            </span>
            <button
              onClick={() => setSelectedEntity(null)}
              className="text-[#666666] hover:text-white text-xs"
            >
              ✕
            </button>
          </div>

          <div>
            <h4 className="font-bold text-white text-sm">
              {selectedEntity.data.name || selectedEntity.data.title || selectedEntity.data.vesselName || selectedEntity.data.productName}
            </h4>
            <p className="text-[#888888] text-[11px] mt-0.5">
              {selectedEntity.data.summary || selectedEntity.data.notes || selectedEntity.data.carrier || 'Active Node'}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1 border-t border-[#1E1E1E] text-[10.5px] font-mono">
            {selectedEntity.data.expectedDelayDays && (
              <div className="text-red-400 font-bold">
                Delay: {selectedEntity.data.expectedDelayDays}
              </div>
            )}
            {selectedEntity.data.stockoutProbability !== undefined && (
              <div className="text-amber-400 font-bold">
                Stockout Risk: {selectedEntity.data.stockoutProbability}%
              </div>
            )}
            {selectedEntity.data.revenueAtRiskInr && (
              <div className="text-white">
                Exposure: {formatInrCurrency(selectedEntity.data.revenueAtRiskInr)}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Map Legend Bottom Right */}
      <div className="hidden md:flex absolute bottom-3 right-3 z-10 bg-[#0E0E0E]/90 backdrop-blur-md border border-[#242424] rounded-lg p-2.5 text-[10px] font-mono gap-4 text-[#A0A0A0]">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
          <span>Cyclone Hazard</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-0.5 bg-red-500 border-dashed" />
          <span>Stalled Sea Lane</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-0.5 bg-emerald-400" />
          <span>AI Alternate Bypass</span>
        </div>
      </div>
    </div>
  );
};
