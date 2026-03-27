import Image from "next/image";
import { ChefHat, Crown, Flame, Leaf, Sparkles, Soup } from "lucide-react";
import { hasLocale } from "next-intl";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";

import { FeaturedDishes } from "@/components/dishes/featured-dishes";
import { Link } from "@/i18n/navigation";
import { routing, type AppLocale } from "@/i18n/routing";
import { getLocalizedCategories, getLocalizedDishes, getLocalizedPromotions } from "@/lib/catalog";

const categoryIconMap = {
  crown: Crown,
  leaf: Leaf,
  flame: Flame,
  bowl: Soup,
  sparkles: Sparkles,
} as const;

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const appLocale = locale as AppLocale;
  const tHome = await getTranslations({ locale: appLocale, namespace: "home" });
  const tCommon = await getTranslations({ locale: appLocale, namespace: "common" });
  const featuredDishes = getLocalizedDishes(appLocale).filter((dish) => dish.featured).slice(0, 3);
  const categories = getLocalizedCategories(appLocale);
  const promotions = getLocalizedPromotions(appLocale);

  return (
    <>
      <section className="scene-section overflow-hidden px-4 pt-10 pb-14 sm:px-6 sm:pt-16 lg:px-8">
        <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="relative z-10">
            <div className="glass-chip inline-flex rounded-full px-4 py-2 text-xs uppercase tracking-[0.26em] text-[#e4d39a]">
              {tHome("hero.eyebrow")}
            </div>
            <h1 className="mt-6 max-w-3xl font-heading text-6xl leading-[0.92] text-white sm:text-7xl lg:text-[5.5rem]">
              <span className="gold-gradient-text">{tHome("hero.title")}</span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-[#d2c5b5]">
              {tHome("hero.description")}
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/menu"
                locale={appLocale}
                className="button-shine inline-flex h-12 items-center justify-center rounded-full bg-[#d6b26a] px-6 text-sm font-semibold text-[#1b130f] transition-colors hover:bg-[#e4c987]"
              >
                {tHome("hero.primaryCta")}
              </Link>
              <Link
                href="/checkout"
                locale={appLocale}
                className="inline-flex h-12 items-center justify-center rounded-full border border-white/10 bg-white/5 px-6 text-sm font-semibold text-white transition-colors hover:bg-white/10"
              >
                {tHome("hero.secondaryCta")}
              </Link>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {[
                tHome("hero.ratingLabel"),
                tHome("hero.deliveryLabel"),
                tHome("hero.tablesideLabel"),
              ].map((label) => (
                <div
                  key={label}
                  className="lux-panel-soft rounded-3xl px-4 py-4 text-sm leading-6 text-[#d4c8b7]"
                >
                  {label}
                </div>
              ))}
            </div>
          </div>

          <div className="relative h-[420px] lg:h-[560px]">
            <div className="depth-layer depth-0 absolute inset-x-8 top-10 h-72 rounded-full bg-[#7d1821]/30 blur-3xl" />
            <div className="depth-layer depth-1 absolute right-8 top-16 h-52 w-52 rounded-full bg-[#14563e]/22 blur-3xl" />
              <div className="float-delayed glass-chip absolute left-3 top-10 z-10 rounded-3xl px-4 py-3 text-sm text-[#f2e2b1] shadow-xl shadow-black/25">
                {tHome("deliveryChip")}
              </div>
            <div className="float-slow glass-chip absolute bottom-10 right-4 z-10 rounded-3xl px-4 py-3 text-sm text-[#f2e2b1] shadow-xl shadow-black/25">
              {tHome("heatChip")}
            </div>
            <div className="relative h-full overflow-hidden rounded-[2.5rem] border border-white/10 bg-gradient-to-br from-[#42131a] via-[#20100f] to-[#090808] shadow-[0_40px_120px_rgba(0,0,0,0.45)]">
              <div className="thai-pattern absolute inset-0 opacity-20" />
              <Image
                src="/images/hero-platter.svg"
                alt={tCommon("brand")}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#080606] via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
                <div className="lux-panel-soft max-w-md rounded-[2rem] p-5">
                  <div className="flex items-center gap-3 text-[#f2dfa6]">
                    <ChefHat className="size-5" />
                    <span className="text-xs uppercase tracking-[0.24em]">
                      {tHome("chefCardEyebrow")}
                    </span>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-[#dacdbd]">
                    {tHome("chefCardBody")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="scene-section px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-[#cdb37d]">
              {tHome("selectionLabel")}
            </p>
              <h2 className="mt-3 font-heading text-5xl text-white">
                {tHome("featuredTitle")}
              </h2>
              <p className="mt-3 max-w-2xl text-[#d1c4b2]">{tHome("featuredBody")}</p>
            </div>
            <Link
              href="/menu"
              locale={appLocale}
              className="inline-flex h-11 items-center justify-center rounded-full border border-white/10 bg-white/5 px-5 text-sm text-white transition-colors hover:bg-white/10"
            >
              {tCommon("browseMenu")}
            </Link>
          </div>
          <FeaturedDishes dishes={featuredDishes} locale={appLocale} />
        </div>
      </section>

      <section className="scene-section px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8">
            <p className="text-xs uppercase tracking-[0.24em] text-[#cdb37d]">
              {tHome("categoryEyebrow")}
            </p>
            <h2 className="mt-3 font-heading text-5xl text-white">
              {tHome("categoriesTitle")}
            </h2>
            <p className="mt-3 max-w-2xl text-[#d1c4b2]">{tHome("categoriesBody")}</p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            {categories.map((category) => {
              const Icon = categoryIconMap[category.icon];

              return (
                <div key={category.id} className="lux-panel-soft rounded-[2rem] p-5">
                  <div className="inline-flex size-12 items-center justify-center rounded-2xl bg-[#d6b26a]/12 text-[#e4cd93]">
                    <Icon className="size-5" />
                  </div>
                  <h3 className="mt-4 font-heading text-3xl text-white">{category.label}</h3>
                  <p className="mt-3 text-sm leading-6 text-[#cdbfae]">{category.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="scene-section px-4 pt-14 pb-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8">
            <p className="text-xs uppercase tracking-[0.24em] text-[#cdb37d]">
              {tHome("promotionEyebrow")}
            </p>
            <h2 className="mt-3 font-heading text-5xl text-white">
              {tHome("promotionsTitle")}
            </h2>
            <p className="mt-3 max-w-2xl text-[#d1c4b2]">{tHome("promotionsBody")}</p>
          </div>
          <div className="grid gap-6 lg:grid-cols-3">
            {promotions.map((promotion) => (
              <div
                key={promotion.id}
                className={`lux-panel relative overflow-hidden rounded-[2rem] bg-gradient-to-br p-6 ${promotion.accentClass}`}
              >
                <div className="absolute inset-0 bg-gradient-to-br opacity-85" />
                <div className="relative">
                  <div className="glass-chip inline-flex rounded-full px-3 py-1 text-xs uppercase tracking-[0.2em] text-[#f3e3af]">
                    {promotion.code}
                  </div>
                  <h3 className="mt-4 font-heading text-4xl text-white">{promotion.title}</h3>
                  <p className="mt-4 text-sm leading-6 text-[#d8cab8]">{promotion.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
