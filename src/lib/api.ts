import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://localhost:7214';

export interface Aircraft {
  callSign: string;
  type: string;
  status: string;
}

export interface Weather {
  temperature: number;
  windSpeed: number;
  conditions: string;
  timestamp: string;
}

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const aircraftService = {
  getAllAircrafts: async (): Promise<Aircraft[]> => {
    const response = await api.get('/api/aircrafts');
    return response.data;
  },

  getAircraftByCallSign: async (callSign: string): Promise<Aircraft> => {
    const response = await api.get(`/api/aircrafts/${callSign}`);
    return response.data;
  },

  addAircraft: async (aircraft: Aircraft): Promise<Aircraft> => {
    const response = await api.post('/api/aircrafts', aircraft);
    return response.data;
  },
};

export const weatherService = {
  getCurrentWeather: async (): Promise<Weather> => {
    const response = await api.get('/api/weather');
    return response.data;
  },
};

export default api; 