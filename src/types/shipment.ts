import { RiskLevel } from './risk';

export interface PortHub {
  id: string;
  name: string;
  city: string;
  country: string;
  lat: number;
  lng: number;
  congestionLevel: 'Normal' | 'Moderate' | 'Severe' | 'Critical' | number | any;
  status: RiskLevel;
  avgDelayDays: number;
  averageDwellTimeDays?: number; // alias
  activeVesselsWaiting: number;
  affectedShipments: number;
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
  carrier?: string;
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
  isAlternativeRoute?: boolean;
}
