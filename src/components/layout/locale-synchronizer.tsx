"use client";

import { useEffect } from "react";

import type { AppLocale } from "@/i18n/routing";
import { useLanguageStore } from "@/store/language-store";

export function LocaleSynchronizer({ locale }: { locale: AppLocale }) {
  const setLocale = useLanguageStore((state) => state.setLocale);

  useEffect(() => {
    setLocale(locale);
  }, [locale, setLocale]);

  return null;
}
