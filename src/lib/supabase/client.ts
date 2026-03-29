"use client";

import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";

import { getSupabaseEnv } from "@/lib/supabase/env";

let browserClient: SupabaseClient | null = null;

export function createClient() {
  const env = getSupabaseEnv();

  if (!env) {
    return null;
  }

  browserClient ??= createBrowserClient(env.url, env.publishableKey);

  return browserClient;
}
