import type { AppLocale } from "@/i18n/routing";

const supportedLocales: AppLocale[] = ["th", "en", "ja", "zh", "ko"];

export function inferLocaleFromPathname(pathname: string | undefined | null): AppLocale {
  if (!pathname) {
    return "th";
  }

  const firstSegment = pathname.split("/").filter(Boolean)[0];

  if (supportedLocales.includes(firstSegment as AppLocale)) {
    return firstSegment as AppLocale;
  }

  return "th";
}

export function inferLocaleFromAcceptLanguage(value: string | null | undefined): AppLocale {
  const normalized = (value ?? "").toLowerCase();

  if (normalized.includes("ja")) return "ja";
  if (normalized.includes("zh")) return "zh";
  if (normalized.includes("ko")) return "ko";
  if (normalized.includes("en")) return "en";

  return "th";
}
