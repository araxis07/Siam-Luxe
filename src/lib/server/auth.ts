import { createClient } from "@/lib/supabase/server";

export async function getServerSupabase() {
  const supabase = await createClient();

  if (!supabase) {
    throw new Error("Supabase is not configured");
  }

  return supabase;
}

export async function getCurrentUser() {
  const supabase = await getServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return { supabase, user };
}
