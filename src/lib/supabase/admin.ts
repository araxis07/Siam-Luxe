import { createClient, type SupabaseClient } from "@supabase/supabase-js";

import { getSupabaseServiceEnv } from "@/lib/supabase/env";

let adminClient: SupabaseClient | null = null;

export function createAdminClient() {
  const env = getSupabaseServiceEnv();

  if (!env) {
    return null;
  }

  adminClient ??= createClient(env.url, env.serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  return adminClient;
}
