import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";

import { FavoritesPage } from "@/components/favorites/favorites-page";
import { routing, type AppLocale } from "@/i18n/routing";

export default async function FavoritesRoute({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  return <FavoritesPage locale={locale as AppLocale} />;
}
