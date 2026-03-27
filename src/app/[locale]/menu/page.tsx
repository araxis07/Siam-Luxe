import { hasLocale } from "next-intl";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";

import { MenuExperience } from "@/components/dishes/menu-experience";
import { routing, type AppLocale } from "@/i18n/routing";
import { getLocalizedCategories, getLocalizedDishes, getLocalizedRegions } from "@/lib/catalog";

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
  const menuEyebrow = {
    th: "เมนูของ Siam Lux",
    en: "Siam Lux Menu",
    ja: "Siam Lux メニュー",
    zh: "Siam Lux 菜单",
    ko: "Siam Lux 메뉴",
  }[appLocale];
  const dishes = getLocalizedDishes(appLocale);
  const categories = getLocalizedCategories(appLocale);
  const regions = getLocalizedRegions(appLocale);

  return (
    <section className="scene-section px-4 pt-10 pb-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 max-w-3xl">
          <p className="text-[0.66rem] uppercase tracking-[0.2em] text-[#cdb37d] sm:text-[0.7rem]">{menuEyebrow}</p>
          <h1 className="mt-3 font-heading text-[2.85rem] leading-tight text-white sm:text-[3.45rem]">{t("title")}</h1>
          <p className="mt-4 text-[0.98rem] leading-8 text-[#d1c4b2]">{t("subtitle")}</p>
        </div>

        <div className="mb-8">
          <p className="text-[0.66rem] uppercase tracking-[0.2em] text-[#cdb37d] sm:text-[0.7rem]">
            {t("regionalSelectionEyebrow")}
          </p>
          <h2 className="mt-3 font-heading text-[2.15rem] leading-tight text-white sm:text-[2.55rem]">
            {t("regionalSelectionTitle")}
          </h2>
          <p className="mt-3 max-w-3xl text-[0.95rem] leading-7 text-[#d1c4b2]">
            {t("regionalSelectionBody")}
          </p>
        </div>

        <div className="mb-10 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {regions.map((region) => {
            const dishCount = dishes.filter((dish) => dish.region === region.id).length;

            return (
              <div key={region.id} className="lux-panel-soft rounded-[1.8rem] px-5 py-5">
                <p className="text-[0.66rem] uppercase tracking-[0.18em] text-[#cdb37d]">
                  {t("regionCount", { count: dishCount })}
                </p>
                <h3 className="mt-3 font-heading text-[1.6rem] leading-tight text-white">{region.label}</h3>
                <p className="mt-3 text-[0.92rem] leading-7 text-[#cdbfae]">{region.description}</p>
              </div>
            );
          })}
        </div>

        <MenuExperience dishes={dishes} categories={categories} regions={regions} locale={appLocale} />
      </div>
    </section>
  );
}
