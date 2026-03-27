import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";

import { AccountExperience } from "@/components/account/account-experience";
import { routing, type AppLocale } from "@/i18n/routing";

export default async function AccountPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  return <AccountExperience locale={locale as AppLocale} />;
}
