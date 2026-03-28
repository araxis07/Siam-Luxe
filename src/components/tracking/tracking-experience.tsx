"use client";

import { Clock3, PackageCheck } from "lucide-react";
import { useMemo, useState } from "react";

import type { AppLocale } from "@/i18n/routing";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DeliveryMapMock } from "@/components/tracking/delivery-map-mock";
import { formatPrice } from "@/lib/format";
import { getExperienceCopy, getFeatureLinks, getLocalizedOrders } from "@/lib/experience";
import { useCartStore } from "@/store/cart-store";

const trackingText = {
  th: {
    subtitle: "แสดงลำดับสถานะของออเดอร์ พร้อมเวลาโดยประมาณและสาขาที่รับผิดชอบ",
    detailTitle: "รายละเอียดออเดอร์",
    timelineTitle: "ลำดับสถานะ",
    reorder: "สั่งซ้ำทั้งออเดอร์",
    empty: "ยังไม่มีออเดอร์ให้ติดตาม",
  },
  en: {
    subtitle: "A frontend-only tracking flow with ETA, branch assignment, and order milestones.",
    detailTitle: "Order details",
    timelineTitle: "Progress timeline",
    reorder: "Reorder this selection",
    empty: "No mock orders available",
  },
  ja: {
    subtitle: "ETA、担当店舗、進行状況を追えるフロントエンドの注文追跡画面です。",
    detailTitle: "注文詳細",
    timelineTitle: "進行状況",
    reorder: "この内容で再注文",
    empty: "表示できる注文がありません",
  },
  zh: {
    subtitle: "这是一个纯前端订单追踪流程，包含 ETA、负责门店与阶段进度。",
    detailTitle: "订单详情",
    timelineTitle: "进度时间线",
    reorder: "按此内容再次下单",
    empty: "暂无可追踪订单",
  },
  ko: {
    subtitle: "ETA, 담당 지점, 진행 단계를 보여주는 프런트엔드 전용 주문 추적 화면입니다.",
    detailTitle: "주문 상세",
    timelineTitle: "진행 단계",
    reorder: "이 주문 다시 담기",
    empty: "표시할 주문이 없습니다",
  },
} as const;

export function TrackingExperience({ locale }: { locale: AppLocale }) {
  const copy = trackingText[locale];
  const experienceCopy = getExperienceCopy(locale);
  const feature = getFeatureLinks(locale).find((item) => item.id === "tracking");
  const orders = getLocalizedOrders(locale);
  const addItem = useCartStore((state) => state.addItem);
  const openCart = useCartStore((state) => state.openCart);
  const [selectedOrderId, setSelectedOrderId] = useState(orders[0]?.id ?? "");
  const activeOrder = useMemo(
    () => orders.find((order) => order.id === selectedOrderId) ?? orders[0],
    [orders, selectedOrderId],
  );

  if (!activeOrder) {
    return (
      <div className="lux-panel rounded-[2rem] px-6 py-14 text-center">
        <p className="font-heading text-[2rem] text-white">{copy.empty}</p>
      </div>
    );
  }

  return (
    <div className="grid gap-8 xl:grid-cols-[0.9fr_1.1fr]">
      <aside className="space-y-4">
        <div className="lux-panel rounded-[2.25rem] p-6 sm:p-8">
          <p className="text-[0.66rem] uppercase tracking-[0.18em] text-[#cdb37d]">{feature?.eyebrow}</p>
          <h1 className="mt-3 font-heading text-[2.5rem] leading-tight text-white sm:text-[3rem]">
            {feature?.title ?? experienceCopy.labels.trackingTitle}
          </h1>
          <p className="mt-3 text-[0.96rem] leading-7 text-[#d1c4b2]">{copy.subtitle}</p>
          <div className="mt-6 space-y-2">
            <p className="text-[0.66rem] uppercase tracking-[0.18em] text-[#cdb37d]">{experienceCopy.labels.selectOrder}</p>
            <Select
              value={selectedOrderId}
              onValueChange={(value) => setSelectedOrderId(value ?? orders[0]?.id ?? "")}
            >
              <SelectTrigger className="h-12 w-full rounded-2xl border-white/10 bg-white/4 px-4 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="rounded-2xl border-white/10 bg-[#120d0d]/96 text-white">
                {orders.map((order) => (
                  <SelectItem key={order.id} value={order.id}>
                    {order.code}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-3">
          {orders.map((order) => (
            <button
              key={order.id}
              type="button"
              className={`lux-panel-soft w-full rounded-[1.7rem] p-5 text-left transition-colors ${
                order.id === activeOrder.id ? "border-[#d6b26a]/24 bg-[#d6b26a]/8" : ""
              }`}
              onClick={() => setSelectedOrderId(order.id)}
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-[0.66rem] uppercase tracking-[0.18em] text-[#cdb37d]">{order.code}</p>
                  <h2 className="mt-2 font-heading text-[1.45rem] leading-tight text-white">{order.branch.name}</h2>
                </div>
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.14em] text-white">
                  {order.serviceMode}
                </span>
              </div>
              <p className="mt-3 text-sm text-[#d0c3b1]">{order.etaLabel}</p>
              <p className="mt-1 text-sm text-[#a89989]">{order.placedAt}</p>
            </button>
          ))}
        </div>
      </aside>

      <div className="space-y-4">
        <div className="lux-panel rounded-[2.25rem] p-6 sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-[0.66rem] uppercase tracking-[0.18em] text-[#cdb37d]">{copy.detailTitle}</p>
              <h2 className="mt-3 font-heading text-[2.1rem] leading-tight text-white">{activeOrder.branch.name}</h2>
              <p className="mt-2 text-[#d0c3b1]">{activeOrder.branch.neighborhood}</p>
            </div>
            <Button
              type="button"
              className="button-shine rounded-full bg-[#d6b26a] text-[#1b130f] hover:bg-[#e4c987]"
              onClick={() => {
                activeOrder.items.forEach((entry) => {
                  if (!entry.dish) return;

                  addItem({
                    dishId: entry.dish.id,
                    quantity: entry.quantity,
                    spiceLevel: entry.dish.baseSpice,
                    toppings: [],
                    unitPrice: entry.dish.price,
                  });
                });
                openCart();
              }}
            >
              {copy.reorder}
            </Button>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="rounded-[1.8rem] border border-white/10 bg-white/4 p-5">
              <div className="flex items-center gap-2 text-[#ecd8a0]">
                <PackageCheck className="size-4" />
                <span className="text-[0.66rem] uppercase tracking-[0.18em]">{activeOrder.code}</span>
              </div>
              <p className="mt-3 text-white">{activeOrder.etaLabel}</p>
              <p className="mt-1 text-sm text-[#bcae9b]">{activeOrder.placedAt}</p>
            </div>
            <div className="rounded-[1.8rem] border border-white/10 bg-white/4 p-5">
              <div className="flex items-center gap-2 text-[#ecd8a0]">
                <Clock3 className="size-4" />
                <span className="text-[0.66rem] uppercase tracking-[0.18em]">{experienceCopy.labels.branch}</span>
              </div>
              <p className="mt-3 text-white">{activeOrder.branch.address}</p>
              <p className="mt-1 text-sm text-[#bcae9b]">{activeOrder.branch.hours}</p>
            </div>
          </div>

          <div className="thai-divider my-6" />

          <div className="space-y-4">
            {activeOrder.items.map((item) => (
              <div key={`${activeOrder.id}-${item.dishId}`} className="flex items-center justify-between gap-4 rounded-[1.5rem] border border-white/10 bg-black/15 px-4 py-4">
                <div>
                  <p className="text-white">{item.dish?.name}</p>
                  <p className="mt-1 text-sm text-[#bcae9b]">{item.quantity} × {formatPrice(item.dish?.price ?? 0, locale)}</p>
                </div>
                <p className="text-[#ecd8a0]">{formatPrice((item.dish?.price ?? 0) * item.quantity, locale)}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="lux-panel-soft rounded-[2rem] p-6 sm:p-8">
          <p className="text-[0.66rem] uppercase tracking-[0.18em] text-[#cdb37d]">{copy.timelineTitle}</p>
          <div className="mt-5 space-y-4">
            {activeOrder.stages.map((stage, index) => (
              <div key={stage.id} className="flex gap-4">
                <div className="flex w-10 flex-col items-center">
                  <span className="mt-1 size-3 rounded-full bg-[#d6b26a]" />
                  {index < activeOrder.stages.length - 1 ? (
                    <span className="mt-2 h-full w-px bg-white/10" />
                  ) : null}
                </div>
                <div className="pb-5">
                  <p className="text-white">{stage.label}</p>
                  <p className="mt-1 text-sm text-[#bcae9b]">{stage.time}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6">
            <Button
              type="button"
              variant="outline"
              className="rounded-full border-white/10 bg-white/5 text-white hover:bg-white/10"
              render={<Link href="/menu" locale={locale} />}
            >
              {experienceCopy.labels.exploreMenu}
            </Button>
          </div>
        </div>

        <DeliveryMapMock locale={locale} orderId={activeOrder.id} />
      </div>
    </div>
  );
}
