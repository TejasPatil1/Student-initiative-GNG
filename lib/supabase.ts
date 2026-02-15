import { createClient } from "@supabase/supabase-js";

export function getSupabaseClient() {
  if (typeof window === "undefined") return null;

  console.log(
    "SUPABASE URL:",
    process.env.Supabase_URL
  );

  return createClient(
    process.env.Supabase_URL as string,
    process.env.Supabase_anon_key as string
  );
}
