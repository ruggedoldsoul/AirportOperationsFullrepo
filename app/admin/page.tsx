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
} from 'lucide-react';

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

const recentActivity = [
  {
    id: 1,
    event: 'Flight AA123 departed',
    time: '2 minutes ago',
    icon: Plane,
    color: 'text-blue-500',
  },
  {
    id: 2,
    event: 'Staff check-in: John Doe',
    time: '5 minutes ago',
    icon: Users,
    color: 'text-green-500',
  },
  {
    id: 3,
    event: 'Delay: Flight BA456',
    time: '10 minutes ago',
    icon: AlertTriangle,
    color: 'text-yellow-500',
  },
];

export default function AdminDashboard() {
  return (
    <AdminLayout>
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">Last updated: Just now</span>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {stat.name}
                  </CardTitle>
                  <Icon className={cn("h-4 w-4", stat.color)} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
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
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Performance Overview</CardTitle>
              <CardDescription>
                Flight operations and efficiency metrics
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Add chart component here */}
              <div className="h-[200px] bg-slate-100 rounded-md flex items-center justify-center">
                Chart placeholder
              </div>
            </CardContent>
          </Card>
          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>
                Latest updates from the airport
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity) => {
                  const Icon = activity.icon;
                  return (
                    <div
                      key={activity.id}
                      className="flex items-center space-x-4 rounded-md border p-4"
                    >
                      <Icon className={cn("h-5 w-5", activity.color)} />
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium">{activity.event}</p>
                        <p className="text-sm text-muted-foreground">
                          {activity.time}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
} 