import { routing, type AppLocale } from "@/i18n/routing";
import { requireAdmin } from "@/lib/server/admin";
import { recordAdminAudit } from "@/lib/server/audit";
import { fail, ok } from "@/lib/server/http";
import { getMenuCatalogStatus, syncMenuCatalogSeed } from "@/lib/server/menu-catalog";

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

    const status = await getMenuCatalogStatus(admin.context.supabase);
    return ok({
      ...status,
      locale,
    });
  } catch (error) {
    return fail("Unable to load menu catalog status", 500, error instanceof Error ? error.message : null);
  }
}

export async function POST() {
  const admin = await requireAdmin();

  if (!admin.ok) {
    return admin.response;
  }

  try {
    const status = await syncMenuCatalogSeed(admin.context.supabase);
    await recordAdminAudit(admin.context, {
      scope: "admin.menu",
      action: "catalog-sync",
      targetTable: "menu_dishes",
      targetId: "seed",
      summary: `Seed synced with ${status.dishes} dishes`,
      metadata: status,
    });
    return ok(status);
  } catch (error) {
    return fail("Unable to sync menu catalog", 500, error instanceof Error ? error.message : null);
  }
}
