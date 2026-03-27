import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";

import { ContactPage } from "@/components/contact/contact-page";
import { routing, type AppLocale } from "@/i18n/routing";

export default async function ContactRoute({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  return <ContactPage locale={locale as AppLocale} />;
}
