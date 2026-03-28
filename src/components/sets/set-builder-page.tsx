"use client";

import { CheckCircle2, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";

import type { AppLocale } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { formatPrice } from "@/lib/format";
import { getLocalizedBuilderDishes, getSetBuilderSections } from "@/lib/guest-experience";
import { useCartStore } from "@/store/cart-store";

const pageText = {
  th: {
    eyebrow: "จัดชุดอาหาร",
    title: "ประกอบสำรับไทยด้วยตัวเอง",
    body: "เลือกจานเปิด สำรับหลัก และของหวาน เพื่อจัดชุดอาหารที่พร้อมโยนเข้าตะกร้าในคลิกเดียว",
    addSet: "เพิ่มชุดนี้ลงตะกร้า",
    summary: "สรุปชุดอาหาร",
    discount: "ส่วนลดชุดอาหาร",
    selected: "ที่เลือก",
    subtotal: "ยอดก่อนส่วนลด",
  },
  en: {
    eyebrow: "Build your set",
    title: "Compose your own Thai set menu",
    body: "Choose an opener, a main, and a sweet finish, then add the full set to cart in one action.",
    addSet: "Add this set to cart",
    summary: "Set summary",
    discount: "Set saving",
    selected: "Selected",
    subtotal: "Subtotal",
  },
  ja: {
    eyebrow: "セット構成",
    title: "自分だけのタイセットを作る",
    body: "前菜、主菜、甘味を選び、セット全体をまとめてカートへ追加できます。",
    addSet: "このセットをカートへ追加",
    summary: "セット概要",
    discount: "セット割引",
    selected: "選択中",
    subtotal: "小計",
  },
  zh: {
    eyebrow: "自选套餐",
    title: "组合属于你的泰式套餐",
    body: "选择开胃菜、主菜与甜品，一键把整套加入购物车。",
    addSet: "将整套加入购物车",
    summary: "套餐摘要",
    discount: "套餐优惠",
    selected: "当前选择",
    subtotal: "小计",
  },
  ko: {
    eyebrow: "세트 구성",
    title: "나만의 태국 세트를 조합하기",
    body: "스타터, 메인, 디저트를 고르고 세트 전체를 한 번에 카트에 담습니다.",
    addSet: "이 세트를 카트에 추가",
    summary: "세트 요약",
    discount: "세트 할인",
    selected: "선택됨",
    subtotal: "소계",
  },
} as const;

export function SetBuilderPage({ locale }: { locale: AppLocale }) {
  const text = pageText[locale];
  const sections = getSetBuilderSections(locale);
  const addItem = useCartStore((state) => state.addItem);
  const openCart = useCartStore((state) => state.openCart);
  const { toast } = useToast();
  const [selected, setSelected] = useState<Record<string, string>>({
    opening: sections[0]?.dishIds[0] ?? "",
    main: sections[1]?.dishIds[0] ?? "",
    sweet: sections[2]?.dishIds[0] ?? "",
  });

  const chosenDishes = useMemo(() => getLocalizedBuilderDishes(locale, Object.values(selected)), [locale, selected]);
  const subtotal = chosenDishes.reduce((sum, dish) => sum + dish.price, 0);
  const discount = 180;
  const total = Math.max(0, subtotal - discount);

  return (
    <section className="scene-section px-4 pt-10 pb-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="max-w-3xl">
          <p className="text-[0.66rem] uppercase tracking-[0.18em] text-[#cdb37d]">{text.eyebrow}</p>
          <h1 className="mt-3 font-heading text-[2.8rem] leading-tight text-white sm:text-[3.2rem]">{text.title}</h1>
          <p className="mt-4 text-[0.98rem] leading-8 text-[#d1c4b2]">{text.body}</p>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.04fr_0.96fr]">
          <div className="space-y-6">
            {sections.map((section) => {
              const dishes = getLocalizedBuilderDishes(locale, section.dishIds);

              return (
                <div key={section.id} className="lux-panel rounded-[2rem] p-6">
                  <p className="text-[0.66rem] uppercase tracking-[0.18em] text-[#cdb37d]">{section.title}</p>
                  <p className="mt-3 text-sm leading-7 text-[#d1c4b2]">{section.body}</p>
                  <div className="mt-5 grid gap-3 md:grid-cols-2">
                    {dishes.map((dish) => {
                      const active = selected[section.id] === dish.id;

                      return (
                        <button
                          key={dish.id}
                          type="button"
                          data-testid={`set-${section.id}-${dish.id}`}
                          className={`rounded-[1.5rem] border px-4 py-4 text-left transition-colors ${
                            active
                              ? "border-[#d6b26a]/35 bg-[#d6b26a]/10"
                              : "border-white/10 bg-white/4 hover:bg-white/8"
                          }`}
                          onClick={() => setSelected((current) => ({ ...current, [section.id]: dish.id }))}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="text-white">{dish.name}</p>
                              <p className="mt-2 text-sm leading-6 text-[#bcae9b]">{dish.description}</p>
                            </div>
                            {active ? <CheckCircle2 className="mt-1 size-4 text-[#ecd8a0]" /> : null}
                          </div>
                          <p className="mt-4 text-[#f2d78d]">{formatPrice(dish.price, locale)}</p>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="space-y-4 xl:sticky xl:top-28 xl:self-start">
            <div className="lux-panel rounded-[2rem] p-6 sm:p-8">
              <p className="text-[0.66rem] uppercase tracking-[0.18em] text-[#cdb37d]">{text.summary}</p>
              <div className="mt-5 space-y-3">
                {chosenDishes.map((dish) => (
                  <div key={dish.id} className="rounded-[1.4rem] border border-white/10 bg-white/4 px-4 py-4">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-white">{dish.name}</p>
                        <p className="mt-1 text-sm text-[#bcae9b]">{text.selected}</p>
                      </div>
                      <span className="text-[#ecd8a0]">{formatPrice(dish.price, locale)}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="thai-divider my-6" />
              <div className="space-y-2 text-sm text-[#d1c4b2]">
                <div className="flex items-center justify-between gap-3">
                  <span>{text.subtotal}</span>
                  <span>{formatPrice(subtotal, locale)}</span>
                </div>
                <div className="flex items-center justify-between gap-3 text-[#ecd8a0]">
                  <span>{text.discount}</span>
                  <span>-{formatPrice(discount, locale)}</span>
                </div>
              </div>
              <p className="mt-5 font-heading text-[2rem] text-white">{formatPrice(total, locale)}</p>
              <Button
                type="button"
                data-testid="add-set-to-cart"
                className="button-shine mt-6 h-12 rounded-full bg-[#d6b26a] px-6 text-[#1b130f] hover:bg-[#e4c987]"
                onClick={() => {
                  chosenDishes.forEach((dish) => {
                    addItem({
                      dishId: dish.id,
                      quantity: 1,
                      spiceLevel: dish.baseSpice,
                      toppings: [],
                      unitPrice: Math.max(0, dish.price - discount / chosenDishes.length),
                    });
                  });
                  openCart();
                  toast({
                    title: text.addSet,
                    description: `${chosenDishes.length} dishes`,
                    tone: "success",
                  });
                }}
              >
                <Sparkles className="size-4" />
                {text.addSet}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
