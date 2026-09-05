import { RiskLevel } from './risk';

export interface Supplier {
  id: string;
  name: string;
  location: string;
  city?: string;
  country: string;
  lat: number;
  lng: number;
  reliabilityScore: number; // 0 to 100
  averageLeadTimeDays: number;
  leadTimeDays?: number; // alias
  leadTimeVariabilityDays: number;
  activeShipmentsCount: number;
  currentRiskLevel: RiskLevel;
  disruptionExposureInr: number;
  primarySkus: string[];
  suppliedSkus?: string[]; // alias
  alternativeSuppliers: string[];
  notes: string;
  contactEmail?: string;
  tier?: 'Tier 1' | 'Tier 2' | 'Strategic' | string;
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
