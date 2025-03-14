import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://localhost:7214';

export interface Aircraft {
  callSign: string;
  type: 'AIRLINER' | 'PRIVATE';
  state: 'PARKED' | 'TAKE_OFF' | 'AIRBORNE' | 'APPROACH' | 'LANDED';
  latitude?: number;
  longitude?: number;
  altitude?: number;
  heading?: number;
  lastUpdated: string;
  parkingSpot?: number;
}

export interface Weather {
  description: string;
  temperature: number;
  visibility: number;
  wind: {
    speed: number;
    deg: number;
  };
  lastUpdate: string;
}

export interface StateChange {
  id: number;
  callSign: string;
  requestedState: string;
  previousState: string;
  outcome: 'ACCEPTED' | 'REJECTED';
  rejectReason?: string;
  timestamp: string;
}

export interface ParkingSpot {
  id: number;
  type: 'AIRLINER' | 'PRIVATE';
  occupied: boolean;
  aircraftCallSign?: string;
}

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const aircraftService = {
  getAllAircrafts: async (): Promise<Aircraft[]> => {
    const response = await api.get('/api/admin/aircraft');
    return response.data;
  },

  getStateChanges: async (): Promise<StateChange[]> => {
    const response = await api.get('/api/admin/statechanges');
    return response.data;
  },

  getParkingStatus: async (): Promise<ParkingSpot[]> => {
    const response = await api.get('/api/admin/parking');
    return response.data;
  },
};

export const weatherService = {
  getCurrentWeather: async (): Promise<Weather> => {
    const response = await api.get('/api/public/TOWER/weather');
    return response.data;
  },
};

export default api; 