"use client";

import { useCallback, useEffect, useState } from "react";

import type { AppLocale } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { requestJson } from "@/lib/backend/client";

type MenuCatalogStatus = {
  categories: number;
  regions: number;
  toppings: number;
  dishes: number;
  lastSyncedAt: string | null;
};

const copy = {
  th: {
    title: "menu master data",
    sync: "ซิงก์ catalog seed",
    syncing: "กำลังซิงก์",
    categories: "หมวด",
    regions: "ภูมิภาค",
    toppings: "toppings",
    dishes: "เมนู",
  },
  en: {
    title: "Menu master data",
    sync: "Sync seed catalog",
    syncing: "Syncing",
    categories: "Categories",
    regions: "Regions",
    toppings: "Toppings",
    dishes: "Dishes",
  },
  ja: {
    title: "メニューマスターデータ",
    sync: "シードを同期",
    syncing: "同期中",
    categories: "カテゴリ",
    regions: "地域",
    toppings: "トッピング",
    dishes: "料理",
  },
  zh: {
    title: "菜单主数据",
    sync: "同步种子目录",
    syncing: "同步中",
    categories: "分类",
    regions: "区域",
    toppings: "加料",
    dishes: "菜品",
  },
  ko: {
    title: "메뉴 마스터 데이터",
    sync: "시드 카탈로그 동기화",
    syncing: "동기화 중",
    categories: "카테고리",
    regions: "지역",
    toppings: "토핑",
    dishes: "메뉴",
  },
} as const;

function formatDateLabel(locale: AppLocale, value: string | null) {
  if (!value) {
    return "—";
  }

  try {
    return new Intl.DateTimeFormat(locale, {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(value));
  } catch {
    return value;
  }
}

export function MenuCatalogPanel({ locale }: { locale: AppLocale }) {
  const text = copy[locale];
  const { toast } = useToast();
  const [status, setStatus] = useState<MenuCatalogStatus | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);

  const load = useCallback(async () => {
    const data = await requestJson<MenuCatalogStatus>(`/api/admin/menu/catalog?locale=${locale}`, {
      method: "GET",
      cache: "no-store",
    });

    setStatus(data);
  }, [locale]);

  useEffect(() => {
    void load().catch(() => {
      setStatus(null);
    });
  }, [load]);

  const sync = async () => {
    setIsSyncing(true);

    try {
      const data = await requestJson<MenuCatalogStatus>("/api/admin/menu/catalog", {
        method: "POST",
      });
      setStatus(data);
      toast({
        title: text.title,
        description: `${data.dishes} dishes`,
        tone: "success",
      });
    } catch (error) {
      toast({
        title: text.title,
        description: error instanceof Error ? error.message : text.title,
        tone: "error",
      });
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="lux-panel-soft rounded-[2rem] p-6">
      <p className="text-[0.66rem] uppercase tracking-[0.18em] text-[#cdb37d]">{text.title}</p>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div className="rounded-[1.4rem] border border-white/10 bg-white/4 p-4 text-sm text-[#d1c4b2]">{text.categories}: {status?.categories ?? 0}</div>
        <div className="rounded-[1.4rem] border border-white/10 bg-white/4 p-4 text-sm text-[#d1c4b2]">{text.regions}: {status?.regions ?? 0}</div>
        <div className="rounded-[1.4rem] border border-white/10 bg-white/4 p-4 text-sm text-[#d1c4b2]">{text.toppings}: {status?.toppings ?? 0}</div>
        <div className="rounded-[1.4rem] border border-white/10 bg-white/4 p-4 text-sm text-[#d1c4b2]">{text.dishes}: {status?.dishes ?? 0}</div>
      </div>
      <p className="mt-4 text-sm text-[#bcae9b]">{formatDateLabel(locale, status?.lastSyncedAt ?? null)}</p>
      <Button
        type="button"
        className="button-shine mt-4 rounded-full bg-[#d6b26a] px-5 text-[#1b130f] hover:bg-[#e4c987]"
        disabled={isSyncing}
        onClick={() => {
          void sync();
        }}
      >
        {isSyncing ? text.syncing : text.sync}
      </Button>
    </div>
  );
}
