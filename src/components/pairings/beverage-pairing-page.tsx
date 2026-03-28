import { Wine } from "lucide-react";

import type { AppLocale } from "@/i18n/routing";
import { getLocalizedDish } from "@/lib/catalog";
import { formatPrice } from "@/lib/format";
import { getBeveragePairings } from "@/lib/hospitality";

const pairingText = {
  th: {
    eyebrow: "เครื่องดื่มจับคู่",
    title: "จับคู่เครื่องดื่มกับอาหารไทยให้หน้าร้านดูครบและพรีเมียมขึ้น",
    body: "แม้เว็บนี้ยังเป็น frontend-only แต่หน้าจับคู่เครื่องดื่มช่วยเล่าอารมณ์ของเมนูและเพิ่ม layer ของประสบการณ์ร้านจริงได้ชัดขึ้น",
  },
  en: {
    eyebrow: "Beverage pairings",
    title: "Pair drinks with Thai dishes to complete the house experience",
    body: "Even in a frontend-only build, pairings add a stronger sense of hospitality, menu storytelling, and premium dining guidance.",
  },
  ja: {
    eyebrow: "ペアリング",
    title: "料理に合わせた飲み物提案で体験を一段引き上げます",
    body: "フロントエンドのみでも、ペアリングの導線があるとレストランらしい体験と世界観が強く伝わります。",
  },
  zh: {
    eyebrow: "饮品搭配",
    title: "用饮品搭配把餐厅体验补完整",
    body: "即使当前仍是 frontend-only，搭配页也能显著增强餐厅感、菜单叙事与高端引导。",
  },
  ko: {
    eyebrow: "페어링",
    title: "음료 페어링으로 레스토랑 경험을 한 단계 더 완성합니다",
    body: "프런트엔드 전용 빌드여도 페어링 페이지는 호스피탈리티와 메뉴 스토리텔링을 크게 강화합니다.",
  },
} as const;

export function BeveragePairingPage({ locale }: { locale: AppLocale }) {
  const text = pairingText[locale];
  const pairings = getBeveragePairings(locale);

  return (
    <section className="scene-section px-4 pt-10 pb-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-10">
        <div className="max-w-3xl">
          <p className="text-[0.66rem] uppercase tracking-[0.18em] text-[#cdb37d]">{text.eyebrow}</p>
          <h1 className="mt-3 font-heading text-[2.75rem] leading-tight text-white sm:text-[3.2rem]">
            {text.title}
          </h1>
          <p className="mt-4 text-[0.98rem] leading-8 text-[#d1c4b2]">{text.body}</p>
        </div>

        <div className="grid gap-6 xl:grid-cols-3">
          {pairings.map((pairing) => (
            <article key={pairing.id} className="lux-panel rounded-[2rem] p-6">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[0.66rem] uppercase tracking-[0.18em] text-[#cdb37d]">{pairing.mood}</p>
                  <h2 className="mt-3 font-heading text-[1.95rem] leading-tight text-white">{pairing.title}</h2>
                </div>
                <div className="inline-flex size-12 items-center justify-center rounded-2xl bg-[#d6b26a]/12 text-[#ecd8a0]">
                  <Wine className="size-5" />
                </div>
              </div>
              <p className="mt-4 text-sm leading-7 text-[#d1c4b2]">{pairing.body}</p>
              <div className="mt-5 rounded-[1.5rem] border border-white/10 bg-black/15 p-4">
                <p className="text-[0.66rem] uppercase tracking-[0.18em] text-[#cdb37d]">{pairing.beverage}</p>
              </div>
              <div className="mt-5 space-y-3">
                {pairing.dishIds.map((dishId) => {
                  const dish = getLocalizedDish(locale, dishId);

                  if (!dish) {
                    return null;
                  }

                  return (
                    <div key={dish.id} className="rounded-[1.5rem] border border-white/10 bg-white/4 p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-white">{dish.name}</p>
                          <p className="mt-1 text-sm text-[#bcae9b]">{dish.regionLabel}</p>
                        </div>
                        <span className="text-sm text-[#ecd8a0]">{formatPrice(dish.price, locale)}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
