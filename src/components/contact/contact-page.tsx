import { Clock3, MapPinned, Phone } from "lucide-react";

import type { AppLocale } from "@/i18n/routing";
import { Link } from "@/i18n/navigation";
import { BranchAvailabilityMatrix } from "@/components/branches/branch-availability-matrix";
import { Button } from "@/components/ui/button";
import { getExperienceCopy, getFeatureLinks, getLocalizedBranches } from "@/lib/experience";

const contactText = {
  th: {
    body: "ทีมบริการของร้านจะช่วยแนะนำสาขาที่เหมาะกับการนั่งทาน รับเอง หรือจัดส่งตามพื้นที่ของคุณ",
    branchStory: "ดูรายละเอียดสาขา",
    privateDining: "จัดเลี้ยง / ห้องส่วนตัว",
    compareBranches: "เทียบสาขา",
  },
  en: {
    body: "House service can guide guests to the best branch for dine-in, pickup, or delivery-ready ordering.",
    branchStory: "View branch details",
    privateDining: "Private dining inquiry",
    compareBranches: "Compare branches",
  },
  ja: {
    body: "店舗サービスチームが、来店、受取、配送に最適な店舗選びを案内します。",
    branchStory: "店舗詳細を見る",
    privateDining: "個室・イベント相談",
    compareBranches: "店舗比較",
  },
  zh: {
    body: "门店服务团队会协助客人选择最适合堂食、自取或配送的门店。",
    branchStory: "查看门店详情",
    privateDining: "包厢 / 宴会咨询",
    compareBranches: "门店对比",
  },
  ko: {
    body: "매장 서비스 팀이 식사, 픽업, 배달에 가장 적합한 지점을 안내합니다.",
    branchStory: "지점 상세 보기",
    privateDining: "프라이빗 다이닝 문의",
    compareBranches: "지점 비교",
  },
} as const;

export function ContactPage({ locale }: { locale: AppLocale }) {
  const feature = getFeatureLinks(locale).find((item) => item.id === "contact");
  const copy = getExperienceCopy(locale);
  const branches = getLocalizedBranches(locale);

  return (
    <section className="scene-section px-4 pt-10 pb-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-10">
        <div className="max-w-3xl">
          <p className="text-[0.66rem] uppercase tracking-[0.18em] text-[#cdb37d]">{feature?.eyebrow}</p>
          <h1 className="mt-3 font-heading text-[2.75rem] leading-tight text-white sm:text-[3.2rem]">{feature?.title}</h1>
          <p className="mt-4 text-[0.98rem] leading-8 text-[#d1c4b2]">{feature?.description}</p>
        </div>

        <div className="grid gap-6 xl:grid-cols-3">
          {branches.map((branch) => (
            <div key={branch.id} className="lux-panel rounded-[2rem] p-6">
              <p className="text-[0.66rem] uppercase tracking-[0.18em] text-[#cdb37d]">{branch.neighborhood}</p>
              <h2 className="mt-3 font-heading text-[2rem] leading-tight text-white">{branch.name}</h2>
              <div className="mt-5 space-y-4 text-sm text-[#d0c3b1]">
                <div className="flex items-start gap-3">
                  <MapPinned className="mt-0.5 size-4 text-[#d6b26a]" />
                  <span>{branch.address}</span>
                </div>
                <div className="flex items-start gap-3">
                  <Clock3 className="mt-0.5 size-4 text-[#d6b26a]" />
                  <span>{branch.hours}</span>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="mt-0.5 size-4 text-[#d6b26a]" />
                  <span>{branch.phone}</span>
                </div>
              </div>
              <div className="thai-divider my-5" />
              <p className="text-[0.66rem] uppercase tracking-[0.18em] text-[#cdb37d]">{copy.labels.branchFeatures}</p>
              <ul className="mt-4 space-y-2 text-sm text-[#d0c3b1]">
                {branch.features.map((item) => (
                  <li key={item}>• {item}</li>
                ))}
              </ul>
              <div className="mt-5 flex flex-col gap-3">
                <Button
                  type="button"
                  className="button-shine rounded-full bg-[#d6b26a] text-[#1b130f] hover:bg-[#e4c987]"
                  render={<Link href={`/branches/${branch.id}`} locale={locale} />}
                >
                  {contactText[locale].branchStory}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-full border-white/10 bg-white/5 text-white hover:bg-white/10"
                  render={<Link href="/private-dining" locale={locale} />}
                >
                  {contactText[locale].privateDining}
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_0.92fr]">
          <div className="lux-panel-soft rounded-[2rem] p-6 sm:p-8">
            <p className="text-[0.66rem] uppercase tracking-[0.18em] text-[#cdb37d]">{copy.labels.mapLabel}</p>
            <div className="mt-5 overflow-hidden rounded-[1.8rem] border border-white/10 bg-gradient-to-br from-[#17352f] via-[#111615] to-[#0a0909] p-8">
              <div className="grid gap-4 md:grid-cols-3">
                {branches.map((branch) => (
                  <div key={branch.id} className="rounded-[1.5rem] border border-white/10 bg-black/20 p-4">
                    <p className="text-white">{branch.name}</p>
                    <p className="mt-2 text-sm text-[#bcae9b]">{branch.neighborhood}</p>
                    <p className="mt-1 text-sm text-[#a89989]">{branch.address}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lux-panel-soft rounded-[2rem] p-6 sm:p-8">
            <p className="text-[0.66rem] uppercase tracking-[0.18em] text-[#cdb37d]">{copy.labels.supportLine}</p>
            <h2 className="mt-3 font-heading text-[2rem] leading-tight text-white">+66 2 118 4500</h2>
            <p className="mt-4 text-[0.96rem] leading-7 text-[#d1c4b2]">{contactText[locale].body}</p>
            <div className="mt-6 flex flex-col gap-3">
              <Button
                type="button"
                className="button-shine rounded-full bg-[#d6b26a] text-[#1b130f] hover:bg-[#e4c987]"
                render={<Link href="/reservation" locale={locale} />}
              >
                {copy.labels.reserveNow}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="rounded-full border-white/10 bg-white/5 text-white hover:bg-white/10"
                render={<Link href="/tracking" locale={locale} />}
              >
                {copy.labels.trackingTitle}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="rounded-full border-white/10 bg-white/5 text-white hover:bg-white/10"
                render={<Link href="/private-dining" locale={locale} />}
              >
                {contactText[locale].privateDining}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="rounded-full border-white/10 bg-white/5 text-white hover:bg-white/10"
                render={<Link href="/compare-branches" locale={locale} />}
              >
                {contactText[locale].compareBranches}
              </Button>
            </div>
          </div>
        </div>

        <BranchAvailabilityMatrix locale={locale} />
      </div>
    </section>
  );
}
