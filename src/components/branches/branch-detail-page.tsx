import { Clock3, MapPinned, Phone, Users } from "lucide-react";

import type { AppLocale } from "@/i18n/routing";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { getLocalizedDishes } from "@/lib/catalog";
import { getLocalizedBranch } from "@/lib/experience";
import { getBranchStory } from "@/lib/premium";

const branchDetailText = {
  th: {
    reserve: "จองที่สาขานี้",
    back: "กลับไปดูสาขาทั้งหมด",
    serviceZones: "โซนให้บริการ",
    bestFor: "เหมาะกับโอกาสแบบไหน",
    highlightDishes: "เมนูเด่นของสาขานี้",
  },
  en: {
    reserve: "Reserve at this branch",
    back: "Back to locations",
    serviceZones: "Service zones",
    bestFor: "Best for",
    highlightDishes: "Highlighted dishes",
  },
  ja: {
    reserve: "この店舗を予約する",
    back: "店舗一覧へ戻る",
    serviceZones: "サービス対象エリア",
    bestFor: "おすすめの利用シーン",
    highlightDishes: "この店舗の注目料理",
  },
  zh: {
    reserve: "预订这家门店",
    back: "返回门店列表",
    serviceZones: "服务区域",
    bestFor: "适合的用餐场景",
    highlightDishes: "本店推荐菜",
  },
  ko: {
    reserve: "이 지점 예약하기",
    back: "지점 목록으로 돌아가기",
    serviceZones: "서비스 권역",
    bestFor: "잘 맞는 이용 장면",
    highlightDishes: "이 지점 추천 메뉴",
  },
} as const;

export function BranchDetailPage({
  locale,
  branchId,
}: {
  locale: AppLocale;
  branchId: "bangrak" | "sukhumvit" | "chiangmai";
}) {
  const text = branchDetailText[locale];
  const branch = getLocalizedBranch(locale, branchId);
  const story = getBranchStory(locale, branchId);
  const highlightedDishes = getLocalizedDishes(locale).filter((dish) => dish.featured).slice(0, 3);

  return (
    <section className="scene-section px-4 pt-10 pb-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-10">
        <div className="lux-panel overflow-hidden rounded-[2.4rem] p-8">
          <p className="text-[0.66rem] uppercase tracking-[0.18em] text-[#cdb37d]">{branch.neighborhood}</p>
          <h1 className="mt-4 font-heading text-[2.8rem] leading-tight text-white sm:text-[3.3rem]">{story.heroTitle}</h1>
          <p className="mt-4 max-w-3xl text-[0.98rem] leading-8 text-[#d1c4b2]">{story.body}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button
              type="button"
              className="button-shine rounded-full bg-[#d6b26a] text-[#1b130f] hover:bg-[#e4c987]"
              render={<Link href="/reservation" locale={locale} />}
            >
              {text.reserve}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="rounded-full border-white/10 bg-white/5 text-white hover:bg-white/10"
              render={<Link href="/contact" locale={locale} />}
            >
              {text.back}
            </Button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[0.92fr_1.08fr]">
          <div className="space-y-6">
            <div className="lux-panel-soft rounded-[2rem] p-6">
              <div className="space-y-4 text-sm text-[#d1c4b2]">
                <div className="flex items-start gap-3">
                  <MapPinned className="mt-1 size-4 text-[#d6b26a]" />
                  <span>{branch.address}</span>
                </div>
                <div className="flex items-start gap-3">
                  <Clock3 className="mt-1 size-4 text-[#d6b26a]" />
                  <span>{branch.hours}</span>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="mt-1 size-4 text-[#d6b26a]" />
                  <span>{branch.phone}</span>
                </div>
                <div className="flex items-start gap-3">
                  <Users className="mt-1 size-4 text-[#d6b26a]" />
                  <span>{story.privateDining}</span>
                </div>
              </div>
            </div>
            <div className="lux-panel-soft rounded-[2rem] p-6">
              <p className="text-[0.66rem] uppercase tracking-[0.18em] text-[#cdb37d]">{text.serviceZones}</p>
              <ul className="mt-4 space-y-2 text-sm text-[#d1c4b2]">
                {story.serviceZones.map((zone) => (
                  <li key={zone}>• {zone}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="lux-panel-soft rounded-[2rem] p-6 md:col-span-2">
              <p className="text-[0.66rem] uppercase tracking-[0.18em] text-[#cdb37d]">{text.bestFor}</p>
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                {story.diningMoments.map((moment) => (
                  <div key={moment} className="rounded-[1.5rem] border border-white/10 bg-white/4 p-4 text-[#d1c4b2]">
                    {moment}
                  </div>
                ))}
              </div>
            </div>
            {highlightedDishes.map((dish) => (
              <div key={dish.id} className="lux-panel-soft rounded-[1.8rem] p-5">
                <p className="text-[0.66rem] uppercase tracking-[0.18em] text-[#cdb37d]">
                  {text.highlightDishes} · {dish.regionLabel}
                </p>
                <h2 className="mt-3 font-heading text-[1.7rem] text-white">{dish.name}</h2>
                <p className="mt-3 text-sm leading-7 text-[#d1c4b2]">{dish.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
