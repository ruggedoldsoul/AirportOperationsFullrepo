'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  Plane,
  Users,
  Calendar,
  Settings,
  BarChart,
  Menu,
  X,
  ChevronDown,
  Bell,
  User
} from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: BarChart },
  { name: 'Flights', href: '/admin/flights', icon: Plane },
  { name: 'Staff', href: '/admin/staff', icon: Users },
  { name: 'Schedule', href: '/admin/schedule', icon: Calendar },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
];

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-white">
      {/* Sidebar */}
      <div
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-64 bg-white transform transition-transform duration-200 ease-in-out border-r border-gray-200',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex h-16 items-center justify-between px-4 border-b border-gray-200">
          <Link href="/admin" className="flex items-center space-x-2">
            <Plane className="h-8 w-8 text-primary" />
            <span className="text-xl font-semibold text-gray-900">
              AirOps
            </span>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-gray-500 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        <nav className="space-y-1 px-2 py-4">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors',
                  isActive
                    ? 'bg-primary text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                )}
              >
                <Icon className={cn('mr-3 h-5 w-5 flex-shrink-0')} />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Main content */}
      <div
        className={cn(
          'flex flex-col min-h-screen transition-all duration-200 ease-in-out bg-white',
          sidebarOpen ? 'lg:pl-64' : ''
        )}
      >
        {/* Top navbar */}
        <header className="sticky top-0 z-40 flex h-16 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
          <button
            onClick={() => setSidebarOpen(true)}
            className={cn(
              'lg:hidden text-gray-500 hover:text-gray-600',
              sidebarOpen && 'hidden'
            )}
          >
            <Menu className="h-6 w-6" />
          </button>

          {/* Header content */}
          <div className="flex flex-1 items-center justify-end gap-x-4 self-stretch lg:gap-x-6">
            <div className="flex items-center gap-x-4 lg:gap-x-6">
              {/* Notifications */}
              <button className="text-gray-400 hover:text-gray-500">
                <Bell className="h-6 w-6" />
              </button>

              {/* Profile dropdown */}
              <div className="flex items-center gap-x-4 lg:gap-x-6">
                <div className="relative">
                  <button className="flex items-center gap-x-2 text-sm font-medium text-gray-500 hover:text-gray-700">
                    <User className="h-6 w-6" />
                    <span className="hidden lg:block">Admin User</span>
                    <ChevronDown className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
} 