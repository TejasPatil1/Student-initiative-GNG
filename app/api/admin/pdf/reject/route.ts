import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { id, filePath } = await req.json();

  await supabaseAdmin.storage.from("pdfs").remove([filePath]);
  await supabaseAdmin.from("pdfs").delete().eq("id", id);

  return NextResponse.json({ success: true });
}
