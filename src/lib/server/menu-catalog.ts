import type { AppLocale } from "@/i18n/routing";
import {
  getCatalogDataset,
  getLocalizedDishes,
  type CategoryId,
  type LocalizedMenuDish,
  type RegionId,
} from "@/lib/catalog";
import type { ServerSupabase } from "@/lib/server/shared";

function isMissingMenuCatalogTable(error: { message?: string } | null) {
  return typeof error?.message === "string" && error.message.includes("public.menu_");
}

function resolveLocalizedValue(
  value: Record<string, unknown> | null | undefined,
  locale: AppLocale,
  fallback: string,
) {
  if (!value) {
    return fallback;
  }

  const resolved = value[locale];
  return typeof resolved === "string" && resolved.trim().length > 0 ? resolved : fallback;
}

export async function syncMenuCatalogSeed(supabase: ServerSupabase) {
  const dataset = getCatalogDataset();

  const [categoryResult, regionResult, toppingResult, dishResult] = await Promise.all([
    supabase.from("menu_categories").upsert(
      dataset.categories.map((item, index) => ({
        id: item.id,
        label: item.label,
        description: item.description,
        icon: item.icon,
        sort_order: index,
      })),
    ),
    supabase.from("menu_regions").upsert(
      dataset.regions.map((item, index) => ({
        id: item.id,
        label: item.label,
        description: item.description,
        sort_order: index,
      })),
    ),
    supabase.from("menu_toppings").upsert(
      dataset.toppings.map((item, index) => ({
        id: item.id,
        label: item.label,
        price: item.price,
        sort_order: index,
      })),
    ),
    supabase.from("menu_dishes").upsert(
      dataset.dishes.map((item) => ({
        id: item.id,
        category_id: item.category,
        region_id: item.region,
        image: item.image,
        name: item.name,
        description: item.description,
        price: item.price,
        rating: item.rating,
        prep_minutes: item.prepMinutes,
        base_spice: item.baseSpice,
        featured: item.featured,
        accent_class: item.accentClass,
        available_toppings: item.availableToppings,
        is_active: true,
      })),
    ),
  ]);

  const firstError =
    categoryResult.error ?? regionResult.error ?? toppingResult.error ?? dishResult.error;

  if (firstError) {
    throw new Error(firstError.message);
  }

  return getMenuCatalogStatus(supabase);
}

export async function getMenuCatalogStatus(supabase: ServerSupabase) {
  const [categories, regions, toppings, dishes] = await Promise.all([
    supabase.from("menu_categories").select("id", { count: "exact", head: true }),
    supabase.from("menu_regions").select("id", { count: "exact", head: true }),
    supabase.from("menu_toppings").select("id", { count: "exact", head: true }),
    supabase.from("menu_dishes").select("id, updated_at").order("updated_at", { ascending: false }).limit(1),
  ]);

  const firstError = categories.error ?? regions.error ?? toppings.error ?? dishes.error;

  if (firstError) {
    if (isMissingMenuCatalogTable(firstError)) {
      return {
        categories: 0,
        regions: 0,
        toppings: 0,
        dishes: 0,
        lastSyncedAt: null as string | null,
      };
    }

    throw new Error(firstError.message);
  }

  const dishCountResult = await supabase.from("menu_dishes").select("id", { count: "exact", head: true });

  if (dishCountResult.error) {
    throw new Error(dishCountResult.error.message);
  }

  return {
    categories: categories.count ?? 0,
    regions: regions.count ?? 0,
    toppings: toppings.count ?? 0,
    dishes: dishCountResult.count ?? 0,
    lastSyncedAt: dishes.data?.[0]?.updated_at ?? null,
  };
}

export async function getLocalizedMenuCatalogFromDb(
  supabase: ServerSupabase,
  locale: AppLocale,
): Promise<LocalizedMenuDish[] | null> {
  const [categoryResult, regionResult, toppingResult, dishResult] = await Promise.all([
    supabase.from("menu_categories").select("*").order("sort_order", { ascending: true }),
    supabase.from("menu_regions").select("*").order("sort_order", { ascending: true }),
    supabase.from("menu_toppings").select("*").order("sort_order", { ascending: true }),
    supabase.from("menu_dishes").select("*").eq("is_active", true).order("created_at", { ascending: true }),
  ]);

  const firstError =
    categoryResult.error ?? regionResult.error ?? toppingResult.error ?? dishResult.error;

  if (firstError) {
    if (isMissingMenuCatalogTable(firstError)) {
      return null;
    }

    throw new Error(firstError.message);
  }

  if (!dishResult.data || dishResult.data.length === 0) {
    return null;
  }

  const categoryLabels = new Map(
    (categoryResult.data ?? []).map((item) => [
      item.id as CategoryId,
      resolveLocalizedValue(item.label as Record<string, unknown>, locale, String(item.id)),
    ]),
  );
  const regionLabels = new Map(
    (regionResult.data ?? []).map((item) => [
      item.id as RegionId,
      resolveLocalizedValue(item.label as Record<string, unknown>, locale, String(item.id)),
    ]),
  );
  const toppings = new Map(
    (toppingResult.data ?? []).map((item) => [
      item.id,
      {
        id: item.id,
        label: resolveLocalizedValue(item.label as Record<string, unknown>, locale, String(item.id)),
        price: Number(item.price ?? 0),
      },
    ]),
  );

  return dishResult.data.map((item) => {
    const toppingIds = Array.isArray(item.available_toppings)
      ? item.available_toppings.map((value: unknown) => String(value))
      : [];

    return {
      id: item.id,
      category: item.category_id as CategoryId,
      categoryLabel: categoryLabels.get(item.category_id as CategoryId) ?? String(item.category_id),
      region: item.region_id as RegionId,
      regionLabel: regionLabels.get(item.region_id as RegionId) ?? String(item.region_id),
      image: item.image,
      name: resolveLocalizedValue(item.name as Record<string, unknown>, locale, item.id),
      description: resolveLocalizedValue(item.description as Record<string, unknown>, locale, item.id),
      price: Number(item.price ?? 0),
      rating: Number(item.rating ?? 0),
      prepMinutes: Number(item.prep_minutes ?? 0),
      baseSpice: Number(item.base_spice ?? 0),
      featured: Boolean(item.featured),
      accentClass: item.accent_class,
      availableToppings: toppingIds
        .map((toppingId: string) => toppings.get(toppingId))
        .filter(
          (
            value: { id: string; label: string; price: number } | undefined,
          ): value is { id: string; label: string; price: number } => Boolean(value),
        ),
      isAvailable: true,
      statusId: null,
      kitchenNote: "",
    };
  });
}

export async function getBackofficeMenuSeedPreview(
  supabase: ServerSupabase,
  locale: AppLocale,
) {
  return (await getLocalizedMenuCatalogFromDb(supabase, locale)) ?? getLocalizedDishes(locale);
}
