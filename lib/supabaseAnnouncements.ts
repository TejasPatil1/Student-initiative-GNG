import { createClient } from "@supabase/supabase-js";

/**
 * Supabase client specifically for Announcements feature
 * Uses separate Supabase project credentials
 */
export function getAnnouncementsSupabaseClient() {
  if (typeof window === "undefined") return null;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_ANNOUNCEMENTS_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANNOUNCEMENTS_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error("Missing Supabase Announcements credentials. Please set:");
    console.error("- NEXT_PUBLIC_SUPABASE_ANNOUNCEMENTS_URL");
    console.error("- NEXT_PUBLIC_SUPABASE_ANNOUNCEMENTS_ANON_KEY");
    return null;
  }

  return createClient(supabaseUrl, supabaseAnonKey);
}
