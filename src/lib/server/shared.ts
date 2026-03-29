import type { createClient } from "@/lib/supabase/server";

export type ServerSupabase = NonNullable<Awaited<ReturnType<typeof createClient>>>;
