"use client";

import { useEffect, useState } from "react";

import type { AppLocale } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { requestJson } from "@/lib/backend/client";
import { formatPrice } from "@/lib/format";
import { useMenuOperationsStore, type MenuOperationOverride } from "@/store/menu-operations-store";

type MenuSnapshot = {
  id: string;
  name: string;
  category: string;
  region: string;
  basePrice: number;
  currentPrice: number;
  featured: boolean;
  isAvailable: boolean;
  statusOverride: "available" | "limited" | "soldOut" | "chefToday" | null;
  kitchenNote: string;
};

const menuPanelText = {
  th: {
    title: "ควบคุมเมนูหน้าร้าน",
    empty: "ยังไม่มี snapshot ของเมนู",
    basePrice: "ราคาตั้งต้น",
    currentPrice: "ราคาปัจจุบัน",
    featured: "สถานะเด่น",
    availability: "การขาย",
    status: "สถานะพิเศษ",
    note: "หมายเหตุครัว",
    save: "บันทึกเมนู",
    saving: "กำลังบันทึก",
    updated: "อัปเดตเมนูแล้ว",
    error: "ยังอัปเดตเมนูไม่ได้",
    inherit: "ใช้ค่าเดิม",
    featuredOn: "เมนูเด่น",
    featuredOff: "ไม่เป็นเมนูเด่น",
    available: "ขายได้",
    unavailable: "หยุดขาย",
    statuses: {
      available: "ปกติ",
      limited: "จำนวนจำกัด",
      soldOut: "ขายหมด",
      chefToday: "เชฟแนะนำวันนี้",
    },
  },
  en: {
    title: "Menu operations control",
    empty: "No menu snapshot available yet",
    basePrice: "Base price",
    currentPrice: "Current price",
    featured: "Featured status",
    availability: "Availability",
    status: "Special status",
    note: "Kitchen note",
    save: "Save menu row",
    saving: "Saving",
    updated: "Menu row updated",
    error: "Unable to update this menu row",
    inherit: "Use default",
    featuredOn: "Featured",
    featuredOff: "Not featured",
    available: "Available",
    unavailable: "Unavailable",
    statuses: {
      available: "Standard",
      limited: "Limited",
      soldOut: "Sold out",
      chefToday: "Chef today",
    },
  },
  ja: {
    title: "メニュー運用コントロール",
    empty: "メニュースナップショットがまだありません",
    basePrice: "基準価格",
    currentPrice: "現在価格",
    featured: "注目表示",
    availability: "販売状態",
    status: "特別ステータス",
    note: "厨房メモ",
    save: "メニューを保存",
    saving: "保存中",
    updated: "メニューを更新しました",
    error: "このメニューを更新できませんでした",
    inherit: "既定値を使う",
    featuredOn: "注目メニュー",
    featuredOff: "通常メニュー",
    available: "販売中",
    unavailable: "販売停止",
    statuses: {
      available: "通常",
      limited: "数量限定",
      soldOut: "売り切れ",
      chefToday: "本日のおすすめ",
    },
  },
  zh: {
    title: "菜单运营控制",
    empty: "暂无菜单快照",
    basePrice: "基础价格",
    currentPrice: "当前价格",
    featured: "推荐状态",
    availability: "销售状态",
    status: "特殊状态",
    note: "后厨备注",
    save: "保存菜单项",
    saving: "保存中",
    updated: "菜单已更新",
    error: "暂时无法更新该菜单项",
    inherit: "使用默认值",
    featuredOn: "推荐菜单",
    featuredOff: "普通菜单",
    available: "可售",
    unavailable: "停售",
    statuses: {
      available: "常规",
      limited: "限量",
      soldOut: "售罄",
      chefToday: "今日主厨推荐",
    },
  },
  ko: {
    title: "메뉴 운영 제어",
    empty: "메뉴 스냅샷이 아직 없습니다",
    basePrice: "기본 가격",
    currentPrice: "현재 가격",
    featured: "대표 메뉴 상태",
    availability: "판매 상태",
    status: "특별 상태",
    note: "주방 메모",
    save: "메뉴 저장",
    saving: "저장 중",
    updated: "메뉴가 업데이트되었습니다",
    error: "이 메뉴를 업데이트할 수 없습니다",
    inherit: "기본값 사용",
    featuredOn: "대표 메뉴",
    featuredOff: "일반 메뉴",
    available: "판매 가능",
    unavailable: "판매 중지",
    statuses: {
      available: "기본",
      limited: "한정",
      soldOut: "품절",
      chefToday: "오늘의 셰프 추천",
    },
  },
} as const;

export function MenuOperationsPanel({ locale }: { locale: AppLocale }) {
  const text = menuPanelText[locale];
  const { toast } = useToast();
  const upsertOperation = useMenuOperationsStore((state) => state.upsertOperation);
  const [menuRows, setMenuRows] = useState<MenuSnapshot[]>([]);
  const [drafts, setDrafts] = useState<Record<string, Record<string, string>>>({});
  const [actionKey, setActionKey] = useState("");

  useEffect(() => {
    let cancelled = false;

    void requestJson<MenuSnapshot[]>(`/api/admin/menu?locale=${locale}`, {
      method: "GET",
      cache: "no-store",
    })
      .then((data) => {
        if (cancelled) {
          return;
        }

        setMenuRows(data);
        setDrafts(
          Object.fromEntries(
            data.map((dish) => [
              dish.id,
              {
                currentPrice: String(dish.currentPrice),
                featured: dish.featured ? "featured" : "standard",
                availability: dish.isAvailable ? "available" : "unavailable",
                status: dish.statusOverride ?? "inherit",
                kitchenNote: dish.kitchenNote,
              },
            ]),
          ),
        );
      })
      .catch(() => {
        if (!cancelled) {
          setMenuRows([]);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [locale]);

  const saveMenuRow = async (dishId: string, basePrice: number) => {
    const draft = drafts[dishId];

    if (!draft) {
      return;
    }

    setActionKey(dishId);

    try {
      const nextOperation = await requestJson<MenuOperationOverride>(`/api/admin/menu/${dishId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          priceOverride:
            draft.currentPrice.trim().length > 0 && Number(draft.currentPrice) !== basePrice
              ? Number(draft.currentPrice)
              : null,
          isAvailable: draft.availability === "available",
          featuredOverride:
            draft.featured === "featured" ? true : draft.featured === "standard" ? false : null,
          statusOverride: draft.status === "inherit" ? null : draft.status,
          kitchenNote: draft.kitchenNote,
        }),
      });
      const normalizedOperation: MenuOperationOverride = {
        ...nextOperation,
        price_override:
          nextOperation.price_override === null
            ? null
            : Number(nextOperation.price_override),
      };

      upsertOperation(normalizedOperation);
      setMenuRows((current) =>
        current.map((row) =>
          row.id === dishId
            ? {
                ...row,
                currentPrice: normalizedOperation.price_override ?? basePrice,
                featured:
                  normalizedOperation.featured_override === null ? row.featured : normalizedOperation.featured_override,
                isAvailable: normalizedOperation.is_available,
                statusOverride: normalizedOperation.status_override,
                kitchenNote: normalizedOperation.kitchen_note,
              }
            : row,
        ),
      );
      toast({
        title: text.updated,
        description: dishId,
        tone: "success",
      });
    } catch (error) {
      toast({
        title: text.error,
        description: error instanceof Error ? error.message : text.error,
        tone: "error",
      });
    } finally {
      setActionKey("");
    }
  };

  return (
    <section className="lux-panel-soft rounded-[2rem] p-6">
      <div className="flex items-center justify-between gap-3">
        <p className="text-[0.66rem] uppercase tracking-[0.18em] text-[#cdb37d]">{text.title}</p>
        <span className="text-sm text-[#bcae9b]">{menuRows.length}</span>
      </div>

      <div className="mt-4 max-h-[52rem] space-y-4 overflow-y-auto pr-1">
        {menuRows.length === 0 ? (
          <p className="rounded-[1.4rem] border border-white/10 bg-white/4 px-4 py-4 text-sm text-[#d1c4b2]">{text.empty}</p>
        ) : (
          menuRows.map((row) => {
            const draft = drafts[row.id];

            if (!draft) {
              return null;
            }

            return (
              <div key={row.id} className="rounded-[1.6rem] border border-white/10 bg-white/4 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-medium text-white">{row.name}</p>
                    <p className="mt-1 text-sm text-[#bcae9b]">{row.category} · {row.region}</p>
                  </div>
                  <p className="text-sm text-[#ecd8a0]">{formatPrice(row.basePrice, locale)}</p>
                </div>
                <div className="mt-4 grid gap-3 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label className="text-[#d9ccbb]">{text.basePrice}</Label>
                    <div className="h-11 rounded-2xl border border-white/10 bg-black/15 px-4 py-3 text-sm text-[#d1c4b2]">
                      {formatPrice(row.basePrice, locale)}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[#d9ccbb]">{text.currentPrice}</Label>
                    <Input
                      type="number"
                      value={draft.currentPrice}
                      onChange={(event) =>
                        setDrafts((current) => ({
                          ...current,
                          [row.id]: { ...current[row.id], currentPrice: event.target.value },
                        }))
                      }
                      className="h-11 rounded-2xl border-white/10 bg-white/4 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[#d9ccbb]">{text.featured}</Label>
                    <Select
                      value={draft.featured}
                      onValueChange={(value) => {
                        if (!value) {
                          return;
                        }

                        setDrafts((current) => ({
                          ...current,
                          [row.id]: { ...current[row.id], featured: value },
                        }));
                      }}
                    >
                      <SelectTrigger className="h-11 w-full rounded-2xl border-white/10 bg-white/4 px-4 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-2xl border-white/10 bg-[#120d0d]/96 text-white">
                        <SelectItem value="inherit">{text.inherit}</SelectItem>
                        <SelectItem value="featured">{text.featuredOn}</SelectItem>
                        <SelectItem value="standard">{text.featuredOff}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[#d9ccbb]">{text.availability}</Label>
                    <Select
                      value={draft.availability}
                      onValueChange={(value) => {
                        if (!value) {
                          return;
                        }

                        setDrafts((current) => ({
                          ...current,
                          [row.id]: { ...current[row.id], availability: value },
                        }));
                      }}
                    >
                      <SelectTrigger className="h-11 w-full rounded-2xl border-white/10 bg-white/4 px-4 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-2xl border-white/10 bg-[#120d0d]/96 text-white">
                        <SelectItem value="available">{text.available}</SelectItem>
                        <SelectItem value="unavailable">{text.unavailable}</SelectItem>
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

                        setDrafts((current) => ({
                          ...current,
                          [row.id]: { ...current[row.id], status: value },
                        }));
                      }}
                    >
                      <SelectTrigger className="h-11 w-full rounded-2xl border-white/10 bg-white/4 px-4 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-2xl border-white/10 bg-[#120d0d]/96 text-white">
                        <SelectItem value="inherit">{text.inherit}</SelectItem>
                        <SelectItem value="available">{text.statuses.available}</SelectItem>
                        <SelectItem value="limited">{text.statuses.limited}</SelectItem>
                        <SelectItem value="soldOut">{text.statuses.soldOut}</SelectItem>
                        <SelectItem value="chefToday">{text.statuses.chefToday}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label className="text-[#d9ccbb]">{text.note}</Label>
                    <Textarea
                      value={draft.kitchenNote}
                      onChange={(event) =>
                        setDrafts((current) => ({
                          ...current,
                          [row.id]: { ...current[row.id], kitchenNote: event.target.value },
                        }))
                      }
                      className="min-h-24 rounded-[1.4rem] border-white/10 bg-white/4 text-white"
                    />
                  </div>
                </div>
                <Button
                  type="button"
                  className="button-shine mt-4 rounded-full bg-[#d6b26a] px-5 text-[#1b130f] hover:bg-[#e4c987]"
                  disabled={actionKey === row.id}
                  onClick={() => {
                    void saveMenuRow(row.id, row.basePrice);
                  }}
                >
                  {actionKey === row.id ? text.saving : text.save}
                </Button>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}
