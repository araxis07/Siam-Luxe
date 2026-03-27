"use client";

import type { AppLocale } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import { getDietaryLabels } from "@/lib/experience";

export function DietaryBadges({
  dishId,
  locale,
  className,
}: {
  dishId: string;
  locale: AppLocale;
  className?: string;
}) {
  const labels = getDietaryLabels(locale, dishId);

  if (labels.length === 0) {
    return null;
  }

  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {labels.map((item) => (
        <span
          key={item.id}
          className={cn(
            "rounded-full border px-2.5 py-1 text-[0.64rem] uppercase tracking-[0.14em]",
            item.className,
          )}
        >
          {item.label}
        </span>
      ))}
    </div>
  );
}
