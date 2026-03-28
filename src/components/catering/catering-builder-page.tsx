"use client";

import { Sparkles } from "lucide-react";
import { useState } from "react";

import type { AppLocale } from "@/i18n/routing";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { formatPrice } from "@/lib/format";
import { getCateringPackages, getLocalizedBuilderDishes } from "@/lib/guest-experience";
import { useCartStore } from "@/store/cart-store";

const pageText = {
  th: {
    eyebrow: "จัดเลี้ยง",
    title: "วางแพ็กเกจงานเลี้ยงและสำรับกลุ่มใหญ่",
    body: "เลือกแพ็กเกจ จำนวนแขก และสไตล์เสิร์ฟ จากนั้นส่งต่อไปยัง cart หรือหน้า private dining inquiry ได้ทันที",
    guests: "จำนวนแขก",
    addPackage: "เพิ่มแพ็กเกจนี้ลงตะกร้า",
    continueInquiry: "ไปหน้าสอบถามงาน",
    estimate: "ประเมินค่าใช้จ่าย",
  },
  en: {
    eyebrow: "Catering",
    title: "Plan large-format hosting and Thai event menus",
    body: "Choose a package, guest count, and service style, then move it into cart or continue to the private dining inquiry.",
    guests: "Guest count",
    addPackage: "Add this package to cart",
    continueInquiry: "Continue to inquiry",
    estimate: "Estimated spend",
  },
  ja: {
    eyebrow: "ケータリング",
    title: "大人数向けホスティングとタイ料理構成を設計する",
    body: "パッケージ、人数、提供形式を選び、カートまたは問い合わせへ進めます。",
    guests: "人数",
    addPackage: "このパッケージをカートへ追加",
    continueInquiry: "問い合わせへ進む",
    estimate: "想定金額",
  },
  zh: {
    eyebrow: "宴会配置",
    title: "规划大人数接待与泰式宴会套餐",
    body: "选择套餐、人数与服务形式，然后加入购物车或继续进入宴会咨询。",
    guests: "宾客人数",
    addPackage: "将此套餐加入购物车",
    continueInquiry: "继续咨询",
    estimate: "预计费用",
  },
  ko: {
    eyebrow: "케이터링",
    title: "대규모 호스팅과 태국식 이벤트 구성을 설계하기",
    body: "패키지, 인원, 서비스 스타일을 선택하고 카트 또는 문의 흐름으로 이어갑니다.",
    guests: "인원",
    addPackage: "이 패키지를 카트에 추가",
    continueInquiry: "문의로 이어가기",
    estimate: "예상 금액",
  },
} as const;

export function CateringBuilderPage({ locale }: { locale: AppLocale }) {
  const text = pageText[locale];
  const packages = getCateringPackages(locale);
  const { toast } = useToast();
  const addItem = useCartStore((state) => state.addItem);
  const openCart = useCartStore((state) => state.openCart);
  const [selectedId, setSelectedId] = useState(packages[0]?.id ?? "");
  const [guestCount, setGuestCount] = useState(16);
  const activePackage = packages.find((item) => item.id === selectedId) ?? packages[0];
  const packageDishes = activePackage ? getLocalizedBuilderDishes(locale, activePackage.dishIds) : [];
  const estimatedTotal = (activePackage?.pricePerGuest ?? 0) * guestCount;

  if (!activePackage) {
    return null;
  }

  return (
    <section className="scene-section px-4 pt-10 pb-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="max-w-3xl">
          <p className="text-[0.66rem] uppercase tracking-[0.18em] text-[#cdb37d]">{text.eyebrow}</p>
          <h1 className="mt-3 font-heading text-[2.8rem] leading-tight text-white sm:text-[3.2rem]">{text.title}</h1>
          <p className="mt-4 text-[0.98rem] leading-8 text-[#d1c4b2]">{text.body}</p>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.02fr_0.98fr]">
          <div className="space-y-4">
            {packages.map((item) => {
              const active = item.id === activePackage.id;

              return (
                <button
                  key={item.id}
                  type="button"
                  data-testid={`catering-${item.id}`}
                  className={`lux-panel relative overflow-hidden rounded-[2rem] bg-gradient-to-br p-6 text-left transition-transform hover:-translate-y-1 ${item.accentClass} ${
                    active ? "ring-2 ring-[#d6b26a]/55" : ""
                  }`}
                  onClick={() => setSelectedId(item.id)}
                >
                  <div className="absolute inset-0 bg-gradient-to-br opacity-88" />
                  <div className="relative">
                    <p className="text-[0.66rem] uppercase tracking-[0.18em] text-[#ecd8a0]">{item.guestRange}</p>
                    <h2 className="mt-4 font-heading text-[1.8rem] leading-tight text-white">{item.title}</h2>
                    <p className="mt-3 text-sm leading-7 text-[#ddd0be]">{item.body}</p>
                    <p className="mt-4 text-sm text-[#bcae9b]">{item.leadTime}</p>
                    <p className="mt-2 text-[#f2d78d]">{formatPrice(item.pricePerGuest, locale)} / guest</p>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="space-y-4 xl:sticky xl:top-28 xl:self-start">
            <div className="lux-panel rounded-[2rem] p-6 sm:p-8">
              <p className="text-[0.66rem] uppercase tracking-[0.18em] text-[#cdb37d]">{text.estimate}</p>
              <h2 className="mt-3 font-heading text-[2rem] text-white">{activePackage.title}</h2>
              <div className="mt-5 space-y-2">
                <label className="space-y-2">
                  <span className="text-sm text-[#d1c4b2]">{text.guests}</span>
                  <Input
                    type="number"
                    min={8}
                    value={guestCount}
                    onChange={(event) => setGuestCount(Math.max(8, Number(event.target.value) || 8))}
                    className="h-12 rounded-2xl border-white/10 bg-white/4 text-white"
                  />
                </label>
              </div>
              <div className="mt-6 grid gap-3">
                {packageDishes.map((dish) => (
                  <div key={dish.id} className="rounded-[1.4rem] border border-white/10 bg-white/4 px-4 py-4">
                    <p className="text-white">{dish.name}</p>
                    <p className="mt-1 text-sm text-[#bcae9b]">{dish.regionLabel}</p>
                  </div>
                ))}
              </div>
              <div className="thai-divider my-6" />
              <p className="font-heading text-[2rem] text-white">{formatPrice(estimatedTotal, locale)}</p>
              <div className="mt-6 flex flex-col gap-3">
                <Button
                  type="button"
                  data-testid="add-catering-to-cart"
                  className="button-shine h-12 rounded-full bg-[#d6b26a] px-6 text-[#1b130f] hover:bg-[#e4c987]"
                  onClick={() => {
                    packageDishes.forEach((dish) => {
                      addItem({
                        dishId: dish.id,
                        quantity: Math.max(1, Math.ceil(guestCount / Math.max(packageDishes.length * 2, 4))),
                        spiceLevel: dish.baseSpice,
                        toppings: [],
                        unitPrice: dish.price,
                      });
                    });
                    openCart();
                    toast({
                      title: text.addPackage,
                      description: `${guestCount} guests`,
                      tone: "success",
                    });
                  }}
                >
                  <Sparkles className="size-4" />
                  {text.addPackage}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-full border-white/10 bg-white/5 text-white hover:bg-white/10"
                  render={<Link href="/private-dining" locale={locale} />}
                >
                  {text.continueInquiry}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
