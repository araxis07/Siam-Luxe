import { hasLocale } from "next-intl";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { JsonLd } from "@/components/app/json-ld";
import { CateringBuilderPage } from "@/components/catering/catering-builder-page";
import { routing, type AppLocale } from "@/i18n/routing";
import { getPageMetadata, getRestaurantSchema } from "@/lib/page-metadata";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return getPageMetadata(locale as AppLocale, "catering", `/${locale}/catering`);
}

export default async function CateringPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const appLocale = locale as AppLocale;
  const metadata = getPageMetadata(appLocale, "catering", `/${locale}/catering`);

  return (
    <>
      <JsonLd
        data={getRestaurantSchema(
          appLocale,
          `/${locale}/catering`,
          String(metadata.title),
          metadata.description ?? "",
        )}
      />
      <CateringBuilderPage locale={appLocale} />
    </>
  );
}
