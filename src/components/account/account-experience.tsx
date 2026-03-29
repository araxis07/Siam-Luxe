"use client";

import {
  Bell,
  BellRing,
  CalendarCheck2,
  Clock3,
  CreditCard,
  Crown,
  Heart,
  MapPinned,
  PackageCheck,
  ReceiptText,
  Settings2,
  ShieldCheck,
  Store,
  Ticket,
  Trash2,
} from "lucide-react";

import type { AppLocale } from "@/i18n/routing";
import { Link } from "@/i18n/navigation";
import { RecentlyViewedStrip } from "@/components/dishes/recently-viewed-strip";
import { Button } from "@/components/ui/button";
import { useHydrated } from "@/hooks/use-hydrated";
import { useToast } from "@/hooks/use-toast";
import { trackEvent } from "@/lib/analytics";
import { requestJson } from "@/lib/backend/client";
import { presentBackendNotifications, presentBackendOrders } from "@/lib/backend/order-presenter";
import { formatPrice } from "@/lib/format";
import { getRewardTierSnapshot } from "@/lib/guest-experience";
import { getAuthPanel } from "@/lib/hospitality";
import {
  getExperienceCopy,
  getFeatureLinks,
  getLocalizedBranch,
  getLocalizedNotifications,
  getLocalizedOrders,
} from "@/lib/experience";
import {
  getBillingEmailFallback,
  getGuestProfileEmailFallback,
  getInvoiceCompanyFallback,
  getLocalizedAddressLabel,
  getLocalizedPaymentLabel,
  getLocalizedWalletTitle,
  normalizeSeedGuestName,
} from "@/lib/user-display";
import { useCartStore } from "@/store/cart-store";
import { useExperienceStore } from "@/store/experience-store";
import { useFavoritesStore } from "@/store/favorites-store";
import { useMemberDataStore } from "@/store/member-data-store";
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
    walletTitle: "กระเป๋าบัตรของขวัญและบัตรกำนัล",
    reservationsTitle: "การจองของฉัน",
    useThis: "ใช้ชุดนี้",
    active: "กำลังใช้งาน",
    addAddress: "เพิ่มที่อยู่ตัวอย่าง",
    addPayment: "เพิ่มบัตรตัวอย่าง",
    reschedule: "เลื่อนเวลา +30 นาที",
    cancel: "ยกเลิกการจอง",
    confirmed: "ยืนยันแล้ว",
    waitlist: "อยู่ในรายชื่อรอ",
    cancelled: "ยกเลิกแล้ว",
    expires: "หมดอายุ",
    noReservations: "ยังไม่มีรายการจองใหม่",
    profileTitle: "ข้อมูลแขกหลัก",
    activePayment: "วิธีชำระที่เลือก",
    memberTitle: "สถานะบัญชี",
    guestMode: "โหมดแขก",
    memberMode: "สมาชิก",
    signIn: "จัดการการเข้าสู่ระบบ",
    preferencesTitle: "รสนิยมที่บันทึกไว้",
    notificationsSettings: "ค่าการแจ้งเตือน",
    invoiceTitle: "ใบเสร็จและใบกำกับภาษี",
    receiptEnabled: "ต้องการใบเสร็จ",
    taxInvoice: "ขอใบกำกับภาษี",
    defaultItem: "ตั้งเป็นค่าเริ่มต้น",
    removeItem: "ลบรายการ",
    addCalendar: "เพิ่มเข้า Calendar",
    compareBranches: "เทียบสาขา",
    pairings: "จับคู่เครื่องดื่ม",
    trustCenter: "ศูนย์ความเชื่อมั่น",
    policies: "นโยบาย",
    marketing: "โปรโมชันและแคมเปญ",
    orderUpdatesSetting: "อัปเดตสถานะออเดอร์",
    reservationReminders: "เตือนการจอง",
    loyaltyDigest: "สรุปสิทธิพิเศษ",
    occasion: "โอกาสที่ชอบ",
    spicePreference: "ระดับความเผ็ด",
    allergenNotes: "หมายเหตุด้านแพ้อาหาร",
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
    memberTitle: "Account status",
    guestMode: "Guest mode",
    memberMode: "Member",
    signIn: "Manage sign-in",
    preferencesTitle: "Saved dining preferences",
    notificationsSettings: "Notification settings",
    invoiceTitle: "Receipts & tax invoices",
    receiptEnabled: "Receipt requested",
    taxInvoice: "Request tax invoice",
    defaultItem: "Set default",
    removeItem: "Remove",
    addCalendar: "Add to calendar",
    compareBranches: "Compare branches",
    pairings: "Beverage pairings",
    trustCenter: "Trust center",
    policies: "Policies",
    marketing: "Promos and campaigns",
    orderUpdatesSetting: "Order status updates",
    reservationReminders: "Reservation reminders",
    loyaltyDigest: "Loyalty digest",
    occasion: "Favorite occasion",
    spicePreference: "Spice preference",
    allergenNotes: "Allergen notes",
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
    memberTitle: "アカウント状態",
    guestMode: "ゲストモード",
    memberMode: "会員",
    signIn: "サインイン設定",
    preferencesTitle: "保存済みの好み",
    notificationsSettings: "通知設定",
    invoiceTitle: "領収書と税務情報",
    receiptEnabled: "領収書を希望",
    taxInvoice: "税務書類を希望",
    defaultItem: "既定にする",
    removeItem: "削除",
    addCalendar: "Calendar に追加",
    compareBranches: "店舗比較",
    pairings: "ペアリング",
    trustCenter: "信頼センター",
    policies: "ポリシー",
    marketing: "プロモーション案内",
    orderUpdatesSetting: "注文状況の更新",
    reservationReminders: "予約リマインド",
    loyaltyDigest: "特典ダイジェスト",
    occasion: "よく使うシーン",
    spicePreference: "辛さの好み",
    allergenNotes: "アレルゲンメモ",
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
    memberTitle: "账户状态",
    guestMode: "游客模式",
    memberMode: "会员",
    signIn: "管理登录",
    preferencesTitle: "已保存偏好",
    notificationsSettings: "通知设置",
    invoiceTitle: "收据与发票",
    receiptEnabled: "需要收据",
    taxInvoice: "申请税务发票",
    defaultItem: "设为默认",
    removeItem: "移除",
    addCalendar: "加入 Calendar",
    compareBranches: "门店对比",
    pairings: "饮品搭配",
    trustCenter: "信任中心",
    policies: "政策说明",
    marketing: "活动与优惠",
    orderUpdatesSetting: "订单状态更新",
    reservationReminders: "预订提醒",
    loyaltyDigest: "会员摘要",
    occasion: "偏好场合",
    spicePreference: "辣度偏好",
    allergenNotes: "过敏备注",
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
    memberTitle: "계정 상태",
    guestMode: "게스트 모드",
    memberMode: "멤버",
    signIn: "로그인 관리",
    preferencesTitle: "저장된 취향",
    notificationsSettings: "알림 설정",
    invoiceTitle: "영수증 및 세금계산서",
    receiptEnabled: "영수증 요청",
    taxInvoice: "세금계산서 요청",
    defaultItem: "기본으로 설정",
    removeItem: "삭제",
    addCalendar: "Calendar에 추가",
    compareBranches: "지점 비교",
    pairings: "페어링",
    trustCenter: "트러스트 센터",
    policies: "정책 안내",
    marketing: "프로모션 및 캠페인",
    orderUpdatesSetting: "주문 상태 업데이트",
    reservationReminders: "예약 리마인드",
    loyaltyDigest: "멤버십 다이제스트",
    occasion: "선호 방문 목적",
    spicePreference: "매운맛 선호",
    allergenNotes: "알레르기 메모",
  },
} as const;

function shiftTimeSlot(timeSlot: string) {
  const [hours, minutes] = timeSlot.split(":").map(Number);
  const nextMinutes = hours * 60 + minutes + 30;
  const nextHours = Math.floor((nextMinutes % (24 * 60)) / 60);
  const remainder = nextMinutes % 60;

  return `${String(nextHours).padStart(2, "0")}:${String(remainder).padStart(2, "0")}`;
}

function buildCalendarHref({
  title,
  date,
  timeSlot,
  description,
}: {
  title: string;
  date: string;
  timeSlot: string;
  description: string;
}) {
  const start = `${date.replaceAll("-", "")}T${timeSlot.replace(":", "")}00`;
  const [hours, minutes] = timeSlot.split(":").map(Number);
  const endDate = new Date(`${date}T${timeSlot}:00`);
  endDate.setHours(hours + 2, minutes, 0, 0);
  const end = `${endDate.getFullYear()}${String(endDate.getMonth() + 1).padStart(2, "0")}${String(endDate.getDate()).padStart(2, "0")}T${String(endDate.getHours()).padStart(2, "0")}${String(endDate.getMinutes()).padStart(2, "0")}00`;
  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "BEGIN:VEVENT",
    `SUMMARY:${title}`,
    `DESCRIPTION:${description}`,
    `DTSTART:${start}`,
    `DTEND:${end}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\n");

  return `data:text/calendar;charset=utf-8,${encodeURIComponent(ics)}`;
}

export function AccountExperience({ locale }: { locale: AppLocale }) {
  const hydrated = useHydrated();
  const feature = getFeatureLinks(locale).find((item) => item.id === "account");
  const copy = getExperienceCopy(locale);
  const authPanel = getAuthPanel(locale);
  const labels = accountText[locale];
  const { toast } = useToast();

  const favoriteDishIds = useFavoritesStore((state) => state.favoriteDishIds);
  const selectedBranchId = useExperienceStore((state) => state.selectedBranchId);
  const serviceMode = useExperienceStore((state) => state.serviceMode);

  const authStatus = useUserStore((state) => state.authStatus);
  const email = useUserStore((state) => state.email);
  const fullName = useUserStore((state) => state.fullName);
  const phone = useUserStore((state) => state.phone);
  const addressLine = useUserStore((state) => state.addressLine);
  const district = useUserStore((state) => state.district);
  const city = useUserStore((state) => state.city);
  const notificationSettings = useUserStore((state) => state.notificationSettings);
  const preferences = useUserStore((state) => state.preferences);
  const invoiceProfile = useUserStore((state) => state.invoiceProfile);
  const savedAddresses = useUserStore((state) => state.savedAddresses);
  const paymentProfiles = useUserStore((state) => state.paymentProfiles);
  const giftWallet = useUserStore((state) => state.giftWallet);
  const rewardPoints = useUserStore((state) => state.rewardPoints);
  const redeemedRewards = useUserStore((state) => state.redeemedRewards);
  const activeAddressId = useUserStore((state) => state.activeAddressId);
  const activePaymentProfileId = useUserStore((state) => state.activePaymentProfileId);
  const setActiveAddress = useUserStore((state) => state.setActiveAddress);
  const setActivePaymentProfile = useUserStore((state) => state.setActivePaymentProfile);
  const updateNotificationSettings = useUserStore((state) => state.updateNotificationSettings);
  const updatePreferences = useUserStore((state) => state.updatePreferences);
  const updateInvoiceProfile = useUserStore((state) => state.updateInvoiceProfile);
  const addSavedAddress = useUserStore((state) => state.addSavedAddress);
  const setPrimaryAddress = useUserStore((state) => state.setPrimaryAddress);
  const removeSavedAddress = useUserStore((state) => state.removeSavedAddress);
  const addPaymentProfile = useUserStore((state) => state.addPaymentProfile);
  const setPrimaryPaymentProfile = useUserStore((state) => state.setPrimaryPaymentProfile);
  const removePaymentProfile = useUserStore((state) => state.removePaymentProfile);

  const reservations = useReservationStore((state) => state.reservations);
  const setReservations = useReservationStore((state) => state.setReservations);
  const cancelReservation = useReservationStore((state) => state.cancelReservation);
  const updateReservation = useReservationStore((state) => state.updateReservation);
  const memberOrders = useMemberDataStore((state) => state.orders);
  const memberNotifications = useMemberDataStore((state) => state.notifications);

  const addItem = useCartStore((state) => state.addItem);
  const openCart = useCartStore((state) => state.openCart);

  if (!hydrated) {
    return <div className="h-[560px] animate-pulse rounded-[2rem] bg-white/5" />;
  }

  const branch = getLocalizedBranch(locale, selectedBranchId);
  const orders =
    authStatus === "member"
      ? presentBackendOrders(locale, memberOrders)
      : getLocalizedOrders(locale);
  const notifications =
    authStatus === "member"
      ? presentBackendNotifications(locale, memberNotifications)
      : getLocalizedNotifications(locale);
  const loyalty = getRewardTierSnapshot(locale, rewardPoints);
  const activeAddress = savedAddresses.find((item) => item.id === activeAddressId) ?? savedAddresses[0];
  const activePayment = paymentProfiles.find((item) => item.id === activePaymentProfileId) ?? paymentProfiles[0];
  const sortedReservations = [...reservations].sort((left, right) =>
    `${left.date}T${left.timeSlot}`.localeCompare(`${right.date}T${right.timeSlot}`),
  );
  const displayName = normalizeSeedGuestName(fullName);
  const occasionLabels = {
    th: {
      casual: "มื้อทั่วไป",
      date: "เดท / ฉลองคู่",
      celebration: "ฉลองโอกาสพิเศษ",
      business: "รับรองลูกค้า",
      family: "มื้อครอบครัว",
    },
    en: {
      casual: "Casual dinner",
      date: "Date night",
      celebration: "Celebration",
      business: "Business hosting",
      family: "Family table",
    },
    ja: {
      casual: "通常利用",
      date: "デート",
      celebration: "お祝い",
      business: "接待",
      family: "家族利用",
    },
    zh: {
      casual: "日常用餐",
      date: "约会晚餐",
      celebration: "庆祝聚餐",
      business: "商务接待",
      family: "家庭聚餐",
    },
    ko: {
      casual: "일반 식사",
      date: "데이트",
      celebration: "기념일",
      business: "비즈니스 접대",
      family: "가족 식사",
    },
  } as const;
  const fallbackNotes = {
    th: "ระบุแพ้อาหารถั่วและต้องการแยกอุปกรณ์จากอาหารทะเล",
    en: "Peanut garnish avoided and shellfish handled separately where possible.",
    ja: "ピーナッツの付け合わせを避け、甲殻類は可能な範囲で分けて調理します。",
    zh: "避免花生配料，并尽量与贝壳类食材分开处理。",
    ko: "땅콩 가니시는 제외하고 해산물은 가능한 범위에서 분리 조리합니다.",
  } as const;
  const paymentKindLabels = {
    th: { cash: "เงินสด", card: "บัตรเครดิต / เดบิต", promptpay: "PromptPay" },
    en: { cash: "Cash", card: "Credit / Debit Card", promptpay: "PromptPay" },
    ja: { cash: "現金", card: "クレジット / デビットカード", promptpay: "PromptPay" },
    zh: { cash: "现金", card: "信用卡 / 借记卡", promptpay: "PromptPay" },
    ko: { cash: "현금", card: "신용 / 체크카드", promptpay: "PromptPay" },
  } as const;
  const getPaymentKindLabel = (kind: "cash" | "card" | "promptpay") => {
    if (kind === "card") return paymentKindLabels[locale].card;
    if (kind === "cash") return paymentKindLabels[locale].cash;
    return paymentKindLabels[locale].promptpay;
  };
  const accountStatusLabel = authStatus === "member" ? labels.memberMode : labels.guestMode;

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

        <RecentlyViewedStrip locale={locale} />

        <div className="grid gap-6 lg:grid-cols-[1.02fr_0.98fr]">
          <div className="space-y-6">
            <div className="lux-panel rounded-[2.2rem] p-6 sm:p-8">
              <p className="text-[0.66rem] uppercase tracking-[0.18em] text-[#cdb37d]">{labels.profileTitle}</p>
              <h2 className="mt-3 font-heading text-[2rem] leading-tight text-white">{displayName || copy.labels.accountGreeting}</h2>
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
                    {labels.activePayment}: {activePayment ? getLocalizedPaymentLabel(locale, activePayment) : "—"}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid gap-6 xl:grid-cols-2">
              <div className="lux-panel-soft rounded-[2rem] p-6">
                <div className="flex items-center gap-3">
                  <div className="inline-flex size-12 items-center justify-center rounded-2xl bg-[#d6b26a]/12 text-[#ecd8a0]">
                    <ShieldCheck className="size-5" />
                  </div>
                  <div>
                    <p className="text-[0.66rem] uppercase tracking-[0.18em] text-[#cdb37d]">{labels.memberTitle}</p>
                    <h2 className="mt-1 font-heading text-[1.9rem] leading-tight text-white">{accountStatusLabel}</h2>
                  </div>
                </div>
                <p className="mt-4 text-sm leading-7 text-[#d1c4b2]">{authPanel.body}</p>
                <div className="mt-5 rounded-[1.5rem] border border-white/10 bg-black/15 p-4">
                  <p className="text-white">{email || getGuestProfileEmailFallback(locale)}</p>
                  <p className="mt-1 text-sm text-[#bcae9b]">{authPanel.highlights[0]?.value}</p>
                </div>
                <div className="mt-5 flex flex-wrap gap-3">
                  <Button
                    type="button"
                    className="button-shine rounded-full bg-[#d6b26a] text-[#1b130f] hover:bg-[#e4c987]"
                    render={<Link href="/auth" locale={locale} />}
                  >
                    {labels.signIn}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="rounded-full border-white/10 bg-white/5 text-white hover:bg-white/10"
                    render={<Link href="/policies" locale={locale} />}
                  >
                    {labels.policies}
                  </Button>
                </div>
              </div>

              <div className="lux-panel-soft rounded-[2rem] p-6">
                <div className="flex items-center gap-3">
                  <div className="inline-flex size-12 items-center justify-center rounded-2xl bg-[#d6b26a]/12 text-[#ecd8a0]">
                    <Settings2 className="size-5" />
                  </div>
                  <div>
                    <p className="text-[0.66rem] uppercase tracking-[0.18em] text-[#cdb37d]">{labels.preferencesTitle}</p>
                    <h2 className="mt-1 font-heading text-[1.9rem] leading-tight text-white">
                      {occasionLabels[locale][preferences.favoriteOccasion]}
                    </h2>
                  </div>
                </div>
                <div className="mt-5 space-y-4">
                  <div className="rounded-[1.5rem] border border-white/10 bg-white/4 p-4">
                    <p className="text-[0.66rem] uppercase tracking-[0.18em] text-[#cdb37d]">{labels.spicePreference}</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {Array.from({ length: 6 }, (_, level) => (
                        <Button
                          key={level}
                          type="button"
                          size="sm"
                          variant={preferences.spiceLevel === level ? "default" : "outline"}
                          className={
                            preferences.spiceLevel === level
                              ? "rounded-full bg-[#d6b26a] text-[#1b130f] hover:bg-[#e4c987]"
                              : "rounded-full border-white/10 bg-white/5 text-white hover:bg-white/10"
                          }
                          onClick={() => {
                            updatePreferences({ spiceLevel: level });
                            trackEvent("preference_spice_update", { level, locale });
                          }}
                        >
                          {level}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-[1.5rem] border border-white/10 bg-white/4 p-4">
                    <p className="text-[0.66rem] uppercase tracking-[0.18em] text-[#cdb37d]">{labels.occasion}</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {(Object.entries(occasionLabels[locale]) as Array<
                        [keyof typeof occasionLabels.en, string]
                      >).map(([key, value]) => (
                        <Button
                          key={key}
                          type="button"
                          size="sm"
                          variant={preferences.favoriteOccasion === key ? "default" : "outline"}
                          className={
                            preferences.favoriteOccasion === key
                              ? "rounded-full bg-[#d6b26a] text-[#1b130f] hover:bg-[#e4c987]"
                              : "rounded-full border-white/10 bg-white/5 text-white hover:bg-white/10"
                          }
                          onClick={() => {
                            updatePreferences({ favoriteOccasion: key });
                            trackEvent("preference_occasion_update", { occasion: key, locale });
                          }}
                        >
                          {value}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-[1.5rem] border border-white/10 bg-white/4 p-4">
                    <p className="text-[0.66rem] uppercase tracking-[0.18em] text-[#cdb37d]">{labels.allergenNotes}</p>
                    <p className="mt-3 text-sm text-[#d1c4b2]">
                      {preferences.allergenNotes || fallbackNotes[locale]}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-3">
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        className="rounded-full border-white/10 bg-white/5 text-white hover:bg-white/10"
                        onClick={() => {
                          updatePreferences({
                            allergenNotes:
                              preferences.allergenNotes.length > 0
                                ? ""
                                : fallbackNotes[locale],
                          });
                          toast({
                            title: labels.preferencesTitle,
                            description: labels.allergenNotes,
                            tone: "success",
                          });
                        }}
                      >
                        {preferences.allergenNotes ? labels.removeItem : labels.defaultItem}
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        className="rounded-full border-white/10 bg-white/5 text-white hover:bg-white/10"
                        render={<Link href="/trust" locale={locale} />}
                      >
                        {labels.trustCenter}
                      </Button>
                    </div>
                  </div>
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
                    style={{ width: `${Math.min(100, (loyalty.currentPoints / Math.max(loyalty.nextThreshold, 1)) * 100)}%` }}
                  />
                </div>
                <p className="mt-3 text-sm text-[#d1c4b2]">
                  {loyalty.pointsToNext > 0
                    ? copy.labels.nextReward.replace("{points}", String(loyalty.pointsToNext))
                    : loyalty.currentTier}
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
                        label: locale === "th" ? "สตูดิโอ" : locale === "ja" ? "スタジオ" : locale === "zh" ? "工作室" : locale === "ko" ? "스튜디오" : "Studio",
                        recipient: displayName || copy.labels.accountGreeting,
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
                            <p className="text-white">{getLocalizedAddressLabel(locale, item)}</p>
                            <p className="mt-1 text-sm text-[#bcae9b]">{normalizeSeedGuestName(item.recipient) || copy.labels.accountGreeting}</p>
                            <p className="mt-2 text-sm text-[#d1c4b2]">{item.addressLine}</p>
                            <p className="mt-1 text-sm text-[#bcae9b]">{item.district} {item.city}</p>
                          </div>
                          <div className="flex flex-col items-end gap-2">
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
                            <div className="flex flex-wrap justify-end gap-2">
                              <Button
                                type="button"
                                size="sm"
                                variant="outline"
                                className="rounded-full border-white/10 bg-white/5 text-white hover:bg-white/10"
                                onClick={() => setPrimaryAddress(item.id)}
                              >
                                {item.isPrimary ? labels.active : labels.defaultItem}
                              </Button>
                              {savedAddresses.length > 1 ? (
                                <Button
                                  type="button"
                                  size="sm"
                                  variant="outline"
                                  className="rounded-full border-white/10 bg-white/5 text-white hover:bg-white/10"
                                  onClick={() => removeSavedAddress(item.id)}
                                >
                                  <Trash2 className="size-4" />
                                  {labels.removeItem}
                                </Button>
                              ) : null}
                            </div>
                          </div>
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
                        label: locale === "th" ? "Mastercard ลงท้าย 2401" : locale === "ja" ? "Mastercard 下4桁 2401" : locale === "zh" ? "Mastercard 尾号 2401" : locale === "ko" ? "Mastercard 끝자리 2401" : "Mastercard ending 2401",
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
                              <p className="text-white">{getLocalizedPaymentLabel(locale, item)}</p>
                              <p className="mt-1 text-sm text-[#bcae9b]">{getPaymentKindLabel(item.kind)}</p>
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-2">
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
                                  description: getLocalizedPaymentLabel(locale, item),
                                  tone: "success",
                                });
                              }}
                            >
                              {isActive ? labels.active : labels.useThis}
                            </Button>
                            <div className="flex flex-wrap justify-end gap-2">
                              <Button
                                type="button"
                                size="sm"
                                variant="outline"
                                className="rounded-full border-white/10 bg-white/5 text-white hover:bg-white/10"
                                onClick={() => setPrimaryPaymentProfile(item.id)}
                              >
                                {item.isPrimary ? labels.active : labels.defaultItem}
                              </Button>
                              {paymentProfiles.length > 1 ? (
                                <Button
                                  type="button"
                                  size="sm"
                                  variant="outline"
                                  className="rounded-full border-white/10 bg-white/5 text-white hover:bg-white/10"
                                  onClick={() => removePaymentProfile(item.id)}
                                >
                                  <Trash2 className="size-4" />
                                  {labels.removeItem}
                                </Button>
                              ) : null}
                            </div>
                          </div>
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
                                render={
                                  <a
                                    href={buildCalendarHref({
                                      title: reservationBranch.name,
                                      date: reservation.date,
                                      timeSlot: reservation.timeSlot,
                                      description: reservation.notes || reservationBranch.neighborhood,
                                    })}
                                    download={`${reservation.id}.ics`}
                                  />
                                }
                                onClick={() => trackEvent("reservation_add_calendar", { reservationId: reservation.id, locale })}
                              >
                                {labels.addCalendar}
                              </Button>
                            ) : null}
                            {reservation.status !== "cancelled" ? (
                              <Button
                                type="button"
                                size="sm"
                                variant="outline"
                                className="rounded-full border-white/10 bg-white/5 text-white hover:bg-white/10"
                                onClick={() => {
                                  const nextTimeSlot = shiftTimeSlot(reservation.timeSlot);

                                  if (authStatus !== "member") {
                                    updateReservation(reservation.id, { timeSlot: nextTimeSlot });
                                    toast({
                                      title: labels.reservationsTitle,
                                      description: `${reservation.date} · ${nextTimeSlot}`,
                                      tone: "success",
                                    });
                                    return;
                                  }

                                  void (async () => {
                                    try {
                                      const updated = await requestJson<typeof reservation>(`/api/reservations/${reservation.id}`, {
                                        method: "PATCH",
                                        headers: {
                                          "Content-Type": "application/json",
                                        },
                                        body: JSON.stringify({ timeSlot: nextTimeSlot }),
                                      });

                                      setReservations(
                                        reservations.map((item) =>
                                          item.id === updated.id ? updated : item,
                                        ),
                                      );
                                      toast({
                                        title: labels.reservationsTitle,
                                        description: `${updated.date} · ${updated.timeSlot}`,
                                        tone: "success",
                                      });
                                    } catch (error) {
                                      toast({
                                        title: labels.reservationsTitle,
                                        description: error instanceof Error ? error.message : labels.reschedule,
                                        tone: "error",
                                      });
                                    }
                                  })();
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
                                  if (authStatus !== "member") {
                                    cancelReservation(reservation.id);
                                    toast({
                                      title: labels.reservationsTitle,
                                      description: labels.cancel,
                                      tone: "info",
                                    });
                                    return;
                                  }

                                  void (async () => {
                                    try {
                                      const updated = await requestJson<typeof reservation>(`/api/reservations/${reservation.id}`, {
                                        method: "PATCH",
                                        headers: {
                                          "Content-Type": "application/json",
                                        },
                                        body: JSON.stringify({ status: "cancelled" }),
                                      });

                                      setReservations(
                                        reservations.map((item) =>
                                          item.id === updated.id ? updated : item,
                                        ),
                                      );
                                      toast({
                                        title: labels.reservationsTitle,
                                        description: labels.cancel,
                                        tone: "info",
                                      });
                                    } catch (error) {
                                      toast({
                                        title: labels.reservationsTitle,
                                        description: error instanceof Error ? error.message : labels.cancel,
                                        tone: "error",
                                      });
                                    }
                                  })();
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
                          <p className="text-white">{getLocalizedWalletTitle(locale, item)}</p>
                          <p className="mt-1 text-sm text-[#bcae9b]">{item.code}</p>
                        </div>
                        <span className="font-heading text-[1.5rem] text-[#ecd8a0]">{formatPrice(item.amount, locale)}</span>
                      </div>
                      <p className="mt-3 text-sm text-[#d1c4b2]">{labels.expires}: {item.expiresAt}</p>
                    </div>
                  ))}
                </div>
                {redeemedRewards.length > 0 ? (
                  <div className="mt-5 rounded-[1.5rem] border border-white/10 bg-black/15 p-4">
                    <p className="text-sm text-[#ecd8a0]">{copy.labels.loyaltyTitle}</p>
                    <p className="mt-2 text-sm text-[#d1c4b2]">{redeemedRewards[0]?.title}</p>
                  </div>
                ) : null}
                <div className="mt-5 flex flex-wrap gap-3">
                  <Button
                    type="button"
                    size="sm"
                    className="button-shine rounded-full bg-[#d6b26a] text-[#1b130f] hover:bg-[#e4c987]"
                    render={<Link href="/gift-cards" locale={locale} />}
                  >
                    {labels.walletTitle}
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    className="rounded-full border-white/10 bg-white/5 text-white hover:bg-white/10"
                    render={<Link href="/rewards" locale={locale} />}
                  >
                    {copy.labels.loyaltyTitle}
                  </Button>
                </div>
              </div>
            </div>

            <div className="grid gap-6 xl:grid-cols-2">
              <div className="lux-panel-soft rounded-[2rem] p-6">
                <div className="flex items-center gap-3">
                  <div className="inline-flex size-12 items-center justify-center rounded-2xl bg-[#d6b26a]/12 text-[#ecd8a0]">
                    <ReceiptText className="size-5" />
                  </div>
                  <div>
                    <p className="text-[0.66rem] uppercase tracking-[0.18em] text-[#cdb37d]">{labels.invoiceTitle}</p>
                    <h2 className="mt-1 font-heading text-[1.9rem] leading-tight text-white">
                      {invoiceProfile.needsReceipt ? labels.receiptEnabled : labels.guestMode}
                    </h2>
                  </div>
                </div>
                <div className="mt-5 space-y-3">
                  <div className="rounded-[1.5rem] border border-white/10 bg-white/4 p-4">
                    <p className="text-white">{invoiceProfile.email || email || getBillingEmailFallback(locale)}</p>
                    <p className="mt-1 text-sm text-[#bcae9b]">
                      {invoiceProfile.taxInvoice
                        ? invoiceProfile.companyName || getInvoiceCompanyFallback(locale)
                        : labels.receiptEnabled}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      type="button"
                      size="sm"
                      variant={invoiceProfile.needsReceipt ? "default" : "outline"}
                      className={
                        invoiceProfile.needsReceipt
                          ? "rounded-full bg-[#d6b26a] text-[#1b130f] hover:bg-[#e4c987]"
                          : "rounded-full border-white/10 bg-white/5 text-white hover:bg-white/10"
                      }
                      onClick={() => updateInvoiceProfile({ needsReceipt: !invoiceProfile.needsReceipt })}
                    >
                      {labels.receiptEnabled}
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant={invoiceProfile.taxInvoice ? "default" : "outline"}
                      className={
                        invoiceProfile.taxInvoice
                          ? "rounded-full bg-[#d6b26a] text-[#1b130f] hover:bg-[#e4c987]"
                          : "rounded-full border-white/10 bg-white/5 text-white hover:bg-white/10"
                      }
                      onClick={() =>
                        updateInvoiceProfile({
                          taxInvoice: !invoiceProfile.taxInvoice,
                          companyName: invoiceProfile.companyName || getInvoiceCompanyFallback(locale),
                          taxId: invoiceProfile.taxId || "0105559001234",
                          email: invoiceProfile.email || email || getBillingEmailFallback(locale),
                        })
                      }
                    >
                      {labels.taxInvoice}
                    </Button>
                  </div>
                </div>
              </div>

              <div className="lux-panel-soft rounded-[2rem] p-6">
                <div className="flex items-center gap-3">
                  <div className="inline-flex size-12 items-center justify-center rounded-2xl bg-[#d6b26a]/12 text-[#ecd8a0]">
                    <BellRing className="size-5" />
                  </div>
                  <div>
                    <p className="text-[0.66rem] uppercase tracking-[0.18em] text-[#cdb37d]">{labels.notificationsSettings}</p>
                    <h2 className="mt-1 font-heading text-[1.9rem] leading-tight text-white">{notifications.length}</h2>
                  </div>
                </div>
                <div className="mt-5 space-y-3">
                  {[
                    { key: "marketing", label: labels.marketing },
                    { key: "orderUpdates", label: labels.orderUpdatesSetting },
                    { key: "reservationReminders", label: labels.reservationReminders },
                    { key: "loyaltyDigest", label: labels.loyaltyDigest },
                  ].map((item) => {
                    const isActive = notificationSettings[item.key as keyof typeof notificationSettings];

                    return (
                      <div key={item.key} className="flex items-center justify-between gap-3 rounded-[1.5rem] border border-white/10 bg-white/4 p-4">
                        <span className="text-white">{item.label}</span>
                        <Button
                          type="button"
                          size="sm"
                          variant={isActive ? "default" : "outline"}
                          className={
                            isActive
                              ? "rounded-full bg-[#d6b26a] text-[#1b130f] hover:bg-[#e4c987]"
                              : "rounded-full border-white/10 bg-white/5 text-white hover:bg-white/10"
                          }
                          onClick={() =>
                            updateNotificationSettings({
                              [item.key]: !isActive,
                            } as Partial<typeof notificationSettings>)
                          }
                        >
                          {isActive ? labels.active : labels.useThis}
                        </Button>
                      </div>
                    );
                  })}
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
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-full border-white/10 bg-white/5 text-white hover:bg-white/10"
                  render={<Link href="/compare-branches" locale={locale} />}
                >
                  <Store className="size-4" />
                  {labels.compareBranches}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-full border-white/10 bg-white/5 text-white hover:bg-white/10"
                  render={<Link href="/pairings" locale={locale} />}
                >
                  <Crown className="size-4" />
                  {labels.pairings}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
