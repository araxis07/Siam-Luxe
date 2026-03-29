import { fail, ok } from "@/lib/server/http";
import { requireAdmin } from "@/lib/server/admin";

export async function GET() {
  const admin = await requireAdmin();

  if (!admin.ok) {
    return admin.response;
  }

  const { supabase } = admin.context;
  const { data, error } = await supabase
    .from("branches")
    .select("*")
    .order("id", { ascending: true });

  if (error) {
    return fail("Unable to load branches", 500, error.message);
  }

  return ok(data ?? []);
}
