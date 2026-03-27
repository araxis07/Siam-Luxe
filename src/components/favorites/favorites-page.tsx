"use client";

import type { AppLocale } from "@/i18n/routing";
import { Link } from "@/i18n/navigation";
import { DishCard } from "@/components/dishes/dish-card";
import { Button } from "@/components/ui/button";
import { useHydrated } from "@/hooks/use-hydrated";
import { getLocalizedDishes } from "@/lib/catalog";
import { getExperienceCopy, getFeatureLinks } from "@/lib/experience";
import { useFavoritesStore } from "@/store/favorites-store";

export function FavoritesPage({ locale }: { locale: AppLocale }) {
  const hydrated = useHydrated();
  const favoriteDishIds = useFavoritesStore((state) => state.favoriteDishIds);
  const feature = getFeatureLinks(locale).find((item) => item.id === "favorites");
  const copy = getExperienceCopy(locale);
  const dishes = getLocalizedDishes(locale).filter((dish) => favoriteDishIds.includes(dish.id));

  if (!hydrated) {
    return <div className="h-[420px] animate-pulse rounded-[2rem] bg-white/5" />;
  }

  return (
    <section className="scene-section px-4 pt-10 pb-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 max-w-3xl">
          <p className="text-[0.66rem] uppercase tracking-[0.18em] text-[#cdb37d]">{feature?.eyebrow}</p>
          <h1 className="mt-3 font-heading text-[2.75rem] leading-tight text-white sm:text-[3.2rem]">{feature?.title}</h1>
          <p className="mt-4 text-[0.98rem] leading-8 text-[#d1c4b2]">{feature?.description}</p>
        </div>

        {dishes.length === 0 ? (
          <div className="lux-panel rounded-[2.2rem] px-6 py-16 text-center sm:px-10">
            <p className="font-heading text-[2.2rem] leading-tight text-white">{copy.labels.noFavorites}</p>
            <p className="mx-auto mt-4 max-w-2xl text-[#d1c4b2]">
              {feature?.description}
            </p>
            <Button
              type="button"
              className="button-shine mt-8 rounded-full bg-[#d6b26a] px-5 text-[#1b130f] hover:bg-[#e4c987]"
              render={<Link href="/menu" locale={locale} />}
            >
              {copy.labels.exploreMenu}
            </Button>
          </div>
        ) : (
          <>
            <p className="mb-6 text-sm text-[#d1c4b2]">{dishes.length} saved dishes</p>
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {dishes.map((dish) => (
                <DishCard key={dish.id} dish={dish} locale={locale} />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
