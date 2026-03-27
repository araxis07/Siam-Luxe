import { Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";

import type { AppLocale } from "@/i18n/routing";
import { Link } from "@/i18n/navigation";
import { CartTrigger } from "@/components/cart/cart-trigger";
import { LanguageSwitcher } from "@/components/layout/language-switcher";

export function SiteHeader({ locale }: { locale: AppLocale }) {
  const tCommon = useTranslations("common");
  const tNav = useTranslations("nav");

  return (
    <header className="sticky top-0 z-40 border-b border-white/6 bg-[#0f0a0b]/75 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            locale={locale}
            className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-3 py-2 transition-colors hover:bg-white/8"
          >
            <span className="inline-flex size-10 items-center justify-center rounded-full bg-gradient-to-br from-[#f2d48b] via-[#d6b26a] to-[#9f6e26] text-[#130d0b] shadow-lg shadow-black/30">
              <Sparkles className="size-4" />
            </span>
            <span className="flex flex-col">
              <span className="font-heading text-[1.05rem] leading-none tracking-[0.12em] text-white uppercase sm:text-[1.12rem]">
                {tCommon("brand")}
              </span>
              <span className="text-[0.6rem] tracking-[0.16em] text-[#d6c9b6] uppercase sm:text-[0.64rem]">
                {tCommon("tagline")}
              </span>
            </span>
          </Link>
          <nav className="hidden items-center gap-2 md:flex">
            <Link
              href="/"
              locale={locale}
              className="rounded-full px-4 py-2 text-sm text-[#e8ddd0] transition-colors hover:bg-white/6 hover:text-white"
            >
              {tNav("home")}
            </Link>
            <Link
              href="/menu"
              locale={locale}
              className="rounded-full px-4 py-2 text-sm text-[#e8ddd0] transition-colors hover:bg-white/6 hover:text-white"
            >
              {tNav("menu")}
            </Link>
            <Link
              href="/heritage"
              locale={locale}
              className="rounded-full px-4 py-2 text-sm text-[#e8ddd0] transition-colors hover:bg-white/6 hover:text-white"
            >
              {tNav("heritage")}
            </Link>
            <Link
              href="/checkout"
              locale={locale}
              className="rounded-full px-4 py-2 text-sm text-[#e8ddd0] transition-colors hover:bg-white/6 hover:text-white"
            >
              {tNav("checkout")}
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          <CartTrigger />
        </div>
      </div>
    </header>
  );
}
