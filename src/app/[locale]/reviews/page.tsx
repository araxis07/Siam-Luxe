import { hasLocale } from "next-intl";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { JsonLd } from "@/components/app/json-ld";
import { ReviewCenter } from "@/components/reviews/review-center";
import { routing, type AppLocale } from "@/i18n/routing";
import { getPageMetadata, getRestaurantSchema } from "@/lib/page-metadata";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return getPageMetadata(locale as AppLocale, "reviews", `/${locale}/reviews`);
}

export default async function ReviewsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const appLocale = locale as AppLocale;
  const metadata = getPageMetadata(appLocale, "reviews", `/${locale}/reviews`);

  return (
    <>
      <JsonLd
        data={getRestaurantSchema(
          appLocale,
          `/${locale}/reviews`,
          String(metadata.title),
          metadata.description ?? "",
        )}
      />
      <ReviewCenter locale={appLocale} />
    </>
  );
}
