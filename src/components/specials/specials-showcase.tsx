"use client";

import { Sparkles } from "lucide-react";

import type { AppLocale } from "@/i18n/routing";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { getExperienceCopy, getFeatureLinks, getLocalizedSpecials, getLocalizedTestimonials } from "@/lib/experience";
import { useCartStore } from "@/store/cart-store";

const specialsText = {
  th: {
    subtitle: "รวม tasting set และเมนูฤดูกาลที่จัดวางมาให้สั่งง่ายขึ้นทั้งสำหรับแชร์และมื้อพิเศษ",
    addSet: "เพิ่มชุดนี้ลงตะกร้า",
    sideBody: "เมื่อจับคู่เมนูชุดกับ flow จองโต๊ะ หน้าเว็บจะดูเป็นประสบการณ์ร้านอาหารจริงครบทั้งกินที่ร้านและสั่งล่วงหน้า",
  },
  en: {
    subtitle: "Curated tasting sets and seasonal Thai collections designed for sharing, date nights, and premium dinners.",
    addSet: "Add this set to cart",
    sideBody: "Pairing tasting menus with reservations makes the frontend feel like a complete restaurant product, not only a menu.",
  },
  ja: {
    subtitle: "シェアにも特別な夜にも合うセットメニューと季節コレクションをまとめました。",
    addSet: "このセットをカートに追加",
    sideBody: "セットメニューと予約導線を組み合わせることで、実店舗体験まで含めた一貫したプロダクトに見えます。",
  },
  zh: {
    subtitle: "整理了适合分享与特别晚餐的品鉴套餐与季节限定组合。",
    addSet: "将此套餐加入购物车",
    sideBody: "把套餐与预约流程组合在一起，会让前端更像完整餐厅产品，而不只是菜单页。",
  },
  ko: {
    subtitle: "공유 식사와 특별한 저녁을 위한 테이스팅 세트와 시즌 컬렉션을 모았습니다.",
    addSet: "이 세트를 장바구니에 추가",
    sideBody: "테이스팅 세트와 예약 흐름을 함께 두면 메뉴 페이지를 넘어 실제 레스토랑 제품처럼 보입니다.",
  },
} as const;

export function SpecialsShowcase({ locale }: { locale: AppLocale }) {
  const feature = getFeatureLinks(locale).find((item) => item.id === "specials");
  const copy = specialsText[locale];
  const experienceCopy = getExperienceCopy(locale);
  const specials = getLocalizedSpecials(locale);
  const testimonials = getLocalizedTestimonials(locale).slice(0, 2);
  const addItem = useCartStore((state) => state.addItem);
  const openCart = useCartStore((state) => state.openCart);

  return (
    <div className="space-y-10">
      <div className="max-w-3xl">
        <p className="text-[0.66rem] uppercase tracking-[0.18em] text-[#cdb37d]">{feature?.eyebrow}</p>
        <h1 className="mt-3 font-heading text-[2.75rem] leading-tight text-white sm:text-[3.2rem]">
          {feature?.title ?? experienceCopy.labels.specialsTitle}
        </h1>
        <p className="mt-4 text-[0.98rem] leading-8 text-[#d1c4b2]">{copy.subtitle}</p>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        {specials.map((special) => (
          <div key={special.id} className={`lux-panel relative overflow-hidden rounded-[2rem] bg-gradient-to-br p-6 ${special.accentClass}`}>
            <div className="absolute inset-0 bg-gradient-to-br opacity-85" />
            <div className="relative">
              <p className="text-[0.66rem] uppercase tracking-[0.18em] text-[#ecd8a0]">{special.season}</p>
              <h2 className="mt-4 font-heading text-[2rem] leading-tight text-white">{special.title}</h2>
              <p className="mt-4 text-[0.92rem] leading-7 text-[#d8cab8]">{special.description}</p>
              <div className="mt-5 space-y-2 rounded-[1.6rem] border border-white/10 bg-black/20 p-4">
                <p className="text-sm text-[#ecd8a0]">{special.serves}</p>
                <p className="text-sm text-[#d4c7b5]">{special.highlight}</p>
                <ul className="space-y-2 text-sm text-[#d8cab8]">
                  {special.dishes.map((dish) =>
                    dish ? <li key={dish.id}>• {dish.name}</li> : null,
                  )}
                </ul>
              </div>
              <div className="mt-6 flex items-center justify-between gap-3">
                <span className="font-heading text-[1.8rem] text-white">{special.price}</span>
                <Button
                  type="button"
                  className="button-shine rounded-full bg-[#d6b26a] text-[#1b130f] hover:bg-[#e4c987]"
                  onClick={() => {
                    special.dishes.forEach((dish) => {
                      if (!dish) return;

                      addItem({
                        dishId: dish.id,
                        quantity: 1,
                        spiceLevel: dish.baseSpice,
                        toppings: [],
                        unitPrice: dish.price,
                      });
                    });
                    openCart();
                  }}
                >
                  {copy.addSet}
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="lux-panel-soft rounded-[2rem] p-6 sm:p-8">
          <p className="text-[0.66rem] uppercase tracking-[0.18em] text-[#cdb37d]">{experienceCopy.labels.reviewsTitle}</p>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {testimonials.map((item) => (
              <div key={item.id} className="rounded-[1.6rem] border border-white/10 bg-black/18 p-5">
                <p className="text-[0.92rem] leading-7 text-[#d7c9b8]">“{item.quote}”</p>
                <p className="mt-4 text-white">{item.name}</p>
                <p className="text-sm text-[#bcae9b]">{item.role}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="lux-panel-soft rounded-[2rem] p-6 sm:p-8">
          <div className="inline-flex size-12 items-center justify-center rounded-2xl bg-[#d6b26a]/12 text-[#ecd8a0]">
            <Sparkles className="size-5" />
          </div>
          <p className="mt-5 text-[0.66rem] uppercase tracking-[0.18em] text-[#cdb37d]">{experienceCopy.labels.reserveNow}</p>
          <p className="mt-3 text-[0.98rem] leading-7 text-[#d1c4b2]">{copy.sideBody}</p>
          <div className="mt-6 flex flex-col gap-3">
            <Button
              type="button"
              className="button-shine rounded-full bg-[#d6b26a] text-[#1b130f] hover:bg-[#e4c987]"
              render={<Link href="/reservation" locale={locale} />}
            >
              {experienceCopy.labels.reserveNow}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="rounded-full border-white/10 bg-white/5 text-white hover:bg-white/10"
              render={<Link href="/menu" locale={locale} />}
            >
              {experienceCopy.labels.exploreMenu}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
