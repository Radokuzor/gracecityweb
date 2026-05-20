import { NextResponse } from "next/server";
import { createBrowserClient } from "@/lib/supabase";

export async function GET() {
  const supabase = createBrowserClient();
  const { data: live } = await supabase
    .from("livestreams")
    .select("*")
    .eq("is_live", true)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (live) return NextResponse.json({ stream: live, status: "live" });

  const { data: upcoming } = await supabase
    .from("livestreams")
    .select("*")
    .eq("is_live", false)
    .gt("scheduled_at", new Date().toISOString())
    .order("scheduled_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (upcoming) return NextResponse.json({ stream: upcoming, status: "upcoming" });

  const { data: past } = await supabase
    .from("livestreams")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(6);

  return NextResponse.json({ stream: null, status: "none", past: past ?? [] });
}
