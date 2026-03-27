import { useTranslations } from "next-intl";

import type { AppLocale } from "@/i18n/routing";
import { Link } from "@/i18n/navigation";
import { getExperienceCopy, getFeatureLinks } from "@/lib/experience";

export function SiteFooter({ locale }: { locale: AppLocale }) {
  const tCommon = useTranslations("common");
  const tFooter = useTranslations("footer");
  const tNav = useTranslations("nav");
  const copy = getExperienceCopy(locale);
  const featureLinks = getFeatureLinks(locale);
  const specialsLink = featureLinks.find((item) => item.id === "specials");

  return (
    <footer className="border-t border-white/6 bg-[#0a0909]/90">
      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-10 text-sm text-[#d8cbbb] sm:px-6 md:grid-cols-[1.1fr_0.9fr_0.8fr] lg:px-8">
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
            <Link href="/specials" locale={locale} className="transition-colors hover:text-white">
              {specialsLink?.title ?? copy.labels.specialsTitle}
            </Link>
            <Link href="/heritage" locale={locale} className="transition-colors hover:text-white">
              {tNav("heritage")}
            </Link>
          </div>
        </div>
        <div className="space-y-2">
          <p className="text-[0.66rem] uppercase tracking-[0.18em] text-[#cdb37d]">{copy.labels.quickAccess}</p>
          <div className="grid gap-2 text-[#d6c9b6] sm:grid-cols-2">
            {featureLinks.map((item) => (
              <Link key={item.id} href={item.href} locale={locale} className="transition-colors hover:text-white">
                {item.title}
              </Link>
            ))}
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
