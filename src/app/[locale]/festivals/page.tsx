import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";

import { FestivalsPage } from "@/components/festivals/festivals-page";
import { routing, type AppLocale } from "@/i18n/routing";

export default async function FestivalsRoute({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  return <FestivalsPage locale={locale as AppLocale} />;
}
