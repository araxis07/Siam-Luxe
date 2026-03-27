"use client";

import { useTranslations } from "next-intl";

import type { AppLocale } from "@/i18n/routing";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { useHydrated } from "@/hooks/use-hydrated";
import { formatPrice } from "@/lib/format";
import { useCartStore } from "@/store/cart-store";

export function MobileCartBar({ locale }: { locale: AppLocale }) {
  const t = useTranslations("cart");
  const hydrated = useHydrated();
  const openCart = useCartStore((state) => state.openCart);
  const items = useCartStore((state) => state.items);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const total = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);

  if (!hydrated || itemCount === 0) {
    return null;
  }

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-white/8 bg-[#120c0d]/96 px-4 py-3 backdrop-blur-xl md:hidden">
      <div className="mx-auto flex max-w-7xl items-center gap-3">
        <Button
          type="button"
          variant="outline"
          className="flex-1 rounded-full border-white/10 bg-white/5 text-white hover:bg-white/10"
          onClick={openCart}
        >
          {t("items", { count: itemCount })}
        </Button>
        <Button
          type="button"
          className="button-shine rounded-full bg-[#d6b26a] px-5 text-[#1b130f] hover:bg-[#e4c987]"
          render={<Link href="/checkout" locale={locale} />}
        >
          {formatPrice(total, locale)}
        </Button>
      </div>
    </div>
  );
}
