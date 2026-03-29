import { routing, type AppLocale } from "@/i18n/routing";
import { requireAdmin } from "@/lib/server/admin";
import { fail, ok } from "@/lib/server/http";
import { getAdminMenuSnapshot, getDishOperations } from "@/lib/server/menu-operations";

export async function GET(request: Request) {
  const admin = await requireAdmin();

  if (!admin.ok) {
    return admin.response;
  }

  try {
    const url = new URL(request.url);
    const requestedLocale = url.searchParams.get("locale");
    const locale = routing.locales.includes(requestedLocale as AppLocale)
      ? (requestedLocale as AppLocale)
      : "th";
    const operations = await getDishOperations(admin.context.supabase);
    return ok(getAdminMenuSnapshot(locale, operations));
  } catch (error) {
    return fail("Unable to load menu operations", 500, error instanceof Error ? error.message : null);
  }
}
