"use client";

import type { AppLocale } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { getLocalizedDishes } from "@/lib/catalog";
import { formatPrice } from "@/lib/format";
import { getUpsellSuggestions } from "@/lib/guest-experience";
import { useCartStore } from "@/store/cart-store";

const panelText = {
  th: {
    title: "แนะนำเพิ่มก่อนปิดออเดอร์",
    add: "เพิ่มเลย",
  },
  en: {
    title: "Suggested before checkout",
    add: "Add this",
  },
  ja: {
    title: "会計前のおすすめ",
    add: "追加する",
  },
  zh: {
    title: "结账前推荐",
    add: "加入此项",
  },
  ko: {
    title: "결제 전 추천",
    add: "추가하기",
  },
} as const;

export function SmartUpsellPanel({ locale }: { locale: AppLocale }) {
  const text = panelText[locale];
  const items = useCartStore((state) => state.items);
  const addItem = useCartStore((state) => state.addItem);
  const suggestions = getUpsellSuggestions(
    locale,
    items.map((item) => item.dishId),
  );
  const dishes = getLocalizedDishes(locale);
  const { toast } = useToast();

  if (items.length === 0 || suggestions.length === 0) {
    return null;
  }

  return (
    <div className="rounded-[1.6rem] border border-white/10 bg-white/4 p-4">
      <p className="text-[0.66rem] uppercase tracking-[0.18em] text-[#cdb37d]">{text.title}</p>
      <div className="mt-4 space-y-3">
        {suggestions.slice(0, 2).map((suggestion) => {
          const dish = dishes.find((entry) => entry.id === suggestion.dishId);
          if (!dish) return null;

          return (
            <div key={suggestion.id} className="rounded-[1.35rem] border border-white/10 bg-black/15 px-4 py-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-white">{dish.name}</p>
                  <p className="mt-2 text-sm leading-6 text-[#bcae9b]">{suggestion.reason}</p>
                </div>
                <span className="text-[#ecd8a0]">{formatPrice(dish.price, locale)}</span>
              </div>
              <Button
                type="button"
                size="sm"
                className="button-shine mt-4 rounded-full bg-[#d6b26a] text-[#1b130f] hover:bg-[#e4c987]"
                onClick={() => {
                  addItem({
                    dishId: dish.id,
                    quantity: 1,
                    spiceLevel: dish.baseSpice,
                    toppings: [],
                    unitPrice: dish.price,
                  });
                  toast({
                    title: text.add,
                    description: dish.name,
                    tone: "success",
                  });
                }}
              >
                {text.add}
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
