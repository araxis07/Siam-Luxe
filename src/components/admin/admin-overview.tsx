"use client";

import { CalendarCheck2, MessageSquareText, PackageCheck, Percent, RefreshCw, ShieldAlert } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import type { AppLocale } from "@/i18n/routing";
import type { BranchId } from "@/lib/experience";
import { BranchOperationsPanel } from "@/components/admin/branch-operations-panel";
import { EmailOutboxPanel } from "@/components/admin/email-outbox-panel";
import { LoyaltyOperationsPanel } from "@/components/admin/loyalty-operations-panel";
import { MenuOperationsPanel } from "@/components/admin/menu-operations-panel";
import { MenuCatalogPanel } from "@/components/admin/menu-catalog-panel";
import { TeamOperationsPanel } from "@/components/admin/team-operations-panel";
import { AutomationOperationsPanel } from "@/components/admin/automation-operations-panel";
import { AuditLogPanel } from "@/components/admin/audit-log-panel";
import { reservationTimeSlots } from "@/lib/reservation-capacity";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { requestJson } from "@/lib/backend/client";
import { formatPrice } from "@/lib/format";
import { getLocalizedBranch } from "@/lib/experience";

const orderStatusOptions = [
  "pending",
  "confirmed",
  "preparing",
  "ready",
  "dispatching",
  "arriving",
  "completed",
  "cancelled",
] as const;

const paymentStatusOptions = ["pending", "paid", "failed", "refunded"] as const;
const reservationStatusOptions = ["confirmed", "waitlist", "cancelled"] as const;
const promoKindOptions = ["percent", "amount"] as const;

const adminText = {
  th: {
    eyebrow: "หลังบ้าน",
    title: "ศูนย์ควบคุมการดำเนินงานของร้าน",
    subtitle: "จัดการคำสั่งซื้อ การจอง รีวิว และโค้ดโปรโมชั่นจากฐานข้อมูลจริงในหน้าเดียว",
    refresh: "รีเฟรชข้อมูล",
    refreshing: "กำลังรีเฟรช",
    loading: "กำลังโหลดข้อมูล",
    lockedTitle: "หน้านี้สำหรับทีมร้านเท่านั้น",
    lockedBody: "บัญชีปัจจุบันยังไม่มีสิทธิ์เป็น `admin` หรือ `staff` ใน Supabase",
    errorTitle: "ยังโหลดข้อมูลหลังบ้านไม่ได้",
    empty: "ยังไม่มีข้อมูลล่าสุด",
    orders: "คำสั่งซื้อ",
    reservations: "การจอง",
    reviews: "รีวิว",
    promos: "โปรโมชั่น",
    latestOrders: "จัดการคำสั่งซื้อ",
    latestReservations: "จัดการการจอง",
    latestReviews: "คัดกรองรีวิว",
    latestPromos: "โค้ดโปรโมชั่น",
    guest: "ผู้สั่ง",
    total: "ยอดรวม",
    placedAt: "เวลาสั่ง",
    branch: "สาขา",
    status: "สถานะ",
    paymentStatus: "สถานะชำระเงิน",
    paymentMethod: "ช่องทางชำระเงิน",
    save: "บันทึก",
    saving: "กำลังบันทึก",
    guests: "จำนวนแขก",
    seating: "โซน",
    schedule: "วันและเวลา",
    publish: "เผยแพร่",
    hide: "ซ่อน",
    rating: "คะแนน",
    locale: "ภาษา",
    createPromo: "สร้างโค้ดใหม่",
    code: "โค้ด",
    titleField: "ชื่อ",
    description: "รายละเอียด",
    minimumSubtotal: "ยอดขั้นต่ำ",
    kind: "ประเภท",
    value: "มูลค่า",
    active: "เปิดใช้งาน",
    inactive: "ปิดใช้งาน",
    toggleActive: "สลับสถานะ",
    promoCreated: "สร้างโค้ดโปรโมชันแล้ว",
    promoUpdated: "อัปเดตโปรโมชันแล้ว",
    orderUpdated: "อัปเดตคำสั่งซื้อแล้ว",
    reservationUpdated: "อัปเดตการจองแล้ว",
    reviewUpdated: "อัปเดตรีวิวแล้ว",
    loadingBody: "กำลังดึงข้อมูลล่าสุดจากระบบร้าน",
    statusLabels: {
      pending: "รอดำเนินการ",
      confirmed: "ยืนยันแล้ว",
      preparing: "กำลังเตรียม",
      ready: "พร้อมเสิร์ฟ",
      dispatching: "กำลังจัดส่ง",
      arriving: "ใกล้ถึง",
      completed: "เสร็จสมบูรณ์",
      cancelled: "ยกเลิก",
      waitlist: "คิวรอ",
      paid: "ชำระแล้ว",
      failed: "ชำระไม่สำเร็จ",
      refunded: "คืนเงินแล้ว",
      percent: "เปอร์เซ็นต์",
      amount: "จำนวนเงิน",
    },
  },
  en: {
    eyebrow: "Backoffice",
    title: "House operations control center",
    subtitle: "Manage live orders, reservations, reviews, and promo codes from one production view.",
    refresh: "Refresh",
    refreshing: "Refreshing",
    loading: "Loading data",
    lockedTitle: "This page is limited to the house team",
    lockedBody: "The current account is not marked as `admin` or `staff` in Supabase yet.",
    errorTitle: "Unable to load the admin workspace",
    empty: "No recent records yet",
    orders: "Orders",
    reservations: "Reservations",
    reviews: "Reviews",
    promos: "Promos",
    latestOrders: "Manage orders",
    latestReservations: "Manage reservations",
    latestReviews: "Moderate reviews",
    latestPromos: "Promo codes",
    guest: "Guest",
    total: "Total",
    placedAt: "Placed",
    branch: "Branch",
    status: "Status",
    paymentStatus: "Payment status",
    paymentMethod: "Payment method",
    save: "Save",
    saving: "Saving",
    guests: "Guests",
    seating: "Seating",
    schedule: "Schedule",
    publish: "Publish",
    hide: "Hide",
    rating: "Rating",
    locale: "Locale",
    createPromo: "Create promo",
    code: "Code",
    titleField: "Title",
    description: "Description",
    minimumSubtotal: "Minimum spend",
    kind: "Type",
    value: "Value",
    active: "Active",
    inactive: "Inactive",
    toggleActive: "Toggle status",
    promoCreated: "Promo code created",
    promoUpdated: "Promo updated",
    orderUpdated: "Order updated",
    reservationUpdated: "Reservation updated",
    reviewUpdated: "Review updated",
    loadingBody: "Pulling the latest operational data from the house system.",
    statusLabels: {
      pending: "Pending",
      confirmed: "Confirmed",
      preparing: "Preparing",
      ready: "Ready",
      dispatching: "Dispatching",
      arriving: "Arriving",
      completed: "Completed",
      cancelled: "Cancelled",
      waitlist: "Waitlist",
      paid: "Paid",
      failed: "Failed",
      refunded: "Refunded",
      percent: "Percent",
      amount: "Amount",
    },
  },
  ja: {
    eyebrow: "バックオフィス",
    title: "店舗運営コントロールセンター",
    subtitle: "実運用の注文、予約、レビュー、クーポンを一つの画面で管理します。",
    refresh: "再読み込み",
    refreshing: "更新中",
    loading: "データを読み込み中",
    lockedTitle: "このページは店舗チーム向けです",
    lockedBody: "現在のアカウントは Supabase 上で `admin` または `staff` に設定されていません。",
    errorTitle: "管理画面を読み込めませんでした",
    empty: "まだ最新データがありません",
    orders: "注文",
    reservations: "予約",
    reviews: "レビュー",
    promos: "クーポン",
    latestOrders: "注文管理",
    latestReservations: "予約管理",
    latestReviews: "レビュー管理",
    latestPromos: "クーポン管理",
    guest: "ゲスト",
    total: "合計",
    placedAt: "受付時刻",
    branch: "店舗",
    status: "ステータス",
    paymentStatus: "支払い状況",
    paymentMethod: "支払い方法",
    save: "保存",
    saving: "保存中",
    guests: "人数",
    seating: "席種",
    schedule: "日時",
    publish: "公開",
    hide: "非公開",
    rating: "評価",
    locale: "言語",
    createPromo: "クーポン作成",
    code: "コード",
    titleField: "名称",
    description: "説明",
    minimumSubtotal: "最低利用額",
    kind: "種別",
    value: "値",
    active: "有効",
    inactive: "無効",
    toggleActive: "状態を切替",
    promoCreated: "クーポンを作成しました",
    promoUpdated: "クーポンを更新しました",
    orderUpdated: "注文を更新しました",
    reservationUpdated: "予約を更新しました",
    reviewUpdated: "レビューを更新しました",
    loadingBody: "店舗システムから最新データを取得しています。",
    statusLabels: {
      pending: "保留",
      confirmed: "確定",
      preparing: "調理中",
      ready: "準備完了",
      dispatching: "配送中",
      arriving: "到着間近",
      completed: "完了",
      cancelled: "キャンセル",
      waitlist: "ウェイトリスト",
      paid: "支払済み",
      failed: "失敗",
      refunded: "返金済み",
      percent: "割合",
      amount: "金額",
    },
  },
  zh: {
    eyebrow: "后台",
    title: "门店运营控制台",
    subtitle: "在一个页面中管理真实订单、预约、点评与优惠码。",
    refresh: "刷新",
    refreshing: "刷新中",
    loading: "正在加载数据",
    lockedTitle: "此页面仅限门店团队使用",
    lockedBody: "当前账号尚未在 Supabase 中标记为 `admin` 或 `staff`。",
    errorTitle: "无法加载后台工作区",
    empty: "暂无最新记录",
    orders: "订单",
    reservations: "预约",
    reviews: "点评",
    promos: "优惠码",
    latestOrders: "订单管理",
    latestReservations: "预约管理",
    latestReviews: "点评审核",
    latestPromos: "优惠码管理",
    guest: "顾客",
    total: "总额",
    placedAt: "下单时间",
    branch: "门店",
    status: "状态",
    paymentStatus: "支付状态",
    paymentMethod: "支付方式",
    save: "保存",
    saving: "保存中",
    guests: "人数",
    seating: "座位区域",
    schedule: "时间安排",
    publish: "发布",
    hide: "隐藏",
    rating: "评分",
    locale: "语言",
    createPromo: "创建优惠码",
    code: "代码",
    titleField: "名称",
    description: "说明",
    minimumSubtotal: "最低消费",
    kind: "类型",
    value: "数值",
    active: "启用",
    inactive: "停用",
    toggleActive: "切换状态",
    promoCreated: "优惠码已创建",
    promoUpdated: "优惠码已更新",
    orderUpdated: "订单已更新",
    reservationUpdated: "预约已更新",
    reviewUpdated: "点评已更新",
    loadingBody: "正在从门店系统拉取最新运营数据。",
    statusLabels: {
      pending: "待处理",
      confirmed: "已确认",
      preparing: "准备中",
      ready: "已就绪",
      dispatching: "配送中",
      arriving: "即将送达",
      completed: "已完成",
      cancelled: "已取消",
      waitlist: "候补",
      paid: "已支付",
      failed: "支付失败",
      refunded: "已退款",
      percent: "百分比",
      amount: "金额",
    },
  },
  ko: {
    eyebrow: "백오피스",
    title: "매장 운영 컨트롤 센터",
    subtitle: "실제 주문, 예약, 리뷰, 프로모 코드를 한 화면에서 관리합니다.",
    refresh: "새로고침",
    refreshing: "새로고침 중",
    loading: "데이터를 불러오는 중",
    lockedTitle: "이 페이지는 매장 팀 전용입니다",
    lockedBody: "현재 계정은 Supabase에서 `admin` 또는 `staff`로 설정되어 있지 않습니다.",
    errorTitle: "관리 화면을 불러올 수 없습니다",
    empty: "최근 기록이 없습니다",
    orders: "주문",
    reservations: "예약",
    reviews: "리뷰",
    promos: "프로모션",
    latestOrders: "주문 관리",
    latestReservations: "예약 관리",
    latestReviews: "리뷰 관리",
    latestPromos: "프로모션 관리",
    guest: "고객",
    total: "합계",
    placedAt: "주문 시각",
    branch: "지점",
    status: "상태",
    paymentStatus: "결제 상태",
    paymentMethod: "결제 수단",
    save: "저장",
    saving: "저장 중",
    guests: "인원",
    seating: "좌석",
    schedule: "일정",
    publish: "게시",
    hide: "숨기기",
    rating: "평점",
    locale: "언어",
    createPromo: "프로모 생성",
    code: "코드",
    titleField: "제목",
    description: "설명",
    minimumSubtotal: "최소 금액",
    kind: "유형",
    value: "값",
    active: "활성",
    inactive: "비활성",
    toggleActive: "상태 변경",
    promoCreated: "프로모 코드가 생성되었습니다",
    promoUpdated: "프로모가 업데이트되었습니다",
    orderUpdated: "주문이 업데이트되었습니다",
    reservationUpdated: "예약이 업데이트되었습니다",
    reviewUpdated: "리뷰가 업데이트되었습니다",
    loadingBody: "매장 시스템에서 최신 운영 데이터를 불러오고 있습니다.",
    statusLabels: {
      pending: "대기",
      confirmed: "확정",
      preparing: "준비 중",
      ready: "준비 완료",
      dispatching: "배송 중",
      arriving: "도착 임박",
      completed: "완료",
      cancelled: "취소",
      waitlist: "대기 명단",
      paid: "결제 완료",
      failed: "결제 실패",
      refunded: "환불 완료",
      percent: "비율",
      amount: "금액",
    },
  },
} as const;

type AdminOverviewPayload = {
  counts: {
    orders: number;
    reservations: number;
    reviews: number;
  };
  latestOrders: Array<{
    id: string;
    code: string;
    branch_id: string;
    status: string;
    created_at: string;
    total: number;
  }>;
  latestReservations: Array<{
    id: string;
    branch_id: string;
    reservation_date: string;
    time_slot: string;
    status: string;
    contact_name: string;
  }>;
  latestReviews: Array<{
    id: string;
    dish_id: string;
    guest: string;
    rating: number;
    created_at: string;
  }>;
};

type AdminOrder = {
  id: string;
  code: string;
  branch_id: string;
  service_mode: string;
  status: string;
  payment_status: string;
  payment_method: string;
  total: number;
  created_at: string;
  contact_name: string;
  phone: string;
  cancel_reason: string;
  staff_note: string;
  kitchen_note: string;
  dispatch_note: string;
  refunded_amount: number;
  order_items?: Array<{
    id: string;
    dish_name: string;
    quantity: number;
  }>;
};

type AdminReservation = {
  id: string;
  branch_id: string;
  reservation_date: string;
  time_slot: string;
  seating: string;
  occasion: string;
  contact_name: string;
  phone: string;
  guest_count: number;
  status: string;
  notes: string;
  internal_note: string;
  table_assignment: string;
  checked_in_at: string | null;
  no_show_at: string | null;
  created_at: string;
};

type AdminReview = {
  id: string;
  dish_id: string;
  guest: string;
  region: string;
  rating: number;
  body: string;
  locale: string;
  is_published: boolean;
  created_at: string;
};

type AdminPromo = {
  code: string;
  title: string;
  description: string;
  minimum_subtotal: number;
  kind: "percent" | "amount";
  value: number;
  is_active: boolean;
};

type OrderDraft = {
  status: string;
  paymentStatus: string;
  cancelReason: string;
  staffNote: string;
  kitchenNote: string;
  dispatchNote: string;
  refundedAmount: string;
};

type ReservationDraft = {
  timeSlot: string;
  status: string;
  tableAssignment: string;
  internalNote: string;
  markCheckedIn: boolean;
  markNoShow: boolean;
};

const opsText = {
  th: {
    cancelReason: "เหตุผลการยกเลิก",
    staffNote: "หมายเหตุทีมบริการ",
    kitchenNote: "หมายเหตุครัว",
    dispatchNote: "หมายเหตุจัดส่ง",
    refundedAmount: "ยอดคืนเงิน",
    tableAssignment: "โต๊ะ / โซนจริง",
    internalNote: "หมายเหตุภายใน",
    checkIn: "เช็กอินแล้ว",
    noShow: "ทำเครื่องหมาย no-show",
  },
  en: {
    cancelReason: "Cancel reason",
    staffNote: "Staff note",
    kitchenNote: "Kitchen note",
    dispatchNote: "Dispatch note",
    refundedAmount: "Refunded amount",
    tableAssignment: "Table assignment",
    internalNote: "Internal note",
    checkIn: "Checked in",
    noShow: "Mark no-show",
  },
  ja: {
    cancelReason: "キャンセル理由",
    staffNote: "サービスメモ",
    kitchenNote: "厨房メモ",
    dispatchNote: "配送メモ",
    refundedAmount: "返金額",
    tableAssignment: "テーブル割当",
    internalNote: "内部メモ",
    checkIn: "来店済み",
    noShow: "no-show にする",
  },
  zh: {
    cancelReason: "取消原因",
    staffNote: "服务备注",
    kitchenNote: "后厨备注",
    dispatchNote: "配送备注",
    refundedAmount: "退款金额",
    tableAssignment: "桌位分配",
    internalNote: "内部备注",
    checkIn: "已到店",
    noShow: "标记 no-show",
  },
  ko: {
    cancelReason: "취소 사유",
    staffNote: "서비스 메모",
    kitchenNote: "주방 메모",
    dispatchNote: "배송 메모",
    refundedAmount: "환불 금액",
    tableAssignment: "테이블 배정",
    internalNote: "내부 메모",
    checkIn: "체크인 완료",
    noShow: "no-show 표시",
  },
} as const;

function formatDateLabel(locale: AppLocale, value: string) {
  try {
    return new Intl.DateTimeFormat(locale, {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(value));
  } catch {
    return value;
  }
}

function branchName(locale: AppLocale, branchId: string) {
  return getLocalizedBranch(locale, branchId as BranchId).name;
}

export function AdminOverview({ locale }: { locale: AppLocale }) {
  const text = adminText[locale];
  const ops = opsText[locale];
  const { toast } = useToast();
  const [overview, setOverview] = useState<AdminOverviewPayload | null>(null);
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [reservations, setReservations] = useState<AdminReservation[]>([]);
  const [reviews, setReviews] = useState<AdminReview[]>([]);
  const [promos, setPromos] = useState<AdminPromo[]>([]);
  const [orderDrafts, setOrderDrafts] = useState<Record<string, OrderDraft>>({});
  const [reservationDrafts, setReservationDrafts] = useState<Record<string, ReservationDraft>>({});
  const [errorState, setErrorState] = useState<"forbidden" | "error" | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [actionKey, setActionKey] = useState("");
  const [promoForm, setPromoForm] = useState({
    code: "",
    title: "",
    description: "",
    minimumSubtotal: "900",
    kind: "amount" as "percent" | "amount",
    value: "120",
  });

  const summaryCards = useMemo(
    () => [
      { id: "orders", icon: PackageCheck, value: overview?.counts.orders ?? 0, label: text.orders },
      { id: "reservations", icon: CalendarCheck2, value: overview?.counts.reservations ?? 0, label: text.reservations },
      { id: "reviews", icon: MessageSquareText, value: overview?.counts.reviews ?? 0, label: text.reviews },
      { id: "promos", icon: Percent, value: promos.length, label: text.promos },
    ],
    [overview, promos.length, text.orders, text.promos, text.reservations, text.reviews],
  );

  const loadAdminData = async () => {
    const overviewResponse = await fetch("/api/admin/overview", {
      method: "GET",
      cache: "no-store",
    });

    if (overviewResponse.status === 401 || overviewResponse.status === 403) {
      setErrorState("forbidden");
      setOverview(null);
      setOrders([]);
      setReservations([]);
      setReviews([]);
      setPromos([]);
      return;
    }

    if (!overviewResponse.ok) {
      const fallback = await overviewResponse.text();
      throw new Error(fallback || text.errorTitle);
    }

    const nextOverview = (await overviewResponse.json()) as AdminOverviewPayload;
    const [nextOrders, nextReservations, nextReviews, nextPromos] = await Promise.all([
      requestJson<AdminOrder[]>("/api/admin/orders", { method: "GET", cache: "no-store" }),
      requestJson<AdminReservation[]>("/api/admin/reservations", { method: "GET", cache: "no-store" }),
      requestJson<AdminReview[]>("/api/admin/reviews", { method: "GET", cache: "no-store" }),
      requestJson<AdminPromo[]>("/api/admin/promos", { method: "GET", cache: "no-store" }),
    ]);

    setOverview(nextOverview);
    setOrders(nextOrders);
    setReservations(nextReservations);
    setReviews(nextReviews);
    setPromos(nextPromos);
    setOrderDrafts((current) => {
      const nextDrafts = { ...current };

      nextOrders.forEach((item) => {
        nextDrafts[item.id] = {
          status: current[item.id]?.status ?? item.status,
          paymentStatus: current[item.id]?.paymentStatus ?? item.payment_status,
          cancelReason: current[item.id]?.cancelReason ?? item.cancel_reason ?? "",
          staffNote: current[item.id]?.staffNote ?? item.staff_note ?? "",
          kitchenNote: current[item.id]?.kitchenNote ?? item.kitchen_note ?? "",
          dispatchNote: current[item.id]?.dispatchNote ?? item.dispatch_note ?? "",
          refundedAmount: current[item.id]?.refundedAmount ?? String(item.refunded_amount ?? 0),
        };
      });

      return nextDrafts;
    });
    setReservationDrafts((current) => {
      const nextDrafts = { ...current };

      nextReservations.forEach((item) => {
        nextDrafts[item.id] = {
          timeSlot: current[item.id]?.timeSlot ?? item.time_slot,
          status: current[item.id]?.status ?? item.status,
          tableAssignment: current[item.id]?.tableAssignment ?? item.table_assignment ?? "",
          internalNote: current[item.id]?.internalNote ?? item.internal_note ?? "",
          markCheckedIn: current[item.id]?.markCheckedIn ?? Boolean(item.checked_in_at),
          markNoShow: current[item.id]?.markNoShow ?? Boolean(item.no_show_at),
        };
      });

      return nextDrafts;
    });
    setErrorState(null);
    setErrorMessage("");
  };

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      setIsLoading(true);

      try {
        await loadAdminData();
      } catch (error) {
        if (!cancelled) {
          setErrorState("error");
          setErrorMessage(error instanceof Error ? error.message : text.errorTitle);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    void run();

    return () => {
      cancelled = true;
    };
  }, [text.errorTitle]);

  const refresh = async () => {
    setIsRefreshing(true);

    try {
      await loadAdminData();
    } catch (error) {
      setErrorState("error");
      setErrorMessage(error instanceof Error ? error.message : text.errorTitle);
    } finally {
      setIsRefreshing(false);
    }
  };

  const updateOrder = async (orderId: string) => {
    const draft = orderDrafts[orderId];

    if (!draft) {
      return;
    }

    setActionKey(`order:${orderId}`);

    try {
      const updated = await requestJson<AdminOrder>(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: draft.status,
          paymentStatus: draft.paymentStatus,
          cancelReason: draft.cancelReason,
          staffNote: draft.staffNote,
          kitchenNote: draft.kitchenNote,
          dispatchNote: draft.dispatchNote,
          refundedAmount: Number(draft.refundedAmount || 0),
        }),
      });

      setOrders((current) => current.map((item) => (item.id === orderId ? { ...item, ...updated } : item)));
      setOrderDrafts((current) => ({
        ...current,
        [orderId]: {
          status: updated.status,
          paymentStatus: updated.payment_status,
          cancelReason: updated.cancel_reason ?? "",
          staffNote: updated.staff_note ?? "",
          kitchenNote: updated.kitchen_note ?? "",
          dispatchNote: updated.dispatch_note ?? "",
          refundedAmount: String(updated.refunded_amount ?? 0),
        },
      }));
      toast({
        title: text.orderUpdated,
        description: `${updated.code} · ${text.statusLabels[updated.status as keyof typeof text.statusLabels] ?? updated.status}`,
        tone: "success",
      });
    } catch (error) {
      toast({
        title: text.errorTitle,
        description: error instanceof Error ? error.message : text.errorTitle,
        tone: "error",
      });
    } finally {
      setActionKey("");
    }
  };

  const updateReservation = async (reservationId: string) => {
    const draft = reservationDrafts[reservationId];

    if (!draft) {
      return;
    }

    setActionKey(`reservation:${reservationId}`);

    try {
      const updated = await requestJson<AdminReservation>(`/api/admin/reservations/${reservationId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          timeSlot: draft.timeSlot,
          status: draft.status,
          tableAssignment: draft.tableAssignment,
          internalNote: draft.internalNote,
          markCheckedIn: draft.markCheckedIn,
          markNoShow: draft.markNoShow,
        }),
      });

      setReservations((current) =>
        current.map((item) => (item.id === reservationId ? { ...item, ...updated } : item)),
      );
      setReservationDrafts((current) => ({
        ...current,
        [reservationId]: {
          timeSlot: updated.time_slot,
          status: updated.status,
          tableAssignment: updated.table_assignment ?? "",
          internalNote: updated.internal_note ?? "",
          markCheckedIn: Boolean(updated.checked_in_at),
          markNoShow: Boolean(updated.no_show_at),
        },
      }));
      toast({
        title: text.reservationUpdated,
        description: `${updated.contact_name} · ${text.statusLabels[updated.status as keyof typeof text.statusLabels] ?? updated.status}`,
        tone: "success",
      });
    } catch (error) {
      toast({
        title: text.errorTitle,
        description: error instanceof Error ? error.message : text.errorTitle,
        tone: "error",
      });
    } finally {
      setActionKey("");
    }
  };

  const toggleReview = async (reviewId: string, isPublished: boolean) => {
    setActionKey(`review:${reviewId}`);

    try {
      const updated = await requestJson<AdminReview>(`/api/admin/reviews/${reviewId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          isPublished,
        }),
      });

      setReviews((current) => current.map((item) => (item.id === reviewId ? { ...item, ...updated } : item)));
      toast({
        title: text.reviewUpdated,
        description: `${updated.guest} · ${updated.rating}/5`,
        tone: "success",
      });
    } catch (error) {
      toast({
        title: text.errorTitle,
        description: error instanceof Error ? error.message : text.errorTitle,
        tone: "error",
      });
    } finally {
      setActionKey("");
    }
  };

  const createPromo = async () => {
    setActionKey("promo:create");

    try {
      const created = await requestJson<AdminPromo>("/api/admin/promos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code: promoForm.code,
          title: promoForm.title,
          description: promoForm.description,
          minimumSubtotal: Number(promoForm.minimumSubtotal || 0),
          kind: promoForm.kind,
          value: Number(promoForm.value || 0),
          isActive: true,
        }),
      });

      setPromos((current) => [...current.filter((item) => item.code !== created.code), created].sort((a, b) => a.code.localeCompare(b.code)));
      setPromoForm({
        code: "",
        title: "",
        description: "",
        minimumSubtotal: "900",
        kind: "amount",
        value: "120",
      });
      toast({
        title: text.promoCreated,
        description: created.code,
        tone: "success",
      });
    } catch (error) {
      toast({
        title: text.errorTitle,
        description: error instanceof Error ? error.message : text.errorTitle,
        tone: "error",
      });
    } finally {
      setActionKey("");
    }
  };

  const togglePromo = async (promo: AdminPromo) => {
    setActionKey(`promo:${promo.code}`);

    try {
      const updated = await requestJson<AdminPromo>(`/api/admin/promos/${promo.code}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          isActive: !promo.is_active,
        }),
      });

      setPromos((current) => current.map((item) => (item.code === promo.code ? { ...item, ...updated } : item)));
      toast({
        title: text.promoUpdated,
        description: `${updated.code} · ${updated.is_active ? text.active : text.inactive}`,
        tone: "success",
      });
    } catch (error) {
      toast({
        title: text.errorTitle,
        description: error instanceof Error ? error.message : text.errorTitle,
        tone: "error",
      });
    } finally {
      setActionKey("");
    }
  };

  if (errorState === "forbidden") {
    return (
      <section className="scene-section px-4 pt-10 pb-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="lux-panel rounded-[2.25rem] px-6 py-16 text-center sm:px-10">
            <ShieldAlert className="mx-auto size-14 text-[#d6b26a]" />
            <p className="mt-5 text-[0.66rem] uppercase tracking-[0.18em] text-[#cdb37d]">{text.eyebrow}</p>
            <h1 className="mt-3 font-heading text-[2.3rem] leading-tight text-white sm:text-[2.8rem]">{text.lockedTitle}</h1>
            <p className="mx-auto mt-4 max-w-2xl text-[#d1c4b2]">{text.lockedBody}</p>
          </div>
        </div>
      </section>
    );
  }

  if (isLoading) {
    return (
      <section className="scene-section px-4 pt-10 pb-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="lux-panel rounded-[2.25rem] px-6 py-16 text-center sm:px-10">
            <RefreshCw className="mx-auto size-12 animate-spin text-[#d6b26a]" />
            <p className="mt-5 text-[0.66rem] uppercase tracking-[0.18em] text-[#cdb37d]">{text.eyebrow}</p>
            <h1 className="mt-3 font-heading text-[2.3rem] leading-tight text-white sm:text-[2.8rem]">{text.loading}</h1>
            <p className="mx-auto mt-4 max-w-2xl text-[#d1c4b2]">{text.loadingBody}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="scene-section px-4 pt-10 pb-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-3xl">
            <p className="text-[0.66rem] uppercase tracking-[0.18em] text-[#cdb37d]">{text.eyebrow}</p>
            <h1 className="mt-3 font-heading text-[2.7rem] leading-tight text-white sm:text-[3.1rem]">{text.title}</h1>
            <p className="mt-4 text-[0.98rem] leading-8 text-[#d1c4b2]">{text.subtitle}</p>
          </div>
          <Button
            type="button"
            variant="outline"
            className="rounded-full border-white/10 bg-white/5 text-white hover:bg-white/10"
            onClick={() => {
              void refresh();
            }}
            disabled={isRefreshing}
          >
            <RefreshCw className={`size-4 ${isRefreshing ? "animate-spin" : ""}`} />
            {isRefreshing ? text.refreshing : text.refresh}
          </Button>
        </div>

        {errorState === "error" ? (
          <div className="rounded-[1.8rem] border border-[#a33]/30 bg-[#7d1f24]/15 px-5 py-4 text-[#f3d0cb]">
            <p className="font-medium">{text.errorTitle}</p>
            <p className="mt-2 text-sm">{errorMessage || text.errorTitle}</p>
          </div>
        ) : null}

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {summaryCards.map((item) => {
            const Icon = item.icon;

            return (
              <div key={item.id} className="lux-panel rounded-[2rem] p-6">
                <div className="inline-flex size-12 items-center justify-center rounded-2xl bg-[#d6b26a]/12 text-[#ecd8a0]">
                  <Icon className="size-5" />
                </div>
                <p className="mt-4 text-[0.66rem] uppercase tracking-[0.18em] text-[#cdb37d]">{item.label}</p>
                <p className="mt-2 font-heading text-[2.4rem] text-white">{item.value}</p>
              </div>
            );
          })}
        </div>

        <div className="grid gap-6 xl:grid-cols-2">
          <div className="lux-panel-soft rounded-[2rem] p-6">
            <div className="flex items-center justify-between gap-3">
              <p className="text-[0.66rem] uppercase tracking-[0.18em] text-[#cdb37d]">{text.latestOrders}</p>
              <span className="text-sm text-[#bcae9b]">{orders.length}</span>
            </div>
            <div className="mt-4 space-y-4">
              {orders.length === 0 ? (
                <p className="rounded-[1.4rem] border border-white/10 bg-white/4 px-4 py-4 text-sm text-[#d1c4b2]">{text.empty}</p>
              ) : (
                orders.map((item) => {
                  const draft = orderDrafts[item.id] ?? {
                    status: item.status,
                    paymentStatus: item.payment_status,
                    cancelReason: item.cancel_reason ?? "",
                    staffNote: item.staff_note ?? "",
                    kitchenNote: item.kitchen_note ?? "",
                    dispatchNote: item.dispatch_note ?? "",
                    refundedAmount: String(item.refunded_amount ?? 0),
                  };

                  return (
                    <div key={item.id} className="rounded-[1.6rem] border border-white/10 bg-white/4 p-4">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="font-medium text-white">{item.code}</p>
                          <p className="mt-1 text-sm text-[#bcae9b]">
                            {branchName(locale, item.branch_id)} · {item.contact_name}
                          </p>
                          <p className="mt-1 text-sm text-[#d1c4b2]">
                            {text.placedAt}: {formatDateLabel(locale, item.created_at)}
                          </p>
                        </div>
                        <p className="text-sm text-[#ecd8a0]">{formatPrice(Number(item.total ?? 0), locale)}</p>
                      </div>

                      {item.order_items && item.order_items.length > 0 ? (
                        <p className="mt-3 text-sm text-[#d1c4b2]">
                          {item.order_items.map((orderItem) => `${orderItem.quantity}x ${orderItem.dish_name}`).join(" · ")}
                        </p>
                      ) : null}

                      <div className="mt-4 grid gap-3 lg:grid-cols-[1fr_1fr_auto]">
                        <div className="space-y-2">
                          <Label className="text-[#d9ccbb]">{text.status}</Label>
                          <Select
                            value={draft.status}
                            onValueChange={(value) => {
                              if (!value) {
                                return;
                              }

                              setOrderDrafts((current) => ({
                                ...current,
                                [item.id]: {
                                  status: value,
                                  paymentStatus: current[item.id]?.paymentStatus ?? draft.paymentStatus,
                                  cancelReason: current[item.id]?.cancelReason ?? draft.cancelReason,
                                  staffNote: current[item.id]?.staffNote ?? draft.staffNote,
                                  kitchenNote: current[item.id]?.kitchenNote ?? draft.kitchenNote,
                                  dispatchNote: current[item.id]?.dispatchNote ?? draft.dispatchNote,
                                  refundedAmount: current[item.id]?.refundedAmount ?? draft.refundedAmount,
                                },
                              }));
                            }}
                          >
                            <SelectTrigger className="h-11 w-full rounded-2xl border-white/10 bg-white/4 px-4 text-white">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="rounded-2xl border-white/10 bg-[#120d0d]/96 text-white">
                              {orderStatusOptions.map((status) => (
                                <SelectItem key={status} value={status}>
                                  {text.statusLabels[status]}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label className="text-[#d9ccbb]">{text.paymentStatus}</Label>
                          <Select
                            value={draft.paymentStatus}
                            onValueChange={(value) => {
                              if (!value) {
                                return;
                              }

                              setOrderDrafts((current) => ({
                                ...current,
                                [item.id]: {
                                  status: current[item.id]?.status ?? draft.status,
                                  paymentStatus: value,
                                  cancelReason: current[item.id]?.cancelReason ?? draft.cancelReason,
                                  staffNote: current[item.id]?.staffNote ?? draft.staffNote,
                                  kitchenNote: current[item.id]?.kitchenNote ?? draft.kitchenNote,
                                  dispatchNote: current[item.id]?.dispatchNote ?? draft.dispatchNote,
                                  refundedAmount: current[item.id]?.refundedAmount ?? draft.refundedAmount,
                                },
                              }));
                            }}
                          >
                            <SelectTrigger className="h-11 w-full rounded-2xl border-white/10 bg-white/4 px-4 text-white">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="rounded-2xl border-white/10 bg-[#120d0d]/96 text-white">
                              {paymentStatusOptions.map((status) => (
                                <SelectItem key={status} value={status}>
                                  {text.statusLabels[status]}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <Button
                          type="button"
                          className="button-shine self-end rounded-full bg-[#d6b26a] px-5 text-[#1b130f] hover:bg-[#e4c987]"
                          disabled={actionKey === `order:${item.id}`}
                          onClick={() => {
                            void updateOrder(item.id);
                          }}
                        >
                          {actionKey === `order:${item.id}` ? text.saving : text.save}
                        </Button>
                      </div>

                      <div className="mt-4 grid gap-3 lg:grid-cols-2">
                        <div className="space-y-2">
                          <Label className="text-[#d9ccbb]">{ops.refundedAmount}</Label>
                          <Input
                            value={draft.refundedAmount}
                            onChange={(event) => {
                              const nextValue = event.target.value;
                              setOrderDrafts((current) => ({
                                ...current,
                                [item.id]: {
                                  ...draft,
                                  ...current[item.id],
                                  refundedAmount: nextValue,
                                },
                              }));
                            }}
                            className="h-11 rounded-2xl border-white/10 bg-white/4 px-4 text-white"
                            inputMode="decimal"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label className="text-[#d9ccbb]">{ops.cancelReason}</Label>
                          <Input
                            value={draft.cancelReason}
                            onChange={(event) => {
                              const nextValue = event.target.value;
                              setOrderDrafts((current) => ({
                                ...current,
                                [item.id]: {
                                  ...draft,
                                  ...current[item.id],
                                  cancelReason: nextValue,
                                },
                              }));
                            }}
                            className="h-11 rounded-2xl border-white/10 bg-white/4 px-4 text-white"
                          />
                        </div>
                      </div>

                      <div className="mt-4 grid gap-3 lg:grid-cols-3">
                        <div className="space-y-2">
                          <Label className="text-[#d9ccbb]">{ops.staffNote}</Label>
                          <Textarea
                            value={draft.staffNote}
                            onChange={(event) => {
                              const nextValue = event.target.value;
                              setOrderDrafts((current) => ({
                                ...current,
                                [item.id]: {
                                  ...draft,
                                  ...current[item.id],
                                  staffNote: nextValue,
                                },
                              }));
                            }}
                            className="min-h-[6rem] rounded-[1.5rem] border-white/10 bg-white/4 px-4 py-3 text-white"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label className="text-[#d9ccbb]">{ops.kitchenNote}</Label>
                          <Textarea
                            value={draft.kitchenNote}
                            onChange={(event) => {
                              const nextValue = event.target.value;
                              setOrderDrafts((current) => ({
                                ...current,
                                [item.id]: {
                                  ...draft,
                                  ...current[item.id],
                                  kitchenNote: nextValue,
                                },
                              }));
                            }}
                            className="min-h-[6rem] rounded-[1.5rem] border-white/10 bg-white/4 px-4 py-3 text-white"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label className="text-[#d9ccbb]">{ops.dispatchNote}</Label>
                          <Textarea
                            value={draft.dispatchNote}
                            onChange={(event) => {
                              const nextValue = event.target.value;
                              setOrderDrafts((current) => ({
                                ...current,
                                [item.id]: {
                                  ...draft,
                                  ...current[item.id],
                                  dispatchNote: nextValue,
                                },
                              }));
                            }}
                            className="min-h-[6rem] rounded-[1.5rem] border-white/10 bg-white/4 px-4 py-3 text-white"
                          />
                        </div>
                      </div>

                      <div className="mt-4 flex justify-end">
                        <Button
                          type="button"
                          className="button-shine rounded-full bg-[#d6b26a] px-5 text-[#1b130f] hover:bg-[#e4c987]"
                          disabled={actionKey === `order:${item.id}`}
                          onClick={() => {
                            void updateOrder(item.id);
                          }}
                        >
                          {actionKey === `order:${item.id}` ? text.saving : text.save}
                        </Button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <div className="lux-panel-soft rounded-[2rem] p-6">
            <div className="flex items-center justify-between gap-3">
              <p className="text-[0.66rem] uppercase tracking-[0.18em] text-[#cdb37d]">{text.latestReservations}</p>
              <span className="text-sm text-[#bcae9b]">{reservations.length}</span>
            </div>
            <div className="mt-4 space-y-4">
              {reservations.length === 0 ? (
                <p className="rounded-[1.4rem] border border-white/10 bg-white/4 px-4 py-4 text-sm text-[#d1c4b2]">{text.empty}</p>
              ) : (
                reservations.map((item) => {
                  const draft = reservationDrafts[item.id] ?? {
                    timeSlot: item.time_slot,
                    status: item.status,
                    tableAssignment: item.table_assignment ?? "",
                    internalNote: item.internal_note ?? "",
                    markCheckedIn: Boolean(item.checked_in_at),
                    markNoShow: Boolean(item.no_show_at),
                  };

                  return (
                    <div key={item.id} className="rounded-[1.6rem] border border-white/10 bg-white/4 p-4">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <p className="font-medium text-white">{item.contact_name}</p>
                          <p className="mt-1 text-sm text-[#bcae9b]">{branchName(locale, item.branch_id)}</p>
                          <p className="mt-2 text-sm text-[#d1c4b2]">
                            {item.reservation_date} · {item.time_slot} · {item.guest_count} {text.guests}
                          </p>
                          <p className="mt-1 text-sm text-[#bcae9b]">
                            {text.seating}: {item.seating} · {item.occasion}
                          </p>
                        </div>
                        <p className="text-sm text-[#ecd8a0]">{text.statusLabels[item.status as keyof typeof text.statusLabels] ?? item.status}</p>
                      </div>

                      <div className="mt-4 grid gap-3 lg:grid-cols-[1fr_1fr_auto]">
                        <div className="space-y-2">
                          <Label className="text-[#d9ccbb]">{text.schedule}</Label>
                          <Select
                            value={draft.timeSlot}
                            onValueChange={(value) => {
                              if (!value) {
                                return;
                              }

                              setReservationDrafts((current) => ({
                                ...current,
                                [item.id]: {
                                  timeSlot: value,
                                  status: current[item.id]?.status ?? draft.status,
                                  tableAssignment: current[item.id]?.tableAssignment ?? draft.tableAssignment,
                                  internalNote: current[item.id]?.internalNote ?? draft.internalNote,
                                  markCheckedIn: current[item.id]?.markCheckedIn ?? draft.markCheckedIn,
                                  markNoShow: current[item.id]?.markNoShow ?? draft.markNoShow,
                                },
                              }));
                            }}
                          >
                            <SelectTrigger className="h-11 w-full rounded-2xl border-white/10 bg-white/4 px-4 text-white">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="rounded-2xl border-white/10 bg-[#120d0d]/96 text-white">
                              {reservationTimeSlots.map((slot) => (
                                <SelectItem key={slot} value={slot}>
                                  {slot}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label className="text-[#d9ccbb]">{text.status}</Label>
                          <Select
                            value={draft.status}
                            onValueChange={(value) => {
                              if (!value) {
                                return;
                              }

                              setReservationDrafts((current) => ({
                                ...current,
                                [item.id]: {
                                  timeSlot: current[item.id]?.timeSlot ?? draft.timeSlot,
                                  status: value,
                                  tableAssignment: current[item.id]?.tableAssignment ?? draft.tableAssignment,
                                  internalNote: current[item.id]?.internalNote ?? draft.internalNote,
                                  markCheckedIn: current[item.id]?.markCheckedIn ?? draft.markCheckedIn,
                                  markNoShow: current[item.id]?.markNoShow ?? draft.markNoShow,
                                },
                              }));
                            }}
                          >
                            <SelectTrigger className="h-11 w-full rounded-2xl border-white/10 bg-white/4 px-4 text-white">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="rounded-2xl border-white/10 bg-[#120d0d]/96 text-white">
                              {reservationStatusOptions.map((status) => (
                                <SelectItem key={status} value={status}>
                                  {text.statusLabels[status]}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <Button
                          type="button"
                          className="button-shine self-end rounded-full bg-[#d6b26a] px-5 text-[#1b130f] hover:bg-[#e4c987]"
                          disabled={actionKey === `reservation:${item.id}`}
                          onClick={() => {
                            void updateReservation(item.id);
                          }}
                        >
                          {actionKey === `reservation:${item.id}` ? text.saving : text.save}
                        </Button>
                      </div>

                      <div className="mt-4 grid gap-3 lg:grid-cols-2">
                        <div className="space-y-2">
                          <Label className="text-[#d9ccbb]">{ops.tableAssignment}</Label>
                          <Input
                            value={draft.tableAssignment}
                            onChange={(event) => {
                              const nextValue = event.target.value;
                              setReservationDrafts((current) => ({
                                ...current,
                                [item.id]: {
                                  ...draft,
                                  ...current[item.id],
                                  tableAssignment: nextValue,
                                },
                              }));
                            }}
                            className="h-11 rounded-2xl border-white/10 bg-white/4 px-4 text-white"
                          />
                        </div>

                        <div className="flex flex-wrap items-end gap-2">
                          <Button
                            type="button"
                            variant={draft.markCheckedIn ? "default" : "outline"}
                            className={
                              draft.markCheckedIn
                                ? "button-shine rounded-full bg-[#d6b26a] px-4 text-[#1b130f] hover:bg-[#e4c987]"
                                : "rounded-full border-white/10 bg-white/5 text-white hover:bg-white/10"
                            }
                            onClick={() => {
                              setReservationDrafts((current) => ({
                                ...current,
                                [item.id]: {
                                  ...draft,
                                  ...current[item.id],
                                  markCheckedIn: !draft.markCheckedIn,
                                },
                              }));
                            }}
                          >
                            {ops.checkIn}
                          </Button>
                          <Button
                            type="button"
                            variant={draft.markNoShow ? "default" : "outline"}
                            className={
                              draft.markNoShow
                                ? "button-shine rounded-full bg-[#d6b26a] px-4 text-[#1b130f] hover:bg-[#e4c987]"
                                : "rounded-full border-white/10 bg-white/5 text-white hover:bg-white/10"
                            }
                            onClick={() => {
                              setReservationDrafts((current) => ({
                                ...current,
                                [item.id]: {
                                  ...draft,
                                  ...current[item.id],
                                  markNoShow: !draft.markNoShow,
                                },
                              }));
                            }}
                          >
                            {ops.noShow}
                          </Button>
                        </div>
                      </div>

                      <div className="mt-4 space-y-2">
                        <Label className="text-[#d9ccbb]">{ops.internalNote}</Label>
                        <Textarea
                          value={draft.internalNote}
                          onChange={(event) => {
                            const nextValue = event.target.value;
                            setReservationDrafts((current) => ({
                              ...current,
                              [item.id]: {
                                ...draft,
                                ...current[item.id],
                                internalNote: nextValue,
                              },
                            }));
                          }}
                          className="min-h-[6rem] rounded-[1.5rem] border-white/10 bg-white/4 px-4 py-3 text-white"
                        />
                      </div>

                      <div className="mt-4 flex justify-end">
                        <Button
                          type="button"
                          className="button-shine rounded-full bg-[#d6b26a] px-5 text-[#1b130f] hover:bg-[#e4c987]"
                          disabled={actionKey === `reservation:${item.id}`}
                          onClick={() => {
                            void updateReservation(item.id);
                          }}
                        >
                          {actionKey === `reservation:${item.id}` ? text.saving : text.save}
                        </Button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <div className="lux-panel-soft rounded-[2rem] p-6">
            <div className="flex items-center justify-between gap-3">
              <p className="text-[0.66rem] uppercase tracking-[0.18em] text-[#cdb37d]">{text.latestReviews}</p>
              <span className="text-sm text-[#bcae9b]">{reviews.length}</span>
            </div>
            <div className="mt-4 space-y-4">
              {reviews.length === 0 ? (
                <p className="rounded-[1.4rem] border border-white/10 bg-white/4 px-4 py-4 text-sm text-[#d1c4b2]">{text.empty}</p>
              ) : (
                reviews.map((item) => (
                  <div key={item.id} className="rounded-[1.6rem] border border-white/10 bg-white/4 p-4">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="font-medium text-white">{item.guest}</p>
                        <p className="mt-1 text-sm text-[#bcae9b]">{item.dish_id} · {item.region}</p>
                      </div>
                      <p className="text-sm text-[#ecd8a0]">{item.rating}/5</p>
                    </div>
                    <p className="mt-3 text-sm leading-7 text-[#d1c4b2]">{item.body}</p>
                    <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                      <p className="text-sm text-[#bcae9b]">
                        {text.locale}: {item.locale}
                      </p>
                      <Button
                        type="button"
                        variant={item.is_published ? "outline" : "default"}
                        className={
                          item.is_published
                            ? "rounded-full border-white/10 bg-white/5 text-white hover:bg-white/10"
                            : "button-shine rounded-full bg-[#d6b26a] px-5 text-[#1b130f] hover:bg-[#e4c987]"
                        }
                        disabled={actionKey === `review:${item.id}`}
                        onClick={() => {
                          void toggleReview(item.id, !item.is_published);
                        }}
                      >
                        {actionKey === `review:${item.id}` ? text.saving : item.is_published ? text.hide : text.publish}
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="lux-panel-soft rounded-[2rem] p-6">
            <div className="flex items-center justify-between gap-3">
              <p className="text-[0.66rem] uppercase tracking-[0.18em] text-[#cdb37d]">{text.latestPromos}</p>
              <span className="text-sm text-[#bcae9b]">{promos.length}</span>
            </div>

            <div className="mt-4 rounded-[1.6rem] border border-white/10 bg-black/15 p-4">
              <p className="font-medium text-white">{text.createPromo}</p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label className="text-[#d9ccbb]">{text.code}</Label>
                  <Input
                    value={promoForm.code}
                    onChange={(event) => setPromoForm((current) => ({ ...current, code: event.target.value.toUpperCase() }))}
                    className="h-11 rounded-2xl border-white/10 bg-white/4 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[#d9ccbb]">{text.titleField}</Label>
                  <Input
                    value={promoForm.title}
                    onChange={(event) => setPromoForm((current) => ({ ...current, title: event.target.value }))}
                    className="h-11 rounded-2xl border-white/10 bg-white/4 text-white"
                  />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label className="text-[#d9ccbb]">{text.description}</Label>
                  <Textarea
                    value={promoForm.description}
                    onChange={(event) => setPromoForm((current) => ({ ...current, description: event.target.value }))}
                    className="min-h-24 rounded-[1.4rem] border-white/10 bg-white/4 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[#d9ccbb]">{text.minimumSubtotal}</Label>
                  <Input
                    type="number"
                    value={promoForm.minimumSubtotal}
                    onChange={(event) => setPromoForm((current) => ({ ...current, minimumSubtotal: event.target.value }))}
                    className="h-11 rounded-2xl border-white/10 bg-white/4 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[#d9ccbb]">{text.value}</Label>
                  <Input
                    type="number"
                    value={promoForm.value}
                    onChange={(event) => setPromoForm((current) => ({ ...current, value: event.target.value }))}
                    className="h-11 rounded-2xl border-white/10 bg-white/4 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[#d9ccbb]">{text.kind}</Label>
                  <Select
                    value={promoForm.kind}
                    onValueChange={(value) => {
                      if (!value) {
                        return;
                      }

                      setPromoForm((current) => ({
                        ...current,
                        kind: value as "percent" | "amount",
                      }));
                    }}
                  >
                    <SelectTrigger className="h-11 w-full rounded-2xl border-white/10 bg-white/4 px-4 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl border-white/10 bg-[#120d0d]/96 text-white">
                      {promoKindOptions.map((kind) => (
                        <SelectItem key={kind} value={kind}>
                          {text.statusLabels[kind]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-end">
                  <Button
                    type="button"
                    className="button-shine h-11 w-full rounded-full bg-[#d6b26a] text-[#1b130f] hover:bg-[#e4c987]"
                    disabled={actionKey === "promo:create"}
                    onClick={() => {
                      void createPromo();
                    }}
                  >
                    {actionKey === "promo:create" ? text.saving : text.createPromo}
                  </Button>
                </div>
              </div>
            </div>

            <div className="mt-4 space-y-3">
              {promos.length === 0 ? (
                <p className="rounded-[1.4rem] border border-white/10 bg-white/4 px-4 py-4 text-sm text-[#d1c4b2]">{text.empty}</p>
              ) : (
                promos.map((promo) => (
                  <div key={promo.code} className="rounded-[1.4rem] border border-white/10 bg-white/4 p-4">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="font-medium text-white">{promo.code}</p>
                        <p className="mt-1 text-sm text-[#bcae9b]">{promo.title}</p>
                        <p className="mt-2 text-sm text-[#d1c4b2]">{promo.description}</p>
                        <p className="mt-3 text-sm text-[#ecd8a0]">
                          {text.statusLabels[promo.kind]} · {promo.kind === "percent" ? `${promo.value}%` : formatPrice(Number(promo.value ?? 0), locale)} · {text.minimumSubtotal}: {formatPrice(Number(promo.minimum_subtotal ?? 0), locale)}
                        </p>
                      </div>
                      <Button
                        type="button"
                        variant={promo.is_active ? "outline" : "default"}
                        className={
                          promo.is_active
                            ? "rounded-full border-white/10 bg-white/5 text-white hover:bg-white/10"
                            : "button-shine rounded-full bg-[#d6b26a] px-5 text-[#1b130f] hover:bg-[#e4c987]"
                        }
                        disabled={actionKey === `promo:${promo.code}`}
                        onClick={() => {
                          void togglePromo(promo);
                        }}
                      >
                        {actionKey === `promo:${promo.code}` ? text.saving : promo.is_active ? text.inactive : text.active}
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-2">
          <BranchOperationsPanel locale={locale} />
          <LoyaltyOperationsPanel locale={locale} />
        </div>

        <div className="grid gap-6 xl:grid-cols-2">
          <MenuOperationsPanel locale={locale} />
          <EmailOutboxPanel locale={locale} />
        </div>

        <div className="grid gap-6 xl:grid-cols-2">
          <MenuCatalogPanel locale={locale} />
          <TeamOperationsPanel locale={locale} />
        </div>

        <div className="grid gap-6 xl:grid-cols-2">
          <AutomationOperationsPanel locale={locale} />
          <AuditLogPanel locale={locale} />
        </div>
      </div>
    </section>
  );
}
