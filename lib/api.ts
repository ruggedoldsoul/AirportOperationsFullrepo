export interface Aircraft {
  callSign: string;
  type: 'AIRLINER' | 'PRIVATE';
  state: 'PARKED' | 'TAKE_OFF' | 'AIRBORNE' | 'APPROACH' | 'LANDED';
  location?: {
    latitude: number;
    longitude: number;
    altitude: number;
  };
  parkingSpot?: number;
  lastUpdated: string;
}

export interface Weather {
  temperature: number;
  windSpeed: number;
  windDirection: string;
  conditions: string;
  visibility: number;
  timestamp: string;
}

export interface StateChangeResult {
  isSuccess: boolean;
  message?: string;
}

interface RequestOptions extends RequestInit {
  requiresAuth?: boolean;
}

class ApiClient {
  protected baseUrl: string;

  constructor() {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!apiUrl) {
      throw new Error('NEXT_PUBLIC_API_URL environment variable is not set');
    }
    this.baseUrl = apiUrl.endsWith('/') ? apiUrl.slice(0, -1) : apiUrl;
  }

  protected async fetch<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const { requiresAuth = true, ...fetchOptions } = options;
    
    const headers = new Headers(fetchOptions.headers);
    headers.set('Content-Type', 'application/json');

    if (requiresAuth) {
      const session = await this.getSession();
      if (session?.token) {
        headers.set('Authorization', `Bearer ${session.token}`);
      }
    }

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...fetchOptions,
        headers,
        // Add credentials for CORS requests
        credentials: 'include'
      });

      if (!response.ok) {
        if (response.status === 401) {
          window.location.href = '/login';
          throw new Error('Unauthorized access');
        }
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || `API Error: ${response.statusText}`);
      }

      if (response.status === 204) {
        return null as T;
      }

      return response.json();
    } catch (error) {
      if (error instanceof TypeError && error.message === 'Failed to fetch') {
        console.error('Network error: Unable to connect to the API server. Please check if the server is running.');
        throw new Error('Network error: Unable to connect to the API server');
      }
      throw error;
    }
  }

  private async getSession() {
    try {
      const response = await fetch('/api/auth/session');
      if (response.ok) {
        return response.json();
      }
      return null;
    } catch (error) {
      console.error('Error fetching session:', error);
      return null;
    }
  }
}

class AircraftService extends ApiClient {
  async getAllAircrafts(): Promise<Aircraft[]> {
    try {
      return await this.fetch<Aircraft[]>('/api/aircraft');
    } catch (error) {
      console.error('Error fetching aircrafts:', error);
      throw error;
    }
  }

  async getAircraftByCallSign(callSign: string): Promise<Aircraft> {
    try {
      return await this.fetch<Aircraft>(`/api/aircraft/${callSign}`);
    } catch (error) {
      console.error('Error fetching aircraft:', error);
      throw error;
    }
  }

  async updateLocation(callSign: string, location: Aircraft['location']): Promise<void> {
    try {
      await this.fetch<void>(`/api/aircraft/${callSign}/location`, {
        method: 'PUT',
        body: JSON.stringify(location),
      });
    } catch (error) {
      console.error('Error updating aircraft location:', error);
      throw error;
    }
  }

  async requestStateChange(callSign: string, newState: Aircraft['state']): Promise<StateChangeResult> {
    try {
      return await this.fetch<StateChangeResult>(`/api/aircraft/${callSign}/state`, {
        method: 'POST',
        body: JSON.stringify({ state: newState }),
      });
    } catch (error) {
      console.error('Error updating aircraft state:', error);
      throw error;
    }
  }
}

class WeatherService extends ApiClient {
  async getCurrentWeather(): Promise<Weather> {
    try {
      return await this.fetch<Weather>('/api/weather/current', {
        // Weather endpoint might not require authentication
        requiresAuth: false
      });
    } catch (error) {
      console.error('Error fetching weather:', error);
      throw error;
    }
  }

  async getWeatherForecast(): Promise<Weather[]> {
    try {
      return await this.fetch<Weather[]>('/api/weather/forecast', {
        // Weather endpoint might not require authentication
        requiresAuth: false
      });
    } catch (error) {
      console.error('Error fetching weather forecast:', error);
      throw error;
    }
  }
}

export const aircraftService = new AircraftService();
export const weatherService = new WeatherService(); 