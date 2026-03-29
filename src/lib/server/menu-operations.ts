import { getLocalizedDishes, type LocalizedMenuDish } from "@/lib/catalog";
import type { AppLocale } from "@/i18n/routing";
import type { ServerSupabase } from "@/lib/server/shared";

export interface DishOperationRecord {
  dish_id: string;
  price_override: number | null;
  is_available: boolean;
  featured_override: boolean | null;
  status_override: "available" | "limited" | "soldOut" | "chefToday" | null;
  kitchen_note: string;
}

function isMissingDishOperationsTable(error: { message?: string } | null) {
  return typeof error?.message === "string" && error.message.includes("public.dish_operations");
}

export async function getDishOperations(
  supabase: ServerSupabase,
): Promise<Record<string, DishOperationRecord>> {
  const { data, error } = await supabase
    .from("dish_operations")
    .select("dish_id, price_override, is_available, featured_override, status_override, kitchen_note");

  if (error) {
    if (isMissingDishOperationsTable(error)) {
      return {};
    }

    throw new Error(error.message);
  }

  return Object.fromEntries(
    (data ?? []).map((item) => [
      item.dish_id,
      {
        dish_id: item.dish_id,
        price_override: item.price_override ? Number(item.price_override) : null,
        is_available: Boolean(item.is_available),
        featured_override: item.featured_override === null ? null : Boolean(item.featured_override),
        status_override:
          (item.status_override as DishOperationRecord["status_override"]) ?? null,
        kitchen_note: item.kitchen_note ?? "",
      },
    ]),
  );
}

export function applyDishOperations(
  dishes: LocalizedMenuDish[],
  operations: Record<string, DishOperationRecord>,
) {
  return dishes.map((dish) => {
    const operation = operations[dish.id];

    if (!operation) {
      return dish;
    }

    return {
      ...dish,
      price: operation.price_override ?? dish.price,
      featured:
        operation.featured_override === null ? dish.featured : operation.featured_override,
      isAvailable: operation.is_available,
      statusId: operation.status_override,
      kitchenNote: operation.kitchen_note,
    };
  });
}

export function getAdminMenuSnapshot(
  locale: AppLocale,
  operations: Record<string, DishOperationRecord>,
) {
  return getLocalizedDishes(locale).map((dish) => {
    const operation = operations[dish.id];

    return {
      id: dish.id,
      name: dish.name,
      category: dish.category,
      region: dish.region,
      basePrice: dish.price,
      currentPrice: operation?.price_override ?? dish.price,
      featured: operation?.featured_override === null || operation?.featured_override === undefined
        ? dish.featured
        : operation.featured_override,
      isAvailable: operation?.is_available ?? true,
      statusOverride: operation?.status_override ?? null,
      kitchenNote: operation?.kitchen_note ?? "",
    };
  });
}

export async function getOperationalLocalizedDishes(
  supabase: ServerSupabase,
  locale: AppLocale,
) {
  const operations = await getDishOperations(supabase);
  return applyDishOperations(getLocalizedDishes(locale), operations);
}
