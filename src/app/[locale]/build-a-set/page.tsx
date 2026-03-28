import { hasLocale } from "next-intl";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { JsonLd } from "@/components/app/json-ld";
import { SetBuilderPage } from "@/components/sets/set-builder-page";
import { routing, type AppLocale } from "@/i18n/routing";
import { getPageMetadata, getRestaurantSchema } from "@/lib/page-metadata";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return getPageMetadata(locale as AppLocale, "buildSet", `/${locale}/build-a-set`);
}

export default async function BuildASetPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const appLocale = locale as AppLocale;
  const metadata = getPageMetadata(appLocale, "buildSet", `/${locale}/build-a-set`);

  return (
    <>
      <JsonLd
        data={getRestaurantSchema(
          appLocale,
          `/${locale}/build-a-set`,
          String(metadata.title),
          metadata.description ?? "",
        )}
      />
      <SetBuilderPage locale={appLocale} />
    </>
  );
}
