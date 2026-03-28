import { hasLocale } from "next-intl";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { JsonLd } from "@/components/app/json-ld";
import { TrackingExperience } from "@/components/tracking/tracking-experience";
import { routing, type AppLocale } from "@/i18n/routing";
import { getPageMetadata, getRestaurantSchema } from "@/lib/page-metadata";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return getPageMetadata(locale as AppLocale, "tracking", `/${locale}/tracking`);
}

export default async function TrackingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const appLocale = locale as AppLocale;
  const metadata = getPageMetadata(appLocale, "tracking", `/${locale}/tracking`);

  return (
    <>
      <JsonLd
        data={getRestaurantSchema(
          appLocale,
          `/${locale}/tracking`,
          String(metadata.title),
          metadata.description ?? "",
        )}
      />
      <section className="scene-section px-4 pt-10 pb-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <TrackingExperience locale={appLocale} />
        </div>
      </section>
    </>
  );
}
