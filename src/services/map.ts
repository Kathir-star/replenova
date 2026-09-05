/**
 * REPLENOVA Map Service Configuration
 * Provides base style URLs and MapTiler / Mapbox / OpenStreetMap tile definitions.
 */

export interface MapConfig {
  styleUrl: string;
  defaultCenter: [number, number]; // [lng, lat]
  defaultZoom: number;
}

export function getMapStyleConfig(): MapConfig {
  const maptilerKey = import.meta.env.VITE_MAPTILER_KEY;
  const mapboxToken = import.meta.env.VITE_MAPBOX_TOKEN;

  let styleUrl = 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json';

  if (maptilerKey) {
    styleUrl = `https://api.maptiler.com/maps/dataviz-dark/style.json?key=${maptilerKey}`;
  } else if (mapboxToken) {
    styleUrl = `mapbox://styles/mapbox/dark-v11?access_token=${mapboxToken}`;
  }

  return {
    styleUrl,
    defaultCenter: [82.0, 16.0], // Centered around South & Southeast Asia
    defaultZoom: 3.8,
  };
}
