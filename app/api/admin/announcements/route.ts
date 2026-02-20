import { supabaseAnnouncementsAdmin } from "@/lib/supabaseAnnouncementsAdmin";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();

  const { error } = await supabaseAnnouncementsAdmin
    .from("announcements")
    .insert(body);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ success: true });
}
