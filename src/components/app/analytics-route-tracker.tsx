"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

import type { AppLocale } from "@/i18n/routing";
import { trackPageView } from "@/lib/analytics";

export function AnalyticsRouteTracker({ locale }: { locale: AppLocale }) {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname) {
      return;
    }

    trackPageView(pathname, locale);
  }, [locale, pathname]);

  return null;
}
