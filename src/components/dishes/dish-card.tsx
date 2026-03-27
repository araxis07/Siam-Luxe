"use client";

import Image from "next/image";
import { Clock3, Star } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { useState } from "react";
import { useTranslations } from "next-intl";

import type { AppLocale } from "@/i18n/routing";
import type { LocalizedMenuDish } from "@/lib/catalog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DietaryBadges } from "@/components/dishes/dietary-badges";
import { FavoriteButton } from "@/components/dishes/favorite-button";
import { formatPrice } from "@/lib/format";
import { useCartStore } from "@/store/cart-store";
import { FoodDetailDialog } from "@/components/dishes/food-detail-dialog";

export function DishCard({
  dish,
  locale,
  compact = false,
}: {
  dish: LocalizedMenuDish;
  locale: AppLocale;
  compact?: boolean;
}) {
  const t = useTranslations("dish");
  const reduceMotion = useReducedMotion();
  const addItem = useCartStore((state) => state.addItem);
  const openCart = useCartStore((state) => state.openCart);
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <motion.div
        whileHover={reduceMotion ? undefined : { y: -6 }}
        transition={{ duration: 0.22, ease: "easeOut" }}
        className="h-full"
      >
        <Card
          className={`group/card lux-panel relative h-full overflow-hidden rounded-[2rem] border-0 bg-transparent p-0 ${dish.accentClass}`}
        >
          <div className="absolute inset-0 bg-gradient-to-br opacity-80" />
          <div className="relative">
            <div className="relative aspect-[4/3] overflow-hidden">
              <div className="depth-layer depth-1 float-slow absolute left-5 top-4 h-24 w-24 rounded-full bg-[#d6b26a]/24 blur-3xl" />
              <Image
                src={dish.image}
                alt={dish.name}
                fill
                sizes={compact ? "(max-width: 768px) 100vw, 33vw" : "(max-width: 768px) 100vw, 28vw"}
                className="object-cover transition-transform duration-500 group-hover/card:scale-[1.03]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#070505] via-transparent to-transparent" />
              <div className="absolute left-4 top-4 flex flex-wrap gap-2">
                <span className="glass-chip rounded-full px-3 py-1 text-[0.64rem] uppercase tracking-[0.18em] text-[#ecd8a0]">
                  {dish.categoryLabel}
                </span>
                <span className="rounded-full border border-white/12 bg-black/30 px-3 py-1 text-[0.62rem] uppercase tracking-[0.16em] text-white/90">
                  {dish.regionLabel}
                </span>
                {dish.featured ? (
                  <span className="rounded-full bg-[#d6b26a] px-3 py-1 text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-[#1b130f]">
                    {t("featuredBadge")}
                  </span>
                ) : null}
              </div>
              <div className="absolute right-4 top-4 z-10">
                <FavoriteButton dishId={dish.id} locale={locale} />
              </div>
            </div>

            <CardContent className="relative space-y-4 px-5 pt-5 pb-5">
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-heading text-[1.78rem] leading-tight text-white">
                      {dish.name}
                    </h3>
                    <p className="mt-2 line-clamp-2 text-[0.9rem] leading-6 text-[#d4c7b5]">
                      {dish.description}
                    </p>
                  </div>
                  <span className="font-heading text-[1.55rem] text-[#f2d78d]">
                    {formatPrice(dish.price, locale)}
                  </span>
                </div>
                <div className="flex flex-wrap gap-4 text-[0.68rem] uppercase tracking-[0.14em] text-[#cdb37d]">
                  <span className="inline-flex items-center gap-1.5">
                    <Star className="size-3.5 fill-current text-[#d6b26a]" />
                    {dish.rating.toFixed(1)}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Clock3 className="size-3.5 text-[#d6b26a]" />
                    {t("prepTime", { minutes: dish.prepMinutes })}
                  </span>
                </div>
                <DietaryBadges dishId={dish.id} locale={locale} />
              </div>

              <div className="flex flex-wrap gap-3">
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-full border-white/10 bg-white/5 text-white hover:bg-white/10"
                  onClick={() => setIsModalOpen(true)}
                >
                  {t("customize")}
                </Button>
                <Button
                  type="button"
                  className="button-shine rounded-full bg-[#d6b26a] text-[#1b130f] hover:bg-[#e4c987]"
                  onClick={() => {
                    addItem({
                      dishId: dish.id,
                      quantity: 1,
                      spiceLevel: dish.baseSpice,
                      toppings: [],
                      unitPrice: dish.price,
                    });
                    openCart();
                  }}
                >
                  {t("quickAdd")}
                </Button>
              </div>
            </CardContent>
          </div>
        </Card>
      </motion.div>
      <FoodDetailDialog
        dish={dish}
        locale={locale}
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
      />
    </>
  );
}
