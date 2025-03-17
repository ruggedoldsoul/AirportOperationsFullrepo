import axios, { AxiosError } from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export interface DashboardStats {
  activeFlights: number;
  totalUsers: number;
  pendingRequests: number;
  availableSpots: number;
  flightsTrend: number;
  usersTrend: number;
}

export interface ActivityItem {
  id: string;
  action: string;
  time: Date;
  aircraftCallSign?: string;
  type: 'LANDING_REQUEST' | 'PARKING_ASSIGNMENT' | 'FLIGHT_PLAN' | 'STATE_CHANGE';
}

class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public code?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

const handleApiError = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<{ message?: string }>;
    const status = axiosError.response?.status;
    const message = axiosError.response?.data?.message || axiosError.message;

    switch (status) {
      case 401:
        throw new ApiError('Please log in to continue', status, 'UNAUTHORIZED');
      case 403:
        throw new ApiError('You do not have permission to perform this action', status, 'FORBIDDEN');
      case 404:
        throw new ApiError('The requested resource was not found', status, 'NOT_FOUND');
      case 429:
        throw new ApiError('Too many requests. Please try again later', status, 'RATE_LIMIT');
      case 500:
        throw new ApiError('An internal server error occurred', status, 'SERVER_ERROR');
      default:
        throw new ApiError(message || 'An unexpected error occurred', status);
    }
  }
  throw new ApiError('An unexpected error occurred');
};

export const adminService = {
  async getDashboardStats(): Promise<DashboardStats> {
    try {
      const response = await axios.get(`${API_BASE_URL}/admin/dashboard/stats`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  async getRecentActivity(): Promise<ActivityItem[]> {
    try {
      const response = await axios.get(`${API_BASE_URL}/admin/dashboard/activity`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  async generateReport(): Promise<{ url: string }> {
    try {
      const response = await axios.post(`${API_BASE_URL}/admin/reports/generate`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }
};

export default adminService; 