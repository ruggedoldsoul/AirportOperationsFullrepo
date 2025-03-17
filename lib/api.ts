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
  protected baseUrl = process.env.NEXT_PUBLIC_API_URL;

  protected async fetch<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const { requiresAuth = true, ...fetchOptions } = options;
    
    const headers = new Headers(fetchOptions.headers);
    headers.set('Content-Type', 'application/json');

    if (requiresAuth) {
      // Get the session token from wherever you store it (localStorage, cookie, etc.)
      const session = await this.getSession();
      if (session?.token) {
        headers.set('Authorization', `Bearer ${session.token}`);
      }
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...fetchOptions,
      headers
    });

    if (!response.ok) {
      if (response.status === 401) {
        // Handle unauthorized access
        window.location.href = '/login';
        throw new Error('Unauthorized access');
      }
      throw new Error(`API Error: ${response.statusText}`);
    }

    // Return null for 204 No Content responses
    if (response.status === 204) {
      return null as T;
    }

    return response.json();
  }

  private async getSession() {
    try {
      // You can replace this with your actual session management logic
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