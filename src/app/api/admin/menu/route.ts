import { routing, type AppLocale } from "@/i18n/routing";
import { requireAdmin } from "@/lib/server/admin";
import { fail, ok } from "@/lib/server/http";
import { getBackofficeMenuSeedPreview } from "@/lib/server/menu-catalog";
import { getDishOperations } from "@/lib/server/menu-operations";

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
    const dishes = await getBackofficeMenuSeedPreview(admin.context.supabase, locale);
    return ok(
      dishes.map((dish) => {
        const operation = operations[dish.id];

        return {
          id: dish.id,
          name: dish.name,
          category: dish.category,
          region: dish.region,
          basePrice: dish.price,
          currentPrice: operation?.price_override ?? dish.price,
          featured:
            operation?.featured_override === null || operation?.featured_override === undefined
              ? dish.featured
              : operation.featured_override,
          isAvailable: operation?.is_available ?? dish.isAvailable ?? true,
          statusOverride: operation?.status_override ?? dish.statusId ?? null,
          kitchenNote: operation?.kitchen_note ?? dish.kitchenNote ?? "",
        };
      }),
    );
  } catch (error) {
    return fail("Unable to load menu operations", 500, error instanceof Error ? error.message : null);
  }
}
