'use client';

import AdminLayout from "@/components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  Plane,
  Users,
  Clock,
  AlertTriangle,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  DollarSign,
  BarChart2,
  Wind,
  Thermometer,
  CloudRain
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Aircraft, Weather, aircraftService, weatherService } from '@/lib/api';

const stats = [
  {
    name: 'Total Flights',
    value: '2,345',
    change: '+12.5%',
    trend: 'up',
    icon: Plane,
    color: 'text-blue-500',
  },
  {
    name: 'Active Staff',
    value: '156',
    change: '+3.2%',
    trend: 'up',
    icon: Users,
    color: 'text-green-500',
  },
  {
    name: 'Average Delay',
    value: '12min',
    change: '-5.1%',
    trend: 'down',
    icon: Clock,
    color: 'text-yellow-500',
  },
  {
    name: 'Revenue',
    value: '$1.2M',
    change: '+8.3%',
    trend: 'up',
    icon: DollarSign,
    color: 'text-purple-500',
  },
];

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
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-400 p-4 rounded-lg">
          {error}
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Monitor airport operations and aircraft status.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {stat.name}
                  </CardTitle>
                  <Icon className={cn("h-4 w-4", stat.color)} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</div>
                  <div className={cn(
                    "flex items-center text-sm",
                    stat.trend === 'up' ? 'text-green-500' : 'text-red-500'
                  )}>
                    {stat.trend === 'up' ? (
                      <ArrowUpRight className="mr-1 h-4 w-4" />
                    ) : (
                      <ArrowDownRight className="mr-1 h-4 w-4" />
                    )}
                    {stat.change}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Weather Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">Current Weather</CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">Real-time weather conditions</CardDescription>
          </CardHeader>
          <CardContent>
            {weather && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="flex items-center space-x-4">
                  <Thermometer className="h-8 w-8 text-red-500" />
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Temperature</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{weather.temperature}°C</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <Wind className="h-8 w-8 text-blue-500" />
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Wind Speed</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{weather.windSpeed} km/h</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <CloudRain className="h-8 w-8 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Conditions</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{weather.conditions}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <Clock className="h-8 w-8 text-purple-500" />
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Last Updated</p>
                    <p className="text-sm text-gray-900 dark:text-white">{new Date(weather.timestamp).toLocaleString()}</p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Aircraft Status */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">Aircraft Status</CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">Current fleet status and locations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Call Sign</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {aircrafts.map((aircraft) => (
                    <tr key={aircraft.callSign} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{aircraft.callSign}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{aircraft.type}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={cn(
                          "px-2 inline-flex text-xs leading-5 font-semibold rounded-full",
                          aircraft.status === 'Active' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' :
                          aircraft.status === 'Maintenance' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400' :
                          'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                        )}>
                          {aircraft.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
} 