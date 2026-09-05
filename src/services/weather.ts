import { WeatherDataPoint } from '../types/index';

const DEMO_WEATHER_DATA: WeatherDataPoint = {
  latitude: 12.8,
  longitude: 84.5,
  windSpeedKmh: 140,
  pressureHpa: 980,
  stormCategory: 'Category 3 Severe Cyclonic Storm',
  rainfallMm: 185,
  movementDirection: 'North-West (310°)',
  forecastSummary: 'Severe cyclonic storm Mandous centered over Southwest Bay of Bengal. Moving WNW towards North Tamil Nadu and South Andhra Pradesh coasts.',
  alertLevel: 'critical',
  radiusKm: 380,
};

export async function fetchLiveWeatherData(lat: number, lng: number): Promise<{ data: WeatherDataPoint; isLive: boolean }> {
  const weatherApiKey = import.meta.env.VITE_WEATHER_API_KEY;

  if (!weatherApiKey) {
    return { data: DEMO_WEATHER_DATA, isLive: false };
  }

  try {
    const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${weatherApiKey}&units=metric`);
    if (!res.ok) throw new Error('Weather API error');
    const json = await res.json();

    const liveData: WeatherDataPoint = {
      latitude: lat,
      longitude: lng,
      windSpeedKmh: Math.round((json.wind?.speed || 10) * 3.6),
      pressureHpa: json.main?.pressure || 1012,
      stormCategory: json.weather?.[0]?.description || 'Active Weather System',
      rainfallMm: json.rain?.['1h'] || 0,
      movementDirection: `${json.wind?.deg || 0}°`,
      forecastSummary: `Current condition: ${json.weather?.[0]?.main || 'Clear'}. Temp: ${json.main?.temp}°C.`,
      alertLevel: json.wind?.speed > 25 ? 'critical' : json.wind?.speed > 15 ? 'warning' : 'watch',
      radiusKm: 250,
    };

    return { data: liveData, isLive: true };
  } catch (e) {
    return { data: DEMO_WEATHER_DATA, isLive: false };
  }
}
