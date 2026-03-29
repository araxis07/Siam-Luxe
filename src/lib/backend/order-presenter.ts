import type { AppLocale } from "@/i18n/routing";
import { getLocalizedDish } from "@/lib/catalog";
import { getLocalizedBranch } from "@/lib/experience";
import type { BackendNotification, BackendOrder } from "@/lib/backend/types";

const orderStatusLabels = {
  confirmed: {
    th: "ยืนยันออเดอร์",
    en: "Order confirmed",
    ja: "注文確認済み",
    zh: "订单已确认",
    ko: "주문 확인됨",
  },
  pending: {
    th: "รอดำเนินการ",
    en: "Pending",
    ja: "受付待ち",
    zh: "待处理",
    ko: "대기 중",
  },
  preparing: {
    th: "กำลังเตรียม",
    en: "Preparing",
    ja: "調理中",
    zh: "制作中",
    ko: "준비 중",
  },
  ready: {
    th: "พร้อมจัดส่ง",
    en: "Ready",
    ja: "準備完了",
    zh: "已备妥",
    ko: "준비 완료",
  },
  dispatching: {
    th: "กำลังออกเดินทาง",
    en: "Dispatching",
    ja: "配送開始",
    zh: "配送中",
    ko: "출발함",
  },
  arriving: {
    th: "ใกล้ถึงแล้ว",
    en: "Arriving",
    ja: "まもなく到着",
    zh: "即将送达",
    ko: "곧 도착",
  },
  completed: {
    th: "เสร็จสิ้น",
    en: "Completed",
    ja: "完了",
    zh: "已完成",
    ko: "완료",
  },
  cancelled: {
    th: "ยกเลิกแล้ว",
    en: "Cancelled",
    ja: "キャンセル済み",
    zh: "已取消",
    ko: "취소됨",
  },
} as const;

const notificationTitles = {
  "order-placed": {
    th: "สร้างคำสั่งซื้อแล้ว",
    en: "Order placed",
    ja: "注文を作成しました",
    zh: "订单已创建",
    ko: "주문이 생성되었습니다",
  },
  "reservation-created": {
    th: "รับคำขอจองโต๊ะแล้ว",
    en: "Reservation captured",
    ja: "予約リクエストを受け付けました",
    zh: "预约请求已记录",
    ko: "예약 요청이 접수되었습니다",
  },
  "reservation-waitlist": {
    th: "เพิ่มเข้ารายชื่อรอแล้ว",
    en: "Added to waitlist",
    ja: "ウェイトリストに追加しました",
    zh: "已加入候补名单",
    ko: "웨이트리스트에 추가되었습니다",
  },
  "reservation-updated": {
    th: "อัปเดตเวลาการจองแล้ว",
    en: "Reservation updated",
    ja: "予約時間を更新しました",
    zh: "预约已更新",
    ko: "예약이 업데이트되었습니다",
  },
  "reservation-cancelled": {
    th: "ยกเลิกการจองแล้ว",
    en: "Reservation cancelled",
    ja: "予約をキャンセルしました",
    zh: "预约已取消",
    ko: "예약이 취소되었습니다",
  },
  order: {
    th: "อัปเดตคำสั่งซื้อ",
    en: "Order update",
    ja: "注文の更新",
    zh: "订单更新",
    ko: "주문 업데이트",
  },
  reservation: {
    th: "อัปเดตการจอง",
    en: "Reservation update",
    ja: "予約の更新",
    zh: "预约更新",
    ko: "예약 업데이트",
  },
} as const;

function localeTag(locale: AppLocale) {
  if (locale === "th") return "th-TH";
  if (locale === "ja") return "ja-JP";
  if (locale === "zh") return "zh-CN";
  if (locale === "ko") return "ko-KR";
  return "en-US";
}

export function presentBackendOrders(locale: AppLocale, orders: BackendOrder[]) {
  return orders.map((order) => ({
    ...order,
    branch: getLocalizedBranch(locale, order.branchId),
    etaLabel:
      locale === "th"
        ? `ถึงโดยประมาณใน ${order.etaMinutes} นาที`
        : locale === "ja"
          ? `約 ${order.etaMinutes} 分で到着予定`
          : locale === "zh"
            ? `预计 ${order.etaMinutes} 分钟送达`
            : locale === "ko"
              ? `약 ${order.etaMinutes}분 후 도착`
              : `Estimated arrival in ${order.etaMinutes} min`,
    placedAt: new Date(order.placedAt).toLocaleString(localeTag(locale), {
      dateStyle: "medium",
      timeStyle: "short",
    }),
    items: order.items.map((item) => ({
      ...item,
      dish: getLocalizedDish(locale, item.dishId) ?? {
        id: item.dishId,
        category: "signature",
        categoryLabel: "",
        region: "nationwide",
        regionLabel: "",
        image: "/images/food-card-1.svg",
        name: item.dishName,
        description: item.dishName,
        price: item.unitPrice,
        rating: 5,
        prepMinutes: order.etaMinutes,
        baseSpice: item.spiceLevel,
        featured: false,
        accentClass: "from-[#43161a] via-[#211112] to-[#0a0909]",
        availableToppings: [],
      },
    })),
    stages: order.stages.map((stage) => ({
      id: stage.id,
      label:
        orderStatusLabels[stage.status as keyof typeof orderStatusLabels]?.[locale] ??
        stage.status,
      time: new Date(stage.occurredAt).toLocaleTimeString(localeTag(locale), {
        hour: "2-digit",
        minute: "2-digit",
      }),
    })),
  }));
}

export function presentBackendNotifications(locale: AppLocale, notifications: BackendNotification[]) {
  return notifications.map((item) => ({
    ...item,
    title:
      notificationTitles[item.kind as keyof typeof notificationTitles]?.[locale] ??
      item.title,
    time: new Date(item.createdAt).toLocaleString(localeTag(locale), {
      dateStyle: "medium",
      timeStyle: "short",
    }),
  }));
}
