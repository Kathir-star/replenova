export * from './risk';
export * from './inventory';
export * from './supplier';
export * from './shipment';
export * from './disruption';

import { RiskLevel } from './risk';

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

export interface MapSelectedEntity {
  type: 'route' | 'port' | 'supplier' | 'warehouse' | 'factory' | 'weather' | 'shipment' | 'product';
  data: any;
}
