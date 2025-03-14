'use client';

import AdminLayout from "@/components/AdminLayout";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Calendar as CalendarIcon, Clock, Users, Plane } from 'lucide-react';

const scheduleItems = [
  {
    id: 1,
    time: '08:00',
    type: 'Shift Change',
    description: 'Morning shift begins',
    staff: ['John Smith', 'Sarah Johnson', 'Mike Brown'],
    location: 'Control Tower',
  },
  {
    id: 2,
    time: '09:30',
    type: 'Maintenance',
    description: 'Runway inspection',
    staff: ['Technical Team A'],
    location: 'Runway 27R',
  },
  {
    id: 3,
    time: '10:00',
    type: 'Flight',
    description: 'FL123 Departure',
    staff: ['Gate Staff B'],
    location: 'Gate A12',
  },
  // Add more schedule items as needed
];

export default function SchedulePage() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Schedule
          </h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Daily operations schedule and timeline
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5" />
                  Today's Schedule
                </h3>
                <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                  <Clock className="h-4 w-4" />
                  <span>Current time: {new Date().toLocaleTimeString()}</span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <div className="absolute top-0 bottom-0 left-8 w-px bg-gray-200 dark:bg-gray-700" />
                <ul className="space-y-6">
                  {scheduleItems.map((item) => (
                    <li key={item.id} className="relative pl-12">
                      <div className="absolute left-6 -translate-x-1/2 mt-1.5">
                        <div className="h-3 w-3 rounded-full border-2 border-primary bg-white dark:bg-gray-900" />
                      </div>
                      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-semibold text-gray-900 dark:text-white">
                              {item.time}
                            </span>
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-primary/10 text-primary">
                              {item.type}
                            </span>
                          </div>
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            {item.location}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                          {item.description}
                        </p>
                        <div className="flex items-center space-x-1 text-sm text-gray-500 dark:text-gray-400">
                          <Users className="h-4 w-4" />
                          <span>{item.staff.join(', ')}</span>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
} 