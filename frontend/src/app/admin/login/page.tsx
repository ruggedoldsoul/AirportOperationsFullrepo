"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await signIn("credentials", { email, password, redirect: false });
    if (!res?.ok) setError("Invalid credentials");
    else router.push("/admin");
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-6 shadow-md rounded w-80">
        <h2 className="text-2xl font-bold">Admin Login</h2>
        {error && <p className="text-red-500">{error}</p>}
        <input type="email" placeholder="Email" className="border p-2 w-full mt-2" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="Password" className="border p-2 w-full mt-2" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button type="submit" className="w-full bg-blue-500 text-white p-2 mt-4 rounded">Login</button>
      </form>
    </div>
  );
}
