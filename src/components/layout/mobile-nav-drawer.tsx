"use client";

import { Menu, Sparkles } from "lucide-react";
import { useState } from "react";

import type { AppLocale } from "@/i18n/routing";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { getExperienceCopy, getFeatureLinks, getLocalizedBranch } from "@/lib/experience";
import { useExperienceStore } from "@/store/experience-store";

const primaryLinks = {
  th: [
    { href: "/", label: "หน้าแรก" },
    { href: "/menu", label: "เมนู" },
    { href: "/specials", label: "ชุดพิเศษ" },
    { href: "/heritage", label: "เรื่องราวร้าน" },
    { href: "/reservation", label: "จองโต๊ะ" },
    { href: "/account", label: "บัญชี" },
  ],
  en: [
    { href: "/", label: "Home" },
    { href: "/menu", label: "Menu" },
    { href: "/specials", label: "Specials" },
    { href: "/heritage", label: "Heritage" },
    { href: "/reservation", label: "Reservation" },
    { href: "/account", label: "Account" },
  ],
  ja: [
    { href: "/", label: "ホーム" },
    { href: "/menu", label: "メニュー" },
    { href: "/specials", label: "特集" },
    { href: "/heritage", label: "物語" },
    { href: "/reservation", label: "予約" },
    { href: "/account", label: "アカウント" },
  ],
  zh: [
    { href: "/", label: "首页" },
    { href: "/menu", label: "菜单" },
    { href: "/specials", label: "精选套餐" },
    { href: "/heritage", label: "品牌故事" },
    { href: "/reservation", label: "预订" },
    { href: "/account", label: "账户" },
  ],
  ko: [
    { href: "/", label: "홈" },
    { href: "/menu", label: "메뉴" },
    { href: "/specials", label: "스페셜" },
    { href: "/heritage", label: "스토리" },
    { href: "/reservation", label: "예약" },
    { href: "/account", label: "계정" },
  ],
} as const;

export function MobileNavDrawer({ locale }: { locale: AppLocale }) {
  const [open, setOpen] = useState(false);
  const copy = getExperienceCopy(locale);
  const selectedBranchId = useExperienceStore((state) => state.selectedBranchId);
  const serviceMode = useExperienceStore((state) => state.serviceMode);
  const branch = getLocalizedBranch(locale, selectedBranchId);
  const featureLinks = getFeatureLinks(locale);

  return (
    <>
      <Button
        type="button"
        variant="outline"
        size="icon-sm"
        aria-label="Open navigation"
        className="rounded-full border-white/10 bg-white/5 text-white hover:bg-white/10 md:hidden"
        onClick={() => setOpen(true)}
      >
        <Menu className="size-4.5" />
      </Button>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent
          side="left"
          className="w-full max-w-[100vw] border-r border-white/10 bg-[#120c0d]/96 p-0 text-white sm:max-w-sm"
        >
          <SheetHeader className="border-b border-white/8 bg-white/3 pr-14">
            <div className="inline-flex size-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#f2d48b] via-[#d6b26a] to-[#9f6e26] text-[#130d0b] shadow-lg shadow-black/30">
              <Sparkles className="size-5" />
            </div>
            <SheetTitle className="mt-4 text-[1.8rem] text-white">Siam Lux</SheetTitle>
            <SheetDescription className="text-[#cdbfae]">
              {branch.name} · {copy.serviceModes[serviceMode]}
            </SheetDescription>
          </SheetHeader>

          <div className="space-y-6 p-4">
            <div className="grid gap-2">
              {primaryLinks[locale].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  locale={locale}
                  className="rounded-[1.2rem] border border-white/10 bg-white/5 px-4 py-3 text-white transition-colors hover:bg-white/10"
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </div>

            <div>
              <p className="mb-3 text-[0.66rem] uppercase tracking-[0.18em] text-[#cdb37d]">
                {copy.labels.quickAccess}
              </p>
              <div className="grid gap-2">
                {featureLinks.map((item) => (
                  <Link
                    key={item.id}
                    href={item.href}
                    locale={locale}
                    className="rounded-[1.2rem] border border-white/10 bg-black/20 px-4 py-3 text-[#d7cab8] transition-colors hover:bg-white/8 hover:text-white"
                    onClick={() => setOpen(false)}
                  >
                    {item.title}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
