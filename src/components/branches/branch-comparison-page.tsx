import { CheckCircle2 } from "lucide-react";

import type { AppLocale } from "@/i18n/routing";
import { Link } from "@/i18n/navigation";
import { BranchAvailabilityMatrix } from "@/components/branches/branch-availability-matrix";
import { Button } from "@/components/ui/button";
import { getBranchComparisonRows } from "@/lib/hospitality";

const branchCompareText = {
  th: {
    eyebrow: "เปรียบเทียบสาขา",
    title: "เทียบสาขาเพื่อเลือกประสบการณ์ที่เหมาะกับแขกแต่ละแบบ",
    body: "หน้านี้สรุปความต่างของแต่ละสาขาทั้งเรื่องบรรยากาศ จุดแข็ง การรับเอง เดลิเวอรี และโอกาสที่เหมาะกับการใช้งานจริง",
    cta: "ดูหน้าติดต่อสาขา",
    bestFor: "เหมาะกับ",
  },
  en: {
    eyebrow: "Branch comparison",
    title: "Compare branches by dining moment, service strength, and guest fit",
    body: "This page helps guests choose the right branch for hosting, pickup, delivery, private dining, or slower dessert-led visits.",
    cta: "Open contact and locations",
    bestFor: "Best for",
  },
  ja: {
    eyebrow: "店舗比較",
    title: "利用シーンに合わせて最適な店舗を比較できます",
    body: "雰囲気、受取、配送、個室、利用シーンごとに店舗の違いを整理しています。",
    cta: "店舗案内へ",
    bestFor: "向いている利用",
  },
  zh: {
    eyebrow: "门店对比",
    title: "按用餐场景、服务强项与客群匹配对比分店",
    body: "帮助客人按招待、自取、配送、包厢或甜品导向体验选择更合适的门店。",
    cta: "查看联系与门店",
    bestFor: "更适合",
  },
  ko: {
    eyebrow: "지점 비교",
    title: "방문 목적과 서비스 강점에 따라 지점을 비교합니다",
    body: "호스팅, 픽업, 배달, 프라이빗 다이닝, 디저트 중심 방문까지 목적에 맞는 지점을 고를 수 있게 정리했습니다.",
    cta: "연락처 및 지점 보기",
    bestFor: "추천 상황",
  },
} as const;

export function BranchComparisonPage({ locale }: { locale: AppLocale }) {
  const text = branchCompareText[locale];
  const rows = getBranchComparisonRows(locale);

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
          {rows.map((row) => (
            <div key={row.id} className="lux-panel rounded-[2rem] p-6">
              <p className="text-[0.66rem] uppercase tracking-[0.18em] text-[#cdb37d]">{row.deliveryWindow}</p>
              <h2 className="mt-3 font-heading text-[2rem] leading-tight text-white">{row.title}</h2>
              <p className="mt-3 text-sm leading-7 text-[#d1c4b2]">{row.body}</p>
              <div className="thai-divider my-5" />
              <div className="space-y-4">
                <div>
                  <p className="text-[0.66rem] uppercase tracking-[0.18em] text-[#cdb37d]">{text.bestFor}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {row.bestFor.map((item) => (
                      <span
                        key={item}
                        className="rounded-full border border-[#d6b26a]/20 bg-[#d6b26a]/10 px-3 py-1 text-sm text-[#ecd8a0]"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="space-y-3 text-sm leading-6 text-[#d1c4b2]">
                  {row.strengths.map((item) => (
                    <p key={item} className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-[#d6b26a]" />
                      <span>{item}</span>
                    </p>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <BranchAvailabilityMatrix locale={locale} />

        <div className="flex justify-start">
          <Button
            type="button"
            className="button-shine rounded-full bg-[#d6b26a] px-5 text-[#1b130f] hover:bg-[#e4c987]"
            render={<Link href="/contact" locale={locale} />}
          >
            {text.cta}
          </Button>
        </div>
      </div>
    </section>
  );
}
