import type { AppLocale } from "@/i18n/routing";

const localeMap: Record<AppLocale, string> = {
  th: "th-TH",
  en: "en-US",
  ja: "ja-JP",
  zh: "zh-CN",
  ko: "ko-KR",
};

export function formatPrice(value: number, locale: AppLocale) {
  return new Intl.NumberFormat(localeMap[locale], {
    style: "currency",
    currency: "THB",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatCount(value: number, locale: AppLocale) {
  return new Intl.NumberFormat(localeMap[locale]).format(value);
}
