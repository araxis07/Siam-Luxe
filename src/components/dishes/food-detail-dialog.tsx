"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useEffectEvent, useMemo, useState } from "react";
import { useTranslations } from "next-intl";

import type { AppLocale } from "@/i18n/routing";
import type { LocalizedMenuDish, ToppingId } from "@/lib/catalog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { formatPrice } from "@/lib/format";
import { useCartStore } from "@/store/cart-store";

export function FoodDetailDialog({
  dish,
  locale,
  open,
  onOpenChange,
}: {
  dish: LocalizedMenuDish;
  locale: AppLocale;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const t = useTranslations("dish");
  const addItem = useCartStore((state) => state.addItem);
  const openCart = useCartStore((state) => state.openCart);
  const [spiceLevel, setSpiceLevel] = useState(dish.baseSpice);
  const [quantity, setQuantity] = useState(1);
  const [selectedToppings, setSelectedToppings] = useState<ToppingId[]>([]);

  const resetSelections = useEffectEvent(() => {
    setSpiceLevel(dish.baseSpice);
    setQuantity(1);
    setSelectedToppings([]);
  });

  useEffect(() => {
    if (open) {
      resetSelections();
    }
  }, [dish.id, open]);

  const toppingTotal = useMemo(
    () =>
      selectedToppings.reduce((sum, toppingId) => {
        const topping = dish.availableToppings.find((item) => item.id === toppingId);
        return sum + (topping?.price ?? 0);
      }, 0),
    [dish.availableToppings, selectedToppings],
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton
        className="max-w-[min(100%,56rem)] gap-0 overflow-hidden border border-white/10 bg-[#100a0a]/96 p-0 text-white sm:max-w-4xl"
      >
        <div className="grid lg:grid-cols-[1.02fr_0.98fr]">
          <div className="relative min-h-[320px] bg-gradient-to-br from-[#5c191f] via-[#25110f] to-[#0c0908]">
            <div className="depth-layer depth-0 float-slow absolute left-6 top-8 h-32 w-32 rounded-full bg-[#d6b26a]/24 blur-3xl" />
            <div className="depth-layer depth-1 float-delayed absolute bottom-8 right-6 h-36 w-36 rounded-full bg-[#15563f]/20 blur-3xl" />
            <Image
              src={dish.image}
              alt={dish.name}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#080505] via-transparent to-transparent" />
          </div>
          <div className="flex flex-col">
            <DialogHeader className="border-b border-white/8 px-6 pt-6 pb-5">
              <div className="glass-chip mb-3 inline-flex w-fit rounded-full px-3 py-1 text-[0.66rem] uppercase tracking-[0.18em] text-[#d8c48e]">
                {dish.categoryLabel}
              </div>
              <DialogTitle className="font-heading text-[2.1rem] leading-tight text-white sm:text-[2.35rem]">
                {dish.name}
              </DialogTitle>
              <DialogDescription className="max-w-lg text-[0.96rem] leading-7 text-[#d1c3b1]">
                {dish.description}
              </DialogDescription>
              <div className="mt-3 flex flex-wrap gap-3 text-sm text-[#d6c9b6]">
                <span>{t("rating", { rating: dish.rating.toFixed(1) })}</span>
                <span>•</span>
                <span>{t("prepTime", { minutes: dish.prepMinutes })}</span>
                <span>•</span>
                <span>{t("premiumFinish")}</span>
              </div>
            </DialogHeader>

            <div className="space-y-6 px-6 py-6">
              <section className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-white">{t("spiceLevel")}</h3>
                  <span className="text-sm text-[#c9bcad]">
                    {t("level", { level: spiceLevel })}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
                  {Array.from({ length: 6 }, (_, level) => (
                    <Button
                      key={level}
                      type="button"
                      variant={spiceLevel === level ? "default" : "outline"}
                      className={
                        spiceLevel === level
                          ? "rounded-full bg-[#d6b26a] text-[#1b130f] hover:bg-[#e4c987]"
                          : "rounded-full border-white/10 bg-white/4 text-white hover:bg-white/8"
                      }
                      onClick={() => setSpiceLevel(level)}
                    >
                      {level}
                    </Button>
                  ))}
                </div>
              </section>

              <section className="space-y-3">
                <h3 className="font-medium text-white">{t("toppings")}</h3>
                <div className="space-y-2">
                  {dish.availableToppings.map((topping) => {
                    const checked = selectedToppings.includes(topping.id);

                    return (
                      <label
                        key={topping.id}
                        className="lux-panel-soft flex cursor-pointer items-center justify-between rounded-2xl px-4 py-3 transition-colors hover:bg-white/8"
                      >
                        <div className="flex items-center gap-3">
                          <Checkbox
                            checked={checked}
                            onCheckedChange={(nextChecked) => {
                              setSelectedToppings((current) =>
                                nextChecked
                                  ? [...current, topping.id]
                                  : current.filter((item) => item !== topping.id),
                              );
                            }}
                          />
                          <span className="text-sm text-white">{topping.label}</span>
                        </div>
                        <span className="text-sm text-[#d6c48c]">
                          +{formatPrice(topping.price, locale)}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </section>

              <section className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-white">{t("quantity")}</h3>
                  <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/20 px-2 py-1">
                    <Button
                      type="button"
                      size="icon-xs"
                      variant="ghost"
                      className="rounded-full text-white hover:bg-white/8"
                      onClick={() => setQuantity((value) => Math.max(1, value - 1))}
                    >
                      -
                    </Button>
                    <span className="min-w-5 text-center text-sm">{quantity}</span>
                    <Button
                      type="button"
                      size="icon-xs"
                      variant="ghost"
                      className="rounded-full text-white hover:bg-white/8"
                      onClick={() => setQuantity((value) => value + 1)}
                    >
                      +
                    </Button>
                  </div>
                </div>
              </section>
            </div>

            <div className="border-t border-white/8 bg-black/10 px-6 py-5">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${dish.id}-${spiceLevel}-${quantity}-${selectedToppings.join(",")}`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="text-[0.66rem] uppercase tracking-[0.18em] text-[#c8b37a]">
                      {t("selectedToppings")}
                    </p>
                    <p className="mt-1 text-sm text-[#d6c9b6]">
                      {selectedToppings.length > 0
                        ? selectedToppings
                            .map(
                              (toppingId) =>
                                dish.availableToppings.find((entry) => entry.id === toppingId)?.label,
                            )
                            .filter(Boolean)
                            .join(", ")
                        : t("none")}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-heading text-[1.9rem] text-white">
                      {formatPrice((dish.price + toppingTotal) * quantity, locale)}
                    </span>
                    <Button
                      type="button"
                      className="button-shine rounded-full bg-[#d6b26a] px-5 text-[#1b130f] hover:bg-[#e4c987]"
                      onClick={() => {
                        addItem({
                          dishId: dish.id,
                          quantity,
                          spiceLevel,
                          toppings: selectedToppings,
                          unitPrice: dish.price + toppingTotal,
                        });
                        openCart();
                        onOpenChange(false);
                      }}
                    >
                      {t("addToCart")}
                    </Button>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
