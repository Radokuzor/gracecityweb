import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone, visit_date, hear_about_us, attending_with } = body;
    if (!name || !email) {
      return NextResponse.json({ error: "Name and email are required" }, { status: 400 });
    }
    const { error } = await createAdminClient()
      .from("plan_a_visit")
      .insert({ name, email, phone, visit_date: visit_date || null, hear_about_us, attending_with });
    if (error) throw error;
    return NextResponse.json({ success: true }, { status: 201 });
  } catch (err) {
    console.error("plan-a-visit error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
