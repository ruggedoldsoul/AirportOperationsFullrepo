'use client';

import { useEffect, useState } from 'react';
import AdminLayout from "@/components/AdminLayout";
import { Aircraft, Weather, aircraftService, weatherService } from '@/lib/api';

export default function AdminDashboard() {
  const [aircrafts, setAircrafts] = useState<Aircraft[]>([]);
  const [weather, setWeather] = useState<Weather | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [aircraftData, weatherData] = await Promise.all([
          aircraftService.getAllAircrafts(),
          weatherService.getCurrentWeather(),
        ]);
        setAircrafts(aircraftData);
        setWeather(weatherData);
      } catch (err) {
        setError('Failed to fetch data. Please try again later.');
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="text-red-500 p-4">{error}</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-gray-600">Manage aircraft operations and monitor weather conditions.</p>
        </div>

        {/* Weather Information */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Current Weather</h2>
          {weather && (
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-gray-600">Temperature</p>
                <p className="text-2xl font-bold">{weather.temperature}°C</p>
              </div>
              <div>
                <p className="text-gray-600">Wind Speed</p>
                <p className="text-2xl font-bold">{weather.windSpeed} km/h</p>
              </div>
              <div>
                <p className="text-gray-600">Conditions</p>
                <p className="text-2xl font-bold">{weather.conditions}</p>
              </div>
            </div>
          )}
        </div>

        {/* Aircraft List */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Aircraft Status</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Call Sign</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {aircrafts.map((aircraft) => (
                  <tr key={aircraft.callSign}>
                    <td className="px-6 py-4 whitespace-nowrap">{aircraft.callSign}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{aircraft.type}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        aircraft.status === 'Active' ? 'bg-green-100 text-green-800' :
                        aircraft.status === 'Maintenance' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {aircraft.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
} 