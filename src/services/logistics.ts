import { LogisticsTelemetryPoint, PortTelemetryPoint } from '../types/index';

export const DEMO_VESSEL_TELEMETRY: LogisticsTelemetryPoint[] = [
  {
    shipmentId: 'shp-4521',
    currentLat: 12.2,
    currentLng: 85.1,
    speedKnots: 2.1,
    headingDeg: 280,
    carrier: 'Evergreen Marine Line (MV EVER BRAVE)',
    lastPingTimestamp: '3 mins ago'
  },
  {
    shipmentId: 'shp-4522',
    currentLat: 11.8,
    currentLng: 77.2,
    speedKnots: 11.4,
    headingDeg: 85,
    carrier: 'OOCL Logistics (MT AL-BARAKA)',
    lastPingTimestamp: '12 mins ago'
  },
  {
    shipmentId: 'shp-4523',
    currentLat: 13.5,
    currentLng: 87.8,
    speedKnots: 3.5,
    headingDeg: 275,
    carrier: 'CMA CGM Group',
    lastPingTimestamp: '8 mins ago'
  }
];

export const DEMO_PORT_TELEMETRY: PortTelemetryPoint[] = [
  {
    portId: 'port-3',
    berthCongestionPct: 94,
    vesselsWaiting: 19,
    avgDwellDays: 4.8,
    operationalStatus: 'critical',
    channelRestrictions: 'Cyclone Mandous gale warning: berth operations suspended by Port Trust.'
  },
  {
    portId: 'port-4',
    berthCongestionPct: 42,
    vesselsWaiting: 3,
    avgDwellDays: 0.9,
    operationalStatus: 'healthy',
    channelRestrictions: 'Normal navigation and double-stack rail freight operating on schedule.'
  }
];

export async function fetchShipmentTelemetry(shipmentId: string): Promise<LogisticsTelemetryPoint | null> {
  const found = DEMO_VESSEL_TELEMETRY.find(t => t.shipmentId === shipmentId);
  return found || null;
}
