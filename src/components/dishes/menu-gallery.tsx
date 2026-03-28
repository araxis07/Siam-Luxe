"use client";

import Image from "next/image";
import { Search, Star } from "lucide-react";
import { useState } from "react";

import type { AppLocale } from "@/i18n/routing";
import type { LocalizedMenuDish } from "@/lib/catalog";
import { Button } from "@/components/ui/button";
import { FavoriteButton } from "@/components/dishes/favorite-button";
import { FoodDetailDialog } from "@/components/dishes/food-detail-dialog";
import { formatPrice } from "@/lib/format";
import { useToast } from "@/hooks/use-toast";
import { getDishStatus } from "@/lib/premium";
import { useCartStore } from "@/store/cart-store";

const galleryText = {
  th: {
    open: "ดูรายละเอียด",
    quickAdd: "เพิ่มเมนูนี้",
  },
  en: {
    open: "Open details",
    quickAdd: "Quick add",
  },
  ja: {
    open: "詳細を見る",
    quickAdd: "追加",
  },
  zh: {
    open: "查看详情",
    quickAdd: "快速加入",
  },
  ko: {
    open: "상세 보기",
    quickAdd: "빠르게 담기",
  },
} as const;

export function MenuGallery({ dishes, locale }: { dishes: LocalizedMenuDish[]; locale: AppLocale }) {
  const text = galleryText[locale];
  const addItem = useCartStore((state) => state.addItem);
  const openCart = useCartStore((state) => state.openCart);
  const { toast } = useToast();
  const [activeDish, setActiveDish] = useState<LocalizedMenuDish | null>(null);

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {dishes.map((dish, index) => {
          const status = getDishStatus(locale, dish.id);
          const featuredTile = index % 5 === 0;

          return (
            <article
              key={dish.id}
              className={`group relative overflow-hidden rounded-[2rem] border border-white/10 bg-[#100c0c] ${
                featuredTile ? "md:col-span-2 md:grid md:grid-cols-[1.18fr_0.82fr]" : ""
              }`}
            >
              <div className={`relative min-h-[18rem] ${featuredTile ? "md:min-h-[20rem]" : ""}`}>
                <Image
                  src={dish.image}
                  alt={dish.name}
                  fill
                  sizes={featuredTile ? "(max-width: 768px) 100vw, 66vw" : "(max-width: 768px) 100vw, 33vw"}
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#060505] via-[#060505]/35 to-transparent" />
                <div className="absolute left-4 top-4 flex flex-wrap gap-2">
                  <span className="glass-chip rounded-full px-3 py-1 text-[0.64rem] uppercase tracking-[0.18em] text-[#ecd8a0]">
                    {dish.regionLabel}
                  </span>
                  <span className="rounded-full border border-white/10 bg-black/35 px-3 py-1 text-[0.64rem] uppercase tracking-[0.18em] text-white">
                    {status.label}
                  </span>
                </div>
                <div className="absolute right-4 top-4">
                  <FavoriteButton dishId={dish.id} locale={locale} />
                </div>
              </div>
              <div className="space-y-4 p-5 sm:p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-heading text-[1.8rem] leading-tight text-white">{dish.name}</h3>
                    <p className="mt-3 line-clamp-3 text-sm leading-7 text-[#d1c4b2]">{dish.description}</p>
                  </div>
                  <span className="font-heading text-[1.5rem] text-[#f2d78d]">{formatPrice(dish.price, locale)}</span>
                </div>
                <div className="flex flex-wrap items-center gap-4 text-sm text-[#bcae9b]">
                  <span className="inline-flex items-center gap-1">
                    <Star className="size-4 fill-current text-[#d6b26a]" />
                    {dish.rating.toFixed(1)}
                  </span>
                  <span>{dish.categoryLabel}</span>
                </div>
                <div className="flex flex-wrap gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    className="rounded-full border-white/10 bg-white/5 text-white hover:bg-white/10"
                    onClick={() => setActiveDish(dish)}
                  >
                    <Search className="size-4" />
                    {text.open}
                  </Button>
                  <Button
                    type="button"
                    className="button-shine rounded-full bg-[#d6b26a] text-[#1b130f] hover:bg-[#e4c987]"
                    disabled={status.id === "soldOut"}
                    onClick={() => {
                      if (status.id === "soldOut") {
                        return;
                      }
                      addItem({
                        dishId: dish.id,
                        quantity: 1,
                        spiceLevel: dish.baseSpice,
                        toppings: [],
                        unitPrice: dish.price,
                      });
                      openCart();
                      toast({
                        title: text.quickAdd,
                        description: dish.name,
                        tone: "success",
                      });
                    }}
                  >
                    {text.quickAdd}
                  </Button>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {activeDish ? (
        <FoodDetailDialog
          dish={activeDish}
          locale={locale}
          open={Boolean(activeDish)}
          onOpenChange={(open) => {
            if (!open) {
              setActiveDish(null);
            }
          }}
        />
      ) : null}
    </>
  );
}
