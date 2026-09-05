export type RiskLevel = 'healthy' | 'watch' | 'elevated' | 'critical';

export interface RiskCalculationResult {
  riskScore: number; // 0 - 100
  riskLevel: RiskLevel;
  stockoutProbability: number; // 0 - 100%
  predictedStockoutDays: number;
  predictedStockoutDate: string;
  daysOfSupply: number;
  financialExposureInr: number;
  leadTimeDeficitDays: number;
  safetyStockBreached: boolean;
}

export interface RiskWeights {
  demandVariability: number;
  leadTimeDelay: number;
  supplierReliability: number;
  disruptionSeverity: number;
  safetyStockBuffer: number;
}
