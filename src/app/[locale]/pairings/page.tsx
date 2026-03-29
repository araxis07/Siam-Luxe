import { hasLocale } from "next-intl";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { JsonLd } from "@/components/app/json-ld";
import { BeveragePairingPage } from "@/components/pairings/beverage-pairing-page";
import { routing, type AppLocale } from "@/i18n/routing";
import { getLocalizedDishes } from "@/lib/catalog";
import { getPageMetadata, getRestaurantSchema } from "@/lib/page-metadata";
import { getServerSupabase } from "@/lib/server/auth";
import { getOperationalLocalizedDishes } from "@/lib/server/menu-operations";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return getPageMetadata(locale as AppLocale, "pairings", `/${locale}/pairings`);
}

export default async function PairingsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const appLocale = locale as AppLocale;
  const metadata = getPageMetadata(appLocale, "pairings", `/${locale}/pairings`);
  let dishes = getLocalizedDishes(appLocale);

  try {
    const supabase = await getServerSupabase();
    dishes = (await getOperationalLocalizedDishes(supabase, appLocale)).filter((dish) => dish.isAvailable !== false);
  } catch {
    // Keep static fallback for SSG and local development without database connectivity.
  }

  return (
    <>
      <JsonLd
        data={getRestaurantSchema(
          appLocale,
          `/${locale}/pairings`,
          String(metadata.title),
          metadata.description ?? "",
        )}
      />
      <BeveragePairingPage locale={appLocale} dishes={dishes} />
    </>
  );
}
