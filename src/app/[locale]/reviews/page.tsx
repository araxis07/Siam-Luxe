import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";

import { ReviewCenter } from "@/components/reviews/review-center";
import { routing, type AppLocale } from "@/i18n/routing";

export default async function ReviewsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  return <ReviewCenter locale={locale as AppLocale} />;
}
