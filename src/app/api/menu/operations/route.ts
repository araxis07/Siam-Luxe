import { getServerSupabase } from "@/lib/server/auth";
import { fail, ok } from "@/lib/server/http";
import { getDishOperations } from "@/lib/server/menu-operations";

export async function GET() {
  try {
    const supabase = await getServerSupabase();
    const operations = await getDishOperations(supabase);
    return ok(Object.values(operations));
  } catch (error) {
    return fail("Unable to load menu operations", 500, error instanceof Error ? error.message : null);
  }
}
