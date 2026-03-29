import type { AppLocale } from "@/i18n/routing";
import { getTrustSections } from "@/lib/hospitality";

const trustText = {
  th: {
    eyebrow: "ศูนย์ความเชื่อมั่น",
    title: "นโยบายที่แขกควรมองเห็นก่อนสั่งอาหารหรือจองโต๊ะ",
    body: "รวม allergen guidance, delivery / pickup policy และ refund / reservation guidance ไว้ในหน้าที่อ่านง่ายและชัดเจน",
  },
  en: {
    eyebrow: "Trust center",
    title: "The policies guests should see before ordering or reserving",
    body: "This page gathers allergen, delivery, pickup, refund, and reservation guidance into one clear guest reference.",
  },
  ja: {
    eyebrow: "信頼センター",
    title: "注文や予約の前に見えるべき案内を一箇所に",
    body: "アレルゲン、配送、受取、返金、予約ポリシーを読みやすくまとめています。",
  },
  zh: {
    eyebrow: "信任中心",
    title: "客人在下单或预订前应看到的重要说明",
    body: "把过敏原、配送、自取、退款与预订政策集中到一个更清晰的页面中。",
  },
  ko: {
    eyebrow: "트러스트 센터",
    title: "주문과 예약 전에 보여야 하는 안내를 한곳에 정리했습니다",
    body: "알레르기, 배달, 픽업, 환불, 예약 정책을 읽기 쉽게 모아 둔 페이지입니다.",
  },
} as const;

export function TrustCenterPage({ locale }: { locale: AppLocale }) {
  const text = trustText[locale];
  const sections = getTrustSections(locale);

  return (
    <section className="scene-section px-4 pt-10 pb-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl space-y-8">
        <div className="max-w-3xl">
          <p className="text-[0.66rem] uppercase tracking-[0.18em] text-[#cdb37d]">{text.eyebrow}</p>
          <h1 className="mt-3 font-heading text-[2.75rem] leading-tight text-white sm:text-[3.2rem]">
            {text.title}
          </h1>
          <p className="mt-4 text-[0.98rem] leading-8 text-[#d1c4b2]">{text.body}</p>
        </div>

        <div className="space-y-6">
          {sections.map((section) => (
            <article key={section.id} className="lux-panel rounded-[2rem] p-6 sm:p-8">
              <h2 className="font-heading text-[2rem] leading-tight text-white">{section.title}</h2>
              <p className="mt-4 text-sm leading-7 text-[#d1c4b2]">{section.body}</p>
              <ul className="mt-5 space-y-3 text-sm leading-6 text-[#d1c4b2]">
                {section.bullets.map((bullet) => (
                  <li key={bullet}>• {bullet}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
