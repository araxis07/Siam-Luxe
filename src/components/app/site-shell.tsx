import type { ReactNode } from "react";

import type { AppLocale } from "@/i18n/routing";
import { AnalyticsRouteTracker } from "@/components/app/analytics-route-tracker";
import { PageTransition } from "@/components/app/page-transition";
import { SiteShellClientLayers } from "@/components/app/site-shell-client-layers";
import { ExperienceBar } from "@/components/layout/experience-bar";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";

export function SiteShell({
  children,
  locale,
}: {
  children: ReactNode;
  locale: AppLocale;
}) {
  const skipLinkText = {
    th: "ข้ามไปยังเนื้อหาหลัก",
    en: "Skip to main content",
    ja: "本文へスキップ",
    zh: "跳到主要内容",
    ko: "본문으로 건너뛰기",
  } as const;

  return (
    <div className="relative flex min-h-screen flex-col">
      <a
        href="#main-content"
        className="sr-only absolute left-4 top-4 z-[70] rounded-full bg-[#d6b26a] px-4 py-2 text-sm font-medium text-[#1b130f] focus:not-sr-only"
      >
        {skipLinkText[locale]}
      </a>
      <AnalyticsRouteTracker locale={locale} />
      <div className="pointer-events-none absolute inset-x-0 top-0 z-0 h-[520px]">
        <div className="depth-layer depth-0 mx-auto mt-[-5rem] h-72 w-72 rounded-full bg-[#7d1821]/35 blur-3xl" />
        <div className="depth-layer depth-1 ml-auto mt-20 h-60 w-60 rounded-full bg-[#15563f]/28 blur-3xl" />
      </div>
      <SiteHeader locale={locale} />
      <ExperienceBar locale={locale} />
      <main id="main-content" className="relative z-10 flex-1 focus:outline-none">
        <PageTransition>{children}</PageTransition>
      </main>
      <SiteFooter locale={locale} />
      <SiteShellClientLayers locale={locale} />
    </div>
  );
}
