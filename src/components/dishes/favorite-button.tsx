"use client";

import { Heart } from "lucide-react";

import type { AppLocale } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { useHydrated } from "@/hooks/use-hydrated";
import { useToast } from "@/hooks/use-toast";
import { requestJson } from "@/lib/backend/client";
import { cn } from "@/lib/utils";
import { getExperienceCopy } from "@/lib/experience";
import { useFavoritesStore } from "@/store/favorites-store";
import { useUserStore } from "@/store/user-store";

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
  const authStatus = useUserStore((state) => state.authStatus);
  const isFavorite = useFavoritesStore((state) => state.favoriteDishIds.includes(dishId));
  const toggleFavorite = useFavoritesStore((state) => state.toggleFavorite);
  const setFavoriteDishIds = useFavoritesStore((state) => state.setFavoriteDishIds);
  const copy = getExperienceCopy(locale);
  const { toast } = useToast();
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

        const nextActive = !isFavorite;
        toggleFavorite(dishId);

        void (async () => {
          if (authStatus === "member") {
            try {
              const payload = await requestJson<{ favoriteDishIds: string[] }>("/api/favorites", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  dishId,
                  active: nextActive,
                }),
              });
              setFavoriteDishIds(payload.favoriteDishIds);
            } catch (error) {
              toggleFavorite(dishId);
              toast({
                title: label,
                description: error instanceof Error ? error.message : copy.labels.favoritesBody,
                tone: "error",
              });
              return;
            }
          }

          toast({
            title: nextActive ? copy.labels.addFavorite : copy.labels.removeFavorite,
            description: copy.labels.favoritesBody,
            tone: "success",
          });
        })();
      }}
    >
      <Heart className={cn("size-4", isFavorite ? "fill-current" : "")} />
    </Button>
  );
}
