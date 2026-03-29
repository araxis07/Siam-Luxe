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
import { getAllDietaryLabels, getDietaryLabels, getExperienceCopy } from "@/lib/experience";
import { getOccasionMoments } from "@/lib/hospitality";
import { ChefRecommendations } from "@/components/dishes/chef-recommendations";
import { MenuGallery } from "@/components/dishes/menu-gallery";
import { RecentlyViewedStrip } from "@/components/dishes/recently-viewed-strip";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DishCard } from "@/components/dishes/dish-card";
import type { DietaryTagId } from "@/lib/experience";
import type { DishStatusId } from "@/lib/premium";
import { getDishStatus, getDishStatusById } from "@/lib/premium";
import { useExperienceStore } from "@/store/experience-store";

type SpiceFilter = "all" | "mild" | "medium" | "hot";
type SortMode = "recommended" | "price" | "rating" | "spicy";
type DietaryFilter = "all" | DietaryTagId;
type StatusFilter = "all" | DishStatusId;
type PriceFilter = "all" | "under400" | "400to700" | "700plus";
type PrepFilter = "all" | "fast" | "balanced" | "leisure";
type OccasionFilter = "all" | "date-night" | "business-hosting" | "family-table";

const menuFiltersText = {
  th: {
    dietary: "ตัวกรองอาหาร",
    status: "สถานะเมนู",
    allDietary: "ทุกแบบ",
    allStatuses: "ทุกสถานะ",
    cards: "โหมดการ์ด",
    gallery: "โหมดแกลเลอรี",
    price: "ช่วงราคา",
    prep: "เวลาปรุง",
    occasions: "โอกาสพิเศษ",
    signatureOnly: "เฉพาะจานซิกเนเจอร์",
    allPrices: "ทุกช่วงราคา",
    allPrep: "ทุกเวลา",
    fast: "เร็ว",
    balanced: "กลาง",
    leisure: "จัดเต็ม",
  },
  en: {
    dietary: "Dietary filter",
    status: "Availability",
    allDietary: "All dietary",
    allStatuses: "All statuses",
    cards: "Card mode",
    gallery: "Gallery mode",
    price: "Price band",
    prep: "Prep time",
    occasions: "Occasions",
    signatureOnly: "Signature only",
    allPrices: "All prices",
    allPrep: "Any timing",
    fast: "Fast",
    balanced: "Balanced",
    leisure: "Leisure",
  },
  ja: {
    dietary: "食事条件フィルター",
    status: "提供状況",
    allDietary: "すべて",
    allStatuses: "すべての状態",
    cards: "カード表示",
    gallery: "ギャラリー表示",
    price: "価格帯",
    prep: "調理時間",
    occasions: "利用シーン",
    signatureOnly: "定番のみ",
    allPrices: "すべて",
    allPrep: "すべて",
    fast: "早め",
    balanced: "標準",
    leisure: "ゆったり",
  },
  zh: {
    dietary: "饮食条件筛选",
    status: "菜单状态",
    allDietary: "全部条件",
    allStatuses: "全部状态",
    cards: "卡片模式",
    gallery: "画廊模式",
    price: "价格区间",
    prep: "制作时间",
    occasions: "使用场景",
    signatureOnly: "仅看招牌",
    allPrices: "全部价格",
    allPrep: "全部时间",
    fast: "快速",
    balanced: "适中",
    leisure: "慢享",
  },
  ko: {
    dietary: "식단 필터",
    status: "메뉴 상태",
    allDietary: "전체 조건",
    allStatuses: "모든 상태",
    cards: "카드 모드",
    gallery: "갤러리 모드",
    price: "가격대",
    prep: "조리 시간",
    occasions: "방문 목적",
    signatureOnly: "시그니처만",
    allPrices: "전체 가격",
    allPrep: "전체 시간",
    fast: "빠름",
    balanced: "보통",
    leisure: "여유",
  },
} as const;

function matchesSpiceFilter(baseSpice: number, filter: SpiceFilter) {
  if (filter === "all") return true;
  if (filter === "mild") return baseSpice <= 2;
  if (filter === "medium") return baseSpice >= 3 && baseSpice <= 4;
  return baseSpice >= 5;
}

function matchesPriceFilter(price: number, filter: PriceFilter) {
  if (filter === "all") return true;
  if (filter === "under400") return price < 400;
  if (filter === "400to700") return price >= 400 && price <= 700;
  return price > 700;
}

function matchesPrepFilter(prepMinutes: number, filter: PrepFilter) {
  if (filter === "all") return true;
  if (filter === "fast") return prepMinutes <= 15;
  if (filter === "balanced") return prepMinutes > 15 && prepMinutes <= 25;
  return prepMinutes > 25;
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
  const [dietaryFilter, setDietaryFilter] = useState<DietaryFilter>("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [priceFilter, setPriceFilter] = useState<PriceFilter>("all");
  const [prepFilter, setPrepFilter] = useState<PrepFilter>("all");
  const [occasionFilter, setOccasionFilter] = useState<OccasionFilter>("all");
  const [signatureOnly, setSignatureOnly] = useState(false);
  const menuViewMode = useExperienceStore((state) => state.menuViewMode);
  const setMenuViewMode = useExperienceStore((state) => state.setMenuViewMode);
  const deferredQuery = useDeferredValue(query);
  const normalizedQuery = deferredQuery.trim().toLowerCase();
  const text = menuFiltersText[locale];
  const occasions = getOccasionMoments(locale);
  const dietaryLabels = getAllDietaryLabels(locale).filter((item) =>
    ["vegetarian", "seafood", "containsNuts", "halalFriendly", "spicy"].includes(item.id),
  );
  const statusOptions: Array<{ id: StatusFilter; label: string }> = [
    { id: "all", label: text.allStatuses },
    { id: "limited", label: getDishStatus(locale, "fire-basil-wagyu").label },
    { id: "soldOut", label: getDishStatus(locale, "southern-roti-mataba").label },
    { id: "chefToday", label: getDishStatus(locale, "royal-tom-yum").label },
  ];

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
      const matchesDietary =
        dietaryFilter === "all" || getDietaryLabels(locale, dish.id).some((item) => item.id === dietaryFilter);
      const resolvedStatus = dish.statusId ? getDishStatusById(locale, dish.statusId) : getDishStatus(locale, dish.id);
      const matchesStatus =
        statusFilter === "all" || (!dish.isAvailable ? "soldOut" : resolvedStatus.id) === statusFilter;
      const matchesPrice = matchesPriceFilter(dish.price, priceFilter);
      const matchesPrep = matchesPrepFilter(dish.prepMinutes, prepFilter);
      const matchesOccasion =
        occasionFilter === "all" ||
        occasions.find((occasion) => occasion.id === occasionFilter)?.recommendedDishIds.includes(dish.id);
      const matchesSignature = !signatureOnly || getDietaryLabels(locale, dish.id).some((item) => item.id === "signature");

      return (
        matchesQuery &&
        matchesRegion &&
        matchesCategory &&
        matchesSpice &&
        matchesDietary &&
        matchesStatus &&
        matchesPrice &&
        matchesPrep &&
        matchesOccasion &&
        matchesSignature
      );
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
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-[0.66rem] uppercase tracking-[0.18em] text-[#bca16a]">{copy.labels.viewAll}</p>
          <div className="flex rounded-full border border-white/10 bg-white/5 p-1">
            <Button
              type="button"
              size="sm"
              variant={menuViewMode === "cards" ? "default" : "ghost"}
              className={
                menuViewMode === "cards"
                  ? "rounded-full bg-[#d6b26a] text-[#1b130f] hover:bg-[#e4c987]"
                  : "rounded-full text-white hover:bg-white/8"
              }
              onClick={() => setMenuViewMode("cards")}
            >
              {text.cards}
            </Button>
            <Button
              type="button"
              size="sm"
              variant={menuViewMode === "gallery" ? "default" : "ghost"}
              className={
                menuViewMode === "gallery"
                  ? "rounded-full bg-[#d6b26a] text-[#1b130f] hover:bg-[#e4c987]"
                  : "rounded-full text-white hover:bg-white/8"
              }
              onClick={() => setMenuViewMode("gallery")}
            >
              {text.gallery}
            </Button>
          </div>
        </div>

        <div>
          <p className="mb-3 text-[0.66rem] uppercase tracking-[0.18em] text-[#bca16a]">
            {text.dietary}
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <Button
              type="button"
              size="sm"
              variant={dietaryFilter === "all" ? "default" : "outline"}
              className={
                dietaryFilter === "all"
                  ? "rounded-full bg-[#d6b26a] text-[#1b130f] hover:bg-[#e4c987]"
                  : "rounded-full border-white/10 bg-white/5 text-white hover:bg-white/10"
              }
              onClick={() => setDietaryFilter("all")}
            >
              {text.allDietary}
            </Button>
            {dietaryLabels.map((item) => (
              <Button
                key={item.id}
                type="button"
                size="sm"
                variant={dietaryFilter === item.id ? "default" : "outline"}
                className={
                  dietaryFilter === item.id
                    ? "rounded-full bg-[#d6b26a] text-[#1b130f] hover:bg-[#e4c987]"
                    : "rounded-full border-white/10 bg-white/5 text-white hover:bg-white/10"
                }
                onClick={() => setDietaryFilter(item.id)}
              >
                {item.label}
              </Button>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-3 text-[0.66rem] uppercase tracking-[0.18em] text-[#bca16a]">
            {text.status}
          </p>
          <div className="flex flex-wrap items-center gap-3">
            {statusOptions.map((item) => (
              <Button
                key={item.id}
                type="button"
                size="sm"
                variant={statusFilter === item.id ? "default" : "outline"}
                className={
                  statusFilter === item.id
                    ? "rounded-full bg-[#d6b26a] text-[#1b130f] hover:bg-[#e4c987]"
                    : "rounded-full border-white/10 bg-white/5 text-white hover:bg-white/10"
                }
                onClick={() => setStatusFilter(item.id)}
              >
                {item.label}
              </Button>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-3 text-[0.66rem] uppercase tracking-[0.18em] text-[#bca16a]">
            {text.price}
          </p>
          <div className="flex flex-wrap items-center gap-3">
            {[
              { id: "all", label: text.allPrices },
              { id: "under400", label: "< 400" },
              { id: "400to700", label: "400-700" },
              { id: "700plus", label: "700+" },
            ].map((item) => (
              <Button
                key={item.id}
                type="button"
                size="sm"
                variant={priceFilter === item.id ? "default" : "outline"}
                className={
                  priceFilter === item.id
                    ? "rounded-full bg-[#d6b26a] text-[#1b130f] hover:bg-[#e4c987]"
                    : "rounded-full border-white/10 bg-white/5 text-white hover:bg-white/10"
                }
                onClick={() => setPriceFilter(item.id as PriceFilter)}
              >
                {item.label}
              </Button>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-3 text-[0.66rem] uppercase tracking-[0.18em] text-[#bca16a]">
            {text.prep}
          </p>
          <div className="flex flex-wrap items-center gap-3">
            {[
              { id: "all", label: text.allPrep },
              { id: "fast", label: text.fast },
              { id: "balanced", label: text.balanced },
              { id: "leisure", label: text.leisure },
            ].map((item) => (
              <Button
                key={item.id}
                type="button"
                size="sm"
                variant={prepFilter === item.id ? "default" : "outline"}
                className={
                  prepFilter === item.id
                    ? "rounded-full bg-[#d6b26a] text-[#1b130f] hover:bg-[#e4c987]"
                    : "rounded-full border-white/10 bg-white/5 text-white hover:bg-white/10"
                }
                onClick={() => setPrepFilter(item.id as PrepFilter)}
              >
                {item.label}
              </Button>
            ))}
            <Button
              type="button"
              size="sm"
              variant={signatureOnly ? "default" : "outline"}
              className={
                signatureOnly
                  ? "rounded-full bg-[#d6b26a] text-[#1b130f] hover:bg-[#e4c987]"
                  : "rounded-full border-white/10 bg-white/5 text-white hover:bg-white/10"
              }
              onClick={() => setSignatureOnly((value) => !value)}
            >
              {text.signatureOnly}
            </Button>
          </div>
        </div>

        <div>
          <p className="mb-3 text-[0.66rem] uppercase tracking-[0.18em] text-[#bca16a]">
            {text.occasions}
          </p>
          <div className="grid gap-3 lg:grid-cols-3">
            <button
              type="button"
              className={`rounded-[1.5rem] border p-4 text-left transition-colors ${
                occasionFilter === "all"
                  ? "border-[#d6b26a]/30 bg-[#d6b26a]/10"
                  : "border-white/10 bg-white/4 hover:bg-white/8"
              }`}
              onClick={() => setOccasionFilter("all")}
            >
              <span className="block text-white">{text.occasions}</span>
              <span className="mt-2 block text-sm text-[#bcae9b]">{copy.labels.viewAll}</span>
            </button>
            {occasions.map((occasion) => (
              <button
                key={occasion.id}
                type="button"
                className={`rounded-[1.5rem] border p-4 text-left transition-colors ${
                  occasionFilter === occasion.id
                    ? "border-[#d6b26a]/30 bg-[#d6b26a]/10"
                    : "border-white/10 bg-white/4 hover:bg-white/8"
                }`}
                onClick={() => setOccasionFilter(occasion.id as OccasionFilter)}
              >
                <span className="block text-white">{occasion.title}</span>
                <span className="mt-2 block text-sm leading-6 text-[#bcae9b]">{occasion.body}</span>
              </button>
            ))}
          </div>
        </div>

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

      <RecentlyViewedStrip locale={locale} />

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
          {dietaryFilter !== "all" ? (
            <span className="rounded-full border border-white/10 bg-white/6 px-3 py-1 text-white">
              {dietaryLabels.find((item) => item.id === dietaryFilter)?.label}
            </span>
          ) : null}
          {statusFilter !== "all" ? (
            <span className="rounded-full border border-white/10 bg-white/6 px-3 py-1 text-white">
              {statusOptions.find((item) => item.id === statusFilter)?.label}
            </span>
          ) : null}
          {priceFilter !== "all" ? (
            <span className="rounded-full border border-white/10 bg-white/6 px-3 py-1 text-white">
              {{
                under400: "< 400",
                "400to700": "400-700",
                "700plus": "700+",
              }[priceFilter]}
            </span>
          ) : null}
          {prepFilter !== "all" ? (
            <span className="rounded-full border border-white/10 bg-white/6 px-3 py-1 text-white">
              {{
                fast: text.fast,
                balanced: text.balanced,
                leisure: text.leisure,
              }[prepFilter]}
            </span>
          ) : null}
          {occasionFilter !== "all" ? (
            <span className="rounded-full border border-white/10 bg-white/6 px-3 py-1 text-white">
              {occasions.find((item) => item.id === occasionFilter)?.title}
            </span>
          ) : null}
          {signatureOnly ? (
            <span className="rounded-full border border-white/10 bg-white/6 px-3 py-1 text-white">
              {text.signatureOnly}
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
          {menuViewMode === "cards" ? (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {filteredDishes.map((dish) => (
                <DishCard key={dish.id} dish={dish} locale={locale} />
              ))}
            </div>
          ) : (
            <MenuGallery dishes={filteredDishes} locale={locale} />
          )}
          <ChefRecommendations locale={locale} region={region} />
        </div>
      )}
    </div>
  );
}
