import { useEffect, useState } from "react";
import AdminLayout from "@/components/AdminLayout";

type ActivityLog = {
  timestamp: string;
  adminEmail: string;
  action: string;
};

export default function ActivityLogPage() {
  const [logs, setLogs] = useState<ActivityLog[]>([]);

  useEffect(() => {
    fetch("/api/activity")
      .then((res) => res.json())
      .then((data) => setLogs(data));
  }, []);

  return (
    <AdminLayout>
      <h1 className="text-3xl font-bold">Activity Log</h1>
      <table className="w-full mt-4 border">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2">Timestamp</th>
            <th className="p-2">Admin Email</th>
            <th className="p-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log, index) => (
            <tr key={index} className="border-t">
              <td className="p-2">{new Date(log.timestamp).toLocaleString()}</td>
              <td className="p-2">{log.adminEmail}</td>
              <td className="p-2">{log.action}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </AdminLayout>
  );
}
