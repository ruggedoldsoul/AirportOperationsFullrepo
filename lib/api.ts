export interface Aircraft {
  callSign: string;
  type: string;
  status: 'Active' | 'Maintenance' | 'Grounded';
}

export interface Weather {
  temperature: number;
  windSpeed: number;
  conditions: string;
  timestamp: string;
}

class AircraftService {
  private baseUrl = process.env.NEXT_PUBLIC_API_URL;

  async getAllAircrafts(): Promise<Aircraft[]> {
    try {
      const response = await fetch(`${this.baseUrl}/api/aircrafts`);
      if (!response.ok) {
        throw new Error('Failed to fetch aircrafts');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching aircrafts:', error);
      throw error;
    }
  }
}

class WeatherService {
  private baseUrl = process.env.NEXT_PUBLIC_API_URL;

  async getCurrentWeather(): Promise<Weather> {
    try {
      const response = await fetch(`${this.baseUrl}/api/weather`);
      if (!response.ok) {
        throw new Error('Failed to fetch weather data');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching weather:', error);
      throw error;
    }
  }
}

export const aircraftService = new AircraftService();
export const weatherService = new WeatherService(); 