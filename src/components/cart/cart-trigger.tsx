"use client";

import { ShoppingBag } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { useHydrated } from "@/hooks/use-hydrated";
import { useCartStore } from "@/store/cart-store";

export function CartTrigger() {
  const t = useTranslations("cart");
  const hydrated = useHydrated();
  const openCart = useCartStore((state) => state.openCart);
  const itemCount = useCartStore((state) =>
    state.items.reduce((sum, item) => sum + item.quantity, 0),
  );

  return (
    <Button
      type="button"
      size="lg"
      variant="outline"
      aria-label={t("open")}
      className="button-shine relative h-10 rounded-full border-white/10 bg-white/5 px-4 text-white hover:bg-white/10"
      onClick={openCart}
    >
      <ShoppingBag className="size-4 text-[#d6b26a]" />
      <span className="hidden sm:inline">{t("title")}</span>
      <span className="inline-flex min-w-6 items-center justify-center rounded-full bg-[#d6b26a] px-2 py-0.5 text-xs font-semibold text-[#1a120f]">
        {hydrated ? itemCount : 0}
      </span>
    </Button>
  );
}
