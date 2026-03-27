import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";

import { PrivateDiningPage } from "@/components/private-dining/private-dining-page";
import { routing, type AppLocale } from "@/i18n/routing";

export default async function PrivateDiningRoute({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  return <PrivateDiningPage locale={locale as AppLocale} />;
}
