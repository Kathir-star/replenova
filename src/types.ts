export type RiskLevel = 'healthy' | 'watch' | 'elevated' | 'critical';

export interface Product {
  id: string;
  sku: string;
  name: string;
  category: string;
  warehouseId: string;
  warehouseName: string;
  currentStock: number;
  dailyDemand: number;
  safetyStock: number;
  unitCostInr: number;
  normalLeadTimeDays: number;
  predictedLeadTimeDays: number;
  supplierId: string;
  supplierName: string;
  stockoutProbability: number; // 0 to 100
  disruptionRisk: 'Low' | 'Medium' | 'High' | 'Critical';
  daysOfSupply: number;
  expectedStockoutDays: number;
  revenueExposureInr: number;
  aiRecommendation: string;
}

export interface Supplier {
  id: string;
  name: string;
  location: string;
  country: string;
  lat: number;
  lng: number;
  reliabilityScore: number; // 0 to 100
  averageLeadTimeDays: number;
  leadTimeVariabilityDays: number;
  activeShipmentsCount: number;
  currentRiskLevel: RiskLevel;
  disruptionExposureInr: number;
  primarySkus: string[];
  alternativeSuppliers: string[];
  notes: string;
}

export interface Warehouse {
  id: string;
  name: string;
  city: string;
  lat: number;
  lng: number;
  capacityUnits: number;
  currentStockUnits: number;
  utilizationPct: number;
  riskScore: number;
  criticalSkusCount: number;
}

export interface Factory {
  id: string;
  name: string;
  location: string;
  city: string;
  country: string;
  lat: number;
  lng: number;
  capacityUnitsPerDay: number;
  currentOutputPct: number;
  status: RiskLevel;
  primaryProducts: string[];
}

export interface ActiveShipment {
  id: string;
  trackingNumber: string;
  sku: string;
  productName: string;
  units: number;
  originName: string;
  originCoords: [number, number];
  portOfLoading: string;
  portOfLoadingCoords: [number, number];
  destinationPort: string;
  destinationPortCoords: [number, number];
  destinationWarehouse: string;
  destinationWarehouseCoords: [number, number];
  currentCoords?: [number, number];
  status: 'on-schedule' | 'delayed' | 'rerouted' | 'disrupted';
  originalEta: string;
  predictedEta: string;
  delayDays: number;
  risk: 'Low' | 'Medium' | 'High' | 'Critical';
  vesselName: string;
  isAlternative?: boolean;
  alternativeRouteNotes?: string;
  waypoints: [number, number][];
}

export interface WeatherDataPoint {
  latitude: number;
  longitude: number;
  windSpeedKmh: number;
  pressureHpa: number;
  stormCategory: string;
  rainfallMm: number;
  movementDirection: string;
  forecastSummary: string;
  alertLevel: 'watch' | 'warning' | 'critical';
  radiusKm: number;
}

export interface PortTelemetryPoint {
  portId: string;
  berthCongestionPct: number;
  vesselsWaiting: number;
  avgDwellDays: number;
  operationalStatus: RiskLevel;
  channelRestrictions: string;
}

export interface LogisticsTelemetryPoint {
  shipmentId: string;
  currentLat: number;
  currentLng: number;
  speedKnots: number;
  headingDeg: number;
  carrier: string;
  lastPingTimestamp: string;
}

export interface PortHub {
  id: string;
  name: string;
  city: string;
  country: string;
  lat: number;
  lng: number;
  congestionLevel: 'Normal' | 'Moderate' | 'Severe' | 'Critical';
  status: RiskLevel;
  avgDelayDays: number;
  activeVesselsWaiting: number;
  affectedShipments: number;
}

export interface SupplyRoute {
  id: string;
  name: string;
  fromName: string;
  toName: string;
  fromCoords: [number, number];
  toCoords: [number, number];
  transitType: 'ocean' | 'air' | 'road' | 'rail';
  status: RiskLevel;
  activeDelayDays: number;
  vesselsInTransit: number;
  skusCarried: number;
}

export interface ImpactNode {
  id: string;
  step: number;
  title: string;
  type: 'event' | 'corridor' | 'port' | 'supplier' | 'shipment' | 'delay' | 'warehouse' | 'sku' | 'stockout' | 'exposure';
  subtitle: string;
  badge?: string;
  badgeType?: RiskLevel;
  details: string;
}

export interface ExternalDisruptionEvent {
  id: string;
  title: string;
  category: 'Weather' | 'Ports' | 'Transportation' | 'News' | 'Geopolitical' | 'Economic';
  locationName: string;
  lat: number;
  lng: number;
  severity: RiskLevel;
  confidence: number;
  detectedAt: string;
  expectedDurationDays: string;
  expectedDelayDays: string;
  affectedSuppliers: number;
  affectedShipments: number;
  affectedSkus: number;
  revenueAtRiskInr: number;
  summary: string;
  impactChain: ImpactNode[];
}

export interface ReplenishmentRecommendation {
  id: string;
  sku: string;
  productName: string;
  currentStock: number;
  dailyDemand: number;
  predictedLeadTimeDays: number;
  stockoutDays: number;
  recommendedAction: string;
  orderUnits: number;
  supplierName: string;
  alternateSupplierName: string;
  transportMode: 'Air Freight' | 'Priority Sea' | 'Inter-facility Rail' | 'Dedicated Road';
  estimatedAdditionalCostInr: number;
  riskReductionPct: number;
  originalStockoutProb: number;
  revisedStockoutProb: number;
  status: 'pending' | 'approved' | 'simulated' | 'dismissed';
  impactSummary: string;
}

export interface AIAction {
  id: string;
  riskLevel: 'critical' | 'elevated' | 'watch';
  title: string;
  problem: string;
  recommendedAction: string;
  costInr: number;
  benefit: string;
  riskReductionPct: number;
  confidencePct: number;
  status: 'pending' | 'approved' | 'simulated' | 'dismissed';
  category: 'Inventory Reallocation' | 'Alternate Sourcing' | 'Expedited Freight' | 'Buffer Adjustment';
  timestamp: string;
}

export interface NotificationItem {
  id: string;
  level: RiskLevel;
  title: string;
  message: string;
  timestamp: string;
  linkTab: string;
  skuTarget?: string;
  read: boolean;
}

export interface SimulationScenarioPreset {
  id: string;
  title: string;
  category: string;
  description: string;
  defaultDurationDays: number;
  withoutReplenova: {
    affectedShipments: number;
    affectedSkus: number;
    potentialStockouts: number;
    revenueAtRiskInr: number;
    stockoutProbability: number;
    leadTimeIncreaseDays: number;
  };
  withReplenova: {
    alternativeSupplier: string;
    inventoryReallocationUnits: number;
    expeditedShipmentUnits: number;
    stockoutProbability: number;
    revenueAtRiskInr: number;
    potentialLossAvoidedInr: number;
    netSavingsInr: number;
  };
}

export interface CopilotMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  suggestedActions?: { label: string; actionTab: string }[];
}

export interface DemoStoryStep {
  step: number;
  title: string;
  narrative: string;
  highlightTarget: string;
  metricBadge: string;
}
