

import { getSupabaseClient } from "./supabase";

const BASE_URL =
  `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/announcements/`;

export async function getCourseAnnouncements() {
  const supabase = getSupabaseClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("announcements")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  if (error) return [];

  return data.map((a: any) => ({
    ...a,
    image_url: BASE_URL + a.image_path,
  }));
}
