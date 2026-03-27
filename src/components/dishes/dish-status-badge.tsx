import type { AppLocale } from "@/i18n/routing";
import { getDishStatus } from "@/lib/premium";

export function DishStatusBadge({
  dishId,
  locale,
}: {
  dishId: string;
  locale: AppLocale;
}) {
  const status = getDishStatus(locale, dishId);

  if (status.id === "available") {
    return null;
  }

  return (
    <span className={`rounded-full border px-3 py-1 text-[0.62rem] uppercase tracking-[0.16em] ${status.className}`}>
      {status.label}
    </span>
  );
}
