import { RiskLevel } from './risk';

export interface ImpactNode {
  id: string;
  step: number;
  title: string;
  type: 'event' | 'corridor' | 'port' | 'supplier' | 'shipment' | 'delay' | 'warehouse' | 'sku' | 'stockout' | 'exposure';
  subtitle: string;
  badge?: string;
  badgeType?: RiskLevel;
  details: string;
  entityType?: 'weather' | 'port' | 'supplier' | 'shipment' | 'warehouse' | 'product';
  entityId?: string;
}

export interface DisruptionEvent {
  id: string;
  title: string;
  category: 'Weather' | 'Ports' | 'Transportation' | 'News' | 'Geopolitical' | 'Economic' | 'Energy' | string;
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
  affectedSkus: number | string[];
  revenueAtRiskInr: number;
  summary: string;
  impactChain: ImpactNode[];
}

export type ExternalDisruptionEvent = DisruptionEvent;

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
  transportMode: 'Air Freight' | 'Priority Sea' | 'Inter-facility Rail' | 'Dedicated Road' | string;
  estimatedAdditionalCostInr: number;
  riskReductionPct: number;
  originalStockoutProb: number;
  revisedStockoutProb: number;
  status: 'pending' | 'approved' | 'simulated' | 'dismissed' | string;
  impactSummary: string;
}

export interface AIAction {
  id: string;
  riskLevel: 'critical' | 'elevated' | 'watch' | string;
  title: string;
  problem: string;
  description?: string; // alias
  recommendedAction: string;
  costInr: number;
  benefit: string;
  impact?: string; // alias
  riskReductionPct: number;
  confidencePct: number;
  status: 'pending' | 'approved' | 'simulated' | 'dismissed' | 'executed' | string;
  category: 'Inventory Reallocation' | 'Alternate Sourcing' | 'Expedited Freight' | 'Buffer Adjustment' | string;
  timestamp: string;
  skuTarget?: string;
  triggerEvent?: string;
  estimatedSavingsInr?: number;
}

export interface ScenarioPreset {
  id: string;
  name?: string; // alias for title
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

export type SimulationScenarioPreset = ScenarioPreset;
