"use client";

import {
  Bell,
  CalendarCheck2,
  Clock3,
  CreditCard,
  Crown,
  Heart,
  MapPinned,
  PackageCheck,
  Ticket,
} from "lucide-react";

import type { AppLocale } from "@/i18n/routing";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { useHydrated } from "@/hooks/use-hydrated";
import { useToast } from "@/hooks/use-toast";
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
import { useReservationStore } from "@/store/reservation-store";
import { useUserStore } from "@/store/user-store";

const accountText = {
  th: {
    noSavedAddress: "ยังไม่มีที่อยู่ที่บันทึกไว้",
    orders: "คำสั่งซื้อ",
    updates: "รายการอัปเดต",
    favorites: "เมนูโปรด",
    trackOrders: "ติดตามออเดอร์",
    helpCenter: "ศูนย์ช่วยเหลือ",
    addressesTitle: "ที่อยู่ที่บันทึกไว้",
    paymentsTitle: "ช่องทางชำระเงิน",
    walletTitle: "gift card และ voucher wallet",
    reservationsTitle: "การจองของฉัน",
    useThis: "ใช้ชุดนี้",
    active: "กำลังใช้งาน",
    addAddress: "เพิ่มที่อยู่ตัวอย่าง",
    addPayment: "เพิ่มบัตรตัวอย่าง",
    reschedule: "เลื่อนเวลา +30 นาที",
    cancel: "ยกเลิกการจอง",
    confirmed: "ยืนยันแล้ว",
    waitlist: "อยู่ใน waitlist",
    cancelled: "ยกเลิกแล้ว",
    expires: "หมดอายุ",
    noReservations: "ยังไม่มีรายการจองใหม่",
    profileTitle: "ข้อมูลแขกหลัก",
    activePayment: "วิธีชำระที่เลือก",
  },
  en: {
    noSavedAddress: "No saved address yet",
    orders: "orders",
    updates: "updates",
    favorites: "favorites",
    trackOrders: "Track orders",
    helpCenter: "Help center",
    addressesTitle: "Saved addresses",
    paymentsTitle: "Payment methods",
    walletTitle: "Gift card & voucher wallet",
    reservationsTitle: "My reservations",
    useThis: "Use this",
    active: "Active",
    addAddress: "Add sample address",
    addPayment: "Add sample card",
    reschedule: "Move +30 mins",
    cancel: "Cancel booking",
    confirmed: "Confirmed",
    waitlist: "Waitlist",
    cancelled: "Cancelled",
    expires: "Expires",
    noReservations: "No new reservations yet",
    profileTitle: "Primary guest profile",
    activePayment: "Selected payment",
  },
  ja: {
    noSavedAddress: "保存済み住所はまだありません",
    orders: "注文",
    updates: "更新",
    favorites: "お気に入り",
    trackOrders: "注文追跡",
    helpCenter: "ヘルプセンター",
    addressesTitle: "保存済み住所",
    paymentsTitle: "支払い方法",
    walletTitle: "ギフトカードとバウチャー",
    reservationsTitle: "予約一覧",
    useThis: "この情報を使う",
    active: "使用中",
    addAddress: "住所サンプルを追加",
    addPayment: "カードサンプルを追加",
    reschedule: "30分後へ変更",
    cancel: "予約をキャンセル",
    confirmed: "確定済み",
    waitlist: "ウェイトリスト",
    cancelled: "キャンセル済み",
    expires: "有効期限",
    noReservations: "新しい予約はまだありません",
    profileTitle: "メインプロフィール",
    activePayment: "選択中の支払い",
  },
  zh: {
    noSavedAddress: "尚未保存地址",
    orders: "订单",
    updates: "更新",
    favorites: "收藏",
    trackOrders: "订单追踪",
    helpCenter: "帮助中心",
    addressesTitle: "已保存地址",
    paymentsTitle: "支付方式",
    walletTitle: "礼品卡与代金券钱包",
    reservationsTitle: "我的预订",
    useThis: "使用此项",
    active: "当前使用",
    addAddress: "添加示例地址",
    addPayment: "添加示例卡片",
    reschedule: "顺延 30 分钟",
    cancel: "取消预订",
    confirmed: "已确认",
    waitlist: "候补名单",
    cancelled: "已取消",
    expires: "到期",
    noReservations: "暂时没有新的预订",
    profileTitle: "主要客人资料",
    activePayment: "当前支付方式",
  },
  ko: {
    noSavedAddress: "저장된 주소가 아직 없습니다",
    orders: "주문",
    updates: "업데이트",
    favorites: "즐겨찾기",
    trackOrders: "주문 추적",
    helpCenter: "도움말 센터",
    addressesTitle: "저장된 주소",
    paymentsTitle: "결제 수단",
    walletTitle: "기프트 카드 및 바우처 월렛",
    reservationsTitle: "내 예약",
    useThis: "이 정보 사용",
    active: "사용 중",
    addAddress: "샘플 주소 추가",
    addPayment: "샘플 카드 추가",
    reschedule: "30분 뒤로 변경",
    cancel: "예약 취소",
    confirmed: "확정",
    waitlist: "웨이트리스트",
    cancelled: "취소됨",
    expires: "만료",
    noReservations: "새 예약이 아직 없습니다",
    profileTitle: "대표 게스트 프로필",
    activePayment: "선택된 결제",
  },
} as const;

function shiftTimeSlot(timeSlot: string) {
  const [hours, minutes] = timeSlot.split(":").map(Number);
  const nextMinutes = hours * 60 + minutes + 30;
  const nextHours = Math.floor((nextMinutes % (24 * 60)) / 60);
  const remainder = nextMinutes % 60;

  return `${String(nextHours).padStart(2, "0")}:${String(remainder).padStart(2, "0")}`;
}

export function AccountExperience({ locale }: { locale: AppLocale }) {
  const hydrated = useHydrated();
  const feature = getFeatureLinks(locale).find((item) => item.id === "account");
  const copy = getExperienceCopy(locale);
  const labels = accountText[locale];
  const { toast } = useToast();

  const favoriteDishIds = useFavoritesStore((state) => state.favoriteDishIds);
  const selectedBranchId = useExperienceStore((state) => state.selectedBranchId);
  const serviceMode = useExperienceStore((state) => state.serviceMode);

  const fullName = useUserStore((state) => state.fullName);
  const phone = useUserStore((state) => state.phone);
  const addressLine = useUserStore((state) => state.addressLine);
  const district = useUserStore((state) => state.district);
  const city = useUserStore((state) => state.city);
  const savedAddresses = useUserStore((state) => state.savedAddresses);
  const paymentProfiles = useUserStore((state) => state.paymentProfiles);
  const giftWallet = useUserStore((state) => state.giftWallet);
  const activeAddressId = useUserStore((state) => state.activeAddressId);
  const activePaymentProfileId = useUserStore((state) => state.activePaymentProfileId);
  const setActiveAddress = useUserStore((state) => state.setActiveAddress);
  const setActivePaymentProfile = useUserStore((state) => state.setActivePaymentProfile);
  const addSavedAddress = useUserStore((state) => state.addSavedAddress);
  const addPaymentProfile = useUserStore((state) => state.addPaymentProfile);

  const reservations = useReservationStore((state) => state.reservations);
  const cancelReservation = useReservationStore((state) => state.cancelReservation);
  const updateReservation = useReservationStore((state) => state.updateReservation);

  const addItem = useCartStore((state) => state.addItem);
  const openCart = useCartStore((state) => state.openCart);

  if (!hydrated) {
    return <div className="h-[560px] animate-pulse rounded-[2rem] bg-white/5" />;
  }

  const branch = getLocalizedBranch(locale, selectedBranchId);
  const orders = getLocalizedOrders(locale);
  const notifications = getLocalizedNotifications(locale);
  const loyalty = getLoyaltySnapshot(locale);
  const activeAddress = savedAddresses.find((item) => item.id === activeAddressId) ?? savedAddresses[0];
  const activePayment = paymentProfiles.find((item) => item.id === activePaymentProfileId) ?? paymentProfiles[0];
  const sortedReservations = [...reservations].sort((left, right) =>
    `${left.date}T${left.timeSlot}`.localeCompare(`${right.date}T${right.timeSlot}`),
  );

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
              <p className="text-[0.66rem] uppercase tracking-[0.18em] text-[#cdb37d]">{labels.profileTitle}</p>
              <h2 className="mt-3 font-heading text-[2rem] leading-tight text-white">{fullName || copy.labels.accountGreeting}</h2>
              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <div className="rounded-[1.7rem] border border-white/10 bg-white/4 p-5">
                  <p className="text-sm text-[#bcae9b]">{phone || "—"}</p>
                  <p className="mt-2 text-white">{activeAddress?.addressLine || addressLine || labels.noSavedAddress}</p>
                  <p className="mt-1 text-sm text-[#bcae9b]">
                    {[activeAddress?.district || district, activeAddress?.city || city].filter(Boolean).join(" ")}
                  </p>
                </div>
                <div className="rounded-[1.7rem] border border-white/10 bg-white/4 p-5">
                  <p className="text-sm text-[#bcae9b]">{copy.labels.branch}</p>
                  <p className="mt-2 text-white">{branch.name}</p>
                  <p className="mt-1 text-sm text-[#bcae9b]">
                    {copy.serviceModes[serviceMode]} · {favoriteDishIds.length} {labels.favorites}
                  </p>
                  <p className="mt-3 text-sm text-[#ecd8a0]">
                    {labels.activePayment}: {activePayment?.label ?? "—"}
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
            </div>

            <div className="grid gap-6 xl:grid-cols-2">
              <div className="lux-panel-soft rounded-[2rem] p-6">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-[0.66rem] uppercase tracking-[0.18em] text-[#cdb37d]">{labels.addressesTitle}</p>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    className="rounded-full border-white/10 bg-white/5 text-white hover:bg-white/10"
                    onClick={() => {
                      addSavedAddress({
                        label: "Studio",
                        recipient: fullName || "Siam Lux Guest",
                        phone,
                        addressLine: "88 Sathorn Square",
                        district: "Bang Rak",
                        city: "Bangkok",
                      });
                      toast({
                        title: labels.addressesTitle,
                        description: labels.addAddress,
                        tone: "success",
                      });
                    }}
                  >
                    {labels.addAddress}
                  </Button>
                </div>
                <div className="mt-4 space-y-3">
                  {savedAddresses.map((item) => {
                    const isActive = item.id === activeAddress?.id;

                    return (
                      <div key={item.id} className="rounded-[1.5rem] border border-white/10 bg-white/4 p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-white">{item.label}</p>
                            <p className="mt-1 text-sm text-[#bcae9b]">{item.recipient}</p>
                            <p className="mt-2 text-sm text-[#d1c4b2]">{item.addressLine}</p>
                            <p className="mt-1 text-sm text-[#bcae9b]">{item.district} {item.city}</p>
                          </div>
                          <Button
                            type="button"
                            size="sm"
                            variant={isActive ? "default" : "outline"}
                            className={
                              isActive
                                ? "rounded-full bg-[#d6b26a] text-[#1b130f] hover:bg-[#e4c987]"
                                : "rounded-full border-white/10 bg-white/5 text-white hover:bg-white/10"
                            }
                            onClick={() => {
                              setActiveAddress(item.id);
                              toast({
                                title: labels.addressesTitle,
                                description: item.label,
                                tone: "success",
                              });
                            }}
                          >
                            {isActive ? labels.active : labels.useThis}
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="lux-panel-soft rounded-[2rem] p-6">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-[0.66rem] uppercase tracking-[0.18em] text-[#cdb37d]">{labels.paymentsTitle}</p>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    className="rounded-full border-white/10 bg-white/5 text-white hover:bg-white/10"
                    onClick={() => {
                      addPaymentProfile({
                        label: "Mastercard ending 2401",
                        kind: "card",
                        last4: "2401",
                      });
                      toast({
                        title: labels.paymentsTitle,
                        description: labels.addPayment,
                        tone: "success",
                      });
                    }}
                  >
                    {labels.addPayment}
                  </Button>
                </div>
                <div className="mt-4 space-y-3">
                  {paymentProfiles.map((item) => {
                    const isActive = item.id === activePayment?.id;

                    return (
                      <div key={item.id} className="rounded-[1.5rem] border border-white/10 bg-white/4 p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-3">
                            <div className="inline-flex size-10 items-center justify-center rounded-2xl bg-[#d6b26a]/10 text-[#ecd8a0]">
                              <CreditCard className="size-4" />
                            </div>
                            <div>
                              <p className="text-white">{item.label}</p>
                              <p className="mt-1 text-sm text-[#bcae9b]">{item.kind}</p>
                            </div>
                          </div>
                          <Button
                            type="button"
                            size="sm"
                            variant={isActive ? "default" : "outline"}
                            className={
                              isActive
                                ? "rounded-full bg-[#d6b26a] text-[#1b130f] hover:bg-[#e4c987]"
                                : "rounded-full border-white/10 bg-white/5 text-white hover:bg-white/10"
                            }
                            onClick={() => {
                              setActivePaymentProfile(item.id);
                              toast({
                                title: labels.paymentsTitle,
                                description: item.label,
                                tone: "success",
                              });
                            }}
                          >
                            {isActive ? labels.active : labels.useThis}
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
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

            <div className="grid gap-6 xl:grid-cols-2">
              <div className="lux-panel-soft rounded-[2rem] p-6">
                <div className="flex items-center gap-3">
                  <div className="inline-flex size-12 items-center justify-center rounded-2xl bg-[#d6b26a]/12 text-[#ecd8a0]">
                    <CalendarCheck2 className="size-5" />
                  </div>
                  <div>
                    <p className="text-[0.66rem] uppercase tracking-[0.18em] text-[#cdb37d]">{labels.reservationsTitle}</p>
                    <h2 className="mt-1 font-heading text-[1.9rem] leading-tight text-white">{sortedReservations.length}</h2>
                  </div>
                </div>
                <div className="mt-5 space-y-3">
                  {sortedReservations.length === 0 ? (
                    <div className="rounded-[1.5rem] border border-white/10 bg-white/4 p-4 text-[#d1c4b2]">
                      {labels.noReservations}
                    </div>
                  ) : (
                    sortedReservations.map((reservation) => {
                      const reservationBranch = getLocalizedBranch(locale, reservation.branchId);
                      const statusLabel =
                        reservation.status === "confirmed"
                          ? labels.confirmed
                          : reservation.status === "waitlist"
                            ? labels.waitlist
                            : labels.cancelled;

                      return (
                        <div key={reservation.id} className="rounded-[1.5rem] border border-white/10 bg-white/4 p-4">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="text-white">{reservationBranch.name}</p>
                              <p className="mt-1 text-sm text-[#bcae9b]">
                                {reservation.date} · {reservation.timeSlot} · {reservation.guestCount}
                              </p>
                            </div>
                            <span className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-[0.66rem] uppercase tracking-[0.16em] text-[#ecd8a0]">
                              {statusLabel}
                            </span>
                          </div>
                          <p className="mt-3 text-sm text-[#d1c4b2]">{reservation.notes || reservationBranch.neighborhood}</p>
                          <div className="mt-4 flex flex-wrap gap-2">
                            {reservation.status !== "cancelled" ? (
                              <Button
                                type="button"
                                size="sm"
                                variant="outline"
                                className="rounded-full border-white/10 bg-white/5 text-white hover:bg-white/10"
                                onClick={() => {
                                  updateReservation(reservation.id, { timeSlot: shiftTimeSlot(reservation.timeSlot) });
                                  toast({
                                    title: labels.reservationsTitle,
                                    description: `${reservation.date} · ${shiftTimeSlot(reservation.timeSlot)}`,
                                    tone: "success",
                                  });
                                }}
                              >
                                {labels.reschedule}
                              </Button>
                            ) : null}
                            {reservation.status !== "cancelled" ? (
                              <Button
                                type="button"
                                size="sm"
                                variant="outline"
                                className="rounded-full border-white/10 bg-white/5 text-white hover:bg-white/10"
                                onClick={() => {
                                  cancelReservation(reservation.id);
                                  toast({
                                    title: labels.reservationsTitle,
                                    description: labels.cancel,
                                    tone: "info",
                                  });
                                }}
                              >
                                {labels.cancel}
                              </Button>
                            ) : null}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              <div className="lux-panel-soft rounded-[2rem] p-6">
                <div className="flex items-center gap-3">
                  <div className="inline-flex size-12 items-center justify-center rounded-2xl bg-[#d6b26a]/12 text-[#ecd8a0]">
                    <Ticket className="size-5" />
                  </div>
                  <div>
                    <p className="text-[0.66rem] uppercase tracking-[0.18em] text-[#cdb37d]">{labels.walletTitle}</p>
                    <h2 className="mt-1 font-heading text-[1.9rem] leading-tight text-white">{giftWallet.length}</h2>
                  </div>
                </div>
                <div className="mt-5 space-y-3">
                  {giftWallet.map((item) => (
                    <div key={item.id} className="rounded-[1.5rem] border border-white/10 bg-white/4 p-4">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="text-white">{item.title}</p>
                          <p className="mt-1 text-sm text-[#bcae9b]">{item.code}</p>
                        </div>
                        <span className="font-heading text-[1.5rem] text-[#ecd8a0]">{formatPrice(item.amount, locale)}</span>
                      </div>
                      <p className="mt-3 text-sm text-[#d1c4b2]">{labels.expires}: {item.expiresAt}</p>
                    </div>
                  ))}
                </div>
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
                  <Bell className="size-4" />
                  {labels.helpCenter}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-full border-white/10 bg-white/5 text-white hover:bg-white/10"
                  render={<Link href="/reviews" locale={locale} />}
                >
                  <MapPinned className="size-4" />
                  {copy.labels.reviewsTitle}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
