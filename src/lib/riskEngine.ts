import { RiskLevel, RiskCalculationResult, RiskWeights } from '../types/risk';
import { calculateDaysOfSupply, calculateStockoutDate, calculateFinancialExposure } from './calculations';

export const DEFAULT_RISK_WEIGHTS: RiskWeights = {
  demandVariability: 0.20,
  leadTimeDelay: 0.30,
  supplierReliability: 0.15,
  disruptionSeverity: 0.25,
  safetyStockBuffer: 0.10,
};

export interface RiskInputParams {
  currentStock: number;
  dailyDemand: number;
  safetyStock: number;
  normalLeadTimeDays: number;
  predictedLeadTimeDays: number;
  supplierReliabilityScore: number; // 0 to 100
  disruptionSeverityLevel?: RiskLevel;
  unitCostInr: number;
}

/**
 * REPLENOVA Multi-Factor Deterministic Risk Engine
 * Computes live stockout probabilities, days of supply, risk levels, and revenue exposure.
 */
export function evaluateSupplyChainRisk(
  params: RiskInputParams,
  weights: RiskWeights = DEFAULT_RISK_WEIGHTS
): RiskCalculationResult {
  const {
    currentStock,
    dailyDemand,
    safetyStock,
    normalLeadTimeDays,
    predictedLeadTimeDays,
    supplierReliabilityScore,
    disruptionSeverityLevel = 'healthy',
    unitCostInr
  } = params;

  const daysOfSupply = calculateDaysOfSupply(currentStock, dailyDemand);
  const leadTimeDeficit = Math.max(0, predictedLeadTimeDays - daysOfSupply);

  // 1. Lead Time Delay Factor (0 - 100)
  const leadTimeRatio = normalLeadTimeDays > 0 ? predictedLeadTimeDays / normalLeadTimeDays : 1;
  const leadTimeFactor = Math.min(100, Math.max(0, (leadTimeRatio - 1) * 70 + (leadTimeDeficit > 0 ? 30 : 0)));

  // 2. Safety Stock Deficit Factor (0 - 100)
  let safetyBufferFactor = 0;
  if (currentStock < safetyStock) {
    safetyBufferFactor = Math.min(100, ((safetyStock - currentStock) / safetyStock) * 100);
  }

  // 3. Supplier Unreliability Factor (0 - 100)
  const supplierUnreliabilityFactor = Math.max(0, 100 - supplierReliabilityScore);

  // 4. Disruption Severity Factor (0 - 100)
  let disruptionFactor = 0;
  switch (disruptionSeverityLevel) {
    case 'critical':
      disruptionFactor = 95;
      break;
    case 'elevated':
      disruptionFactor = 65;
      break;
    case 'watch':
      disruptionFactor = 35;
      break;
    case 'healthy':
    default:
      disruptionFactor = 5;
      break;
  }

  // 5. Demand Buffer Depletion (0 - 100)
  const demandDeficitFactor = daysOfSupply <= predictedLeadTimeDays
    ? Math.min(100, ((predictedLeadTimeDays - daysOfSupply + 1) / (predictedLeadTimeDays + 1)) * 100)
    : Math.max(0, 20 - (daysOfSupply - predictedLeadTimeDays) * 2);

  // Calculate Weighted Composite Risk Score (0 - 100)
  const compositeScore = (
    leadTimeFactor * weights.leadTimeDelay +
    safetyBufferFactor * weights.safetyStockBuffer +
    supplierUnreliabilityFactor * weights.supplierReliability +
    disruptionFactor * weights.disruptionSeverity +
    demandDeficitFactor * weights.demandVariability
  );

  const roundedScore = Math.min(100, Math.max(0, Math.round(compositeScore)));

  // Map to discrete Risk Level
  let riskLevel: RiskLevel = 'healthy';
  if (roundedScore >= 75 || leadTimeDeficit > 3 || (daysOfSupply <= 3 && dailyDemand > 0)) {
    riskLevel = 'critical';
  } else if (roundedScore >= 50 || leadTimeDeficit > 0 || currentStock < safetyStock) {
    riskLevel = 'elevated';
  } else if (roundedScore >= 25) {
    riskLevel = 'watch';
  } else {
    riskLevel = 'healthy';
  }

  // Calculate Stockout Probability
  let stockoutProbability = 0;
  if (daysOfSupply <= 0) {
    stockoutProbability = 100;
  } else if (daysOfSupply < predictedLeadTimeDays) {
    const gap = predictedLeadTimeDays - daysOfSupply;
    stockoutProbability = Math.min(99, Math.round(55 + (gap / predictedLeadTimeDays) * 44));
  } else if (daysOfSupply <= predictedLeadTimeDays + 2) {
    stockoutProbability = Math.round(25 + (1 - (daysOfSupply - predictedLeadTimeDays) / 3) * 25);
  } else {
    stockoutProbability = Math.max(2, Math.round(15 - (daysOfSupply - predictedLeadTimeDays)));
  }

  const financialExposureInr = calculateFinancialExposure(
    currentStock,
    dailyDemand,
    predictedLeadTimeDays,
    unitCostInr
  );

  return {
    riskScore: roundedScore,
    riskLevel,
    stockoutProbability,
    predictedStockoutDays: Math.max(0, Math.floor(daysOfSupply)),
    predictedStockoutDate: calculateStockoutDate(daysOfSupply),
    daysOfSupply,
    financialExposureInr,
    leadTimeDeficitDays: leadTimeDeficit,
    safetyStockBreached: currentStock < safetyStock,
  };
}
