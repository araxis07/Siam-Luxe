"use client";

import type { AppLocale } from "@/i18n/routing";
import type { RegionId } from "@/lib/catalog";
import { getChefRecommendations, getExperienceCopy } from "@/lib/experience";
import { useFavoritesStore } from "@/store/favorites-store";
import { useExperienceStore } from "@/store/experience-store";
import { DishCard } from "@/components/dishes/dish-card";

export function ChefRecommendations({
  locale,
  region,
}: {
  locale: AppLocale;
  region: RegionId | "all";
}) {
  const favoriteDishIds = useFavoritesStore((state) => state.favoriteDishIds);
  const serviceMode = useExperienceStore((state) => state.serviceMode);
  const copy = getExperienceCopy(locale);
  const dishes = getChefRecommendations(locale, {
    favoriteIds: favoriteDishIds,
    region,
    serviceMode,
  });

  if (dishes.length === 0) {
    return null;
  }

  return (
    <section className="space-y-5">
      <div className="max-w-2xl">
        <p className="text-[0.66rem] uppercase tracking-[0.18em] text-[#cdb37d]">
          {copy.labels.chefRecommendationTitle}
        </p>
        <h2 className="mt-3 font-heading text-[2rem] leading-tight text-white sm:text-[2.35rem]">
          {copy.labels.chefRecommendationBody}
        </h2>
      </div>
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {dishes.map((dish) => (
          <DishCard key={dish.id} dish={dish} locale={locale} compact />
        ))}
      </div>
    </section>
  );
}
