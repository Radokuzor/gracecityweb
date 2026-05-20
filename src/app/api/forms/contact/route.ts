import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone, message } = body;
    if (!name || !email || !message) {
      return NextResponse.json({ error: "Name, email, and message are required" }, { status: 400 });
    }
    const { error } = await createAdminClient()
      .from("contact_submissions")
      .insert({ name, email, phone, message });
    if (error) throw error;
    return NextResponse.json({ success: true }, { status: 201 });
  } catch (err) {
    console.error("contact error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
