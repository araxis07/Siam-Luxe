import { Sparkles } from "lucide-react";

import type { AppLocale } from "@/i18n/routing";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { getLocalizedDish } from "@/lib/catalog";
import { getFestivals } from "@/lib/premium";

const festivalText = {
  th: {
    eyebrow: "เทศกาลไทย",
    title: "แคมเปญและ landing page ตามเทศกาล",
    body: "หน้าชุดนี้ถูกออกแบบให้เป็น seasonal frontend สำหรับผูกกับโปรโมชัน การจอง และ set menu ในภายหลัง",
    viewSpecials: "ดู seasonal specials",
    bookTable: "จองโต๊ะช่วงเทศกาล",
  },
  en: {
    eyebrow: "Festivals",
    title: "Seasonal landing pages for Thai celebrations",
    body: "These campaigns are designed as premium seasonal frontends that can later connect to promotions, bookings, and set menus.",
    viewSpecials: "View seasonal specials",
    bookTable: "Book festival table",
  },
  ja: {
    eyebrow: "祝祭企画",
    title: "タイの祝祭に向けた季節ランディング",
    body: "将来的にプロモーション、予約、セットメニューへ接続しやすい季節特集ページとして設計しています。",
    viewSpecials: "季節メニューを見る",
    bookTable: "祝祭ディナーを予約",
  },
  zh: {
    eyebrow: "节庆企划",
    title: "面向泰国节庆的季节活动页",
    body: "这些页面按高端季节企划设计，后续可以平滑连接促销、订位与套餐系统。",
    viewSpecials: "查看季节精选",
    bookTable: "预订节庆餐桌",
  },
  ko: {
    eyebrow: "페스티벌",
    title: "태국 축제를 위한 시즌 랜딩 페이지",
    body: "이 페이지들은 이후 프로모션, 예약, 세트 메뉴와 쉽게 연결할 수 있도록 설계된 프리미엄 시즌 프런트엔드입니다.",
    viewSpecials: "시즌 스페셜 보기",
    bookTable: "축제 시즌 예약하기",
  },
} as const;

export function FestivalsPage({ locale }: { locale: AppLocale }) {
  const text = festivalText[locale];
  const festivals = getFestivals(locale);

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

        <div className="grid gap-6 xl:grid-cols-2">
          {festivals.map((festival) => (
            <div key={festival.slug} className="lux-panel rounded-[2rem] p-6 sm:p-8">
              <div className="inline-flex size-12 items-center justify-center rounded-2xl bg-[#d6b26a]/12 text-[#ecd8a0]">
                <Sparkles className="size-5" />
              </div>
              <p className="mt-5 text-[0.66rem] uppercase tracking-[0.18em] text-[#cdb37d]">{festival.season}</p>
              <h2 className="mt-3 font-heading text-[2rem] leading-tight text-white">{festival.title}</h2>
              <p className="mt-4 text-[0.96rem] leading-7 text-[#d1c4b2]">{festival.body}</p>
              <div className="mt-5 rounded-[1.6rem] border border-white/10 bg-white/4 p-5">
                <p className="text-sm text-[#ecd8a0]">{festival.highlight}</p>
                <ul className="mt-4 space-y-2 text-sm text-[#d1c4b2]">
                  {festival.dishIds.map((dishId) => {
                    const dish = getLocalizedDish(locale, dishId);
                    return dish ? <li key={dish.id}>• {dish.name}</li> : null;
                  })}
                </ul>
              </div>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Button
                  type="button"
                  className="button-shine rounded-full bg-[#d6b26a] text-[#1b130f] hover:bg-[#e4c987]"
                  render={<Link href="/specials" locale={locale} />}
                >
                  {text.viewSpecials}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-full border-white/10 bg-white/5 text-white hover:bg-white/10"
                  render={<Link href="/reservation" locale={locale} />}
                >
                  {text.bookTable}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
