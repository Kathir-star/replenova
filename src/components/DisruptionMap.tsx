import React, { useEffect, useRef, useState, useCallback } from 'react';
import L from 'leaflet';
import {
  PortHub,
  Supplier,
  Warehouse,
  SupplyRoute,
  ExternalDisruptionEvent,
  RiskLevel,
  Factory,
  ActiveShipment
} from '../types';
import {
  INITIAL_FACTORIES,
  INITIAL_ACTIVE_SHIPMENTS
} from '../data/mockSupplyChain';
import { weatherService } from '../services/mapDataServices';
import {
  Layers,
  Anchor,
  Factory as FactoryIcon,
  Warehouse as WhIcon,
  Navigation,
  AlertTriangle,
  X,
  ExternalLink,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Wind,
  ShieldCheck,
  CheckCircle2,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Compass,
  Eye,
  EyeOff,
  Play,
  Pause,
  ArrowRight,
  Activity,
  IndianRupee
} from 'lucide-react';

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
}

export const DisruptionMap: React.FC<DisruptionMapProps> = ({
  suppliers,
  warehouses,
  ports,
  routes,
  disruptions,
  factories = INITIAL_FACTORIES,
  shipments = INITIAL_ACTIVE_SHIPMENTS,
  onSelectEntity,
  onNavigateToTab
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const layerGroupRef = useRef<L.LayerGroup | null>(null);

  // Core Demo Scenario Stepper (0 to 6)
  // 0: Initial State (Normal, 8.4% risk, all green)
  // 1: Cyclone detected in Bay of Bengal
  // 2: Chennai Port impact (Green -> Red)
  // 3: Supplier impact (Green -> Orange)
  // 4: Shipment #4521 delayed (Green -> Red)
  // 5: Inventory impact (Chennai Warehouse Red, 87% stockout risk)
  // 6: AI Replenishment & Alternative Route (Loss Avoided ₹54.2L)
  const [demoStep, setDemoStep] = useState<number>(1);
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(false);
  const [isMitigationApplied, setIsMitigationApplied] = useState<boolean>(false);
  const [isScenarioSimActive, setIsScenarioSimActive] = useState<boolean>(false);

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
    type: 'supplier' | 'factory' | 'port' | 'warehouse' | 'shipment' | 'weather' | 'route';
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
      subdomains: 'abcd',
      maxZoom: 18,
      attribution: '&copy; OpenStreetMap contributors &copy; CARTO'
    }).addTo(map);

    // Create a managed LayerGroup for all dynamic SVG layers & markers
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

  // Render Map Features & Entities
  useEffect(() => {
    const map = mapInstanceRef.current;
    const layerGroup = layerGroupRef.current;
    if (!map || !layerGroup) return;

    // Clear previous dynamic layers
    layerGroup.clearLayers();

    // -------------------------------------------------------------
    // 1. WEATHER & CYCLONE MANDOUS DISRUPTION ZONE
    // -------------------------------------------------------------
    const showCyclone = layers.weather && (demoStep >= 1 || isScenarioSimActive);
    if (showCyclone) {
      const cycloneLat = 12.8;
      const cycloneLng = 84.5;
      const radiusMeters = 380000; // ~380km radius

      // Outer Warning Zone Circle
      const outerCircle = L.circle([cycloneLat, cycloneLng], {
        radius: radiusMeters,
        color: '#CC3333',
        weight: 1.5,
        opacity: 0.6,
        dashArray: '6, 6',
        fillColor: '#CC3333',
        fillOpacity: 0.08,
        className: 'cyclone-radar-wave'
      }).addTo(layerGroup);

      outerCircle.on('click', () => {
        setSelectedEntity({
          type: 'weather',
          data: {
            title: 'Cyclone Mandous (Category 3)',
            location: 'Bay of Bengal Shipping Corridor',
            windSpeed: '165 km/h',
            pressure: '960 hPa',
            affectedRadiusKm: 380,
            heading: 'WNW at 18 km/h towards Tamil Nadu Coast',
            severity: 'HIGH / CRITICAL',
            confidence: '94%',
            expectedDuration: '4–6 days'
          }
        });
      });

      // Inner Severe Storm Core
      L.circle([cycloneLat, cycloneLng], {
        radius: 170000,
        color: '#FF8800',
        weight: 1,
        opacity: 0.8,
        fillColor: '#CC3333',
        fillOpacity: 0.22
      }).addTo(layerGroup);

      // Cyclone Eye Marker with animated spinning glyph
      const cycloneIcon = L.divIcon({
        className: 'custom-geo-marker',
        html: `
          <div class="relative flex items-center justify-center">
            <div class="w-10 h-10 rounded-full bg-red-950/70 border border-red-500 flex items-center justify-center animate-pulse shadow-lg shadow-red-950/80">
              <svg class="w-6 h-6 text-red-400 animate-spin" style="animation-duration: 8s;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z" opacity="0.3"/>
                <path d="M12 6a6 6 0 0 1 6 6c0 3.31-2.69 6-6 6a6 6 0 0 1-6-6c0-3.31 2.69-6 6-6z" stroke-dasharray="4 2"/>
                <circle cx="12" cy="12" r="2.5" fill="#CC3333"/>
              </svg>
            </div>
            <span class="absolute -bottom-5 whitespace-nowrap px-1.5 py-0.5 rounded bg-[#0A0A0A] border border-red-500/40 text-[9px] font-mono text-red-400 font-bold tracking-wider">
              CYCLONE MANDOUS (CAT 3)
            </span>
          </div>
        `,
        iconSize: [40, 40],
        iconAnchor: [20, 20]
      });

      const cycloneMarker = L.marker([cycloneLat, cycloneLng], { icon: cycloneIcon }).addTo(layerGroup);
      cycloneMarker.on('click', () => {
        setSelectedEntity({
          type: 'weather',
          data: {
            title: 'Cyclone Mandous (Category 3)',
            location: 'Bay of Bengal Shipping Corridor',
            windSpeed: '165 km/h',
            pressure: '960 hPa',
            affectedRadiusKm: 380,
            heading: 'WNW at 18 km/h towards Tamil Nadu Coast',
            severity: 'HIGH / CRITICAL',
            confidence: '94%',
            expectedDuration: '4–6 days'
          }
        });
      });

      // Direction vector line pointing towards Chennai coast
      L.polyline([[cycloneLat, cycloneLng], [13.0844, 80.2925]], {
        color: '#FF8800',
        weight: 1.5,
        dashArray: '4, 6',
        opacity: 0.6
      }).addTo(layerGroup);
    }

    // -------------------------------------------------------------
    // 2. SHIPMENT ROUTES (Polylines along actual trade coordinates)
    // -------------------------------------------------------------
    if (layers.routes) {
      // Primary Disrupted Route: Shanghai -> Singapore -> Bay of Bengal -> Chennai Port -> Chennai Warehouse
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

      mainRoutePolyline.on('click', () => {
        setSelectedEntity({
          type: 'route',
          data: {
            name: 'Trans-Pacific/Indian Ocean Route (Shanghai → Chennai)',
            from: 'Shanghai Port',
            to: 'Chennai Central Hub',
            transitType: 'Ocean Freight + Inland Drayage',
            status: isDisrupted ? 'critical' : 'healthy',
            delayDays: isDisrupted ? 4 : 0,
            activeVessels: 8,
            skusCarried: 18,
            eta: isDisrupted ? 'Delayed to Sept 12 (+4d)' : 'On Schedule (Sept 8)',
            risk: isDisrupted ? 'CRITICAL (Port Closed)' : 'NORMAL'
          }
        });
      });

      // Secondary Route: Malacca / Penang to Colombo to Chennai
      const penangToChennaiCoords: [number, number][] = [
        [5.4164, 100.3327], // Penang
        [6.9497, 79.8436],  // Colombo
        [13.0844, 80.2925]  // Chennai Port
      ];
      L.polyline(penangToChennaiCoords, {
        color: isDisrupted ? '#FF8800' : '#22C55E',
        weight: 2,
        opacity: 0.7,
        className: isDisrupted ? 'route-dash-delayed' : 'route-dash-normal'
      }).addTo(layerGroup);

      // Domestic Inter-warehouse Link: Bengaluru to Chennai (Dedicated Road Express)
      L.polyline([[12.9716, 77.5946], [13.0827, 80.2707]], {
        color: isMitigationApplied ? '#22C55E' : '#888888',
        weight: isMitigationApplied ? 3 : 1.5,
        opacity: 0.9,
        dashArray: isMitigationApplied ? '4, 4' : '2, 4',
        className: isMitigationApplied ? 'route-dash-normal' : ''
      }).addTo(layerGroup);

      // Air Freight Corridor: Munich to Mumbai
      L.polyline([[48.1351, 11.582], [19.076, 72.8777]], {
        color: '#22C55E',
        weight: 1.5,
        opacity: 0.6,
        dashArray: '6, 6'
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
        color: '#F27D26', // High contrast signal orange/gold
        weight: 3.5,
        opacity: 0.95,
        className: 'route-dash-alternative'
      }).addTo(layerGroup);

      altPolyline.on('click', () => {
        setSelectedEntity({
          type: 'route',
          data: {
            name: 'AI Recommended Alternative Route: Western Coastal Bypass',
            from: 'Shanghai Port (Via Singapore)',
            to: 'Chennai Central Hub via Mumbai JNPT + Dedicated Rail Express',
            transitType: 'Multi-Modal Ocean + Inland Express',
            status: 'healthy',
            delayDays: 1,
            eta: 'Sept 9 (Just +1 Day vs. +4 Days)',
            additionalCost: '₹12,800',
            riskReduction: '68% Risk Avoidance',
            notes: 'Bypasses Bay of Bengal cyclone completely via Arabian Sea approach to Nhava Sheva port.'
          }
        });
      });

      // Animated Waypoint Tag on Alternative Route
      const altBadgeIcon = L.divIcon({
        className: 'custom-geo-marker',
        html: `
          <div class="px-2 py-0.5 rounded bg-[#0A0A0A] border border-[#F27D26] text-[#F27D26] text-[9px] font-mono font-bold shadow-lg flex items-center gap-1">
            <span class="w-1.5 h-1.5 rounded-full bg-[#F27D26] animate-ping"></span>
            ALT ROUTE (-68% RISK)
          </div>
        `,
        iconSize: [130, 24],
        iconAnchor: [65, 12]
      });
      L.marker([16.5, 72.2], { icon: altBadgeIcon }).addTo(layerGroup);
    }

    // -------------------------------------------------------------
    // 4. PORTS LAYER (Anchor Markers with status color)
    // -------------------------------------------------------------
    if (layers.ports) {
      ports.forEach((port) => {
        // Status logic based on demo scenario
        let portStatus: RiskLevel = 'healthy';
        let delay = port.avgDelayDays;

        if (port.id === 'port-1') {
          // Chennai Port
          portStatus = (demoStep >= 2 || isScenarioSimActive) ? 'critical' : 'healthy';
          delay = (demoStep >= 2 || isScenarioSimActive) ? 4.8 : 0.6;
        } else if (port.id === 'port-3') {
          // Colombo
          portStatus = (demoStep >= 2) ? 'elevated' : 'healthy';
        } else if (port.id === 'port-2' || port.id === 'port-shanghai') {
          portStatus = (demoStep >= 1) ? 'watch' : 'healthy';
        }

        const color = getStatusColor(portStatus);
        const isCritical = portStatus === 'critical';

        const portIcon = L.divIcon({
          className: 'custom-geo-marker',
          html: `
            <div class="relative group cursor-pointer">
              <div class="w-7 h-7 rounded bg-[#0A0A0A] border ${isCritical ? 'border-red-500 shadow-red-950/80' : 'border-[#1F1F1F]'} flex items-center justify-center shadow-md">
                <svg class="w-4 h-4" style="color: ${color};" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="5" r="3"/>
                  <line x1="12" y1="22" x2="12" y2="8"/>
                  <path d="M5 12H2a10 10 0 0 0 20 0h-3"/>
                </svg>
              </div>
              ${isCritical ? '<span class="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-red-500 animate-ping"></span>' : ''}
              <span class="absolute -bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap text-[9px] font-mono font-bold px-1 rounded bg-[#0A0A0A]/90 text-white border border-[#1F1F1F]">
                ${port.name.split(' ')[0]}
              </span>
            </div>
          `,
          iconSize: [28, 28],
          iconAnchor: [14, 14]
        });

        const marker = L.marker([port.lat, port.lng], { icon: portIcon }).addTo(layerGroup);
        marker.on('click', () => {
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
        });
      });
    }

    // -------------------------------------------------------------
    // 5. SUPPLIERS LAYER (Circular Markers)
    // -------------------------------------------------------------
    if (layers.suppliers) {
      suppliers.forEach((sup) => {
        let supStatus: RiskLevel = 'healthy';
        if (sup.id === 'sup-1' || sup.id === 'sup-3' || sup.id === 'sup-11') {
          // Suppliers depending on Chennai route
          supStatus = (demoStep >= 3 || isScenarioSimActive) ? 'elevated' : 'healthy';
          if (demoStep >= 4 && sup.id === 'sup-11') supStatus = 'critical';
        }

        const color = getStatusColor(supStatus);
        const isAlert = supStatus === 'critical' || supStatus === 'elevated';

        const supIcon = L.divIcon({
          className: 'custom-geo-marker',
          html: `
            <div class="relative group cursor-pointer">
              <div class="w-4 h-4 rounded-full bg-[#0A0A0A] border-2 flex items-center justify-center shadow-md transition-transform hover:scale-125" style="border-color: ${color};">
                <div class="w-1.5 h-1.5 rounded-full" style="background-color: ${color};"></div>
              </div>
              ${isAlert ? `<span class="absolute -top-1 -right-1 w-2 h-2 rounded-full animate-ping" style="background-color: ${color};"></span>` : ''}
              <span class="absolute -bottom-3.5 left-1/2 -translate-x-1/2 whitespace-nowrap text-[8px] font-mono px-1 rounded bg-[#0A0A0A]/90 text-[#D1D1D1] border border-[#1F1F1F]">
                ${sup.name.split(' ')[0]}
              </span>
            </div>
          `,
          iconSize: [16, 16],
          iconAnchor: [8, 8]
        });

        const marker = L.marker([sup.lat, sup.lng], { icon: supIcon }).addTo(layerGroup);
        marker.on('click', () => {
          setSelectedEntity({
            type: 'supplier',
            data: {
              ...sup,
              currentRiskLevel: supStatus
            }
          });
        });
      });
    }

    // -------------------------------------------------------------
    // 6. FACTORIES LAYER
    // -------------------------------------------------------------
    if (layers.factories) {
      factories.forEach((fac) => {
        const facStatus: RiskLevel = fac.status;
        const color = getStatusColor(facStatus);

        const facIcon = L.divIcon({
          className: 'custom-geo-marker',
          html: `
            <div class="relative group cursor-pointer">
              <div class="w-6 h-6 rounded bg-[#0A0A0A] border border-[#1F1F1F] flex items-center justify-center shadow-md hover:border-[#F27D26]">
                <svg class="w-3.5 h-3.5" style="color: ${color};" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M2 20a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8l-7 5V8l-7 5V4a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"/>
                  <path d="M17 18h1"/>
                  <path d="M12 18h1"/>
                  <path d="M7 18h1"/>
                </svg>
              </div>
              <span class="absolute -bottom-3.5 left-1/2 -translate-x-1/2 whitespace-nowrap text-[8px] font-mono px-1 rounded bg-[#0A0A0A]/90 text-white border border-[#1F1F1F]">
                ${fac.name.split(' ')[1] || fac.city}
              </span>
            </div>
          `,
          iconSize: [24, 24],
          iconAnchor: [12, 12]
        });

        const marker = L.marker([fac.lat, fac.lng], { icon: facIcon }).addTo(layerGroup);
        marker.on('click', () => {
          setSelectedEntity({
            type: 'factory',
            data: fac
          });
        });
      });
    }

    // -------------------------------------------------------------
    // 7. WAREHOUSES LAYER
    // -------------------------------------------------------------
    if (layers.warehouses) {
      warehouses.forEach((wh) => {
        // Chennai Warehouse status changes on Step 5
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
            <div class="relative group cursor-pointer">
              <div class="w-7 h-7 rounded bg-[#0A0A0A] border ${isCritical ? 'border-red-500 shadow-red-950/80 animate-pulse' : 'border-[#1F1F1F]'} flex items-center justify-center shadow-md hover:border-[#F27D26]">
                <svg class="w-4 h-4" style="color: ${color};" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                  <polyline points="9 22 9 12 15 12 15 22"/>
                </svg>
              </div>
              ${isCritical ? '<span class="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-red-500 animate-ping"></span>' : ''}
              <span class="absolute -bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap text-[9px] font-mono font-bold px-1 rounded bg-[#0A0A0A]/90 text-white border border-[#1F1F1F]">
                ${wh.city}
              </span>
            </div>
          `,
          iconSize: [28, 28],
          iconAnchor: [14, 14]
        });

        const marker = L.marker([wh.lat, wh.lng], { icon: whIcon }).addTo(layerGroup);
        marker.on('click', () => {
          setSelectedEntity({
            type: 'warehouse',
            data: {
              ...wh,
              status: whStatus,
              stockoutRisk,
              skuAtRisk: wh.id === 'wh-1' ? 'MCU-X1 (Automotive Microcontroller)' : 'None',
              inventoryUnits: wh.currentStockUnits,
              inventoryValueInr: '₹16.4 Cr',
              incomingShipments: wh.id === 'wh-1' ? 4 : 2,
              expectedArrivals: wh.id === 'wh-1' && isCritical ? 'Delayed +4 Days by Cyclone' : 'Normal delivery schedule'
            }
          });
        });
      });
    }

    // -------------------------------------------------------------
    // 8. ACTIVE SHIPMENTS (Moving vessel glyphs along routes)
    // -------------------------------------------------------------
    if (layers.routes && shipments.length > 0) {
      shipments.forEach((shp) => {
        if (!shp.currentCoords) return;
        const isShipmentDelayed = (demoStep >= 4 || isScenarioSimActive) && shp.id === 'shp-4521';
        const color = isShipmentDelayed ? '#CC3333' : '#22C55E';

        const shpIcon = L.divIcon({
          className: 'custom-geo-marker',
          html: `
            <div class="relative group cursor-pointer">
              <div class="w-6 h-6 rounded-full bg-[#0A0A0A] border flex items-center justify-center shadow-lg" style="border-color: ${color};">
                <svg class="w-3.5 h-3.5" style="color: ${color};" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M2 21c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1 .6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/>
                  <path d="M19.38 20A11.6 11.6 0 0 0 21 14l-9-4-9 4c0 2.9.94 5.34 2.81 7.18"/>
                  <path d="M12 2v8"/>
                </svg>
              </div>
              ${isShipmentDelayed ? '<span class="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-red-500 animate-ping"></span>' : ''}
              <span class="absolute -bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap text-[8px] font-mono px-1 rounded bg-[#0A0A0A] text-white border border-[#1F1F1F]">
                ${shp.trackingNumber}
              </span>
            </div>
          `,
          iconSize: [24, 24],
          iconAnchor: [12, 12]
        });

        const marker = L.marker([shp.currentCoords[0], shp.currentCoords[1]], { icon: shpIcon }).addTo(layerGroup);
        marker.on('click', () => {
          setSelectedEntity({
            type: 'shipment',
            data: {
              ...shp,
              status: isShipmentDelayed ? 'delayed' : shp.status,
              delayDays: isShipmentDelayed ? 4 : shp.delayDays,
              predictedEta: isShipmentDelayed ? 'September 12 (+4 Days)' : shp.predictedEta,
              risk: isShipmentDelayed ? 'CRITICAL' : shp.risk
            }
          });
        });
      });
    }
  }, [layers, demoStep, isMitigationApplied, isScenarioSimActive, ports, suppliers, factories, warehouses, shipments, getStatusColor]);

  // Handle Scenario Stepper Forward & Backward
  const handleNextStep = useCallback(() => {
    setDemoStep((prev) => {
      const next = Math.min(6, prev + 1);
      // Auto-fly camera to highlight the entity of the current step
      if (next === 1) flyToLocation(12.8, 84.5, 5); // Cyclone
      if (next === 2) flyToLocation(13.0844, 80.2925, 7); // Chennai Port
      if (next === 3) flyToLocation(16.0, 95.0, 5); // Suppliers A, B, C
      if (next === 4) flyToLocation(18.0, 92.0, 5); // Shipment #4521
      if (next === 5) flyToLocation(13.0827, 80.2707, 7); // Chennai Warehouse
      if (next === 6) {
        flyToLocation(16.0, 84.0, 4); // Full Network & Alternative Route
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
        if (next === 4) flyToLocation(18.0, 92.0, 5);
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

  // Step Narrative Data for the Demo Scenario Bar
  const scenarioSteps = [
    {
      step: 0,
      badge: 'HEALTHY BASELINE',
      title: 'Normal Operations',
      desc: 'All Indo-Pacific routes operating on schedule. Inventory risk: 8.4%. All nodes GREEN.',
      metric: 'Risk: 8.4%'
    },
    {
      step: 1,
      badge: 'EVENT 1 — CYCLONE',
      title: 'Extreme Weather Detected in Bay of Bengal',
      desc: 'Cyclone Mandous approaching maritime corridor. High severity, 92% confidence, 4–6 day disruption.',
      metric: 'Wind: 165 km/h'
    },
    {
      step: 2,
      badge: 'EVENT 2 — PORT IMPACT',
      title: 'Chennai Port Disruption Triggered',
      desc: 'Outer anchorages suspended. Chennai Port status: CRITICAL (GREEN → RED). +4 days delay, 14 shipments affected.',
      metric: '+4.8 Days Dwell'
    },
    {
      step: 3,
      badge: 'EVENT 3 — SUPPLIER IMPACT',
      title: 'Supplier Corridors Stranded',
      desc: 'Suppliers IndoSilicon (Chennai), Pacific Micro (Singapore) & Shanghai turn ORANGE. Feeder vessels anchored in high seas.',
      metric: '3 Suppliers Stranded'
    },
    {
      step: 4,
      badge: 'EVENT 4 — SHIPMENT IMPACT',
      title: 'Shipment #4521 Delayed in Transit',
      desc: 'Consignment of 4,200 MCU-X1 units delayed. Original ETA Sept 8 → Predicted ETA Sept 12 (+4 days).',
      metric: 'Delay: +4 Days'
    },
    {
      step: 5,
      badge: 'EVENT 5 — INVENTORY IMPACT',
      title: 'Chennai Warehouse Stockout Imminent',
      desc: 'MCU-X1: 4,200 units on hand, 620 units/day burn rate. Days of supply: 6.8 days vs 9.0 day lead time. 87% STOCKOUT RISK.',
      metric: '87% Stockout Risk'
    },
    {
      step: 6,
      badge: 'AI MITIGATION APPLIED',
      title: 'Alternative Route & Dynamic Reallocation Activated',
      desc: 'Multi-modal bypass via Mumbai JNPT + 1,200 units from Bengaluru. Stockout risk falls to 17%. Revenue protected: ₹54.2L.',
      metric: '₹54.2L Protected'
    }
  ];

  const currentStepInfo = scenarioSteps[demoStep] || scenarioSteps[0];

  return (
    <div
      id="global-live-geographic-map-container"
      className="relative w-full rounded bg-[#0A0A0A] border border-[#1F1F1F] overflow-hidden flex flex-col"
    >
      {/* 1. TOP HEADER & TELEMETRY CONTROLS */}
      <div className="flex flex-wrap items-center justify-between p-4 border-b border-[#1F1F1F] bg-[#0A0A0A] gap-3 z-10">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#F27D26] animate-pulse"></span>
            <h2 className="text-xs font-semibold text-white tracking-wide uppercase">
              REAL-WORLD LIVE GEOGRAPHIC SUPPLY CHAIN MAP
            </h2>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#141414] border border-[#1F1F1F] text-[#888888]">
              LEAFLET REAL GIS ENGINE
            </span>
          </div>
          <p className="text-[10px] text-[#666666] mt-0.5 font-mono">
            Eurasia & Indo-Pacific Maritime Telemetry • Real Coordinates • Live Vessel Tracking • Cyclone Radar
          </p>
        </div>

        {/* Quick Location Fly-to Shortcuts */}
        <div className="flex items-center gap-1 bg-[#050505] p-1 rounded border border-[#1F1F1F] text-[10px] font-mono">
          <button
            onClick={handleFocusChennai}
            className="px-2 py-1 rounded bg-[#141414] text-[#D1D1D1] hover:text-white hover:bg-[#1A1A1A] cursor-pointer transition-colors"
          >
            Chennai Port
          </button>
          <button
            onClick={handleFocusCyclone}
            className="px-2 py-1 rounded bg-[#141414] text-[#CC3333] hover:text-red-400 hover:bg-[#1A1A1A] cursor-pointer transition-colors"
          >
            Cyclone Eye
          </button>
          <button
            onClick={() => flyToLocation(1.2644, 103.8219, 6)}
            className="px-2 py-1 rounded bg-[#141414] text-[#D1D1D1] hover:text-white hover:bg-[#1A1A1A] cursor-pointer transition-colors"
          >
            Singapore Hub
          </button>
          <button
            onClick={handleResetView}
            className="px-2 py-1 rounded bg-[#141414] text-[#888888] hover:text-white hover:bg-[#1A1A1A] cursor-pointer transition-colors flex items-center gap-1"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset View</span>
          </button>
        </div>
      </div>

      {/* 2. COMPACT MAP CONTROL PANEL (LAYER TOGGLES) */}
      <div className="flex flex-wrap items-center justify-between px-4 py-2 bg-[#070707] border-b border-[#1F1F1F] text-[10px] font-mono gap-2 z-10">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[#666666] mr-1 uppercase flex items-center gap-1">
            <Layers className="w-3 h-3" />
            Layers:
          </span>

          <button
            onClick={() => setLayers(l => ({ ...l, ports: !l.ports }))}
            className={`px-2 py-0.5 rounded border cursor-pointer transition-colors ${layers.ports ? 'bg-[#141414] border-[#F27D26]/50 text-white' : 'bg-transparent border-[#1F1F1F] text-[#555555]'}`}
          >
            ● Ports
          </button>

          <button
            onClick={() => setLayers(l => ({ ...l, suppliers: !l.suppliers }))}
            className={`px-2 py-0.5 rounded border cursor-pointer transition-colors ${layers.suppliers ? 'bg-[#141414] border-[#F27D26]/50 text-white' : 'bg-transparent border-[#1F1F1F] text-[#555555]'}`}
          >
            ● Suppliers
          </button>

          <button
            onClick={() => setLayers(l => ({ ...l, factories: !l.factories }))}
            className={`px-2 py-0.5 rounded border cursor-pointer transition-colors ${layers.factories ? 'bg-[#141414] border-[#F27D26]/50 text-white' : 'bg-transparent border-[#1F1F1F] text-[#555555]'}`}
          >
            ● Factories
          </button>

          <button
            onClick={() => setLayers(l => ({ ...l, warehouses: !l.warehouses }))}
            className={`px-2 py-0.5 rounded border cursor-pointer transition-colors ${layers.warehouses ? 'bg-[#141414] border-[#F27D26]/50 text-white' : 'bg-transparent border-[#1F1F1F] text-[#555555]'}`}
          >
            ● Warehouses
          </button>

          <button
            onClick={() => setLayers(l => ({ ...l, routes: !l.routes }))}
            className={`px-2 py-0.5 rounded border cursor-pointer transition-colors ${layers.routes ? 'bg-[#141414] border-[#F27D26]/50 text-white' : 'bg-transparent border-[#1F1F1F] text-[#555555]'}`}
          >
            ● Routes
          </button>

          <button
            onClick={() => setLayers(l => ({ ...l, weather: !l.weather }))}
            className={`px-2 py-0.5 rounded border cursor-pointer transition-colors ${layers.weather ? 'bg-[#221111] border-red-500/50 text-red-400' : 'bg-transparent border-[#1F1F1F] text-[#555555]'}`}
          >
            ● Weather / Cyclone
          </button>

          <button
            onClick={() => setLayers(l => ({ ...l, alternativeRoute: !l.alternativeRoute }))}
            className={`px-2 py-0.5 rounded border cursor-pointer transition-colors ${layers.alternativeRoute ? 'bg-[#0f1f14] border-green-500/50 text-green-400' : 'bg-transparent border-[#1F1F1F] text-[#555555]'}`}
          >
            ● Alternative AI Route
          </button>
        </div>

        {/* Zoom & Reset Buttons */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => mapInstanceRef.current?.zoomIn()}
            className="p-1 rounded bg-[#141414] border border-[#1F1F1F] text-[#888888] hover:text-white hover:bg-[#1A1A1A] cursor-pointer"
            title="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => mapInstanceRef.current?.zoomOut()}
            className="p-1 rounded bg-[#141414] border border-[#1F1F1F] text-[#888888] hover:text-white hover:bg-[#1A1A1A] cursor-pointer"
            title="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => {
              setIsScenarioSimActive(!isScenarioSimActive);
              if (!isScenarioSimActive) {
                setDemoStep(5);
                flyToLocation(13.0844, 80.2925, 6);
              } else {
                setDemoStep(0);
                setIsMitigationApplied(false);
              }
            }}
            className={`px-2 py-1 rounded border text-[10px] font-mono cursor-pointer transition-colors flex items-center gap-1 ${isScenarioSimActive ? 'bg-[#CC3333] text-white border-[#CC3333]' : 'bg-[#141414] border-[#1F1F1F] text-[#D1D1D1] hover:text-white'}`}
          >
            <AlertTriangle className="w-3 h-3" />
            <span>Simulate 7d Port Closure</span>
          </button>
        </div>
      </div>

      {/* 3. CORE DEMO SCENARIO PIPELINE (EVENTS 1 TO 6 STEPPER) */}
      <div className="bg-[#050505] p-3 border-b border-[#1F1F1F] flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs font-mono">
        <div className="flex items-center gap-3">
          <span className="px-2 py-0.5 rounded bg-[#141414] border border-[#F27D26]/40 text-[#F27D26] font-bold text-[10px] uppercase">
            {currentStepInfo.badge}
          </span>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-white uppercase text-xs">
                {currentStepInfo.title}
              </span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#1A1A1A] text-[#888888]">
                {currentStepInfo.metric}
              </span>
            </div>
            <p className="text-[11px] text-[#888888] font-sans mt-0.5 line-clamp-1">
              {currentStepInfo.desc}
            </p>
          </div>
        </div>

        {/* Stepper Controls */}
        <div className="flex items-center gap-2 self-end md:self-center shrink-0">
          <button
            onClick={() => setIsAutoPlaying(!isAutoPlaying)}
            className="px-2 py-1 rounded bg-[#141414] border border-[#1F1F1F] text-[10px] text-[#D1D1D1] hover:text-white hover:bg-[#1A1A1A] cursor-pointer flex items-center gap-1"
          >
            {isAutoPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
            <span>{isAutoPlaying ? 'Pause' : 'Auto Play'}</span>
          </button>

          <button
            disabled={demoStep === 0}
            onClick={handlePrevStep}
            className="p-1 rounded bg-[#141414] border border-[#1F1F1F] text-[#888888] hover:text-white disabled:opacity-30 cursor-pointer"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>

          <span className="text-[10px] text-[#666666] min-w-[50px] text-center">
            {demoStep} / 6
          </span>

          <button
            disabled={demoStep === 6}
            onClick={handleNextStep}
            className="px-3 py-1 rounded bg-[#F27D26] hover:bg-[#FF8800] text-black font-bold text-[10px] uppercase tracking-wider cursor-pointer flex items-center gap-1 disabled:opacity-40"
          >
            <span>{demoStep === 6 ? 'Completed' : 'Next Event'}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 4. MAIN MAP CANVAS & FLOATING OVERLAYS */}
      <div className="relative w-full h-[520px] bg-[#050505]">
        {/* The Real Leaflet Map Container */}
        <div ref={mapContainerRef} className="w-full h-full" />

        {/* Map Legend (Minimal Sleek) */}
        <div className="absolute bottom-4 left-4 z-[400] p-2.5 rounded bg-[#0A0A0A]/90 border border-[#1F1F1F] backdrop-blur-md text-[10px] font-mono space-y-1.5 shadow-xl pointer-events-auto">
          <div className="font-bold text-white uppercase text-[9px] tracking-wider mb-1">
            NETWORK STATUS LEGEND
          </div>
          <div className="grid grid-cols-2 gap-x-3 gap-y-1">
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
              <span className="w-2 h-2 rounded-full bg-[#CC3333]"></span>
              <span>Critical</span>
            </div>
          </div>
          <div className="pt-1.5 border-t border-[#1F1F1F] space-y-1">
            <div className="flex items-center gap-1.5 text-[#22C55E]">
              <span className="w-4 h-0.5 bg-[#22C55E]"></span>
              <span>Normal Route</span>
            </div>
            <div className="flex items-center gap-1.5 text-[#CC3333]">
              <span className="w-4 h-0.5 bg-[#CC3333] border-b border-dashed"></span>
              <span>Delayed Route (+4d)</span>
            </div>
            <div className="flex items-center gap-1.5 text-[#F27D26]">
              <span className="w-4 h-0.5 bg-[#F27D26]"></span>
              <span>AI Alternative Route</span>
            </div>
          </div>
        </div>

        {/* Interactive Entity Details Card (Float in top right) */}
        {selectedEntity && (
          <div className="absolute top-4 right-4 z-[400] w-80 max-w-[calc(100%-2rem)] p-4 rounded bg-[#0A0A0A]/95 border border-[#1F1F1F] backdrop-blur-md shadow-2xl space-y-3 pointer-events-auto">
            <div className="flex items-center justify-between pb-2 border-b border-[#1F1F1F]">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-[#141414] border border-[#1F1F1F] text-[#F27D26]">
                  {selectedEntity.type.toUpperCase()}
                </span>
                <h4 className="text-xs font-bold text-white truncate max-w-[160px]">
                  {selectedEntity.data.name || selectedEntity.data.title || 'Telemetry Entity'}
                </h4>
              </div>
              <button
                onClick={() => setSelectedEntity(null)}
                className="text-[#666666] hover:text-white p-1 rounded hover:bg-[#141414] cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Entity Specific Information */}
            {selectedEntity.type === 'weather' && (
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-[#888888] font-mono text-[10px]">
                  <span>STORM SEVERITY:</span>
                  <span className="text-[#CC3333] font-bold">{selectedEntity.data.severity}</span>
                </div>
                <div className="flex justify-between text-[#888888] font-mono text-[10px]">
                  <span>MAX SUSTAINED WIND:</span>
                  <span className="text-white">{selectedEntity.data.windSpeed}</span>
                </div>
                <div className="flex justify-between text-[#888888] font-mono text-[10px]">
                  <span>CENTRAL PRESSURE:</span>
                  <span className="text-white">{selectedEntity.data.pressure}</span>
                </div>
                <div className="flex justify-between text-[#888888] font-mono text-[10px]">
                  <span>IMPACT RADIUS:</span>
                  <span className="text-white">{selectedEntity.data.affectedRadiusKm} km</span>
                </div>
                <div className="flex justify-between text-[#888888] font-mono text-[10px]">
                  <span>MOVEMENT VECTOR:</span>
                  <span className="text-[#FF8800]">{selectedEntity.data.heading}</span>
                </div>
                <p className="text-[11px] text-[#D1D1D1] pt-1 leading-relaxed">
                  Severe cyclonic storm halting container crane operations, inducing pilot vessel hold-ups and berthing suspensions at Chennai Harbor.
                </p>
              </div>
            )}

            {selectedEntity.type === 'port' && (
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-[#888888] font-mono text-[10px]">
                  <span>OPERATIONAL STATUS:</span>
                  <span className="font-bold uppercase" style={{ color: getStatusColor(selectedEntity.data.status) }}>
                    {selectedEntity.data.status}
                  </span>
                </div>
                <div className="flex justify-between text-[#888888] font-mono text-[10px]">
                  <span>AVERAGE BERTH DELAY:</span>
                  <span className="text-white font-bold">+{selectedEntity.data.avgDelayDays} Days</span>
                </div>
                <div className="flex justify-between text-[#888888] font-mono text-[10px]">
                  <span>VESSELS WAITING:</span>
                  <span className="text-white">{selectedEntity.data.activeVesselsWaiting} Ships</span>
                </div>
                <div className="flex justify-between text-[#888888] font-mono text-[10px]">
                  <span>AFFECTED SHIPMENTS:</span>
                  <span className="text-[#CC3333] font-bold">{selectedEntity.data.affectedShipments} Containers</span>
                </div>
                <div className="pt-2">
                  <button
                    onClick={() => onNavigateToTab?.('disruptions')}
                    className="w-full py-1.5 rounded bg-[#141414] border border-[#1F1F1F] hover:bg-[#1A1A1A] text-[10px] font-mono text-[#F27D26] flex items-center justify-center gap-1 cursor-pointer transition-colors"
                  >
                    <span>Inspect Port Disruption Dossier</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            )}

            {selectedEntity.type === 'warehouse' && (
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-[#888888] font-mono text-[10px]">
                  <span>STOCKOUT RISK:</span>
                  <span className="font-bold" style={{ color: getStatusColor(selectedEntity.data.status) }}>
                    {selectedEntity.data.stockoutRisk || selectedEntity.data.riskScore}%
                  </span>
                </div>
                <div className="flex justify-between text-[#888888] font-mono text-[10px]">
                  <span>CURRENT INVENTORY:</span>
                  <span className="text-white font-bold">{selectedEntity.data.capacityUnits ? `${(selectedEntity.data.currentStockUnits).toLocaleString()} Units` : '98,400 Units'}</span>
                </div>
                <div className="flex justify-between text-[#888888] font-mono text-[10px]">
                  <span>CRITICAL SKU EXPOSED:</span>
                  <span className="text-[#CC3333] font-bold">{selectedEntity.data.skuAtRisk || 'MCU-X1 (4,200 units left)'}</span>
                </div>
                <div className="flex justify-between text-[#888888] font-mono text-[10px]">
                  <span>DAYS OF SUPPLY:</span>
                  <span className="text-white font-mono">6.8 Days (Daily Burn: 620 units)</span>
                </div>
                <div className="flex justify-between text-[#888888] font-mono text-[10px]">
                  <span>INCOMING SHIPMENTS:</span>
                  <span className="text-[#FF8800]">{selectedEntity.data.incomingShipments || 4} En-route</span>
                </div>
                <div className="pt-2">
                  <button
                    onClick={() => onNavigateToTab?.('inventory')}
                    className="w-full py-1.5 rounded bg-[#141414] border border-[#1F1F1F] hover:bg-[#1A1A1A] text-[10px] font-mono text-[#F27D26] flex items-center justify-center gap-1 cursor-pointer transition-colors"
                  >
                    <span>View Warehouse SKU Breakdown</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            )}

            {selectedEntity.type === 'shipment' && (
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-[#888888] font-mono text-[10px]">
                  <span>TRACKING ID:</span>
                  <span className="text-white font-bold font-mono">{selectedEntity.data.trackingNumber}</span>
                </div>
                <div className="flex justify-between text-[#888888] font-mono text-[10px]">
                  <span>CARGO / SKU:</span>
                  <span className="text-[#F27D26] font-bold">{selectedEntity.data.sku} ({selectedEntity.data.units} Units)</span>
                </div>
                <div className="flex justify-between text-[#888888] font-mono text-[10px]">
                  <span>ORIGIN → DESTINATION:</span>
                  <span className="text-white">{selectedEntity.data.originName} → {selectedEntity.data.destinationWarehouse}</span>
                </div>
                <div className="flex justify-between text-[#888888] font-mono text-[10px]">
                  <span>STATUS & DELAY:</span>
                  <span className="text-[#CC3333] font-bold uppercase">{selectedEntity.data.status} (+{selectedEntity.data.delayDays} Days)</span>
                </div>
                <div className="flex justify-between text-[#888888] font-mono text-[10px]">
                  <span>PREDICTED ETA:</span>
                  <span className="text-white">{selectedEntity.data.predictedEta}</span>
                </div>
              </div>
            )}

            {selectedEntity.type === 'supplier' && (
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-[#888888] font-mono text-[10px]">
                  <span>LOCATION:</span>
                  <span className="text-white">{selectedEntity.data.location}, {selectedEntity.data.country}</span>
                </div>
                <div className="flex justify-between text-[#888888] font-mono text-[10px]">
                  <span>RELIABILITY SCORE:</span>
                  <span className="text-[#22C55E] font-bold">{selectedEntity.data.reliabilityScore}%</span>
                </div>
                <div className="flex justify-between text-[#888888] font-mono text-[10px]">
                  <span>ACTIVE CORRIDORS:</span>
                  <span className="text-[#FF8800]">{selectedEntity.data.activeShipmentsCount} In-Transit</span>
                </div>
                <div className="flex justify-between text-[#888888] font-mono text-[10px]">
                  <span>PRIMARY SKUS:</span>
                  <span className="text-white font-mono">{selectedEntity.data.primarySkus?.join(', ')}</span>
                </div>
              </div>
            )}

            {selectedEntity.type === 'route' && (
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-[#888888] font-mono text-[10px]">
                  <span>CORRIDOR:</span>
                  <span className="text-white font-bold">{selectedEntity.data.from} → {selectedEntity.data.to}</span>
                </div>
                <div className="flex justify-between text-[#888888] font-mono text-[10px]">
                  <span>STATUS:</span>
                  <span className="font-bold uppercase" style={{ color: getStatusColor(selectedEntity.data.status) }}>
                    {selectedEntity.data.status}
                  </span>
                </div>
                <div className="flex justify-between text-[#888888] font-mono text-[10px]">
                  <span>ACTIVE TRANSIT DELAY:</span>
                  <span className="text-white">+{selectedEntity.data.delayDays} Days</span>
                </div>
                {selectedEntity.data.additionalCost && (
                  <div className="flex justify-between text-[#888888] font-mono text-[10px]">
                    <span>ADDITIONAL COST:</span>
                    <span className="text-[#F27D26] font-bold">{selectedEntity.data.additionalCost}</span>
                  </div>
                )}
                {selectedEntity.data.riskReduction && (
                  <div className="flex justify-between text-[#888888] font-mono text-[10px]">
                    <span>RISK REDUCTION:</span>
                    <span className="text-[#22C55E] font-bold">{selectedEntity.data.riskReduction}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* 5. INTERACTIVE CAUSAL IMPACT CHAIN (EVENT 6) */}
      <div className="p-4 bg-[#080808] border-t border-[#1F1F1F] space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-3.5 h-3.5 text-[#F27D26]" />
            <h3 className="text-xs font-semibold text-white uppercase tracking-wide">
              EVENT 6 — DYNAMIC CAUSAL PROPAGATION CHAIN
            </h3>
            <span className="text-[10px] text-[#666666] font-mono hidden sm:inline">
              (Click any stage to focus map camera)
            </span>
          </div>
          <span className="text-[10px] font-mono text-[#888888]">
            8-Stage Geospatial Cascade
          </span>
        </div>

        {/* Chain Pipeline Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
          {[
            { label: 'CYCLONE', sub: 'Mandous Cat 3', lat: 12.8, lng: 84.5, zoom: 5, color: '#CC3333' },
            { label: 'BAY OF BENGAL', sub: 'Corridor Halted', lat: 13.5, lng: 85.0, zoom: 5, color: '#CC3333' },
            { label: 'CHENNAI PORT', sub: 'Berth Hold +4.8d', lat: 13.0844, lng: 80.2925, zoom: 7, color: '#CC3333' },
            { label: 'SUPPLIER DELAY', sub: 'IndoSilicon & PMC', lat: 13.0827, lng: 80.2707, zoom: 6, color: '#FF8800' },
            { label: 'SHIPMENT #4521', sub: 'MCU-X1 Delayed', lat: 11.8, lng: 85.2, zoom: 6, color: '#CC3333' },
            { label: 'WAREHOUSE CHENNAI', sub: 'Hub Buffer Loss', lat: 13.0827, lng: 80.2707, zoom: 7, color: '#CC3333' },
            { label: 'MCU-X1 EXPOSURE', sub: '6.8 Days of Supply', lat: 13.0827, lng: 80.2707, zoom: 7, color: '#FF8800' },
            { label: '87% STOCKOUT RISK', sub: 'Stockout in 6 Days', lat: 13.0827, lng: 80.2707, zoom: 7, color: '#CC3333' }
          ].map((item, idx) => (
            <button
              key={item.label}
              onClick={() => {
                flyToLocation(item.lat, item.lng, item.zoom);
                if (idx >= 4 && demoStep < 4) setDemoStep(4);
              }}
              className="p-2 rounded bg-[#0D0D0D] border border-[#1A1A1A] hover:bg-[#141414] hover:border-[#F27D26] text-left cursor-pointer transition-colors group flex flex-col justify-between"
            >
              <div className="flex items-center justify-between">
                <span className="text-[8px] font-mono text-[#666666]">0{idx + 1}</span>
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: item.color }}></span>
              </div>
              <div className="mt-1">
                <span className="text-[10px] font-mono font-bold text-white group-hover:text-[#F27D26] block truncate">
                  {item.label}
                </span>
                <span className="text-[9px] text-[#888888] block truncate">
                  {item.sub}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* 6. AI REPLENISHMENT RESPONSE & LOSS AVOIDED VISUALIZATION */}
      <div className="p-4 bg-[#0A0A0A] border-t border-[#1F1F1F] flex flex-col lg:flex-row items-stretch justify-between gap-4">
        {/* Left: AI Recommendation Module */}
        <div className="flex-1 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#F27D26]" />
              <h4 className="text-xs font-bold text-white uppercase font-sans">
                AI REPLENISHMENT INTELLIGENCE RECOMMENDATION
              </h4>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#141414] text-[#F27D26] border border-[#F27D26]/40">
              MCU-X1 Stockout Prevention Protocol
            </span>
          </div>

          <p className="text-xs text-[#888888] leading-relaxed">
            Automotive 32-Bit Microcontroller (MCU-X1) is projected to stock out on <span className="text-white font-bold">Day 6</span> before delayed sea shipment #4521 arrives on Day 9.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] font-mono pt-1">
            <div className="p-2 rounded bg-[#0D0D0D] border border-[#1F1F1F] text-[#D1D1D1]">
              <span className="text-[#F27D26] font-bold">1. Reallocate:</span> 1,200 units from Bengaluru Warehouse via dedicated road express.
            </div>
            <div className="p-2 rounded bg-[#0D0D0D] border border-[#1F1F1F] text-[#D1D1D1]">
              <span className="text-[#F27D26] font-bold">2. Expedite:</span> 2,500 units from Alternate Supplier Bharat Dynamics via Air Courier.
            </div>
            <div className="p-2 rounded bg-[#0D0D0D] border border-[#1F1F1F] text-[#D1D1D1]">
              <span className="text-[#F27D26] font-bold">3. Alternative Route:</span> Reroute Shanghai shipment via Mumbai JNPT (-68% risk).
            </div>
            <div className="p-2 rounded bg-[#0D0D0D] border border-[#1F1F1F] text-[#D1D1D1]">
              <span className="text-[#F27D26] font-bold">4. Safety Buffer:</span> Increase temporary reserve to 4,500 units to absorb coastal squalls.
            </div>
          </div>
        </div>

        {/* Right: Loss Avoided Comparison Banner & Action */}
        <div className="w-full lg:w-96 p-4 rounded bg-[#050505] border border-[#1F1F1F] flex flex-col justify-between space-y-3">
          <div className="grid grid-cols-2 gap-3 text-center">
            <div className="p-2 rounded bg-[#111111] border border-[#1A1A1A]">
              <span className="text-[9px] font-mono text-[#666666] block uppercase">WITHOUT REPLENOVA</span>
              <span className="text-sm font-mono font-bold text-[#CC3333] block mt-0.5">81% Risk</span>
              <span className="text-[10px] text-[#888888] font-mono">₹68.4L at Risk</span>
            </div>

            <div className="p-2 rounded bg-[#0F1F14] border border-green-500/30">
              <span className="text-[9px] font-mono text-green-400 block uppercase">WITH REPLENOVA</span>
              <span className="text-sm font-mono font-bold text-green-400 block mt-0.5">17% Risk</span>
              <span className="text-[10px] text-green-300 font-mono">₹14.2L at Risk</span>
            </div>
          </div>

          <div className="flex items-center justify-between px-3 py-2 rounded bg-[#141414] border border-[#1F1F1F]">
            <div>
              <span className="text-[9px] font-mono text-[#888888] block uppercase">POTENTIAL LOSS AVOIDED</span>
              <span className="text-base font-mono font-bold text-[#F27D26]">₹54.2 LAKHS</span>
            </div>
            <div className="text-right">
              <span className="text-[9px] font-mono text-[#888888] block uppercase">EXECUTION COST</span>
              <span className="text-xs font-mono text-white">₹14,600</span>
            </div>
          </div>

          <button
            onClick={() => {
              setIsMitigationApplied(true);
              setLayers(l => ({ ...l, alternativeRoute: true }));
              setDemoStep(6);
              flyToLocation(16.0, 84.0, 4);
            }}
            className="w-full py-2.5 rounded bg-[#F27D26] hover:bg-[#FF8800] text-black font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-lg"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>{isMitigationApplied ? 'AI Mitigation Deployed (Loss Avoided ₹54.2L)' : 'Deploy AI Mitigation Plan'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
