"use client";

import { Heart } from "lucide-react";

import type { AppLocale } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { useHydrated } from "@/hooks/use-hydrated";
import { cn } from "@/lib/utils";
import { getExperienceCopy } from "@/lib/experience";
import { useFavoritesStore } from "@/store/favorites-store";

export function FavoriteButton({
  dishId,
  locale,
  className,
}: {
  dishId: string;
  locale: AppLocale;
  className?: string;
}) {
  const hydrated = useHydrated();
  const isFavorite = useFavoritesStore((state) => state.favoriteDishIds.includes(dishId));
  const toggleFavorite = useFavoritesStore((state) => state.toggleFavorite);
  const copy = getExperienceCopy(locale);
  const label = isFavorite ? copy.labels.removeFavorite : copy.labels.addFavorite;

  return (
    <Button
      type="button"
      size="icon-sm"
      variant="ghost"
      aria-label={label}
      title={label}
      className={cn(
        "rounded-full border border-white/12 bg-black/35 text-white backdrop-blur-md transition-colors hover:bg-black/55",
        isFavorite ? "text-rose-200" : "text-white",
        className,
      )}
      onClick={() => {
        if (!hydrated) {
          return;
        }

        toggleFavorite(dishId);
      }}
    >
      <Heart className={cn("size-4", isFavorite ? "fill-current" : "")} />
    </Button>
  );
}
