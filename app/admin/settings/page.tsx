'use client';

import AdminLayout from "@/components/AdminLayout";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Settings, Bell, Shield, Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Settings
          </h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Manage your preferences and system settings
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <Card>
            <CardHeader>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center gap-2">
                <Settings className="h-5 w-5" />
                General Settings
              </h3>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Theme Toggle */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {theme === 'dark' ? (
                    <Moon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                  ) : (
                    <Sun className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                  )}
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      Theme
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Choose your preferred theme
                    </p>
                  </div>
                </div>
                <select
                  value={theme}
                  onChange={(e) => setTheme(e.target.value)}
                  className="rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="system">System</option>
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                </select>
              </div>

              {/* Notifications */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bell className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      Notifications
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Manage notification preferences
                    </p>
                  </div>
                </div>
                <button className="rounded-md bg-primary px-3 py-2 text-sm font-medium text-white hover:bg-primary/90">
                  Configure
                </button>
              </div>

              {/* Security */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      Security
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Update security preferences
                    </p>
                  </div>
                </div>
                <button className="rounded-md bg-primary px-3 py-2 text-sm font-medium text-white hover:bg-primary/90">
                  Configure
                </button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                About
              </h3>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Airport Operations Dashboard
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Version 1.0.0
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  © 2024 Airport Operations. All rights reserved.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
} 