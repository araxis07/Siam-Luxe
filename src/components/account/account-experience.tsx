"use client";

import { Bell, Clock3, Crown, Heart, PackageCheck, Star } from "lucide-react";

import type { AppLocale } from "@/i18n/routing";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { useHydrated } from "@/hooks/use-hydrated";
import { formatPrice } from "@/lib/format";
import {
  getExperienceCopy,
  getFeatureLinks,
  getLocalizedBranch,
  getLocalizedNotifications,
  getLocalizedOrders,
  getLoyaltySnapshot,
} from "@/lib/experience";
import { useCartStore } from "@/store/cart-store";
import { useExperienceStore } from "@/store/experience-store";
import { useFavoritesStore } from "@/store/favorites-store";
import { useUserStore } from "@/store/user-store";

const accountText = {
  th: {
    noSavedAddress: "ยังไม่มีที่อยู่ที่บันทึกไว้",
    orders: "คำสั่งซื้อ",
    updates: "รายการอัปเดต",
    favorites: "เมนูโปรด",
    trackOrders: "ติดตามออเดอร์",
    helpCenter: "ศูนย์ช่วยเหลือ",
  },
  en: {
    noSavedAddress: "No saved address yet",
    orders: "orders",
    updates: "updates",
    favorites: "favorites",
    trackOrders: "Track orders",
    helpCenter: "Help center",
  },
  ja: {
    noSavedAddress: "保存済み住所はまだありません",
    orders: "注文",
    updates: "更新",
    favorites: "お気に入り",
    trackOrders: "注文追跡",
    helpCenter: "ヘルプセンター",
  },
  zh: {
    noSavedAddress: "尚未保存地址",
    orders: "订单",
    updates: "更新",
    favorites: "收藏",
    trackOrders: "订单追踪",
    helpCenter: "帮助中心",
  },
  ko: {
    noSavedAddress: "저장된 주소가 아직 없습니다",
    orders: "주문",
    updates: "업데이트",
    favorites: "즐겨찾기",
    trackOrders: "주문 추적",
    helpCenter: "도움말 센터",
  },
} as const;

export function AccountExperience({ locale }: { locale: AppLocale }) {
  const hydrated = useHydrated();
  const feature = getFeatureLinks(locale).find((item) => item.id === "account");
  const copy = getExperienceCopy(locale);
  const labels = accountText[locale];
  const favoriteDishIds = useFavoritesStore((state) => state.favoriteDishIds);
  const selectedBranchId = useExperienceStore((state) => state.selectedBranchId);
  const serviceMode = useExperienceStore((state) => state.serviceMode);
  const fullName = useUserStore((state) => state.fullName);
  const phone = useUserStore((state) => state.phone);
  const addressLine = useUserStore((state) => state.addressLine);
  const district = useUserStore((state) => state.district);
  const city = useUserStore((state) => state.city);
  const addItem = useCartStore((state) => state.addItem);
  const openCart = useCartStore((state) => state.openCart);

  if (!hydrated) {
    return <div className="h-[560px] animate-pulse rounded-[2rem] bg-white/5" />;
  }

  const branch = getLocalizedBranch(locale, selectedBranchId);
  const orders = getLocalizedOrders(locale);
  const notifications = getLocalizedNotifications(locale);
  const loyalty = getLoyaltySnapshot(locale);

  return (
    <section className="scene-section px-4 pt-10 pb-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="max-w-3xl">
          <p className="text-[0.66rem] uppercase tracking-[0.18em] text-[#cdb37d]">{feature?.eyebrow}</p>
          <h1 className="mt-3 font-heading text-[2.75rem] leading-tight text-white sm:text-[3.2rem]">
            {feature?.title ?? copy.labels.accountTitle}
          </h1>
          <p className="mt-4 text-[0.98rem] leading-8 text-[#d1c4b2]">{feature?.description}</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.02fr_0.98fr]">
          <div className="space-y-6">
            <div className="lux-panel rounded-[2.2rem] p-6 sm:p-8">
              <p className="text-[0.66rem] uppercase tracking-[0.18em] text-[#cdb37d]">{copy.labels.accountSummaryTitle}</p>
              <h2 className="mt-3 font-heading text-[2rem] leading-tight text-white">{fullName || copy.labels.accountGreeting}</h2>
              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <div className="rounded-[1.7rem] border border-white/10 bg-white/4 p-5">
                  <p className="text-sm text-[#bcae9b]">{phone || "—"}</p>
                  <p className="mt-2 text-white">{addressLine || labels.noSavedAddress}</p>
                  <p className="mt-1 text-sm text-[#bcae9b]">{district} {city}</p>
                </div>
                <div className="rounded-[1.7rem] border border-white/10 bg-white/4 p-5">
                  <p className="text-sm text-[#bcae9b]">{copy.labels.branch}</p>
                  <p className="mt-2 text-white">{branch.name}</p>
                  <p className="mt-1 text-sm text-[#bcae9b]">
                    {copy.serviceModes[serviceMode]} · {favoriteDishIds.length} {labels.favorites}
                  </p>
                </div>
              </div>
            </div>

            <div className="lux-panel rounded-[2.2rem] p-6 sm:p-8">
              <div className="flex items-center gap-3">
                <div className="inline-flex size-12 items-center justify-center rounded-2xl bg-[#d6b26a]/12 text-[#ecd8a0]">
                  <Crown className="size-5" />
                </div>
                <div>
                  <p className="text-[0.66rem] uppercase tracking-[0.18em] text-[#cdb37d]">{copy.labels.loyaltyTitle}</p>
                  <h2 className="mt-1 font-heading text-[1.9rem] leading-tight text-white">{loyalty.currentTier}</h2>
                </div>
              </div>
              <p className="mt-4 text-[#d1c4b2]">{loyalty.currentTierBody}</p>
              <div className="mt-6 rounded-[1.7rem] border border-white/10 bg-white/4 p-5">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm text-[#bcae9b]">{loyalty.currentPoints} pts</span>
                  <span className="text-sm text-[#ecd8a0]">{loyalty.nextTier}</span>
                </div>
                <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/8">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#9b1d27] via-[#d6b26a] to-[#1d624b]"
                    style={{ width: `${Math.min(100, (loyalty.currentPoints / loyalty.nextThreshold) * 100)}%` }}
                  />
                </div>
                <p className="mt-3 text-sm text-[#d1c4b2]">
                  {copy.labels.nextReward.replace("{points}", String(loyalty.pointsToNext))}
                </p>
              </div>
              <div className="mt-5 grid gap-3 md:grid-cols-3">
                {loyalty.tiers.map((tier) => (
                  <div key={tier.id} className="rounded-[1.4rem] border border-white/10 bg-black/15 p-4">
                    <p className="text-white">{tier.title}</p>
                    <p className="mt-2 text-sm text-[#bcae9b]">{tier.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="lux-panel rounded-[2.2rem] p-6 sm:p-8">
              <div className="flex items-center gap-3">
                <div className="inline-flex size-12 items-center justify-center rounded-2xl bg-[#d6b26a]/12 text-[#ecd8a0]">
                  <PackageCheck className="size-5" />
                </div>
                <div>
                  <p className="text-[0.66rem] uppercase tracking-[0.18em] text-[#cdb37d]">{copy.labels.orderHistoryTitle}</p>
                  <h2 className="mt-1 font-heading text-[1.9rem] leading-tight text-white">{orders.length} {labels.orders}</h2>
                </div>
              </div>
              <div className="mt-5 space-y-4">
                {orders.map((order) => (
                  <div key={order.id} className="rounded-[1.7rem] border border-white/10 bg-white/4 p-5">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-white">{order.code}</p>
                        <p className="mt-1 text-sm text-[#bcae9b]">{order.branch.name} · {order.placedAt}</p>
                      </div>
                      <Button
                        type="button"
                        size="sm"
                        className="button-shine rounded-full bg-[#d6b26a] text-[#1b130f] hover:bg-[#e4c987]"
                        onClick={() => {
                          order.items.forEach((item) => {
                            if (!item.dish) return;

                            addItem({
                              dishId: item.dish.id,
                              quantity: item.quantity,
                              spiceLevel: item.dish.baseSpice,
                              toppings: [],
                              unitPrice: item.dish.price,
                            });
                          });
                          openCart();
                        }}
                      >
                        {copy.labels.reorder}
                      </Button>
                    </div>
                    <div className="mt-4 space-y-2">
                      {order.items.map((item) => (
                        <div key={`${order.id}-${item.dishId}`} className="flex items-center justify-between gap-3 text-sm">
                          <span className="text-[#d1c4b2]">{item.dish?.name} × {item.quantity}</span>
                          <span className="text-[#ecd8a0]">{formatPrice((item.dish?.price ?? 0) * item.quantity, locale)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lux-panel-soft rounded-[2rem] p-6 sm:p-8">
              <div className="flex items-center gap-3">
                <div className="inline-flex size-12 items-center justify-center rounded-2xl bg-[#d6b26a]/12 text-[#ecd8a0]">
                  <Bell className="size-5" />
                </div>
                <div>
                  <p className="text-[0.66rem] uppercase tracking-[0.18em] text-[#cdb37d]">{copy.labels.notificationsTitle}</p>
                  <h2 className="mt-1 font-heading text-[1.9rem] leading-tight text-white">{notifications.length} {labels.updates}</h2>
                </div>
              </div>
              <div className="mt-5 space-y-3">
                {notifications.map((item) => (
                  <div key={item.id} className="rounded-[1.5rem] border border-white/10 bg-black/15 p-4">
                    <p className="text-white">{item.title}</p>
                    <p className="mt-2 text-sm leading-6 text-[#d0c3b1]">{item.body}</p>
                    <p className="mt-3 text-xs uppercase tracking-[0.14em] text-[#bcae9b]">{item.time}</p>
                  </div>
                ))}
              </div>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-full border-white/10 bg-white/5 text-white hover:bg-white/10"
                  render={<Link href="/favorites" locale={locale} />}
                >
                  <Heart className="size-4" />
                  {favoriteDishIds.length} {labels.favorites}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-full border-white/10 bg-white/5 text-white hover:bg-white/10"
                  render={<Link href="/tracking" locale={locale} />}
                >
                  <Clock3 className="size-4" />
                  {labels.trackOrders}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-full border-white/10 bg-white/5 text-white hover:bg-white/10"
                  render={<Link href="/help" locale={locale} />}
                >
                  <Star className="size-4" />
                  {labels.helpCenter}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
