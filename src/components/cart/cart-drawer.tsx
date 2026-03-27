"use client";

import Image from "next/image";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";

import type { AppLocale } from "@/i18n/routing";
import { Link } from "@/i18n/navigation";
import { PromoCodePanel } from "@/components/cart/promo-code-panel";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useHydrated } from "@/hooks/use-hydrated";
import { getLocalizedDish } from "@/lib/catalog";
import { formatPrice } from "@/lib/format";
import { getExperienceCopy, getLocalizedBranch, getOrderTotals } from "@/lib/experience";
import { useCartStore } from "@/store/cart-store";
import { useExperienceStore } from "@/store/experience-store";

export function CartDrawer({ locale }: { locale: AppLocale }) {
  const t = useTranslations("cart");
  const tDish = useTranslations("dish");
  const hydrated = useHydrated();
  const experienceCopy = getExperienceCopy(locale);
  const items = useCartStore((state) => state.items);
  const isOpen = useCartStore((state) => state.isOpen);
  const setCartOpen = useCartStore((state) => state.setCartOpen);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const clearCart = useCartStore((state) => state.clearCart);
  const closeCart = useCartStore((state) => state.closeCart);
  const selectedBranchId = useExperienceStore((state) => state.selectedBranchId);
  const serviceMode = useExperienceStore((state) => state.serviceMode);
  const appliedPromoCode = useExperienceStore((state) => state.appliedPromoCode);

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const totals = getOrderTotals(items, appliedPromoCode);
  const branch = getLocalizedBranch(locale, selectedBranchId);

  return (
    <Sheet open={isOpen} onOpenChange={setCartOpen}>
      <SheetContent
        side="right"
        className="w-full max-w-[100vw] border-l border-white/10 bg-[#120c0d]/96 p-0 text-white sm:max-w-lg"
      >
        <SheetHeader className="border-b border-white/8 bg-white/3 pb-5 pr-14">
          <SheetTitle className="font-heading text-[2rem] text-white">{t("title")}</SheetTitle>
          <SheetDescription className="max-w-sm text-[#c9bcad]">
            {t("subtitle")}
          </SheetDescription>
        </SheetHeader>

        <div className="flex min-h-0 flex-1 flex-col">
          {!hydrated ? (
            <div className="space-y-4 p-4">
              <div className="h-24 animate-pulse rounded-3xl bg-white/6" />
              <div className="h-24 animate-pulse rounded-3xl bg-white/6" />
            </div>
          ) : items.length === 0 ? (
            <div className="flex flex-1 flex-col items-center justify-center gap-5 px-6 py-12 text-center">
              <div className="lux-panel-soft rounded-3xl px-6 py-5">
                <p className="font-heading text-[2rem] leading-tight text-white">{t("emptyTitle")}</p>
                <p className="mt-2 max-w-sm text-[#c9bcad]">{t("emptyBody")}</p>
              </div>
              <Button
                type="button"
                className="button-shine rounded-full bg-[#d6b26a] px-5 text-[#1b130f] hover:bg-[#e4c987]"
                onClick={closeCart}
                render={<Link href="/menu" locale={locale} />}
              >
                {t("continueBrowsing")}
              </Button>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between px-4 py-3 text-sm text-[#d8cbbb]">
                <span>{t("items", { count: itemCount })}</span>
                <span className="text-right text-[#a89b8d]">
                  {branch.name} · {experienceCopy.serviceModes[serviceMode]}
                </span>
              </div>
              <Separator className="bg-white/8" />
              <div className="flex-1 space-y-4 overflow-y-auto px-4 py-4">
                {items.map((item) => {
                  const dish = getLocalizedDish(locale, item.dishId);

                  if (!dish) {
                    return null;
                  }

                  return (
                    <div
                      key={item.key}
                      className="lux-panel flex gap-4 rounded-3xl p-4"
                    >
                      <div className="relative h-22 w-22 shrink-0 overflow-hidden rounded-2xl">
                        <Image
                          src={dish.image}
                          alt={dish.name}
                          fill
                          sizes="88px"
                          className="object-cover"
                        />
                      </div>
                      <div className="min-w-0 flex-1 space-y-3">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="font-medium text-white">{dish.name}</p>
                            <p className="mt-1 text-xs text-[#bdaa99]">
                              {tDish("level", { level: item.spiceLevel })} ·{" "}
                              {item.toppings.length > 0
                                ? item.toppings
                                    .map(
                                      (toppingId) =>
                                        dish.availableToppings.find((entry) => entry.id === toppingId)
                                          ?.label,
                                    )
                                    .filter(Boolean)
                                    .join(", ")
                                : tDish("none")}
                            </p>
                          </div>
                          <Button
                            type="button"
                            size="icon-sm"
                            variant="ghost"
                            className="rounded-full text-[#d5c7b6] hover:bg-white/8 hover:text-white"
                            onClick={() => removeItem(item.key)}
                          >
                            <Trash2 className="size-4" />
                            <span className="sr-only">{t("remove")}</span>
                          </Button>
                        </div>
                        <div className="flex items-center justify-between gap-3">
                          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/20 px-2 py-1">
                            <Button
                              type="button"
                              size="icon-xs"
                              variant="ghost"
                              className="rounded-full text-white hover:bg-white/8"
                              onClick={() => updateQuantity(item.key, item.quantity - 1)}
                            >
                              <Minus className="size-3" />
                              <span className="sr-only">Decrease</span>
                            </Button>
                            <span className="min-w-5 text-center text-sm">{item.quantity}</span>
                            <Button
                              type="button"
                              size="icon-xs"
                              variant="ghost"
                              className="rounded-full text-white hover:bg-white/8"
                              onClick={() => updateQuantity(item.key, item.quantity + 1)}
                            >
                              <Plus className="size-3" />
                              <span className="sr-only">Increase</span>
                            </Button>
                          </div>
                          <span className="font-medium text-[#f0d58f]">
                            {formatPrice(item.unitPrice * item.quantity, locale)}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>

        {items.length > 0 && hydrated && (
          <SheetFooter className="border-t border-white/8 bg-[#120c0d] p-4">
            <div className="lux-panel-soft w-full rounded-3xl p-4">
              <div className="mb-4 rounded-[1.5rem] border border-white/10 bg-black/15 px-4 py-3 text-sm text-[#d1c4b2]">
                <p className="text-[0.66rem] uppercase tracking-[0.18em] text-[#cdb37d]">
                  {experienceCopy.labels.branch}
                </p>
                <p className="mt-2 text-white">{branch.name}</p>
                <p className="mt-1 text-sm text-[#bcae9b]">{experienceCopy.serviceModes[serviceMode]}</p>
              </div>
              <PromoCodePanel locale={locale} subtotal={totals.subtotal} />
              <div className="my-4" />
              <div className="space-y-2 text-sm text-[#d8cbbb]">
                <div className="flex items-center justify-between">
                  <span>{t("subtotal")}</span>
                  <span>{formatPrice(totals.subtotal, locale)}</span>
                </div>
                {totals.discount > 0 ? (
                  <div className="flex items-center justify-between">
                    <span>{experienceCopy.labels.discount}</span>
                    <span>-{formatPrice(totals.discount, locale)}</span>
                  </div>
                ) : null}
                <div className="flex items-center justify-between">
                  <span>{t("delivery")}</span>
                  <span>
                    {formatPrice(totals.delivery, locale)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>{t("service")}</span>
                  <span>{formatPrice(totals.service, locale)}</span>
                </div>
              </div>
              <div className="thai-divider my-4" />
              <div className="flex items-center justify-between">
                <span className="text-[0.7rem] uppercase tracking-[0.14em] text-[#cdb37d]">
                  {t("total")}
                </span>
                <span className="font-heading text-[2rem] text-white">
                  {formatPrice(totals.total, locale)}
                </span>
              </div>
              <div className="mt-4 flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 rounded-full border-white/10 bg-white/4 text-white hover:bg-white/8"
                  onClick={clearCart}
                >
                  {t("clear")}
                </Button>
                <Button
                  type="button"
                  className="button-shine flex-1 rounded-full bg-[#d6b26a] text-[#1b130f] hover:bg-[#e4c987]"
                  onClick={closeCart}
                  render={<Link href="/checkout" locale={locale} />}
                >
                  {t("checkout")}
                </Button>
              </div>
            </div>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}
