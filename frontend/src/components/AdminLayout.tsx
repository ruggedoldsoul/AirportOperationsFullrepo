import Link from "next/link";
import { ReactNode } from "react";
import { Home, Users, FileText, Settings } from "lucide-react";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen bg-gray-100">
      <aside className="w-64 bg-gray-900 text-white p-6">
        <h2 className="text-2xl font-bold">Admin Panel</h2>
        <ul className="mt-6 space-y-3">
          <li><Link href="/admin" className="flex items-center p-3 rounded hover:bg-gray-700"><Home className="mr-2"/> Dashboard</Link></li>
          <li><Link href="/admin/users" className="flex items-center p-3 rounded hover:bg-gray-700"><Users className="mr-2"/> Users</Link></li>
          <li><Link href="/admin/reports" className="flex items-center p-3 rounded hover:bg-gray-700"><FileText className="mr-2"/> Reports</Link></li>
          <li><Link href="/admin/settings" className="flex items-center p-3 rounded hover:bg-gray-700"><Settings className="mr-2"/> Settings</Link></li>
        </ul>
      </aside>
      <div className="flex-1 p-6">
        {children}
      </div>
    </div>
  );
}
