

import { getAnnouncementsSupabaseClient } from "./supabaseAnnouncements";

const BASE_URL =
  `${process.env.NEXT_PUBLIC_SUPABASE_ANNOUNCEMENTS_URL}/storage/v1/object/public/announcements-images/`;

export async function getCourseAnnouncements() {
  const supabase = getAnnouncementsSupabaseClient();
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
