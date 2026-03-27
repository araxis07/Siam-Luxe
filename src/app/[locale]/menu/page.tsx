import { hasLocale } from "next-intl";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";

import { MenuExperience } from "@/components/dishes/menu-experience";
import { routing, type AppLocale } from "@/i18n/routing";
import { getLocalizedCategories, getLocalizedDishes } from "@/lib/catalog";

export default async function MenuPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const appLocale = locale as AppLocale;
  const t = await getTranslations({ locale: appLocale, namespace: "menu" });
  const dishes = getLocalizedDishes(appLocale);
  const categories = getLocalizedCategories(appLocale);

  return (
    <section className="scene-section px-4 pt-10 pb-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 max-w-3xl">
          <p className="text-xs uppercase tracking-[0.24em] text-[#cdb37d]">Siam Lux Menu</p>
          <h1 className="mt-3 font-heading text-6xl text-white sm:text-7xl">{t("title")}</h1>
          <p className="mt-4 text-lg leading-8 text-[#d1c4b2]">{t("subtitle")}</p>
        </div>
        <MenuExperience dishes={dishes} categories={categories} locale={appLocale} />
      </div>
    </section>
  );
}
