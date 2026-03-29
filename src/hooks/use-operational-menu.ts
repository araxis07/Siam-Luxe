"use client";

import { useMemo } from "react";

import type { AppLocale } from "@/i18n/routing";
import { getLocalizedDishes, type LocalizedMenuDish } from "@/lib/catalog";
import { useMenuOperationsStore } from "@/store/menu-operations-store";

function applyOperation(
  dish: LocalizedMenuDish,
  operation: ReturnType<typeof useMenuOperationsStore.getState>["operations"][string] | undefined,
): LocalizedMenuDish {
  if (!operation) {
    return dish;
  }

  return {
    ...dish,
    price: operation.price_override ?? dish.price,
    featured: operation.featured_override === null ? dish.featured : operation.featured_override,
    isAvailable: operation.is_available,
    statusId: operation.status_override,
    kitchenNote: operation.kitchen_note,
  };
}

export function useOperationalDishes(locale: AppLocale) {
  const operations = useMenuOperationsStore((state) => state.operations);

  return useMemo(
    () => getLocalizedDishes(locale).map((dish) => applyOperation(dish, operations[dish.id])),
    [locale, operations],
  );
}

export function useOperationalDishMap(locale: AppLocale) {
  const dishes = useOperationalDishes(locale);

  return useMemo(() => new Map(dishes.map((dish) => [dish.id, dish])), [dishes]);
}

export function useOperationalDish(locale: AppLocale, dishId: string | null | undefined) {
  const dishMap = useOperationalDishMap(locale);

  return useMemo(() => {
    if (!dishId) {
      return null;
    }

    return dishMap.get(dishId) ?? null;
  }, [dishId, dishMap]);
}
