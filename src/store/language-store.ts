"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import type { AppLocale } from "@/i18n/routing";

interface LanguageState {
  locale: AppLocale;
  setLocale: (locale: AppLocale) => void;
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set) => ({
      locale: "th",
      setLocale: (locale) => set({ locale }),
    }),
    {
      name: "siam-lux-language",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
