import { NextResponse } from "next/server";

export async function GET() {
  const res = await fetch("http://localhost:5000/api/users");
  const users = await res.json();
  return NextResponse.json(users);
}
