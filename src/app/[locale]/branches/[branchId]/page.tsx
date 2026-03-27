import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";

import { BranchDetailPage } from "@/components/branches/branch-detail-page";
import { routing, type AppLocale } from "@/i18n/routing";
import type { BranchId } from "@/lib/experience";

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

  return <BranchDetailPage locale={locale as AppLocale} branchId={branchId as BranchId} />;
}
