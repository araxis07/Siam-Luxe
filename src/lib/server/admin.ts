import type { User } from "@supabase/supabase-js";

import { fail } from "@/lib/server/http";
import { getCurrentUser } from "@/lib/server/auth";
import type { ServerSupabase } from "@/lib/server/shared";

export interface AdminContext {
  supabase: ServerSupabase;
  user: User;
  profile: {
    id: string;
    role: "admin" | "staff";
    email: string | null;
  };
}

export async function requireAdmin(): Promise<
  | { ok: true; context: AdminContext }
  | { ok: false; response: Response }
> {
  const { supabase, user } = await getCurrentUser();

  if (!user) {
    return { ok: false, response: fail("Unauthorized", 401) };
  }

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("id, role, email")
    .eq("id", user.id)
    .maybeSingle();

  if (error || !profile || !["admin", "staff"].includes(String(profile.role))) {
    return { ok: false, response: fail("Forbidden", 403, error?.message) };
  }

  return {
    ok: true,
    context: {
      supabase,
      user,
      profile: {
        id: profile.id,
        role: profile.role as "admin" | "staff",
        email: profile.email,
      },
    },
  };
}
