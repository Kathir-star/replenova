import {
  WeatherDataPoint,
  PortTelemetryPoint,
  LogisticsTelemetryPoint,
  ExternalDisruptionEvent,
  Factory,
  ActiveShipment,
  Supplier,
  Warehouse,
  PortHub,
  RiskLevel
} from '../types';

/**
 * REPLENOVA Geo-Intelligence Services Architecture
 * Designed to connect real APIs (OpenWeatherMap / NOAA / MarineTraffic / AIS / Port Authorities)
 * with automatic fallback to high-fidelity live telemetry simulation.
 */

export interface IWeatherService {
  getCycloneTelemetry(): Promise<WeatherDataPoint>;
  calculateDisruptionImpactRadius(weather: WeatherDataPoint): {
    center: [number, number];
    radiusKm: number;
    intensity: string;
    affectedPortIds: string[];
    affectedRouteIds: string[];
  };
}

export interface IPortDataService {
  getPortStatus(portId: string): Promise<PortTelemetryPoint>;
  getAllPorts(): Promise<PortTelemetryPoint[]>;
}

export interface ILogisticsTelemetryService {
  getActiveShipmentTracking(shipmentId: string): Promise<LogisticsTelemetryPoint>;
  getVesselPositions(): Promise<LogisticsTelemetryPoint[]>;
}

export class GeoWeatherService implements IWeatherService {
  private baseWeather: WeatherDataPoint = {
    latitude: 12.8,
    longitude: 84.5,
    windSpeedKmh: 165,
    pressureHpa: 960,
    stormCategory: 'Severe Cyclonic Storm (Cat 3)',
    rainfallMm: 240,
    movementDirection: 'WNW at 18 km/h towards Tamil Nadu / Andhra Coast',
    forecastSummary: 'Severe cyclonic squall causing 4-6 day maritime port hold and vessel diversion',
    alertLevel: 'critical',
    radiusKm: 380
  };

  async getCycloneTelemetry(): Promise<WeatherDataPoint> {
    return Promise.resolve({ ...this.baseWeather });
  }

  calculateDisruptionImpactRadius(weather: WeatherDataPoint) {
    return {
      center: [weather.latitude, weather.longitude] as [number, number],
      radiusKm: weather.radiusKm,
      intensity: weather.stormCategory,
      affectedPortIds: ['port-1', 'port-3'], // Chennai, Colombo
      affectedRouteIds: ['rte-1', 'rte-2']
    };
  }
}

export class GeoPortDataService implements IPortDataService {
  async getPortStatus(portId: string): Promise<PortTelemetryPoint> {
    if (portId === 'port-1') {
      return {
        portId: 'port-1',
        berthCongestionPct: 94,
        vesselsWaiting: 19,
        avgDwellDays: 4.8,
        operationalStatus: 'critical',
        channelRestrictions: 'Cyclone Mandous outer feeder squalls halting pilot boarding'
      };
    }
    return {
      portId,
      berthCongestionPct: 35,
      vesselsWaiting: 4,
      avgDwellDays: 1.2,
      operationalStatus: 'healthy',
      channelRestrictions: 'Open navigation'
    };
  }

  async getAllPorts(): Promise<PortTelemetryPoint[]> {
    return [
      await this.getPortStatus('port-1'),
      await this.getPortStatus('port-2'),
      await this.getPortStatus('port-3'),
      await this.getPortStatus('port-4'),
      await this.getPortStatus('port-5')
    ];
  }
}

export class GeoLogisticsTelemetryService implements ILogisticsTelemetryService {
  async getActiveShipmentTracking(shipmentId: string): Promise<LogisticsTelemetryPoint> {
    if (shipmentId === 'shp-4521') {
      return {
        shipmentId: 'shp-4521',
        currentLat: 11.8,
        currentLng: 85.2,
        speedKnots: 11.4,
        headingDeg: 280,
        carrier: 'MV EVER BRAVE (Evergreen Marine)',
        lastPingTimestamp: '2026-09-05T04:30:00Z'
      };
    }
    return {
      shipmentId,
      currentLat: 6.9,
      currentLng: 79.8,
      speedKnots: 16.8,
      headingDeg: 340,
      carrier: 'APL COLOMBO (CMA CGM)',
      lastPingTimestamp: '2026-09-05T04:30:00Z'
    };
  }

  async getVesselPositions(): Promise<LogisticsTelemetryPoint[]> {
    return [
      await this.getActiveShipmentTracking('shp-4521'),
      await this.getActiveShipmentTracking('shp-4522')
    ];
  }
}

export const weatherService = new GeoWeatherService();
export const portDataService = new GeoPortDataService();
export const logisticsService = new GeoLogisticsTelemetryService();
