"use client";

import { useMemo, useState } from "react";

import type { AppLocale } from "@/i18n/routing";
import { DishCard } from "@/components/dishes/dish-card";
import { Button } from "@/components/ui/button";
import { useOperationalDishes } from "@/hooks/use-operational-menu";
import { getDishIdsForQuiz } from "@/lib/premium";

type Mood = "comfort" | "spicy" | "light" | "dessert";
type Dietary = "none" | "vegetarian" | "seafood" | "containsNuts" | "spicy" | "halalFriendly";

const quizText = {
  th: {
    eyebrow: "ตัวช่วยเลือกเมนู",
    title: "ให้ระบบช่วยจัดสำรับไทยให้คุณ",
    body: "เลือกอารมณ์ของมื้ออาหารและเงื่อนไขด้านอาหาร เพื่อรับชุดเมนูที่เหมาะกับรสนิยมของคุณ",
    mood: "1. อารมณ์ของมื้อนี้",
    dietary: "2. เงื่อนไขด้านอาหาร",
    moodLabels: {
      comfort: "จานหลักแบบกินสบาย",
      spicy: "อยากได้รสจัดและเผ็ดขึ้น",
      light: "เมนูเบาและออกเร็ว",
      dessert: "อยากเริ่มจากของหวาน",
    },
    dietaryLabels: {
      none: "ยังไม่มีเงื่อนไขพิเศษ",
      vegetarian: "เน้นมังสวิรัติ",
      seafood: "เน้นซีฟู้ด",
      halalFriendly: "เมนู halal-friendly",
    },
    emptyTitle: "เลือกสไตล์การกินก่อน",
    emptyBody: "ระบบจะคัดเมนูไทยชุดเล็กที่เหมาะกับอารมณ์รสชาติและข้อจำกัดด้านอาหารของคุณ",
    noResults: "ยังไม่มีชุดเมนูที่ตรงกับตัวเลือกนี้ ลองเปลี่ยน dietary หรือ mood อีกครั้ง",
  },
  en: {
    eyebrow: "Recommendation quiz",
    title: "Let us curate your Thai table",
    body: "Choose your dining mood and dietary focus to receive a tighter Thai recommendation set.",
    mood: "1. Mood",
    dietary: "2. Dietary focus",
    moodLabels: {
      comfort: "Comforting mains",
      spicy: "Spice-forward plates",
      light: "Quick and lighter dishes",
      dessert: "Dessert mood",
    },
    dietaryLabels: {
      none: "No dietary priority",
      vegetarian: "Vegetarian-friendly",
      seafood: "Seafood-led",
      halalFriendly: "Halal-friendly",
    },
    emptyTitle: "Choose your dining mood",
    emptyBody: "The quiz will return a small set of Thai dishes aligned with your flavor preference and dietary focus.",
    noResults: "No dishes matched this combination yet. Try a different mood or dietary filter.",
  },
  ja: {
    eyebrow: "おすすめ案内",
    title: "気分に合わせてタイ料理を絞り込みます",
    body: "食べたい気分と食事条件を選ぶと、相性のよいタイ料理を絞り込みます。",
    mood: "1. 気分",
    dietary: "2. 食事条件",
    moodLabels: {
      comfort: "満足感ある主食",
      spicy: "辛さをしっかり楽しむ",
      light: "軽めで早い料理",
      dessert: "甘味から選ぶ",
    },
    dietaryLabels: {
      none: "特に条件なし",
      vegetarian: "ベジタリアン寄り",
      seafood: "シーフード中心",
      halalFriendly: "ハラール配慮",
    },
    emptyTitle: "まず食べたい気分を選んでください",
    emptyBody: "味の方向性と食事条件に沿って、小さく絞ったおすすめを返します。",
    noResults: "この組み合わせに合う料理はまだありません。条件を少し変えてみてください。",
  },
  zh: {
    eyebrow: "推荐测验",
    title: "让系统为你搭配一桌泰式风味",
    body: "选择当下口味心情与饮食偏好，即可得到更贴合的泰式菜单建议。",
    mood: "1. 当前口味心情",
    dietary: "2. 饮食偏好",
    moodLabels: {
      comfort: "偏向主食与满足感",
      spicy: "想吃更辣更重口",
      light: "想要清爽快上的菜",
      dessert: "先看甜品",
    },
    dietaryLabels: {
      none: "暂无特别限制",
      vegetarian: "偏素食",
      seafood: "偏海鲜",
      halalFriendly: "可选 halal-friendly",
    },
    emptyTitle: "先选择你的用餐心情",
    emptyBody: "系统会根据口味方向与饮食偏好，给出更精简合适的泰国菜推荐。",
    noResults: "当前组合下暂无匹配菜品，请调整口味或饮食偏好。",
  },
  ko: {
    eyebrow: "추천 퀴즈",
    title: "취향에 맞는 태국 식탁을 골라 드립니다",
    body: "지금의 식사 기분과 식단 조건을 고르면 더 잘 맞는 태국 메뉴를 추천합니다.",
    mood: "1. 지금의 식사 기분",
    dietary: "2. 식단 조건",
    moodLabels: {
      comfort: "편안한 메인 메뉴",
      spicy: "매운맛 중심",
      light: "가볍고 빠른 메뉴",
      dessert: "디저트 중심",
    },
    dietaryLabels: {
      none: "특별한 조건 없음",
      vegetarian: "채식 위주",
      seafood: "해산물 위주",
      halalFriendly: "할랄 친화 메뉴",
    },
    emptyTitle: "먼저 식사 취향을 골라 주세요",
    emptyBody: "맛의 방향과 식단 조건에 맞춰 작은 추천 세트를 보여 줍니다.",
    noResults: "이 조합에 맞는 메뉴가 아직 없습니다. 조건을 조금 바꿔 보세요.",
  },
} as const;

export function RecommendationQuiz({ locale }: { locale: AppLocale }) {
  const text = quizText[locale];
  const dishes = useOperationalDishes(locale);
  const [mood, setMood] = useState<Mood>("comfort");
  const [dietary, setDietary] = useState<Dietary>("none");
  const [started, setStarted] = useState(false);

  const results = useMemo(() => {
    let filtered = dishes;

    if (dietary !== "none") {
      const preferredIds = getDishIdsForQuiz(dietary);
      filtered = filtered.filter((dish) => preferredIds.includes(dish.id));
    }

    if (mood === "spicy") filtered = filtered.filter((dish) => dish.baseSpice >= 4);
    if (mood === "light") filtered = filtered.filter((dish) => dish.prepMinutes <= 15);
    if (mood === "dessert") filtered = filtered.filter((dish) => dish.category === "sweetFinish");
    if (mood === "comfort") filtered = filtered.filter((dish) => ["riceNoodles", "signature"].includes(dish.category));

    return filtered.slice(0, 3);
  }, [dietary, dishes, mood]);

  return (
    <section className="scene-section px-4 pt-10 pb-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-10">
        <div className="max-w-3xl">
          <p className="text-[0.66rem] uppercase tracking-[0.18em] text-[#cdb37d]">{text.eyebrow}</p>
          <h1 className="mt-3 font-heading text-[2.75rem] leading-tight text-white sm:text-[3.2rem]">
            {text.title}
          </h1>
          <p className="mt-4 text-[0.98rem] leading-8 text-[#d1c4b2]">
            {text.body}
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[0.86fr_1.14fr]">
          <div className="lux-panel rounded-[2rem] p-6 sm:p-8">
            <div className="space-y-6">
              <div>
                <p className="text-[0.66rem] uppercase tracking-[0.18em] text-[#cdb37d]">{text.mood}</p>
                <div className="mt-4 grid gap-3">
                  {([
                    ["comfort", text.moodLabels.comfort],
                    ["spicy", text.moodLabels.spicy],
                    ["light", text.moodLabels.light],
                    ["dessert", text.moodLabels.dessert],
                  ] as const).map(([value, label]) => (
                    <Button
                      key={value}
                      type="button"
                      variant={mood === value ? "default" : "outline"}
                      className={
                        mood === value
                          ? "justify-start rounded-[1.2rem] bg-[#d6b26a] px-4 text-[#1b130f] hover:bg-[#e4c987]"
                          : "justify-start rounded-[1.2rem] border-white/10 bg-white/5 px-4 text-white hover:bg-white/10"
                      }
                      onClick={() => {
                        setMood(value);
                        setStarted(true);
                      }}
                    >
                      {label}
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-[0.66rem] uppercase tracking-[0.18em] text-[#cdb37d]">{text.dietary}</p>
                <div className="mt-4 grid gap-3">
                  {([
                    ["none", text.dietaryLabels.none],
                    ["vegetarian", text.dietaryLabels.vegetarian],
                    ["seafood", text.dietaryLabels.seafood],
                    ["halalFriendly", text.dietaryLabels.halalFriendly],
                  ] as const).map(([value, label]) => (
                    <Button
                      key={value}
                      type="button"
                      variant={dietary === value ? "default" : "outline"}
                      className={
                        dietary === value
                          ? "justify-start rounded-[1.2rem] bg-[#d6b26a] px-4 text-[#1b130f] hover:bg-[#e4c987]"
                          : "justify-start rounded-[1.2rem] border-white/10 bg-white/5 px-4 text-white hover:bg-white/10"
                      }
                      onClick={() => {
                        setDietary(value);
                        setStarted(true);
                      }}
                    >
                      {label}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div>
            {!started ? (
              <div className="lux-panel-soft rounded-[2rem] px-6 py-14 text-center">
                <p className="font-heading text-[2.2rem] leading-tight text-white">{text.emptyTitle}</p>
                <p className="mx-auto mt-4 max-w-xl text-[#d1c4b2]">
                  {text.emptyBody}
                </p>
              </div>
            ) : results.length === 0 ? (
              <div className="lux-panel-soft rounded-[2rem] px-6 py-14 text-center">
                <p className="font-heading text-[2.2rem] leading-tight text-white">{text.emptyTitle}</p>
                <p className="mx-auto mt-4 max-w-xl text-[#d1c4b2]">
                  {text.noResults}
                </p>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {results.map((dish) => (
                  <DishCard key={dish.id} dish={dish} locale={locale} compact />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
