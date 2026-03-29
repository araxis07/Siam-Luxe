import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";

import { BranchDetailPage } from "@/components/branches/branch-detail-page";
import { routing, type AppLocale } from "@/i18n/routing";
import { getLocalizedDishes } from "@/lib/catalog";
import type { BranchId } from "@/lib/experience";
import { getServerSupabase } from "@/lib/server/auth";
import { getOperationalLocalizedDishes } from "@/lib/server/menu-operations";

const branchIds: BranchId[] = ["bangrak", "sukhumvit", "chiangmai"];

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    branchIds.map((branchId) => ({
      locale,
      branchId,
    })),
  );
}

export default async function BranchRoute({
  params,
}: {
  params: Promise<{ locale: string; branchId: string }>;
}) {
  const { locale, branchId } = await params;

  if (!hasLocale(routing.locales, locale) || !branchIds.includes(branchId as BranchId)) {
    notFound();
  }

  const appLocale = locale as AppLocale;
  let highlightedDishes = getLocalizedDishes(appLocale).filter((dish) => dish.featured).slice(0, 3);

  try {
    const supabase = await getServerSupabase();
    highlightedDishes = (await getOperationalLocalizedDishes(supabase, appLocale))
      .filter((dish) => dish.featured && dish.isAvailable !== false)
      .slice(0, 3);
  } catch {
    // Keep static fallback for SSG and local development without database connectivity.
  }

  return <BranchDetailPage locale={appLocale} branchId={branchId as BranchId} highlightedDishes={highlightedDishes} />;
}
