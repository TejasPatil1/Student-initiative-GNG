import { createClient } from "@supabase/supabase-js";

let supabaseAdminClient: any = null;

function getSupabaseAdmin() {
  if (!supabaseAdminClient) {
    supabaseAdminClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
  }
  return supabaseAdminClient;
}

// Export as const for backward compatibility
export const supabaseAdmin: any = new Proxy({}, {
  get: (target, prop) => {
    return getSupabaseAdmin()[prop];
  },
});
