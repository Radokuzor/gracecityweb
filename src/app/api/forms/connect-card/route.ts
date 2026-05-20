import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone, address, decision, groups_interest } = body;
    if (!name || !email) {
      return NextResponse.json({ error: "Name and email are required" }, { status: 400 });
    }
    const { error } = await createAdminClient()
      .from("connect_cards")
      .insert({ name, email, phone, address, decision, groups_interest });
    if (error) throw error;
    return NextResponse.json({ success: true }, { status: 201 });
  } catch (err) {
    console.error("connect-card error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
