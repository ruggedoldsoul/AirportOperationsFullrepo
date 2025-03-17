'use client';

import AdminLayout from "@/components/AdminLayout";
import { FaPlane, FaUsers, FaHistory, FaParking } from "react-icons/fa";
import useSWR from 'swr';
import adminService, { ActivityItem, DashboardStats } from "@/services/adminService";
import { formatDistanceToNow } from 'date-fns';
import { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';

const fetcher = (url: string) => fetch(url).then(res => res.json());

const StatCard = ({ icon: Icon, title, value, change, isLoading }: { 
  icon: any, 
  title: string, 
  value: string | number, 
  change?: string,
  isLoading?: boolean 
}) => (
  <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-lg">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
        <h3 className="text-2xl font-bold mt-2">
          {isLoading ? (
            <div className="h-8 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          ) : (
            value
          )}
        </h3>
        {change && (
          <p className={`text-sm mt-1 ${
            change.startsWith('+') ? 'text-green-500' : 'text-red-500'
          }`}>
            {change}
          </p>
        )}
      </div>
      <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-full">
        <Icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
      </div>
    </div>
  </div>
);

const RecentActivity = ({ activities, isLoading }: { activities: ActivityItem[], isLoading: boolean }) => (
  <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-lg">
    <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
    <div className="space-y-4">
      {isLoading ? (
        Array(3).fill(0).map((_, index) => (
          <div key={index} className="flex items-center space-x-4 py-2 border-b last:border-0">
            <div className="w-2 h-2 bg-gray-200 dark:bg-gray-700 rounded-full" />
            <div className="flex-1">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2" />
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
            </div>
          </div>
        ))
      ) : (
        activities.map((item) => (
          <div key={item.id} className="flex items-center space-x-4 py-2 border-b last:border-0">
            <div className="w-2 h-2 bg-blue-500 rounded-full" />
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-300">{item.action}</p>
              <p className="text-xs text-gray-400">
                {formatDistanceToNow(new Date(item.time), { addSuffix: true })}
              </p>
            </div>
          </div>
        ))
      )}
    </div>
  </div>
);

const QuickActions = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerateReport = async () => {
    try {
      setIsLoading(true);
      const result = await adminService.generateReport();
      window.open(result.url, '_blank');
      toast.success('Report generated successfully');
    } catch (error) {
      console.error('Failed to generate report:', error);
      toast.error('Failed to generate report. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-lg">
      <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
      <div className="grid grid-cols-2 gap-4">
        {[
          { title: "Approve Requests", color: "bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400", href: "/admin/requests" },
          { title: "View Reports", color: "bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400", href: "/admin/reports" },
          { title: "Manage Users", color: "bg-yellow-100 dark:bg-yellow-900 text-yellow-600 dark:text-yellow-400", href: "/admin/users" },
          { title: "System Settings", color: "bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400", href: "/admin/settings" },
        ].map((action, index) => (
          <a
            key={index}
            href={action.href}
            className={`${action.color} p-4 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity text-center`}
          >
            {action.title}
          </a>
        ))}
      </div>
    </div>
  );
};

export default function AdminDashboard() {
  const { data: stats, error: statsError, isLoading: statsLoading } = useSWR<DashboardStats>(
    `${process.env.NEXT_PUBLIC_API_URL}/admin/dashboard/stats`,
    fetcher,
    { 
      refreshInterval: 30000,
      onError: (error) => {
        toast.error('Failed to load dashboard statistics');
      }
    }
  );

  const { data: activities, error: activitiesError, isLoading: activitiesLoading } = useSWR<ActivityItem[]>(
    `${process.env.NEXT_PUBLIC_API_URL}/admin/dashboard/activity`,
    fetcher,
    { 
      refreshInterval: 10000,
      onError: (error) => {
        toast.error('Failed to load recent activities');
      }
    }
  );

  const [isGeneratingReport, setIsGeneratingReport] = useState(false);

  const handleGenerateReport = async () => {
    try {
      setIsGeneratingReport(true);
      const result = await adminService.generateReport();
      window.open(result.url, '_blank');
      toast.success('Report generated successfully');
    } catch (error) {
      console.error('Failed to generate report:', error);
      toast.error('Failed to generate report. Please try again.');
    } finally {
      setIsGeneratingReport(false);
    }
  };

  // Show error states in the UI
  if (statsError) {
    toast.error('Failed to load dashboard statistics');
  }

  if (activitiesError) {
    toast.error('Failed to load recent activities');
  }

  return (
    <AdminLayout>
      <Toaster
        position="top-right"
        toastOptions={{
          success: {
            duration: 3000,
            style: {
              background: '#10B981',
              color: 'white',
            },
          },
          error: {
            duration: 5000,
            style: {
              background: '#EF4444',
              color: 'white',
            },
          },
          loading: {
            duration: Infinity,
            style: {
              background: '#3B82F6',
              color: 'white',
            },
          },
        }}
      />
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <button 
            className={`bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors ${
              isGeneratingReport ? 'opacity-75 cursor-not-allowed' : ''
            }`}
            onClick={handleGenerateReport}
            disabled={isGeneratingReport}
          >
            {isGeneratingReport ? 'Generating...' : 'Generate Report'}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            icon={FaPlane}
            title="Active Flights"
            value={statsLoading ? '-' : stats?.activeFlights || 0}
            change={stats?.flightsTrend ? `${stats.flightsTrend > 0 ? '+' : ''}${stats.flightsTrend} from last hour` : undefined}
            isLoading={statsLoading}
          />
          <StatCard
            icon={FaUsers}
            title="Total Users"
            value={statsLoading ? '-' : stats?.totalUsers || 0}
            change={stats?.usersTrend ? `${stats.usersTrend > 0 ? '+' : ''}${stats.usersTrend} this week` : undefined}
            isLoading={statsLoading}
          />
          <StatCard
            icon={FaHistory}
            title="Pending Requests"
            value={statsLoading ? '-' : stats?.pendingRequests || 0}
            isLoading={statsLoading}
          />
          <StatCard
            icon={FaParking}
            title="Available Spots"
            value={statsLoading ? '-' : stats?.availableSpots || 0}
            isLoading={statsLoading}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RecentActivity 
            activities={activities || []} 
            isLoading={activitiesLoading} 
          />
          <QuickActions />
        </div>
      </div>
    </AdminLayout>
  );
}
