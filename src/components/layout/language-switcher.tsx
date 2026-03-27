"use client";

import { Globe2 } from "lucide-react";
import { startTransition } from "react";
import { useLocale, useTranslations } from "next-intl";

import type { AppLocale } from "@/i18n/routing";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLanguageStore } from "@/store/language-store";
import { usePathname, useRouter } from "@/i18n/navigation";

export function LanguageSwitcher() {
  const t = useTranslations("language");
  const locale = useLocale() as AppLocale;
  const router = useRouter();
  const pathname = usePathname();
  const setLocale = useLanguageStore((state) => state.setLocale);

  return (
    <Select
      value={locale}
      onValueChange={(nextValue) => {
        const nextLocale = nextValue as AppLocale;

        startTransition(() => {
          setLocale(nextLocale);
          router.replace(pathname, { locale: nextLocale });
        });
      }}
    >
      <SelectTrigger
        size="sm"
        aria-label={t("label")}
        className="glass-chip h-10 w-[132px] rounded-full border-white/10 bg-white/5 pl-3 text-white hover:bg-white/8"
      >
        <Globe2 className="size-4 text-[#d6b26a]" />
        <SelectValue />
      </SelectTrigger>
      <SelectContent align="end" className="rounded-2xl border-white/10 bg-[#120d0d]/95 text-white">
        <SelectItem value="th">{t("th")}</SelectItem>
        <SelectItem value="en">{t("en")}</SelectItem>
        <SelectItem value="ja">{t("ja")}</SelectItem>
        <SelectItem value="zh">{t("zh")}</SelectItem>
        <SelectItem value="ko">{t("ko")}</SelectItem>
      </SelectContent>
    </Select>
  );
}
