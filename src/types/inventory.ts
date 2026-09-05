import { RiskLevel } from './risk';

export interface InventoryItem {
  id: string;
  sku: string;
  productName?: string;
  name?: string; // alias for productName
  category: string;
  warehouseId: string;
  warehouseName: string;
  currentStock: number;
  dailyDemand: number;
  safetyStock: number;
  unitCostInr: number;
  normalLeadTimeDays: number;
  predictedLeadTimeDays: number;
  leadTimeDeficitDays?: number;
  supplierId: string;
  supplierName: string;
  stockoutProbability: number; // 0 - 100%
  riskLevel?: RiskLevel;
  disruptionRisk?: RiskLevel | string; // alias for riskLevel
  daysOfSupply: number;
  expectedStockoutDays: number;
  revenueExposureInr: number;
  aiRecommendation: string;
  criticalityRank?: number;
  status?: 'Optimal' | 'Depleting' | 'At Risk' | 'Critical Buffer Breached' | string;
}

export type Product = InventoryItem;

export interface Warehouse {
  id: string;
  name: string;
  city: string;
  country?: string;
  region?: string;
  lat: number;
  lng: number;
  capacityUnits: number;
  currentStockUnits: number;
  utilizationPct: number;
  capacityUtilizationPct?: number; // alias
  riskScore: number;
  criticalSkusCount: number;
  activeSkusCount?: number;
  status?: RiskLevel;
}
