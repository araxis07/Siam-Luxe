import { hasLocale } from "next-intl";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { JsonLd } from "@/components/app/json-ld";
import { GiftCardShowcase } from "@/components/gift-cards/gift-card-showcase";
import { routing, type AppLocale } from "@/i18n/routing";
import { getPageMetadata, getRestaurantSchema } from "@/lib/page-metadata";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return getPageMetadata(locale as AppLocale, "giftCards", `/${locale}/gift-cards`);
}

export default async function GiftCardsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const appLocale = locale as AppLocale;
  const metadata = getPageMetadata(appLocale, "giftCards", `/${locale}/gift-cards`);

  return (
    <>
      <JsonLd
        data={getRestaurantSchema(
          appLocale,
          `/${locale}/gift-cards`,
          String(metadata.title),
          metadata.description ?? "",
        )}
      />
      <GiftCardShowcase locale={appLocale} />
    </>
  );
}
