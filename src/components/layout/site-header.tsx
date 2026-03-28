import { Sparkles, UserRound } from "lucide-react";
import { useTranslations } from "next-intl";

import type { AppLocale } from "@/i18n/routing";
import { Link } from "@/i18n/navigation";
import { CartTrigger } from "@/components/cart/cart-trigger";
import { LanguageSwitcher } from "@/components/layout/language-switcher";
import { MobileNavDrawer } from "@/components/layout/mobile-nav-drawer";

export function SiteHeader({ locale }: { locale: AppLocale }) {
  const tCommon = useTranslations("common");
  const tNav = useTranslations("nav");
  const extraNavLabels = {
    th: {
      specials: "ชุดพิเศษ",
      reservation: "จองโต๊ะ",
      account: "บัญชี",
      signIn: "เข้าสู่ระบบ",
    },
    en: {
      specials: "Specials",
      reservation: "Reservation",
      account: "Account",
      signIn: "Sign in",
    },
    ja: {
      specials: "特集",
      reservation: "予約",
      account: "アカウント",
      signIn: "サインイン",
    },
    zh: {
      specials: "精选套餐",
      reservation: "预订",
      account: "账户",
      signIn: "登录",
    },
    ko: {
      specials: "스페셜",
      reservation: "예약",
      account: "계정",
      signIn: "로그인",
    },
  } as const;
  const navItems = [
    { href: "/", label: tNav("home") },
    { href: "/menu", label: tNav("menu") },
    { href: "/specials", label: extraNavLabels[locale].specials },
    { href: "/heritage", label: tNav("heritage") },
    { href: "/reservation", label: extraNavLabels[locale].reservation },
    { href: "/account", label: extraNavLabels[locale].account },
  ] as const;
  const brandMark = (
    <Link
      href="/"
      locale={locale}
      className="inline-flex min-w-0 items-center gap-3 rounded-full border border-white/10 bg-white/5 px-3 py-2 shadow-[0_14px_34px_rgba(0,0,0,0.18)] transition-colors hover:bg-white/8"
    >
      <span className="inline-flex size-10 items-center justify-center rounded-full bg-gradient-to-br from-[#f2d48b] via-[#d6b26a] to-[#9f6e26] text-[#130d0b] shadow-lg shadow-black/30">
        <Sparkles className="size-4" />
      </span>
      <span className="flex min-w-0 flex-col">
        <span className="truncate font-heading text-[1.02rem] leading-none tracking-[0.12em] text-white uppercase sm:text-[1.1rem]">
          {tCommon("brand")}
        </span>
        <span className="truncate text-[0.58rem] tracking-[0.16em] text-[#d6c9b6] uppercase sm:text-[0.64rem]">
          {tCommon("tagline")}
        </span>
      </span>
    </Link>
  );
  const utilityTray = (
    <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/4 p-1.5 shadow-[0_18px_40px_rgba(0,0,0,0.2)]">
      <Link
        href="/auth"
        locale={locale}
        className="inline-flex h-10 shrink-0 items-center gap-2 rounded-full bg-gradient-to-r from-[#d6b26a]/18 via-[#b28747]/16 to-[#6b4b19]/10 px-3.5 text-[0.9rem] text-[#f1dfb0] transition-colors hover:from-[#d6b26a]/24 hover:via-[#b28747]/22 hover:to-[#6b4b19]/16 hover:text-white"
      >
        <UserRound className="size-4" />
        <span className="hidden xl:inline">{extraNavLabels[locale].signIn}</span>
      </Link>
      <LanguageSwitcher compact />
      <CartTrigger compact />
    </div>
  );

  return (
    <header className="sticky top-0 z-40 border-b border-white/6 bg-[#0f0a0b]/75 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 py-2.5 sm:px-6 lg:px-8">
        <div className="hidden xl:grid xl:grid-cols-[max-content_1fr_max-content] xl:items-center xl:gap-5">
          <div className="justify-self-start">{brandMark}</div>
          <nav className="justify-self-center rounded-[1.7rem] border border-white/8 bg-white/[0.045] p-1.5 shadow-[0_20px_44px_rgba(0,0,0,0.18)]">
            <div className="inline-flex items-center justify-center gap-1.5">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  locale={locale}
                  className="rounded-full px-3.5 py-2 text-[0.9rem] text-[#e8ddd0] transition-colors hover:bg-white/6 hover:text-white"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </nav>
          <div className="justify-self-end">{utilityTray}</div>
        </div>

        <div className="xl:hidden">
          <div className="flex items-center justify-between gap-3 sm:gap-4">
            {brandMark}

            <div className="flex items-center gap-2">
              <div className="hidden lg:flex items-center gap-2 rounded-full border border-white/10 bg-white/4 p-1.5 shadow-[0_18px_40px_rgba(0,0,0,0.2)]">
                <Link
                  href="/auth"
                  locale={locale}
                  className="inline-flex h-10 shrink-0 items-center gap-2 rounded-full bg-gradient-to-r from-[#d6b26a]/18 via-[#b28747]/16 to-[#6b4b19]/10 px-3.5 text-[0.9rem] text-[#f1dfb0] transition-colors hover:from-[#d6b26a]/24 hover:via-[#b28747]/22 hover:to-[#6b4b19]/16 hover:text-white"
                >
                  <UserRound className="size-4" />
                  <span className="hidden xl:inline">{extraNavLabels[locale].signIn}</span>
                </Link>
                <LanguageSwitcher compact />
                <CartTrigger compact />
              </div>

              <div className="flex items-center gap-2 lg:hidden">
                <LanguageSwitcher />
                <CartTrigger />
                <MobileNavDrawer locale={locale} />
              </div>
            </div>
          </div>

          <div className="relative hidden lg:flex justify-center pt-1 -mt-1.5">
            <nav className="inline-flex flex-wrap items-center justify-center gap-1.5 rounded-[1.7rem] border border-white/8 bg-white/[0.045] p-1.5 shadow-[0_20px_44px_rgba(0,0,0,0.18)]">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  locale={locale}
                  className="rounded-full px-3.5 py-2 text-[0.9rem] text-[#e8ddd0] transition-colors hover:bg-white/6 hover:text-white"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
}
