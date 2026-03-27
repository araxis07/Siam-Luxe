import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";

import { HeritagePage } from "@/components/heritage/heritage-page";
import { routing, type AppLocale } from "@/i18n/routing";

export default async function HeritageRoute({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  return <HeritagePage locale={locale as AppLocale} />;
}
