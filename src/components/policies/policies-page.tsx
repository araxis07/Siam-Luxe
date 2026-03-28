import type { AppLocale } from "@/i18n/routing";
import { getLegalSections } from "@/lib/hospitality";

const policyText = {
  th: {
    eyebrow: "กฎหมายและการใช้งาน",
    title: "หน้ากฎหมายและนโยบายหลักสำหรับเว็บร้านอาหาร",
    body: "เพื่อให้ frontend พร้อม production มากขึ้น ควรมีทั้ง privacy, terms และ device storage guidance ที่มองเห็นได้ชัดจากหน้าเว็บ",
  },
  en: {
    eyebrow: "Legal pages",
    title: "Core policies that make the restaurant frontend feel production-ready",
    body: "A polished restaurant frontend needs visible privacy, terms, and device-storage guidance rather than hiding them behind missing links.",
  },
  ja: {
    eyebrow: "法務ページ",
    title: "本番らしさを高めるための基本ポリシー",
    body: "プライバシー、利用規約、端末保存に関する説明を見える場所に置くことで、信頼感のある体験になります。",
  },
  zh: {
    eyebrow: "法律页面",
    title: "让餐饮前端更像真实产品的核心政策页",
    body: "清晰可见的隐私、条款与设备存储说明，会让整个前端更接近 production-ready。",
  },
  ko: {
    eyebrow: "정책 페이지",
    title: "프로덕션 느낌을 완성하는 핵심 법률/정책 페이지",
    body: "개인정보, 이용약관, 기기 저장소 안내가 눈에 띄게 제공되어야 프런트엔드가 더 신뢰감 있게 보입니다.",
  },
} as const;

export function PoliciesPage({ locale }: { locale: AppLocale }) {
  const text = policyText[locale];
  const sections = getLegalSections(locale);

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
