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
  const serviceLinks = {
    th: [
      { href: "/auth", label: "เข้าสู่ระบบ" },
      { href: "/compare-branches", label: "เทียบสาขา" },
      { href: "/pairings", label: "จับคู่เครื่องดื่ม" },
      { href: "/policies", label: "นโยบาย" },
      { href: "/trust", label: "ศูนย์ความเชื่อมั่น" },
    ],
    en: [
      { href: "/auth", label: "Sign in" },
      { href: "/compare-branches", label: "Compare branches" },
      { href: "/pairings", label: "Pairings" },
      { href: "/policies", label: "Policies" },
      { href: "/trust", label: "Trust center" },
    ],
    ja: [
      { href: "/auth", label: "サインイン" },
      { href: "/compare-branches", label: "店舗比較" },
      { href: "/pairings", label: "ペアリング" },
      { href: "/policies", label: "ポリシー" },
      { href: "/trust", label: "信頼センター" },
    ],
    zh: [
      { href: "/auth", label: "登录" },
      { href: "/compare-branches", label: "门店对比" },
      { href: "/pairings", label: "饮品搭配" },
      { href: "/policies", label: "政策说明" },
      { href: "/trust", label: "信任中心" },
    ],
    ko: [
      { href: "/auth", label: "로그인" },
      { href: "/compare-branches", label: "지점 비교" },
      { href: "/pairings", label: "페어링" },
      { href: "/policies", label: "정책 안내" },
      { href: "/trust", label: "트러스트 센터" },
    ],
  } as const;

  return (
    <footer className="border-t border-white/6 bg-[#0a0909]/90">
      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-10 text-sm text-[#d8cbbb] sm:px-6 md:grid-cols-[1.1fr_0.9fr_0.9fr] lg:px-8">
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
        <div className="space-y-3 md:text-right">
          <div className="grid gap-2 text-[#d6c9b6] md:justify-items-end">
            {serviceLinks[locale].map((item) => (
              <Link key={item.href} href={item.href} locale={locale} className="transition-colors hover:text-white">
                {item.label}
              </Link>
            ))}
          </div>
          <p>{tFooter("hours")}</p>
          <p className="text-[#9f9386]">{tFooter("rights")}</p>
        </div>
      </div>
    </footer>
  );
}
