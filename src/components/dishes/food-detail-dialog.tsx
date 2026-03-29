"use client";

import Image from "next/image";
import { Share2, Star, Wine } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useEffectEvent, useMemo, useState } from "react";
import { useTranslations } from "next-intl";

import type { AppLocale } from "@/i18n/routing";
import { Link } from "@/i18n/navigation";
import type { LocalizedMenuDish, ToppingId } from "@/lib/catalog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DietaryBadges } from "@/components/dishes/dietary-badges";
import { DishStatusBadge } from "@/components/dishes/dish-status-badge";
import { FavoriteButton } from "@/components/dishes/favorite-button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { trackEvent } from "@/lib/analytics";
import { formatPrice } from "@/lib/format";
import { getExperienceCopy, getLocalizedDishReviews } from "@/lib/experience";
import { getBeveragePairings, getSocialProof } from "@/lib/hospitality";
import { useToast } from "@/hooks/use-toast";
import { getDishStatus, getDishStatusById } from "@/lib/premium";
import { useCartStore } from "@/store/cart-store";
import { useRecentlyViewedStore } from "@/store/recently-viewed-store";

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
  const experienceCopy = getExperienceCopy(locale);
  const addItem = useCartStore((state) => state.addItem);
  const openCart = useCartStore((state) => state.openCart);
  const pushDish = useRecentlyViewedStore((state) => state.pushDish);
  const { toast } = useToast();
  const [spiceLevel, setSpiceLevel] = useState(dish.baseSpice);
  const [quantity, setQuantity] = useState(1);
  const [selectedToppings, setSelectedToppings] = useState<ToppingId[]>([]);
  const reviews = getLocalizedDishReviews(locale, dish.id).slice(0, 2);
  const pairings = getBeveragePairings(locale).filter((item) => item.dishIds.includes(dish.id)).slice(0, 2);
  const socialProof = getSocialProof(locale, dish.id);
  const status = dish.statusId ? getDishStatusById(locale, dish.statusId) : getDishStatus(locale, dish.id);
  const isSoldOut = !dish.isAvailable || status.id === "soldOut";
  const extraText = {
    th: { pairings: "จับคู่เครื่องดื่ม", share: "แชร์เมนู" },
    en: { pairings: "Pairings", share: "Share dish" },
    ja: { pairings: "ペアリング", share: "料理を共有" },
    zh: { pairings: "饮品搭配", share: "分享菜品" },
    ko: { pairings: "페어링", share: "메뉴 공유" },
  } as const;

  const resetSelections = useEffectEvent(() => {
    setSpiceLevel(dish.baseSpice);
    setQuantity(1);
    setSelectedToppings([]);
  });

  useEffect(() => {
    if (open) {
      resetSelections();
      pushDish(dish.id);
      trackEvent("dish_modal_open", { dishId: dish.id, locale });
    }
  }, [dish.id, locale, open, pushDish]);

  const toppingTotal = useMemo(
    () =>
      selectedToppings.reduce((sum, toppingId) => {
        const topping = dish.availableToppings.find((item) => item.id === toppingId);
        return sum + (topping?.price ?? 0);
      }, 0),
    [dish.availableToppings, selectedToppings],
  );

  async function handleShare() {
    const shareUrl =
      typeof window !== "undefined" ? `${window.location.origin}/${locale}/menu#${dish.id}` : `/${locale}/menu#${dish.id}`;

    try {
      if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
        await navigator.share({
          title: dish.name,
          text: dish.description,
          url: shareUrl,
        });
      } else if (typeof navigator !== "undefined" && navigator.clipboard) {
        await navigator.clipboard.writeText(shareUrl);
      }

      trackEvent("dish_share", { dishId: dish.id, locale, source: "detail-modal" });
      toast({
        title: dish.name,
        description: shareUrl,
        tone: "success",
      });
    } catch {
      toast({
        title: dish.name,
        description: shareUrl,
        tone: "info",
      });
    }
  }

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
              <div className="mb-3 flex flex-wrap gap-2">
                <div className="glass-chip inline-flex w-fit rounded-full px-3 py-1 text-[0.66rem] uppercase tracking-[0.18em] text-[#d8c48e]">
                  {dish.categoryLabel}
                </div>
                <div className="inline-flex w-fit rounded-full border border-white/12 bg-white/5 px-3 py-1 text-[0.66rem] uppercase tracking-[0.18em] text-white/85">
                  {dish.regionLabel}
                </div>
                <DishStatusBadge dishId={dish.id} locale={locale} />
                <FavoriteButton dishId={dish.id} locale={locale} className="ml-auto" />
                <Button
                  type="button"
                  size="icon-sm"
                  variant="outline"
                  className="rounded-full border-white/10 bg-white/5 text-white hover:bg-white/10"
                  aria-label={`${dish.name} ${extraText[locale].share}`}
                  onClick={handleShare}
                >
                  <Share2 className="size-4" />
                </Button>
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
              <DietaryBadges dishId={dish.id} locale={locale} className="mt-4" />
              <p className="mt-4 text-sm leading-7 text-[#d1c4b2]">
                {socialProof.label} · {socialProof.todayOrders} · {socialProof.note}
              </p>
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

              {reviews.length > 0 ? (
                <section className="space-y-3">
                  <h3 className="font-medium text-white">{experienceCopy.labels.reviewsTitle}</h3>
                  <div className="space-y-3">
                    {reviews.map((review) => (
                      <div key={review.id} className="rounded-[1.5rem] border border-white/10 bg-white/4 p-4">
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <p className="text-white">{review.guest}</p>
                            <p className="text-sm text-[#bcae9b]">{review.region}</p>
                          </div>
                          <span className="inline-flex items-center gap-1 text-sm text-[#ecd8a0]">
                            <Star className="size-3.5 fill-current" />
                            {review.rating.toFixed(1)}
                          </span>
                        </div>
                        <p className="mt-3 text-sm leading-6 text-[#d4c7b5]">{review.body}</p>
                      </div>
                    ))}
                  </div>
                </section>
              ) : null}

              {pairings.length > 0 ? (
                <section className="space-y-3">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="font-medium text-white">{extraText[locale].pairings}</h3>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      className="rounded-full border-white/10 bg-white/5 text-white hover:bg-white/10"
                      render={<Link href="/pairings" locale={locale} />}
                    >
                      <Wine className="size-4" />
                      {extraText[locale].pairings}
                    </Button>
                  </div>
                  <div className="space-y-3">
                    {pairings.map((pairing) => (
                      <div key={pairing.id} className="rounded-[1.5rem] border border-white/10 bg-white/4 p-4">
                        <p className="text-white">{pairing.title}</p>
                        <p className="mt-1 text-sm text-[#ecd8a0]">{pairing.beverage}</p>
                        <p className="mt-3 text-sm leading-6 text-[#d4c7b5]">{pairing.body}</p>
                      </div>
                    ))}
                  </div>
                </section>
              ) : null}
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
                      disabled={isSoldOut}
                      onClick={() => {
                        if (isSoldOut) {
                          return;
                        }
                        addItem({
                          dishId: dish.id,
                          quantity,
                          spiceLevel,
                          toppings: selectedToppings,
                          unitPrice: dish.price + toppingTotal,
                        });
                        openCart();
                        trackEvent("add_to_cart", {
                          dishId: dish.id,
                          locale,
                          quantity,
                          spiceLevel,
                          source: "detail-modal",
                        });
                        toast({
                          title: t("addToCart"),
                          description: dish.name,
                          tone: "success",
                        });
                        onOpenChange(false);
                      }}
                    >
                      {isSoldOut ? status.label : t("addToCart")}
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
