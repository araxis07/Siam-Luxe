"use client";

import { Search } from "lucide-react";
import { startTransition, useDeferredValue, useState } from "react";
import { useTranslations } from "next-intl";

import type { AppLocale } from "@/i18n/routing";
import type {
  CategoryId,
  LocalizedCategory,
  LocalizedMenuDish,
  LocalizedRegion,
  RegionId,
} from "@/lib/catalog";
import { getExperienceCopy } from "@/lib/experience";
import { ChefRecommendations } from "@/components/dishes/chef-recommendations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DishCard } from "@/components/dishes/dish-card";

type SpiceFilter = "all" | "mild" | "medium" | "hot";
type SortMode = "recommended" | "price" | "rating" | "spicy";

function matchesSpiceFilter(baseSpice: number, filter: SpiceFilter) {
  if (filter === "all") return true;
  if (filter === "mild") return baseSpice <= 2;
  if (filter === "medium") return baseSpice >= 3 && baseSpice <= 4;
  return baseSpice >= 5;
}

export function MenuExperience({
  dishes,
  categories,
  regions,
  locale,
}: {
  dishes: LocalizedMenuDish[];
  categories: LocalizedCategory[];
  regions: LocalizedRegion[];
  locale: AppLocale;
}) {
  const t = useTranslations("menu");
  const copy = getExperienceCopy(locale);
  const [query, setQuery] = useState("");
  const [region, setRegion] = useState<RegionId | "all">("all");
  const [category, setCategory] = useState<CategoryId | "all">("all");
  const [spiceFilter, setSpiceFilter] = useState<SpiceFilter>("all");
  const [sortMode, setSortMode] = useState<SortMode>("recommended");
  const deferredQuery = useDeferredValue(query);
  const normalizedQuery = deferredQuery.trim().toLowerCase();

  const suggestions =
    normalizedQuery.length === 0
      ? []
      : dishes
          .filter(
            (dish) =>
              dish.name.toLowerCase().includes(normalizedQuery) ||
              dish.description.toLowerCase().includes(normalizedQuery),
          )
          .slice(0, 5);

  const filteredDishes = dishes
    .filter((dish) => {
      const matchesQuery =
        normalizedQuery.length === 0 ||
        dish.name.toLowerCase().includes(normalizedQuery) ||
        dish.description.toLowerCase().includes(normalizedQuery) ||
        dish.categoryLabel.toLowerCase().includes(normalizedQuery) ||
        dish.regionLabel.toLowerCase().includes(normalizedQuery);

      const matchesRegion = region === "all" || dish.region === region;
      const matchesCategory = category === "all" || dish.category === category;
      const matchesSpice = matchesSpiceFilter(dish.baseSpice, spiceFilter);

      return matchesQuery && matchesRegion && matchesCategory && matchesSpice;
    })
    .sort((left, right) => {
      if (sortMode === "price") return left.price - right.price;
      if (sortMode === "rating") return right.rating - left.rating;
      if (sortMode === "spicy") return right.baseSpice - left.baseSpice;
      return Number(right.featured) - Number(left.featured) || right.rating - left.rating;
    });

  return (
    <div className="space-y-6">
      <div className="lux-panel rounded-[2rem] p-4 sm:p-5">
        <div className="grid gap-4 xl:grid-cols-[1.2fr_0.76fr_0.76fr_0.58fr_0.7fr]">
          <label className="space-y-2">
            <span className="text-[0.66rem] uppercase tracking-[0.18em] text-[#cdb37d]">
              {t("searchLabel")}
            </span>
            <div className="relative">
              <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-[#a99883]" />
              <Input
                value={query}
                onChange={(event) => {
                  const nextQuery = event.target.value;
                  startTransition(() => setQuery(nextQuery));
                }}
                placeholder={t("searchPlaceholder")}
                className="h-12 rounded-full border-white/10 bg-white/4 pl-11 text-white placeholder:text-[#8f8579]"
              />
              {suggestions.length > 0 ? (
                <div className="absolute left-0 right-0 top-[calc(100%+0.5rem)] z-20 rounded-[1.5rem] border border-white/10 bg-[#120d0d]/96 p-2 shadow-2xl shadow-black/30">
                  <p className="px-3 py-2 text-[0.64rem] uppercase tracking-[0.18em] text-[#cdb37d]">
                    {copy.labels.suggestions}
                  </p>
                  {suggestions.map((suggestion) => (
                    <button
                      key={suggestion.id}
                      type="button"
                      className="flex w-full items-start justify-between gap-3 rounded-[1rem] px-3 py-3 text-left transition-colors hover:bg-white/7"
                      onClick={() => setQuery(suggestion.name)}
                    >
                      <span>
                        <span className="block text-white">{suggestion.name}</span>
                        <span className="mt-1 block text-sm text-[#bdaa99]">
                          {suggestion.regionLabel} · {suggestion.categoryLabel}
                        </span>
                      </span>
                      <span className="text-sm text-[#ecd8a0]">{suggestion.rating.toFixed(1)}</span>
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
          </label>
          <label className="space-y-2">
            <span className="text-[0.66rem] uppercase tracking-[0.18em] text-[#cdb37d]">
              {t("regionLabel")}
            </span>
            <Select
              value={region}
              onValueChange={(value) => startTransition(() => setRegion(value as RegionId | "all"))}
            >
              <SelectTrigger className="h-12 w-full rounded-full border-white/10 bg-white/4 px-4 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="rounded-2xl border-white/10 bg-[#120d0d]/96 text-white">
                <SelectItem value="all">{t("allRegions")}</SelectItem>
                {regions.map((item) => (
                  <SelectItem key={item.id} value={item.id}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </label>
          <label className="space-y-2">
            <span className="text-[0.66rem] uppercase tracking-[0.18em] text-[#cdb37d]">
              {t("categoryLabel")}
            </span>
            <Select
              value={category}
              onValueChange={(value) => startTransition(() => setCategory(value as CategoryId | "all"))}
            >
              <SelectTrigger className="h-12 w-full rounded-full border-white/10 bg-white/4 px-4 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="rounded-2xl border-white/10 bg-[#120d0d]/96 text-white">
                <SelectItem value="all">{t("allCategories")}</SelectItem>
                {categories.map((item) => (
                  <SelectItem key={item.id} value={item.id}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </label>
          <label className="space-y-2">
            <span className="text-[0.66rem] uppercase tracking-[0.18em] text-[#cdb37d]">
              {t("spiceLabel")}
            </span>
            <Select
              value={spiceFilter}
              onValueChange={(value) => startTransition(() => setSpiceFilter(value as SpiceFilter))}
            >
              <SelectTrigger className="h-12 w-full rounded-full border-white/10 bg-white/4 px-4 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="rounded-2xl border-white/10 bg-[#120d0d]/96 text-white">
                <SelectItem value="all">{t("allSpice")}</SelectItem>
                <SelectItem value="mild">{t("spiceMild")}</SelectItem>
                <SelectItem value="medium">{t("spiceMedium")}</SelectItem>
                <SelectItem value="hot">{t("spiceHot")}</SelectItem>
              </SelectContent>
            </Select>
          </label>
          <label className="space-y-2">
            <span className="text-[0.66rem] uppercase tracking-[0.18em] text-[#cdb37d]">
              {t("sortLabel")}
            </span>
            <Select
              value={sortMode}
              onValueChange={(value) => startTransition(() => setSortMode(value as SortMode))}
            >
              <SelectTrigger className="h-12 w-full rounded-full border-white/10 bg-white/4 px-4 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="rounded-2xl border-white/10 bg-[#120d0d]/96 text-white">
                <SelectItem value="recommended">{t("sortRecommended")}</SelectItem>
                <SelectItem value="price">{t("sortPriceLow")}</SelectItem>
                <SelectItem value="rating">{t("sortRating")}</SelectItem>
                <SelectItem value="spicy">{t("sortSpicy")}</SelectItem>
              </SelectContent>
            </Select>
          </label>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <p className="mb-3 text-[0.66rem] uppercase tracking-[0.18em] text-[#bca16a]">
            {t("quickRegions")}
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <Button
              type="button"
              size="sm"
              variant={region === "all" ? "default" : "outline"}
              className={
                region === "all"
                  ? "rounded-full bg-[#d6b26a] text-[#1b130f] hover:bg-[#e4c987]"
                  : "rounded-full border-white/10 bg-white/5 text-white hover:bg-white/10"
              }
              onClick={() => setRegion("all")}
            >
              {t("allRegions")}
            </Button>
            {regions.map((item) => (
              <Button
                key={item.id}
                type="button"
                size="sm"
                variant={region === item.id ? "default" : "outline"}
                className={
                  region === item.id
                    ? "rounded-full bg-[#d6b26a] text-[#1b130f] hover:bg-[#e4c987]"
                    : "rounded-full border-white/10 bg-white/5 text-white hover:bg-white/10"
                }
                onClick={() => setRegion(item.id)}
              >
                {item.label}
              </Button>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-3 text-[0.66rem] uppercase tracking-[0.18em] text-[#bca16a]">
            {t("quickCategories")}
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <Button
              type="button"
              size="sm"
              variant={category === "all" ? "default" : "outline"}
              className={
                category === "all"
                  ? "rounded-full bg-[#d6b26a] text-[#1b130f] hover:bg-[#e4c987]"
                  : "rounded-full border-white/10 bg-white/5 text-white hover:bg-white/10"
              }
              onClick={() => setCategory("all")}
            >
              {t("allCategories")}
            </Button>
            {categories.map((item) => (
              <Button
                key={item.id}
                type="button"
                size="sm"
                variant={category === item.id ? "default" : "outline"}
                className={
                  category === item.id
                    ? "rounded-full bg-[#d6b26a] text-[#1b130f] hover:bg-[#e4c987]"
                    : "rounded-full border-white/10 bg-white/5 text-white hover:bg-white/10"
                }
                onClick={() => setCategory(item.id)}
              >
                {item.label}
              </Button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-[#cabda9]">{t("results", { count: filteredDishes.length })}</p>
        <div className="flex flex-wrap items-center gap-2 text-[0.72rem] uppercase tracking-[0.16em] text-[#bca16a]">
          {region !== "all" ? (
            <span className="rounded-full border border-[#d6b26a]/20 bg-[#d6b26a]/10 px-3 py-1 text-[#ecd8a0]">
              {regions.find((item) => item.id === region)?.label}
            </span>
          ) : null}
          {category !== "all" ? (
            <span className="rounded-full border border-white/10 bg-white/6 px-3 py-1 text-white">
              {categories.find((item) => item.id === category)?.label}
            </span>
          ) : null}
        </div>
      </div>

      {filteredDishes.length === 0 ? (
        <div className="lux-panel rounded-[2rem] px-6 py-14 text-center">
          <p className="font-heading text-[2.1rem] leading-tight text-white">{t("emptyTitle")}</p>
          <p className="mx-auto mt-3 max-w-lg text-[#cdbfae]">{t("emptyBody")}</p>
        </div>
      ) : (
        <div className="space-y-10">
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filteredDishes.map((dish) => (
              <DishCard key={dish.id} dish={dish} locale={locale} />
            ))}
          </div>
          <ChefRecommendations locale={locale} region={region} />
        </div>
      )}
    </div>
  );
}
