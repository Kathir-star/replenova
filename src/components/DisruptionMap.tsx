import React, { useEffect, useRef, useState, useCallback } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  Supplier,
  Warehouse,
  PortHub,
  SupplyRoute,
  ExternalDisruptionEvent,
  RiskLevel,
  Factory,
  ActiveShipment
} from '../types';
import { INITIAL_FACTORIES, INITIAL_ACTIVE_SHIPMENTS } from '../data/mockSupplyChain';
import {
  Activity,
  AlertTriangle,
  Play,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  Radio,
  ArrowRight,
  Maximize2,
  ChevronRight,
  ChevronLeft,
  Flame,
  Clock,
  Compass,
  CheckCircle2,
  Navigation,
  Wind
} from 'lucide-react';
import { MapLeftFilterPanel } from './map/MapLeftFilterPanel';
import { MapRightDetailPanel } from './map/MapRightDetailPanel';
import { MapLegendBar } from './map/MapLegendBar';
import { MapImpactChainBar } from './map/MapImpactChainBar';

interface DisruptionMapProps {
  suppliers: Supplier[];
  warehouses: Warehouse[];
  ports: PortHub[];
  routes: SupplyRoute[];
  disruptions: ExternalDisruptionEvent[];
  factories?: Factory[];
  shipments?: ActiveShipment[];
  onSelectEntity?: (type: string, id: string) => void;
  onNavigateToTab?: (tab: string) => void;
  onSelectProductForReplenishment?: (sku: string) => void;
}

interface MiniTooltipConfig {
  title: string;
  category: string;
  status: RiskLevel | 'critical' | 'elevated' | 'watch' | 'healthy' | 'delayed';
  statusText?: string;
  metrics: Array<{ label: string; value: string; isAlert?: boolean }>;
  detailHint?: string;
}

const renderMiniTooltip = ({
  title,
  category,
  status,
  statusText,
  metrics,
  detailHint = 'Click to center camera'
}: MiniTooltipConfig): string => {
  let statusColor = '#22C55E';
  let badgeBg = 'rgba(34, 197, 94, 0.2)';
  let defaultLabel = 'HEALTHY';
  let dotAnimation = '';

  switch (status) {
    case 'critical':
      statusColor = '#EF4444';
      badgeBg = 'rgba(239, 68, 68, 0.25)';
      defaultLabel = 'CRITICAL';
      dotAnimation = 'animate-ping';
      break;
    case 'elevated':
    case 'delayed':
      statusColor = '#F97316';
      badgeBg = 'rgba(249, 115, 22, 0.25)';
      defaultLabel = 'ELEVATED';
      dotAnimation = 'animate-pulse';
      break;
    case 'watch':
      statusColor = '#EAB308';
      badgeBg = 'rgba(234, 179, 8, 0.25)';
      defaultLabel = 'WATCH';
      break;
    case 'healthy':
    default:
      statusColor = '#22C55E';
      badgeBg = 'rgba(34, 197, 94, 0.22)';
      defaultLabel = 'HEALTHY';
      break;
  }

  const label = statusText || defaultLabel;

  const metricsHtml = metrics
    .map(
      (m) => `
      <div style="display: flex; justify-content: space-between; align-items: center; padding: 2px 0; border-bottom: 1px solid #1C1C1C; font-size: 10px;">
        <span style="color: #9E9E9E;">${m.label}</span>
        <span style="font-family: monospace; font-weight: 700; color: ${m.isAlert ? '#F87171' : '#FFFFFF'};">${m.value}</span>
      </div>
    `
    )
    .join('');

  return `
    <div style="min-width: 220px; text-align: left; user-select: none;">
      <div style="display: flex; justify-content: space-between; align-items: center; gap: 8px; padding-bottom: 5px; border-bottom: 1px solid #2C2C2C;">
        <div style="display: flex; align-items: center; gap: 6px; min-width: 0;">
          <span style="position: relative; display: flex; height: 8px; width: 8px; flex-shrink: 0;">
            ${dotAnimation ? `<span class="${dotAnimation}" style="position: absolute; display: inline-flex; height: 100%; width: 100%; border-radius: 9999px; opacity: 0.75; background-color: ${statusColor};"></span>` : ''}
            <span style="position: relative; display: inline-flex; border-radius: 9999px; height: 8px; width: 8px; background-color: ${statusColor};"></span>
          </span>
          <span style="font-weight: 800; color: #FFFFFF; font-size: 11px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; letter-spacing: 0.02em; text-transform: uppercase;">
            ${title}
          </span>
        </div>
        <span style="padding: 2px 5px; border-radius: 4px; font-size: 8.5px; font-weight: 800; text-transform: uppercase; font-family: monospace; letter-spacing: 0.05em; flex-shrink: 0; background-color: ${badgeBg}; color: ${statusColor}; border: 1px solid ${statusColor};">
          HEALTH: ${label}
        </span>
      </div>

      <div style="font-size: 9px; color: #A3A3A3; font-family: monospace; padding: 4px 0 2px 0;">
        ${category}
      </div>

      <div style="padding-top: 2px;">
        ${metricsHtml}
      </div>

      <div style="margin-top: 6px; padding-top: 4px; border-top: 1px solid #202020; display: flex; justify-content: space-between; align-items: center; font-size: 9px; color: #7A7A7A; font-family: monospace;">
        <span>${detailHint}</span>
        <span style="color: #F27D26; font-weight: 700; letter-spacing: 0.05em;">CENTER ⌖</span>
      </div>
    </div>
  `;
};

export const DisruptionMap: React.FC<DisruptionMapProps> = ({
  suppliers,
  warehouses,
  ports,
  routes,
  disruptions,
  factories = INITIAL_FACTORIES,
  shipments = INITIAL_ACTIVE_SHIPMENTS,
  onSelectEntity,
  onNavigateToTab,
  onSelectProductForReplenishment
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const layerGroupRef = useRef<L.LayerGroup | null>(null);
  const animatedVesselMarkerRef = useRef<L.Marker | null>(null);

  // Core Demo Scenario Stepper (0 to 6)
  // 0: Normal Operations (Healthy baseline, 8.4% risk)
  // 1: Cyclone Detected in Bay of Bengal (Extreme Weather alert)
  // 2: Chennai Port Impact (Port status: Critical, +4d delay)
  // 3: Supplier Impact (Suppliers dependent on port turn Orange)
  // 4: Shipment Impact (Shipment #4521 turns Delayed, Red route)
  // 5: Inventory Impact (Chennai Warehouse turns Red, 87% stockout probability)
  // 6: AI Replenishment & Alternative Route (Loss Avoided ₹54.2L)
  const [demoStep, setDemoStep] = useState<number>(1);
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(false);
  const [isMitigationApplied, setIsMitigationApplied] = useState<boolean>(false);
  const [isScenarioSimActive, setIsScenarioSimActive] = useState<boolean>(false);
  const [weatherSeverity, setWeatherSeverity] = useState<'critical' | 'elevated' | 'watch'>('critical');
  const [vesselProgress, setVesselProgress] = useState<number>(0.72); // Progress along trade corridor

  // Layer Visibility Controls
  const [layers, setLayers] = useState({
    suppliers: true,
    factories: true,
    ports: true,
    warehouses: true,
    routes: true,
    disruptions: true,
    weather: true,
    alternativeRoute: false
  });

  // Selected Entity for Interactive Details Drawer
  const [selectedEntity, setSelectedEntity] = useState<{
    type: 'supplier' | 'factory' | 'port' | 'warehouse' | 'shipment' | 'weather' | 'route' | 'ai-recommendation';
    data: any;
  } | null>({
    type: 'port',
    data: ports.find(p => p.id === 'port-1') || ports[0]
  });

  // Helper: Status Colors
  const getStatusColor = useCallback((status: RiskLevel) => {
    switch (status) {
      case 'critical':
        return '#CC3333';
      case 'elevated':
        return '#FF8800';
      case 'watch':
        return '#EAB308';
      case 'healthy':
      default:
        return '#22C55E';
    }
  }, []);

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    // Create Leaflet Map centered on Eurasia & Indo-Pacific Trade Corridor
    const map = L.map(mapContainerRef.current, {
      center: [16.0, 84.0],
      zoom: 4,
      minZoom: 2,
      maxZoom: 14,
      zoomControl: false,
      attributionControl: false
    });

    // Mount CartoDB Dark Matter tiles (sleek dark aesthetic)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 18,
      subdomains: 'abcd'
    }).addTo(map);

    // Zoom Controls in bottom-right
    L.control.zoom({ position: 'bottomright' }).addTo(map);

    // Dedicated LayerGroup for reactive supply-chain entities
    const layerGroup = L.layerGroup().addTo(map);
    layerGroupRef.current = layerGroup;
    mapInstanceRef.current = map;

    // Invalidate size after layout mounts
    setTimeout(() => {
      map.invalidateSize();
    }, 250);

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Smooth Camera Flight Helper
  const flyToLocation = useCallback((lat: number, lng: number, zoom: number = 6) => {
    if (!mapInstanceRef.current) return;
    mapInstanceRef.current.flyTo([lat, lng], zoom, {
      duration: 1.2,
      easeLinearity: 0.25
    });
  }, []);

  // Smooth Camera Pan & Center Helper
  const smoothPanToEntity = useCallback((lat: number, lng: number, minZoom = 7) => {
    if (!mapInstanceRef.current) return;
    const map = mapInstanceRef.current;
    const currentZoom = map.getZoom();

    if (currentZoom < minZoom) {
      map.flyTo([lat, lng], minZoom, {
        duration: 0.95,
        easeLinearity: 0.25
      });
    } else {
      map.panTo([lat, lng], {
        animate: true,
        duration: 0.75,
        easeLinearity: 0.25
      });
    }
  }, []);

  // Reset View to full network
  const handleResetView = useCallback(() => {
    flyToLocation(16.0, 84.0, 4);
  }, [flyToLocation]);

  // Focus on Chennai Corridor
  const handleFocusChennai = useCallback(() => {
    flyToLocation(13.0844, 80.2925, 7);
  }, [flyToLocation]);

  // Focus on Bay of Bengal Cyclone
  const handleFocusCyclone = useCallback(() => {
    flyToLocation(12.8, 84.5, 5);
  }, [flyToLocation]);

  // Search Select handler
  const handleSearchSelect = useCallback((query: string) => {
    const q = query.toLowerCase();
    if (q.includes('chennai port') || q.includes('port-1')) {
      flyToLocation(13.0844, 80.2925, 7);
      const port = ports.find(p => p.id === 'port-1') || ports[0];
      setSelectedEntity({ type: 'port', data: port });
    } else if (q.includes('shanghai')) {
      flyToLocation(31.2304, 121.4737, 6);
      const port = ports.find(p => p.id === 'port-shanghai') || ports[1] || ports[0];
      setSelectedEntity({ type: 'port', data: port });
    } else if (q.includes('supplier a') || q.includes('indosilicon')) {
      flyToLocation(13.0827, 80.2707, 7);
      const sup = suppliers.find(s => s.id === 'sup-1') || suppliers[0];
      setSelectedEntity({ type: 'supplier', data: sup });
    } else if (q.includes('mcu-x1') || q.includes('sku') || q.includes('microcontroller')) {
      flyToLocation(13.0827, 80.2707, 7);
      const wh = warehouses.find(w => w.id === 'wh-1') || warehouses[0];
      setSelectedEntity({
        type: 'warehouse',
        data: {
          ...wh,
          skuAtRisk: 'MCU-X1 (Automotive Microcontroller)',
          stockoutRisk: 87.0
        }
      });
    } else if (q.includes('chennai warehouse') || q.includes('wh-1')) {
      flyToLocation(13.0827, 80.2707, 7);
      const wh = warehouses.find(w => w.id === 'wh-1') || warehouses[0];
      setSelectedEntity({ type: 'warehouse', data: wh });
    } else if (q.includes('shipment') || q.includes('4521') || q.includes('ever brave')) {
      flyToLocation(11.8, 85.2, 6);
      setSelectedEntity({
        type: 'route',
        data: {
          from: 'Shanghai Port',
          to: 'Chennai Port',
          name: 'Shipment Route #4521 (MV EVER BRAVE)'
        }
      });
    } else if (q.includes('cyclone') || q.includes('mandous') || q.includes('weather')) {
      flyToLocation(12.8, 84.5, 5);
      setSelectedEntity({
        type: 'weather',
        data: {
          title: 'Cyclone Mandous (Category 3)',
          severity: 'critical'
        }
      });
    } else if (q.includes('singapore')) {
      flyToLocation(1.2644, 103.8219, 6);
      const port = ports.find(p => p.id === 'port-2') || ports[0];
      setSelectedEntity({ type: 'port', data: port });
    } else if (q.includes('mumbai') || q.includes('jnpt')) {
      flyToLocation(18.95, 72.95, 6);
      const port = ports.find(p => p.id === 'port-5') || ports[0];
      setSelectedEntity({ type: 'port', data: port });
    }
  }, [ports, suppliers, warehouses, flyToLocation]);

  // Render Map Features & Entities
  useEffect(() => {
    const map = mapInstanceRef.current;
    const layerGroup = layerGroupRef.current;
    if (!map || !layerGroup) return;

    // Clear previous dynamic layers
    layerGroup.clearLayers();

    // -------------------------------------------------------------
    // 1. DYNAMIC WEATHER ALERT LAYER & CYCLONE DISRUPTION ZONE
    // -------------------------------------------------------------
    const showCyclone = layers.weather && (demoStep >= 1 || isScenarioSimActive);
    if (showCyclone) {
      const weatherDisruption = disruptions.find(d => d.category === 'Weather' || d.title.toLowerCase().includes('cyclone')) || {
        lat: 12.8,
        lng: 84.5,
        title: 'Cyclone Mandous (Category 3)',
        severity: weatherSeverity
      };
      const cycloneLat = weatherDisruption.lat || 12.8;
      const cycloneLng = weatherDisruption.lng || 84.5;
      const radiusMeters = 380000; // ~380km radius

      let stormColor = '#CC3333';
      let stormGlowColor = 'rgba(204, 51, 51, 0.45)';
      let stormRgb = '204, 51, 51';
      let severityBadge = 'CRITICAL / CAT 3';
      let windSpeed = '165 km/h';
      let centralPressure = '960 hPa';
      let overlayClass = 'weather-overlay-critical';
      let spinSpeed = '6s';

      if (weatherSeverity === 'elevated') {
        stormColor = '#FF8800';
        stormGlowColor = 'rgba(255, 136, 0, 0.4)';
        stormRgb = '255, 136, 0';
        severityBadge = 'ELEVATED / CAT 1';
        windSpeed = '125 km/h';
        centralPressure = '980 hPa';
        overlayClass = 'weather-overlay-elevated';
        spinSpeed = '10s';
      } else if (weatherSeverity === 'watch') {
        stormColor = '#EAB308';
        stormGlowColor = 'rgba(234, 179, 8, 0.3)';
        stormRgb = '234, 179, 8';
        severityBadge = 'WATCH / DEPRESSION';
        windSpeed = '75 km/h';
        centralPressure = '995 hPa';
        overlayClass = 'weather-overlay-watch';
        spinSpeed = '14s';
      }

      // Geographic Reference Circles
      L.circle([cycloneLat, cycloneLng], {
        radius: radiusMeters,
        color: stormColor,
        weight: 1.5,
        opacity: 0.5,
        dashArray: '6, 6',
        fillColor: stormColor,
        fillOpacity: 0.05,
        className: 'cyclone-radar-wave'
      }).addTo(layerGroup);

      L.circle([cycloneLat, cycloneLng], {
        radius: 170000,
        color: stormColor,
        weight: 1,
        opacity: 0.75,
        fillColor: stormColor,
        fillOpacity: 0.16
      }).addTo(layerGroup);

      // Translucent CSS-animated circular overlays pulsing to represent severity
      const dynamicWeatherOverlayIcon = L.divIcon({
        className: 'custom-geo-marker',
        html: `
          <div class="relative flex items-center justify-center ${overlayClass} map-marker-interactive group" style="width: 240px; height: 240px;">
            <div class="absolute inset-0 rounded-full border border-[${stormColor}]/40 pulse-ring-1 pointer-events-none"
                 style="border-color: ${stormColor}; background: radial-gradient(circle, ${stormGlowColor} 0%, rgba(${stormRgb}, 0) 72%);"></div>
            <div class="absolute inset-4 rounded-full border border-[${stormColor}]/60 pulse-ring-2 pointer-events-none"
                 style="border-color: ${stormColor};"></div>
            <div class="absolute inset-8 rounded-full border border-[${stormColor}]/80 pulse-ring-3 pointer-events-none"
                 style="border-color: ${stormColor};"></div>
            <div class="absolute w-24 h-24 rounded-full core-pulse pointer-events-none"
                 style="background: radial-gradient(circle, rgba(${stormRgb}, 0.7) 0%, rgba(${stormRgb}, 0.15) 80%); border: 1.5px solid ${stormColor};"></div>
            <div class="absolute inset-0 weather-radar-arm flex items-center justify-center pointer-events-none">
              <div class="w-1/2 h-[1.5px] origin-right ml-auto"
                   style="background: linear-gradient(to right, transparent, ${stormColor}); box-shadow: 0 0 8px ${stormColor};"></div>
            </div>
            <div class="marker-box relative z-10 w-10 h-10 rounded-full bg-[#080808]/95 border-2 flex items-center justify-center shadow-2xl transition-all cursor-pointer pointer-events-auto"
                 style="border-color: ${stormColor}; box-shadow: 0 0 20px ${stormColor};">
              <svg class="w-5 h-5 animate-spin group-hover:scale-115 transition-transform" style="color: ${stormColor}; animation-duration: ${spinSpeed};" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
              </svg>
            </div>
            <div class="marker-label absolute -bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap text-[9px] font-mono font-bold px-2 py-0.5 rounded bg-[#0A0A0A] text-white border border-[#333333] transition-all pointer-events-none">
              ⚠️ ${weatherDisruption.title || 'CYCLONE MANDOUS'}
            </div>
          </div>
        `,
        iconSize: [240, 240],
        iconAnchor: [120, 120]
      });

      const weatherMarker = L.marker([cycloneLat, cycloneLng], {
        icon: dynamicWeatherOverlayIcon,
        zIndexOffset: 300
      }).addTo(layerGroup);

      weatherMarker.bindTooltip(
        renderMiniTooltip({
          title: 'CYCLONE MANDOUS',
          category: 'Bay of Bengal Maritime Hazard Zone',
          status: 'critical',
          statusText: severityBadge,
          metrics: [
            { label: 'Max Sustained Winds:', value: windSpeed, isAlert: true },
            { label: 'Barometric Pressure:', value: centralPressure },
            { label: 'Hazard Radius:', value: '380 km Radius', isAlert: true }
          ],
          detailHint: 'Click to center cyclone'
        }),
        { className: 'replenova-mini-tooltip', direction: 'top', offset: [0, -20] }
      );

      weatherMarker.on('mouseover', () => weatherMarker.setZIndexOffset(1000));
      weatherMarker.on('mouseout', () => weatherMarker.setZIndexOffset(300));
      weatherMarker.on('click', () => {
        smoothPanToEntity(cycloneLat, cycloneLng, 5);
        setSelectedEntity({
          type: 'weather',
          data: {
            title: 'Cyclone Mandous (Category 3)',
            severity: weatherSeverity
          }
        });
      });

      // Forecast Track (Dotted trajectory towards North-West)
      const forecastWaypoints: [number, number][] = [
        [cycloneLat - 1.2, cycloneLng + 2.0],
        [cycloneLat, cycloneLng],
        [cycloneLat + 1.2, cycloneLng - 1.5],
        [cycloneLat + 2.1, cycloneLng - 2.8]
      ];
      L.polyline(forecastWaypoints, {
        color: stormColor,
        weight: 2,
        dashArray: '4, 6',
        opacity: 0.8
      }).addTo(layerGroup);
    }

    // -------------------------------------------------------------
    // 2. SHIPMENT ROUTES (Polylines along actual trade coordinates)
    // -------------------------------------------------------------
    if (layers.routes) {
      const isDisrupted = demoStep >= 4 || isScenarioSimActive;
      const shanghaiToChennaiCoords: [number, number][] = [
        [31.2304, 121.4737], // Shanghai
        [22.28, 114.15],     // South China Sea
        [1.2644, 103.8219],   // Singapore Port
        [5.9, 95.2],         // Malacca Strait exit
        [11.8, 85.2],        // Bay of Bengal
        [13.0844, 80.2925],  // Chennai Port
        [13.0827, 80.2707]   // Chennai Warehouse
      ];

      const mainRouteColor = isDisrupted ? '#CC3333' : '#22C55E';
      const mainRoutePolyline = L.polyline(shanghaiToChennaiCoords, {
        color: mainRouteColor,
        weight: isDisrupted ? 3.5 : 2.5,
        opacity: 0.85,
        className: isDisrupted ? 'route-dash-delayed' : 'route-dash-normal'
      }).addTo(layerGroup);

      mainRoutePolyline.bindTooltip(
        renderMiniTooltip({
          title: 'SHANGHAI → CHENNAI ROUTE',
          category: 'Trans-Oceanic Freight Lane',
          status: isDisrupted ? 'critical' : 'healthy',
          statusText: isDisrupted ? 'DELAYED (+4d)' : 'ON SCHEDULE',
          metrics: [
            { label: 'Active Vessel:', value: 'MV EVER BRAVE (#4521)' },
            { label: 'Cargo:', value: '4,500 MCU-X1 Units' },
            { label: 'Route Risk:', value: isDisrupted ? 'High (Cyclone Intercept)' : 'Nominal', isAlert: isDisrupted }
          ],
          detailHint: 'Click to center route waypoint'
        }),
        { className: 'replenova-mini-tooltip' }
      );

      mainRoutePolyline.on('click', (e) => {
        if (e.latlng) {
          smoothPanToEntity(e.latlng.lat, e.latlng.lng);
        }
        setSelectedEntity({
          type: 'route',
          data: {
            name: 'Trans-Pacific/Indian Ocean Route (Shanghai → Chennai)',
            from: 'Shanghai Port',
            to: 'Chennai Central Hub',
            status: isDisrupted ? 'critical' : 'healthy',
            delayDays: isDisrupted ? 4 : 0
          }
        });
      });

      // Secondary Route: Penang to Colombo to Chennai
      const penangToChennaiCoords: [number, number][] = [
        [5.4164, 100.3327],
        [6.9497, 79.8436],
        [13.0844, 80.2925]
      ];
      L.polyline(penangToChennaiCoords, {
        color: isDisrupted ? '#FF8800' : '#22C55E',
        weight: 2,
        opacity: 0.7,
        className: isDisrupted ? 'route-dash-delayed' : 'route-dash-normal'
      }).addTo(layerGroup);

      // Domestic Inter-warehouse Link: Bengaluru to Chennai
      L.polyline([[12.9716, 77.5946], [13.0827, 80.2707]], {
        color: isMitigationApplied ? '#22C55E' : '#888888',
        weight: isMitigationApplied ? 3 : 1.5,
        opacity: 0.9,
        dashArray: isMitigationApplied ? '4, 4' : '2, 4',
        className: isMitigationApplied ? 'route-dash-normal' : ''
      }).addTo(layerGroup);
    }

    // -------------------------------------------------------------
    // 3. ALTERNATIVE AI ROUTE (Shanghai -> Singapore -> Mumbai -> Chennai)
    // -------------------------------------------------------------
    const showAltRoute = layers.alternativeRoute || isMitigationApplied || (demoStep >= 6);
    if (showAltRoute) {
      const altRouteCoords: [number, number][] = [
        [31.2304, 121.4737], // Shanghai
        [1.2644, 103.8219],   // Singapore Port
        [5.9, 80.5],         // Southern Sri Lanka bypass
        [15.0, 71.8],        // Arabian Sea
        [18.95, 72.95],      // Nhava Sheva (Mumbai Port)
        [15.5, 76.5],        // Dedicated Freight Corridor
        [13.0827, 80.2707]   // Chennai Warehouse
      ];

      const altPolyline = L.polyline(altRouteCoords, {
        color: '#F27D26',
        weight: 3.5,
        opacity: 0.95,
        className: 'route-dash-alternative'
      }).addTo(layerGroup);

      altPolyline.bindTooltip(
        renderMiniTooltip({
          title: 'AI ALTERNATIVE ROUTE',
          category: 'Western Coastal Bypass via Mumbai JNPT',
          status: 'healthy',
          statusText: 'OPTIMAL (-68% RISK)',
          metrics: [
            { label: 'Transit Delay:', value: '+1d only' },
            { label: 'Risk Reduction:', value: '87% → 17%' },
            { label: 'Protected Revenue:', value: '₹54.2L' }
          ],
          detailHint: 'Click to center route bypass'
        }),
        { className: 'replenova-mini-tooltip' }
      );

      altPolyline.on('click', (e) => {
        if (e.latlng) {
          smoothPanToEntity(e.latlng.lat, e.latlng.lng);
        }
        setSelectedEntity({
          type: 'route',
          data: {
            name: 'AI Recommended Alternative Route: Western Coastal Bypass',
            from: 'Shanghai Port (Via Singapore)',
            to: 'Chennai Central Hub via Mumbai JNPT + Dedicated Rail Express',
            status: 'healthy',
            delayDays: 1
          }
        });
      });

      // Animated Waypoint Tag on Alternative Route
      const altBadgeIcon = L.divIcon({
        className: 'custom-geo-marker',
        html: `
          <div class="map-marker-interactive group">
            <div class="marker-box px-2.5 py-1 rounded bg-[#0A0A0A] border border-[#F27D26] text-[#F27D26] text-[9px] font-mono font-bold shadow-lg flex items-center gap-1.5 transition-all">
              <span class="w-1.5 h-1.5 rounded-full bg-[#F27D26] animate-ping"></span>
              <span>ALT ROUTE (-68% RISK)</span>
            </div>
          </div>
        `,
        iconSize: [140, 26],
        iconAnchor: [70, 13]
      });

      const altBadgeMarker = L.marker([16.5, 72.2], { icon: altBadgeIcon }).addTo(layerGroup);
      altBadgeMarker.bindTooltip(
        renderMiniTooltip({
          title: 'AI ALTERNATIVE ROUTE WAYPOINT',
          category: 'Arabian Sea Maritime Bypass Corridor',
          status: 'healthy',
          statusText: 'HEALTHY (OPTIMAL)',
          metrics: [
            { label: 'Port Entry:', value: 'Mumbai JNPT Terminal' },
            { label: 'Intermodal Transfer:', value: 'Dedicated Rail Express' },
            { label: 'Mitigation Status:', value: 'Ready to Dispatch' }
          ],
          detailHint: 'Click to center waypoint'
        }),
        { className: 'replenova-mini-tooltip', direction: 'top', offset: [0, -12] }
      );

      altBadgeMarker.on('mouseover', () => altBadgeMarker.setZIndexOffset(1000));
      altBadgeMarker.on('mouseout', () => altBadgeMarker.setZIndexOffset(0));
      altBadgeMarker.on('click', () => {
        smoothPanToEntity(16.5, 72.2, 5);
        setSelectedEntity({
          type: 'route',
          data: {
            name: 'AI Recommended Alternative Route: Western Coastal Bypass',
            from: 'Shanghai Port (Via Singapore)',
            to: 'Chennai Central Hub via Mumbai JNPT + Dedicated Rail Express',
            status: 'healthy',
            delayDays: 1
          }
        });
      });
    }

    // -------------------------------------------------------------
    // 4. PORTS LAYER (Anchor Markers with high-contrast hover & pan)
    // -------------------------------------------------------------
    if (layers.ports) {
      ports.forEach((port) => {
        let portStatus: RiskLevel = 'healthy';
        let delay = port.avgDelayDays;

        if (port.id === 'port-1') {
          // Chennai Port
          portStatus = (demoStep >= 2 || isScenarioSimActive) ? 'critical' : 'healthy';
          delay = (demoStep >= 2 || isScenarioSimActive) ? 4.8 : 0.6;
        } else if (port.id === 'port-3') {
          portStatus = (demoStep >= 2) ? 'elevated' : 'healthy';
        } else if (port.id === 'port-2' || port.id === 'port-shanghai') {
          portStatus = (demoStep >= 1) ? 'watch' : 'healthy';
        }

        const color = getStatusColor(portStatus);
        const isCritical = portStatus === 'critical';

        const portIcon = L.divIcon({
          className: 'custom-geo-marker',
          html: `
            <div class="map-marker-interactive group">
              <div class="marker-box w-7 h-7 rounded bg-[#0A0A0A] border ${isCritical ? 'border-red-500 shadow-red-950/80 ring-2 ring-red-500/50' : 'border-[#2A2A2A]'} flex items-center justify-center shadow-md">
                <svg class="w-4 h-4 transition-transform group-hover:scale-110" style="color: ${color};" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="5" r="3"/>
                  <line x1="12" y1="22" x2="12" y2="8"/>
                  <path d="M5 12H2a10 10 0 0 0 20 0h-3"/>
                </svg>
              </div>
              ${isCritical ? '<span class="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-red-500 animate-ping"></span>' : ''}
              <span class="marker-label absolute -bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-[#0A0A0A]/95 text-white border border-[#2A2A2A]">
                ⚓ ${port.name.split(' ')[0]}
              </span>
            </div>
          `,
          iconSize: [28, 28],
          iconAnchor: [14, 14]
        });

        const marker = L.marker([port.lat, port.lng], { icon: portIcon }).addTo(layerGroup);

        marker.bindTooltip(
          renderMiniTooltip({
            title: port.name,
            category: `${port.city}, ${port.country} • Maritime Hub`,
            status: portStatus,
            statusText: portStatus.toUpperCase(),
            metrics: [
              { label: 'Avg Dwell Delay:', value: `+${delay}d`, isAlert: isCritical },
              { label: 'Berth Congestion:', value: isCritical ? '94% (High)' : '35% (Normal)', isAlert: isCritical },
              { label: 'Waiting Vessels:', value: `${isCritical ? 19 : port.activeVesselsWaiting} ships` }
            ],
            detailHint: 'Click to center port'
          }),
          { className: 'replenova-mini-tooltip', direction: 'top', offset: [0, -12] }
        );

        marker.on('mouseover', () => marker.setZIndexOffset(1000));
        marker.on('mouseout', () => marker.setZIndexOffset(0));
        marker.on('click', () => {
          smoothPanToEntity(port.lat, port.lng, 7);
          setSelectedEntity({
            type: 'port',
            data: {
              ...port,
              status: portStatus,
              avgDelayDays: delay,
              activeVesselsWaiting: isCritical ? 19 : port.activeVesselsWaiting,
              affectedShipments: isCritical ? 14 : port.affectedShipments
            }
          });
          onSelectEntity?.('port', port.id);
        });
      });
    }

    // -------------------------------------------------------------
    // 5. SUPPLIERS LAYER (High-contrast hover & pan)
    // -------------------------------------------------------------
    if (layers.suppliers) {
      suppliers.forEach((sup) => {
        let supStatus: RiskLevel = 'healthy';
        if (sup.id === 'sup-1' || sup.id === 'sup-3' || sup.id === 'sup-11') {
          supStatus = (demoStep >= 3 || isScenarioSimActive) ? 'elevated' : 'healthy';
          if (demoStep >= 4 && sup.id === 'sup-11') supStatus = 'critical';
        }

        const color = getStatusColor(supStatus);
        const isAlert = supStatus === 'critical' || supStatus === 'elevated';

        const supIcon = L.divIcon({
          className: 'custom-geo-marker',
          html: `
            <div class="map-marker-interactive group">
              <div class="marker-box w-6 h-6 rounded bg-[#0A0A0A] border-2 flex items-center justify-center shadow-md" style="border-color: ${color};">
                <svg class="w-3.5 h-3.5 transition-transform group-hover:scale-110" style="color: ${color};" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M2 20a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8l-7 5V8l-7 5V4a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"/>
                </svg>
              </div>
              ${isAlert ? `<span class="absolute -top-1 -right-1 w-2 h-2 rounded-full animate-ping" style="background-color: ${color};"></span>` : ''}
              <span class="marker-label absolute -bottom-3.5 left-1/2 -translate-x-1/2 whitespace-nowrap text-[8px] font-mono px-1 rounded bg-[#0A0A0A]/95 text-[#D1D1D1] border border-[#2A2A2A]">
                🏭 ${sup.name.split(' ')[0]}
              </span>
            </div>
          `,
          iconSize: [24, 24],
          iconAnchor: [12, 12]
        });

        const marker = L.marker([sup.lat, sup.lng], { icon: supIcon }).addTo(layerGroup);

        marker.bindTooltip(
          renderMiniTooltip({
            title: sup.name,
            category: `${sup.location} • Supplier`,
            status: supStatus,
            statusText: supStatus.toUpperCase(),
            metrics: [
              { label: 'Reliability Score:', value: `${sup.reliabilityScore}%` },
              { label: 'Average Lead Time:', value: `${sup.averageLeadTimeDays}d`, isAlert: isAlert },
              { label: 'Active Shipments:', value: `${sup.activeShipmentsCount || 8} batches` }
            ],
            detailHint: 'Click to center supplier'
          }),
          { className: 'replenova-mini-tooltip', direction: 'top', offset: [0, -10] }
        );

        marker.on('mouseover', () => marker.setZIndexOffset(1000));
        marker.on('mouseout', () => marker.setZIndexOffset(0));
        marker.on('click', () => {
          smoothPanToEntity(sup.lat, sup.lng, 7);
          setSelectedEntity({
            type: 'supplier',
            data: {
              ...sup,
              currentRiskLevel: supStatus
            }
          });
          onSelectEntity?.('supplier', sup.id);
        });
      });
    }

    // -------------------------------------------------------------
    // 5B. FACTORIES LAYER (Manufacturing Plants)
    // -------------------------------------------------------------
    if (layers.factories && factories) {
      factories.forEach((fac) => {
        const facStatus: RiskLevel = fac.status || 'healthy';
        const color = getStatusColor(facStatus);
        const isWatch = facStatus === 'watch' || facStatus === 'elevated';

        const facIcon = L.divIcon({
          className: 'custom-geo-marker',
          html: `
            <div class="map-marker-interactive group">
              <div class="marker-box w-6 h-6 rounded bg-[#0A0A0A] border-2 flex items-center justify-center shadow-md" style="border-color: ${color};">
                <svg class="w-3.5 h-3.5 transition-transform group-hover:scale-110" style="color: ${color};" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
                  <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
                </svg>
              </div>
              ${isWatch ? `<span class="absolute -top-1 -right-1 w-2 h-2 rounded-full animate-ping" style="background-color: ${color};"></span>` : ''}
              <span class="marker-label absolute -bottom-3.5 left-1/2 -translate-x-1/2 whitespace-nowrap text-[8px] font-mono px-1 rounded bg-[#0A0A0A]/95 text-[#D1D1D1] border border-[#2A2A2A]">
                ⚙️ ${fac.city || fac.name.split(' ')[0]}
              </span>
            </div>
          `,
          iconSize: [24, 24],
          iconAnchor: [12, 12]
        });

        const marker = L.marker([fac.lat, fac.lng], { icon: facIcon }).addTo(layerGroup);

        marker.bindTooltip(
          renderMiniTooltip({
            title: fac.name,
            category: `${fac.location || fac.city} • Production Plant`,
            status: facStatus,
            statusText: facStatus.toUpperCase(),
            metrics: [
              { label: 'Current Output:', value: `${fac.currentOutputPct || 91}%` },
              { label: 'Output Capacity:', value: `${(fac.capacityUnitsPerDay || 20000).toLocaleString()}/day` },
              { label: 'Primary Lines:', value: fac.primaryProducts?.slice(0, 2).join(', ') || 'Sensors' }
            ],
            detailHint: 'Click to center factory'
          }),
          { className: 'replenova-mini-tooltip', direction: 'top', offset: [0, -10] }
        );

        marker.on('mouseover', () => marker.setZIndexOffset(1000));
        marker.on('mouseout', () => marker.setZIndexOffset(0));
        marker.on('click', () => {
          smoothPanToEntity(fac.lat, fac.lng, 7);
          setSelectedEntity({
            type: 'factory',
            data: fac
          });
          onSelectEntity?.('factory', fac.id);
        });
      });
    }

    // -------------------------------------------------------------
    // 6. WAREHOUSES LAYER (High-contrast hover & pan)
    // -------------------------------------------------------------
    if (layers.warehouses) {
      warehouses.forEach((wh) => {
        let whStatus: RiskLevel = 'healthy';
        let stockoutRisk = 8.4;

        if (wh.id === 'wh-1') {
          if (isMitigationApplied) {
            whStatus = 'healthy';
            stockoutRisk = 17.0;
          } else if (demoStep >= 5 || isScenarioSimActive) {
            whStatus = 'critical';
            stockoutRisk = 87.0;
          }
        }

        const color = getStatusColor(whStatus);
        const isCritical = whStatus === 'critical';

        const whIcon = L.divIcon({
          className: 'custom-geo-marker',
          html: `
            <div class="map-marker-interactive group">
              <div class="marker-box w-7 h-7 rounded bg-[#0A0A0A] border ${isCritical ? 'border-red-500 shadow-red-950/80 animate-pulse ring-2 ring-red-500/50' : 'border-[#2A2A2A]'} flex items-center justify-center shadow-md">
                <svg class="w-4 h-4 transition-transform group-hover:scale-110" style="color: ${color};" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                  <polyline points="9 22 9 12 15 12 15 22"/>
                </svg>
              </div>
              ${isCritical ? '<span class="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-red-500 animate-ping"></span>' : ''}
              <span class="marker-label absolute -bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-[#0A0A0A]/95 text-white border border-[#2A2A2A]">
                📦 ${wh.city}
              </span>
            </div>
          `,
          iconSize: [28, 28],
          iconAnchor: [14, 14]
        });

        const marker = L.marker([wh.lat, wh.lng], { icon: whIcon }).addTo(layerGroup);

        marker.bindTooltip(
          renderMiniTooltip({
            title: wh.name,
            category: `${wh.city} • Distribution Warehouse`,
            status: whStatus,
            statusText: `${whStatus.toUpperCase()} (${stockoutRisk}% RISK)`,
            metrics: [
              { label: 'Stockout Risk:', value: `${stockoutRisk}%`, isAlert: isCritical },
              { label: 'Days of Supply:', value: wh.id === 'wh-1' ? '6.8d' : '14.2d', isAlert: isCritical },
              { label: 'Current Inventory:', value: `${wh.currentStockUnits.toLocaleString()} units` }
            ],
            detailHint: 'Click to center warehouse'
          }),
          { className: 'replenova-mini-tooltip', direction: 'top', offset: [0, -12] }
        );

        marker.on('mouseover', () => marker.setZIndexOffset(1000));
        marker.on('mouseout', () => marker.setZIndexOffset(0));
        marker.on('click', () => {
          smoothPanToEntity(wh.lat, wh.lng, 7);
          setSelectedEntity({
            type: 'warehouse',
            data: {
              ...wh,
              status: whStatus,
              stockoutRisk,
              skuAtRisk: wh.id === 'wh-1' ? 'MCU-X1 (Automotive Microcontroller)' : 'None'
            }
          });
          onSelectEntity?.('warehouse', wh.id);
        });
      });
    }

    // -------------------------------------------------------------
    // 7. ANIMATED SHIPMENT (MV EVER BRAVE along Shanghai -> Chennai)
    // -------------------------------------------------------------
    if (layers.routes) {
      // Dynamic coordinate calculation along shipping lane
      const isDelayedInBay = (demoStep >= 4 || isScenarioSimActive);
      const vesselCoords: [number, number] = isDelayedInBay ? [11.8, 85.2] : [8.5, 91.0];
      const vesselColor = isDelayedInBay ? '#CC3333' : '#22C55E';

      const vesselIcon = L.divIcon({
        className: 'custom-geo-marker',
        html: `
          <div class="map-marker-interactive group">
            <div class="marker-box w-8 h-8 rounded-full bg-[#0A0A0A] border-2 flex items-center justify-center shadow-2xl" style="border-color: ${vesselColor};">
              <svg class="w-4 h-4 transition-transform group-hover:scale-110" style="color: ${vesselColor};" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M2 21c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1 .6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/>
                <path d="M19.38 20A11.6 11.6 0 0 0 21 14l-9-4-9 4c0 2.9.94 5.34 2.81 7.76"/>
                <path d="M19 13V7a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v6"/>
                <path d="M12 10v4"/>
                <path d="M12 2v3"/>
              </svg>
            </div>
            ${isDelayedInBay ? '<span class="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-red-500 animate-ping"></span>' : '<span class="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>'}
            <div class="marker-label absolute -bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap text-[8px] font-mono font-bold px-1.5 py-0.5 rounded bg-[#0A0A0A] text-white border border-[#333333] transition-all">
              🚢 EVER BRAVE (#4521)
            </div>
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });

      const vesselMarker = L.marker(vesselCoords, { icon: vesselIcon }).addTo(layerGroup);
      animatedVesselMarkerRef.current = vesselMarker;

      vesselMarker.bindTooltip(
        renderMiniTooltip({
          title: 'MV EVER BRAVE (#4521)',
          category: 'Container Vessel • Shanghai → Chennai',
          status: isDelayedInBay ? 'delayed' : 'healthy',
          statusText: isDelayedInBay ? 'DELAYED (+4d)' : 'ON SCHEDULE',
          metrics: [
            { label: 'Current Status:', value: isDelayedInBay ? 'Cyclone Sea Hold' : 'Underway', isAlert: isDelayedInBay },
            { label: 'Cargo In Transit:', value: '4,500 MCU-X1 Units' },
            { label: 'Predicted ETA:', value: isDelayedInBay ? 'Sep 12 (+4d)' : 'Sep 8', isAlert: isDelayedInBay }
          ],
          detailHint: 'Click to center vessel'
        }),
        { className: 'replenova-mini-tooltip', direction: 'top', offset: [0, -14] }
      );

      vesselMarker.on('mouseover', () => vesselMarker.setZIndexOffset(1000));
      vesselMarker.on('mouseout', () => vesselMarker.setZIndexOffset(0));
      vesselMarker.on('click', () => {
        smoothPanToEntity(vesselCoords[0], vesselCoords[1], 6);
        setSelectedEntity({
          type: 'route',
          data: {
            name: 'Shipment #4521 (MV EVER BRAVE)',
            from: 'Shanghai Port',
            to: 'Chennai Port',
            status: isDelayedInBay ? 'critical' : 'healthy',
            delayDays: isDelayedInBay ? 4 : 0
          }
        });
      });
    }
  }, [
    layers,
    demoStep,
    isMitigationApplied,
    isScenarioSimActive,
    weatherSeverity,
    ports,
    suppliers,
    warehouses,
    disruptions,
    factories,
    shipments,
    getStatusColor,
    smoothPanToEntity,
    onSelectEntity
  ]);

  // Stepper Handlers
  const handleNextStep = useCallback(() => {
    setDemoStep((prev) => {
      const next = Math.min(6, prev + 1);
      if (next === 1) flyToLocation(12.8, 84.5, 5);
      if (next === 2) flyToLocation(13.0844, 80.2925, 7);
      if (next === 3) flyToLocation(16.0, 95.0, 5);
      if (next === 4) flyToLocation(11.8, 85.2, 6);
      if (next === 5) flyToLocation(13.0827, 80.2707, 7);
      if (next === 6) {
        flyToLocation(16.0, 84.0, 4);
        setLayers((l) => ({ ...l, alternativeRoute: true }));
        setIsMitigationApplied(true);
      }
      return next;
    });
  }, [flyToLocation]);

  const handlePrevStep = useCallback(() => {
    setDemoStep((prev) => Math.max(0, prev - 1));
  }, []);

  // Auto-play walkthrough effect
  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      setDemoStep((prev) => {
        if (prev >= 6) {
          setIsAutoPlaying(false);
          return 6;
        }
        const next = prev + 1;
        if (next === 1) flyToLocation(12.8, 84.5, 5);
        if (next === 2) flyToLocation(13.0844, 80.2925, 7);
        if (next === 3) flyToLocation(16.0, 95.0, 5);
        if (next === 4) flyToLocation(11.8, 85.2, 6);
        if (next === 5) flyToLocation(13.0827, 80.2707, 7);
        if (next === 6) {
          flyToLocation(16.0, 84.0, 4);
          setLayers((l) => ({ ...l, alternativeRoute: true }));
          setIsMitigationApplied(true);
        }
        return next;
      });
    }, 4500);
    return () => clearInterval(interval);
  }, [isAutoPlaying, flyToLocation]);

  // Scenario step narratives
  const scenarioSteps = [
    {
      step: 0,
      badge: 'STAGE 1 — NORMAL',
      title: 'Normal Operations Baseline',
      desc: 'All Indo-Pacific trade routes operating smoothly. Supplier A, Chennai Port, Shipment #4521, and Chennai Warehouse all GREEN. Inventory risk: 8.4%.',
      metric: 'Risk: 8.4%'
    },
    {
      step: 1,
      badge: 'STAGE 2 — CYCLONE DETECTED',
      title: 'Extreme Weather Detected in Bay of Bengal',
      desc: 'Cyclone Mandous approaching maritime corridor. Severity: HIGH, Confidence: 92%, Expected duration: 4–6 days. Coastal alerts triggered.',
      metric: 'Wind: 165 km/h'
    },
    {
      step: 2,
      badge: 'STAGE 3 — PORT IMPACT',
      title: 'Chennai Port Disruption Triggered',
      desc: 'Chennai Port status: CRITICAL (GREEN → RED). Berth congestion: 94%, Expected delay: +4 days. 14 shipments affected, 3 suppliers impacted.',
      metric: '+4.8 Days Dwell'
    },
    {
      step: 3,
      badge: 'STAGE 4 — SUPPLIER IMPACT',
      title: 'Suppliers Dependent on Port Stranded',
      desc: 'Supplier A (IndoSilicon), Pacific Micro & Shanghai turn ORANGE. Feeder vessels anchored offshore awaiting harbor master clearance.',
      metric: '3 Suppliers Stranded'
    },
    {
      step: 4,
      badge: 'STAGE 5 — SHIPMENT IMPACT',
      title: 'Shipment #4521 Delayed in Transit',
      desc: 'Consignment of 4,500 MCU-X1 units on MV EVER BRAVE delayed. Original ETA: Sep 8 → Predicted ETA: Sep 12 (+4 days). Route turns RED.',
      metric: 'Delay: +4 Days'
    },
    {
      step: 5,
      badge: 'STAGE 6 — INVENTORY IMPACT',
      title: 'Chennai Warehouse Stockout Imminent',
      desc: 'Chennai Warehouse GREEN → RED. Current stock: 4,200 units, daily demand: 620 units. Days of supply: 6.8 days. Stockout probability: 87%.',
      metric: '87% Stockout Risk'
    },
    {
      step: 6,
      badge: 'STAGE 7 — AI REPLENISHMENT',
      title: 'Alternative Route & Dynamic Reallocation Activated',
      desc: 'Transfer 1,200 units from Bengaluru + switch shipment to alternative route via Mumbai JNPT. Stockout risk falls 87% → 17%. Revenue protected: ₹54.2L.',
      metric: '₹54.2L Protected'
    }
  ];

  const currentStepInfo = scenarioSteps[demoStep] || scenarioSteps[0];

  return (
    <div
      id="global-live-geographic-map-container"
      className="relative w-full rounded bg-[#0A0A0A] border border-[#1F1F1F] overflow-hidden flex flex-col select-none"
    >
      {/* 1. TOP HEADER & TELEMETRY CONTROLS */}
      <div className="flex flex-wrap items-center justify-between p-3.5 border-b border-[#1F1F1F] bg-[#070707] gap-3 z-10 font-mono">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#22C55E] animate-pulse"></span>
            <h2 className="text-xs font-bold text-white tracking-wider uppercase font-sans">
              REPLENOVA COMMAND CENTER
            </h2>
          </div>
          <span className="text-[#333333] hidden sm:inline">|</span>
          <span className="text-[10px] text-[#22C55E] flex items-center gap-1 font-bold">
            <Radio className="w-3 h-3 text-[#22C55E]" />
            LIVE GLOBAL SIGNALS
          </span>
          <span className="text-[10px] text-[#666666] hidden md:inline">
            (Eurasia & Indo-Pacific Maritime Telemetry)
          </span>
        </div>

        {/* Right Status Badges */}
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded bg-red-950/80 border border-red-500/60 text-red-400 text-[10px] font-bold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping"></span>
            🔴 3 CRITICAL
          </span>
          <span className="px-2 py-0.5 rounded bg-green-950/80 border border-green-500/60 text-green-400 text-[10px] font-bold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
            AI LIVE
          </span>
          <span className="px-2 py-0.5 rounded bg-[#141414] border border-[#2A2A2A] text-[#F27D26] text-[10px] font-bold">
            STAGE {demoStep + 1} / 7
          </span>
        </div>
      </div>

      {/* 2. 7-STAGE DEMO SCENARIO STEPPER BANNER */}
      <div className="p-3 bg-[#0D0D0D] border-b border-[#1F1F1F] space-y-2 font-mono">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase px-2 py-0.5 rounded bg-[#1A1A1A] border border-[#2A2A2A] text-[#F27D26] font-bold">
              {currentStepInfo.badge}
            </span>
            <h3 className="text-xs font-bold text-white">
              {currentStepInfo.title}
            </h3>
          </div>

          {/* Stepper Controls */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={handlePrevStep}
              disabled={demoStep === 0}
              className="px-2 py-1 rounded bg-[#141414] border border-[#262626] text-[#A0A0A0] hover:text-white hover:bg-[#1E1E1E] disabled:opacity-40 text-[10px] flex items-center gap-1 cursor-pointer transition-colors"
            >
              <ChevronLeft className="w-3 h-3" />
              <span>PREV</span>
            </button>

            <button
              onClick={handleNextStep}
              disabled={demoStep === 6}
              className="px-2 py-1 rounded bg-[#1A1A1A] border border-[#2A2A2A] text-white hover:bg-[#252525] disabled:opacity-40 text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-colors"
            >
              <span>NEXT EVENT</span>
              <ChevronRight className="w-3 h-3" />
            </button>

            <button
              onClick={() => setIsAutoPlaying(!isAutoPlaying)}
              className={`px-2.5 py-1 rounded text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-colors ${isAutoPlaying ? 'bg-[#CC3333] text-white' : 'bg-[#141414] border border-[#262626] text-[#A0A0A0] hover:text-white'}`}
            >
              <Play className="w-3 h-3" />
              <span>{isAutoPlaying ? 'PAUSE' : 'AUTO PLAY'}</span>
            </button>

            <button
              onClick={() => {
                setDemoStep(0);
                setIsMitigationApplied(false);
                setIsScenarioSimActive(false);
                setLayers((l) => ({ ...l, alternativeRoute: false }));
                handleResetView();
              }}
              className="px-2 py-1 rounded bg-[#141414] border border-[#262626] text-[#888888] hover:text-white text-[10px] flex items-center gap-1 cursor-pointer transition-colors"
              title="Reset Demo to Healthy Baseline"
            >
              <RotateCcw className="w-3 h-3" />
              <span>RESET</span>
            </button>
          </div>
        </div>

        {/* Narrative Description & Metric */}
        <div className="flex flex-wrap items-center justify-between text-[11px] text-[#A0A0A0] gap-2 pt-0.5">
          <p className="max-w-3xl leading-relaxed">
            {currentStepInfo.desc}
          </p>
          <span className="px-2 py-0.5 rounded bg-[#141414] border border-[#262626] text-[#F27D26] font-bold text-[10px]">
            {currentStepInfo.metric}
          </span>
        </div>
      </div>

      {/* 3. MAIN MAP CONTAINER (3-COLUMN DESKTOP / RESPONSIVE) */}
      <div className="relative flex flex-col lg:flex-row items-stretch min-h-[580px] bg-[#050505]">
        {/* Left Filter & Search Panel */}
        <MapLeftFilterPanel
          layers={layers}
          onToggleLayer={(key) => setLayers((l) => ({ ...l, [key]: !l[key] }))}
          onSearchSelect={handleSearchSelect}
          onResetView={handleResetView}
          onFitNetwork={() => flyToLocation(16.0, 84.0, 4)}
          onLiveEvents={handleFocusCyclone}
          onAlternativeRoute={() => {
            setLayers((l) => ({ ...l, alternativeRoute: true }));
            flyToLocation(16.0, 75.0, 5);
          }}
        />

        {/* Center: Real Leaflet Map Canvas */}
        <div className="relative flex-1 min-h-[420px] lg:min-h-[580px] bg-[#050505] overflow-hidden">
          <div
            ref={mapContainerRef}
            className="absolute inset-0 w-full h-full z-0 cursor-grab active:cursor-grabbing"
          />

          {/* Quick Floating Map Overlays */}
          <div className="absolute top-3 left-3 z-[400] flex items-center gap-2 pointer-events-none">
            <div className="px-2.5 py-1 rounded bg-[#0A0A0A]/90 backdrop-blur-md border border-[#222222] text-[10px] font-mono text-white flex items-center gap-1.5 shadow-xl">
              <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] animate-ping"></span>
              <span>CARTO DARK MATTER REAL GIS</span>
            </div>
            {demoStep >= 1 && (
              <div className="px-2.5 py-1 rounded bg-red-950/90 backdrop-blur-md border border-red-500/50 text-[10px] font-mono text-red-300 flex items-center gap-1.5 shadow-xl">
                <Wind className="w-3 h-3 text-red-400" />
                <span>BAY OF BENGAL WEATHER ALERT ACTIVE</span>
              </div>
            )}
          </div>

          {/* In-Map Camera Shortcuts */}
          <div className="absolute top-3 right-3 z-[400] flex items-center gap-1 bg-[#0A0A0A]/90 backdrop-blur-md p-1 rounded border border-[#222222] text-[10px] font-mono shadow-xl">
            <button
              onClick={handleFocusChennai}
              className="px-2 py-0.5 rounded bg-[#141414] text-[#D1D1D1] hover:text-white hover:bg-[#202020] cursor-pointer transition-colors"
            >
              Chennai
            </button>
            <button
              onClick={handleFocusCyclone}
              className="px-2 py-0.5 rounded bg-[#141414] text-red-400 hover:text-red-300 hover:bg-[#202020] cursor-pointer transition-colors"
            >
              Cyclone
            </button>
            <button
              onClick={() => flyToLocation(1.2644, 103.8219, 6)}
              className="px-2 py-0.5 rounded bg-[#141414] text-[#D1D1D1] hover:text-white hover:bg-[#202020] cursor-pointer transition-colors"
            >
              Singapore
            </button>
            <button
              onClick={handleResetView}
              className="p-1 rounded bg-[#141414] text-[#888888] hover:text-white cursor-pointer transition-colors"
              title="Reset View"
            >
              <RotateCcw className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Right Contextual Details Panel */}
        <MapRightDetailPanel
          selectedEntity={selectedEntity}
          onClose={() => setSelectedEntity(null)}
          onNavigateToTab={onNavigateToTab}
          onSelectProductForReplenishment={onSelectProductForReplenishment}
          onApplyMitigation={() => {
            setIsMitigationApplied(true);
            setLayers((l) => ({ ...l, alternativeRoute: true }));
            setDemoStep(6);
            flyToLocation(16.0, 84.0, 4);
          }}
          isMitigationApplied={isMitigationApplied}
          onSimulateScenario={() => onNavigateToTab?.('simulation')}
          onFocusEntity={flyToLocation}
        />
      </div>

      {/* 4. IMPACT CHAIN: GEOGRAPHIC CAUSAL CASCADE */}
      <MapImpactChainBar
        activeStage={demoStep}
        onNodeClick={(node) => {
          flyToLocation(node.lat, node.lng, node.zoom);
          if (node.entityType === 'weather') {
            setSelectedEntity({
              type: 'weather',
              data: { title: 'Cyclone Mandous (Category 3)', severity: 'critical' }
            });
          } else if (node.entityType === 'port') {
            const port = ports.find(p => p.id === 'port-1') || ports[0];
            setSelectedEntity({ type: 'port', data: port });
          } else if (node.entityType === 'supplier') {
            const sup = suppliers.find(s => s.id === 'sup-1') || suppliers[0];
            setSelectedEntity({ type: 'supplier', data: sup });
          } else if (node.entityType === 'shipment') {
            setSelectedEntity({
              type: 'route',
              data: {
                from: 'Shanghai Port',
                to: 'Chennai Port',
                name: 'Shipment Route #4521 (MV EVER BRAVE)'
              }
            });
          } else if (node.entityType === 'warehouse' || node.entityType === 'sku') {
            const wh = warehouses.find(w => w.id === 'wh-1') || warehouses[0];
            setSelectedEntity({ type: 'warehouse', data: wh });
          } else if (node.entityType === 'ai-recommendation') {
            setSelectedEntity({
              type: 'ai-recommendation',
              data: { title: 'REPLENOVA AI MITIGATION' }
            });
          }
        }}
      />

      {/* 5. BOTTOM LEGEND BAR */}
      <MapLegendBar
        signalsMonitored={1284}
        activeDisruptions={7}
        lastUpdated="Just now"
      />
    </div>
  );
};
