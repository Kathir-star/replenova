/**
 * REPLENOVA Supply Chain Calculations
 * Deterministic formulas for inventory telemetry, safety stock, and EOQ.
 */

export function calculateDaysOfSupply(currentStock: number, dailyDemand: number): number {
  if (dailyDemand <= 0) return 999;
  return Number((currentStock / dailyDemand).toFixed(1));
}

export function calculateStockoutDate(daysOfSupply: number, startDate: Date = new Date()): string {
  const targetDate = new Date(startDate.getTime() + daysOfSupply * 24 * 60 * 60 * 1000);
  return targetDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function calculateSafetyStockDeficit(
  currentStock: number,
  safetyStock: number
): { isBreached: boolean; deficitUnits: number; deficitPct: number } {
  if (currentStock < safetyStock) {
    const deficit = safetyStock - currentStock;
    const pct = Number(((deficit / safetyStock) * 100).toFixed(1));
    return { isBreached: true, deficitUnits: deficit, deficitPct: pct };
  }
  return { isBreached: false, deficitUnits: 0, deficitPct: 0 };
}

export function calculateFinancialExposure(
  currentStock: number,
  dailyDemand: number,
  leadTimeDays: number,
  unitCostInr: number,
  marginMultiplier: number = 2.4
): number {
  const demandDuringLeadTime = dailyDemand * leadTimeDays;
  const shortfallUnits = Math.max(0, demandDuringLeadTime - currentStock);
  const potentialRevenueLoss = shortfallUnits * (unitCostInr * marginMultiplier);
  return Math.round(potentialRevenueLoss);
}

export function formatInrCurrency(amount: number): string {
  if (amount >= 10000000) {
    return `₹${(amount / 10000000).toFixed(2)} Cr`;
  }
  if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(1)}L`;
  }
  if (amount >= 1000) {
    return `₹${(amount / 1000).toFixed(1)}k`;
  }
  return `₹${amount.toLocaleString('en-IN')}`;
}

export function formatNumber(val: number): string {
  return val.toLocaleString('en-US');
}
