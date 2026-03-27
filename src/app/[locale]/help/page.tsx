import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";

import { HelpPage } from "@/components/help/help-page";
import { routing, type AppLocale } from "@/i18n/routing";

export default async function HelpRoute({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  return <HelpPage locale={locale as AppLocale} />;
}
