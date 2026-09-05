/**
 * REPLENOVA Base API Service Client
 * Handles requests with fallback mechanisms and mock switches.
 */

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  isMock?: boolean;
}

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

export async function fetchWithFallback<T>(
  endpoint: string,
  fallbackData: T,
  options?: RequestInit
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      console.warn(`API call to ${endpoint} returned ${response.status}. Falling back to demo data.`);
      return { data: fallbackData, success: true, isMock: true };
    }

    const data = await response.json();
    return { data, success: true, isMock: false };
  } catch (err) {
    // Graceful fallback to demo dataset
    return { data: fallbackData, success: true, isMock: true };
  }
}
