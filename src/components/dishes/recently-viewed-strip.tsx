"use client";

import type { AppLocale } from "@/i18n/routing";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { useOperationalDishes } from "@/hooks/use-operational-menu";
import { formatPrice } from "@/lib/format";
import { useRecentlyViewedStore } from "@/store/recently-viewed-store";

const stripText = {
  th: {
    title: "เมนูที่คุณเพิ่งดู",
    viewAll: "ไปต่อที่เมนู",
  },
  en: {
    title: "Recently viewed",
    viewAll: "Back to menu",
  },
  ja: {
    title: "最近見た料理",
    viewAll: "メニューへ戻る",
  },
  zh: {
    title: "最近浏览",
    viewAll: "返回菜单",
  },
  ko: {
    title: "최근 본 메뉴",
    viewAll: "메뉴로 돌아가기",
  },
} as const;

export function RecentlyViewedStrip({ locale }: { locale: AppLocale }) {
  const text = stripText[locale];
  const dishIds = useRecentlyViewedStore((state) => state.dishIds);
  const dishes = useOperationalDishes(locale).filter((dish) => dishIds.includes(dish.id));
  const ordered = dishIds
    .map((id) => dishes.find((dish) => dish.id === id))
    .filter((dish): dish is NonNullable<typeof dish> => Boolean(dish));

  if (ordered.length === 0) {
    return null;
  }

  return (
    <section className="lux-panel-soft rounded-[2rem] p-5 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-[0.66rem] uppercase tracking-[0.18em] text-[#cdb37d]">{text.title}</p>
        <Button
          type="button"
          variant="outline"
          className="rounded-full border-white/10 bg-white/5 text-white hover:bg-white/10"
          render={<Link href="/menu" locale={locale} />}
        >
          {text.viewAll}
        </Button>
      </div>
      <div className="mt-4 grid gap-3 md:grid-cols-3 xl:grid-cols-4">
        {ordered.slice(0, 4).map((dish) => (
          <div key={dish.id} className="rounded-[1.4rem] border border-white/10 bg-white/4 px-4 py-4">
            <p className="text-white">{dish.name}</p>
            <p className="mt-2 line-clamp-2 text-sm leading-6 text-[#bcae9b]">{dish.description}</p>
            <p className="mt-3 text-[#ecd8a0]">{formatPrice(dish.price, locale)}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
