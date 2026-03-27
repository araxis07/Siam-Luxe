import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["th", "en", "ja", "zh", "ko"],
  defaultLocale: "th",
  localePrefix: "always",
});

export type AppLocale = (typeof routing.locales)[number];
