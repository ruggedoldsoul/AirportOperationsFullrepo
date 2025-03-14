import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-4">Welcome to the Admin Dashboard</h1>
      <Link href="/admin" className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
        Go to Admin Panel
      </Link>
    </div>
  );
}
