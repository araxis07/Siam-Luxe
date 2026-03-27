import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";

import { CheckoutExperience } from "@/components/checkout/checkout-experience";
import { routing, type AppLocale } from "@/i18n/routing";

export default async function CheckoutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  return (
    <section className="scene-section px-4 pt-10 pb-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <CheckoutExperience locale={locale as AppLocale} />
      </div>
    </section>
  );
}
