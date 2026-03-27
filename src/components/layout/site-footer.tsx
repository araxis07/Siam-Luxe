import { useTranslations } from "next-intl";

import type { AppLocale } from "@/i18n/routing";
import { Link } from "@/i18n/navigation";

export function SiteFooter({ locale }: { locale: AppLocale }) {
  const tCommon = useTranslations("common");
  const tFooter = useTranslations("footer");
  const tNav = useTranslations("nav");

  return (
    <footer className="border-t border-white/6 bg-[#0a0909]/90">
      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-10 text-sm text-[#d8cbbb] sm:px-6 md:grid-cols-[1.2fr_0.8fr] lg:px-8">
        <div className="space-y-3">
          <p className="font-heading text-[1.45rem] tracking-[0.14em] text-white uppercase">
            {tCommon("brand")}
          </p>
          <p className="max-w-xl text-[#c9bda9]">{tFooter("note")}</p>
          <div className="flex flex-wrap gap-3 pt-1 text-[0.82rem] text-[#d6c9b6]">
            <Link href="/" locale={locale} className="transition-colors hover:text-white">
              {tNav("home")}
            </Link>
            <Link href="/menu" locale={locale} className="transition-colors hover:text-white">
              {tNav("menu")}
            </Link>
            <Link href="/heritage" locale={locale} className="transition-colors hover:text-white">
              {tNav("heritage")}
            </Link>
          </div>
        </div>
        <div className="space-y-2 md:text-right">
          <p>{tFooter("hours")}</p>
          <p className="text-[#9f9386]">{tFooter("rights")}</p>
        </div>
      </div>
    </footer>
  );
}
