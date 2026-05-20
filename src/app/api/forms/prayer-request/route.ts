import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, request, is_private } = body;
    if (!name || !request) {
      return NextResponse.json({ error: "Name and request are required" }, { status: 400 });
    }
    const { error } = await createAdminClient()
      .from("prayer_requests")
      .insert({ name, email: email || null, request, is_private: !!is_private });
    if (error) throw error;
    return NextResponse.json({ success: true }, { status: 201 });
  } catch (err) {
    console.error("prayer-request error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
