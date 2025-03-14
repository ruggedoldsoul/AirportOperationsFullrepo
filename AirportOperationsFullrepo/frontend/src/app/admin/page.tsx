'use client';

import { useEffect, useState } from 'react';
import AdminLayout from "@/components/AdminLayout";
import { Aircraft, Weather, aircraftService, weatherService } from '@/lib/api';

interface StateChange {
  id: number;
  callSign: string;
  requestedState: string;
  previousState: string;
  outcome: 'ACCEPTED' | 'REJECTED';
  rejectReason?: string;
  timestamp: string;
}

interface ParkingSpot {
  id: number;
  type: 'AIRLINER' | 'PRIVATE';
  occupied: boolean;
  aircraftCallSign?: string;
}

export default function AdminDashboard() {
  const [aircrafts, setAircrafts] = useState<Aircraft[]>([]);
  const [weather, setWeather] = useState<Weather | null>(null);
  const [stateChanges, setStateChanges] = useState<StateChange[]>([]);
  const [parkingSpots, setParkingSpots] = useState<ParkingSpot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      const [aircraftData, weatherData, stateChangeData, parkingData] = await Promise.all([
        aircraftService.getAllAircrafts(),
        weatherService.getCurrentWeather(),
        aircraftService.getStateChanges(),
        aircraftService.getParkingStatus(),
      ]);
      setAircrafts(aircraftData);
      setWeather(weatherData);
      setStateChanges(stateChangeData);
      setParkingSpots(parkingData);
    } catch (err) {
      setError('Failed to fetch data. Please try again later.');
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(() => {
      fetchData();
    }, 10000); // Refresh every 10 seconds

    return () => clearInterval(interval);
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
          <p className="text-gray-600">Monitor airport operations and aircraft status.</p>
        </div>

        {/* Weather Information */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Current Weather</h2>
          {weather && (
            <div className="grid grid-cols-4 gap-4">
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
              <div>
                <p className="text-gray-600">Last Updated</p>
                <p className="text-sm">{new Date(weather.timestamp).toLocaleString()}</p>
              </div>
            </div>
          )}
        </div>

        {/* Parking Overview */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Parking Status</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Spot #</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Aircraft</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {parkingSpots.map((spot) => (
                    <tr key={spot.id}>
                      <td className="px-6 py-4 whitespace-nowrap">{spot.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{spot.type}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          spot.occupied ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                        }`}>
                          {spot.occupied ? 'Occupied' : 'Available'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">{spot.aircraftCallSign || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Aircraft List */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Aircraft Status</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Call Sign</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">State</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Last Updated</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {aircrafts.map((aircraft) => (
                    <tr key={aircraft.callSign}>
                      <td className="px-6 py-4 whitespace-nowrap">{aircraft.callSign}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{aircraft.type}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          aircraft.state === 'LANDED' ? 'bg-yellow-100 text-yellow-800' :
                          aircraft.state === 'AIRBORNE' ? 'bg-blue-100 text-blue-800' :
                          aircraft.state === 'PARKED' ? 'bg-green-100 text-green-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {aircraft.state}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {aircraft.latitude ? `${aircraft.latitude.toFixed(6)}, ${aircraft.longitude.toFixed(6)}` : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {new Date(aircraft.lastUpdated).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Recent State Changes */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Recent State Changes</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Time</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Aircraft</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Change</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Outcome</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reason</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {stateChanges.slice(0, 10).map((change) => (
                    <tr key={change.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {new Date(change.timestamp).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">{change.callSign}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {change.previousState} → {change.requestedState}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          change.outcome === 'ACCEPTED' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {change.outcome}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {change.rejectReason || '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
} 