import Image from "next/image";
import { BadgeCheck, Crown, ScrollText, Sparkles, Users } from "lucide-react";

import { Link } from "@/i18n/navigation";
import type { AppLocale } from "@/i18n/routing";
import { getLocalizedHeritageData } from "@/lib/heritage";
import { TeamPortrait } from "@/components/heritage/team-portrait";

const crewKindLabel = {
  chef: {
    th: "เชฟ",
    en: "Chef",
    ja: "シェフ",
    zh: "主厨",
    ko: "셰프",
  },
  assistant: {
    th: "ลูกมือ",
    en: "Assistant",
    ja: "アシスタント",
    zh: "助手",
    ko: "어시스턴트",
  },
} as const;

export function HeritagePage({ locale }: { locale: AppLocale }) {
  const heritage = getLocalizedHeritageData(locale);
  const [storyLead, storyAccent, storyTeam] = heritage.stats;

  return (
    <>
      <section className="scene-section overflow-hidden px-4 pt-10 pb-16 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[1.02fr_0.98fr]">
          <div className="relative z-10">
            <div className="glass-chip inline-flex rounded-full px-4 py-2 text-[0.66rem] uppercase tracking-[0.2em] text-[#ecd8a0]">
              {heritage.overview.eyebrow}
            </div>
            <h1 className="mt-6 max-w-4xl font-heading text-[2.95rem] leading-[1.02] text-white sm:text-[3.7rem] lg:text-[4.55rem]">
              <span className="gold-gradient-text">{heritage.overview.title}</span>
            </h1>
            <p className="mt-6 max-w-3xl text-[1rem] leading-8 text-[#d2c5b5]">
              {heritage.overview.body}
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/menu"
                locale={locale}
                className="button-shine inline-flex h-12 items-center justify-center rounded-full bg-[#d6b26a] px-6 text-sm font-semibold text-[#1b130f] transition-colors hover:bg-[#e4c987]"
              >
                {heritage.overview.primaryCta}
              </Link>
              <a
                href="#house-team"
                className="inline-flex h-12 items-center justify-center rounded-full border border-white/10 bg-white/5 px-6 text-sm font-semibold text-white transition-colors hover:bg-white/10"
              >
                {heritage.overview.secondaryCta}
              </a>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {[storyLead, storyAccent, storyTeam].map((stat) => (
                <div key={stat.value} className="lux-panel-soft rounded-[1.8rem] p-4">
                  <p className="font-heading text-[1.9rem] text-white">{stat.value}</p>
                  <p className="mt-1 text-[0.72rem] uppercase tracking-[0.18em] text-[#c8b37a]">
                    {stat.label}
                  </p>
                  <p className="mt-3 text-[0.9rem] leading-6 text-[#d0c3b1]">{stat.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative h-[430px] lg:h-[620px]">
            <div className="depth-layer depth-0 absolute inset-x-6 top-10 h-72 rounded-full bg-[#7d1821]/30 blur-3xl" />
            <div className="depth-layer depth-1 absolute right-8 top-24 h-56 w-56 rounded-full bg-[#14563e]/22 blur-3xl" />
            <div className="relative h-full overflow-hidden rounded-[2.6rem] border border-white/10 bg-gradient-to-br from-[#3f1319] via-[#1a110f] to-[#090808] shadow-[0_45px_120px_rgba(0,0,0,0.48)]">
              <div className="thai-pattern absolute inset-0 opacity-18" />
              <Image
                src="/images/heritage/royal-origins.svg"
                alt={heritage.overview.title}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 48vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#090707] via-transparent to-transparent" />
              <div className="absolute left-5 top-5 rounded-3xl border border-white/10 bg-black/24 px-4 py-3 text-[0.76rem] uppercase tracking-[0.18em] text-[#f2dfad] shadow-xl shadow-black/25">
                {heritage.sections.storyEyebrow}
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
                <div className="lux-panel-soft rounded-[2rem] p-5">
                  <div className="flex items-center gap-3 text-[#ecd8a0]">
                    <Sparkles className="size-5" />
                    <span className="text-[0.68rem] uppercase tracking-[0.18em]">
                      {heritage.sections.valuesEyebrow}
                    </span>
                  </div>
                  <p className="mt-3 text-[0.94rem] leading-7 text-[#dacdbd]">
                    {heritage.sections.valuesTitle}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="scene-section px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8">
            <div className="inline-flex items-center gap-3 text-[#ecd8a0]">
              <ScrollText className="size-4.5" />
              <p className="text-[0.66rem] uppercase tracking-[0.2em] sm:text-[0.7rem]">
                {heritage.sections.storyEyebrow}
              </p>
            </div>
            <h2 className="mt-3 max-w-4xl font-heading text-[2.3rem] leading-tight text-white sm:text-[2.95rem]">
              {heritage.sections.storyTitle}
            </h2>
          </div>

          <div className="grid gap-5 lg:grid-cols-2">
            {heritage.chapters.map((chapter, index) => (
              <article key={chapter.id} className="lux-panel relative overflow-hidden rounded-[2rem] p-6">
                <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] to-transparent" />
                <div className="relative">
                  <div className="flex items-center gap-3">
                    <div className="inline-flex size-11 items-center justify-center rounded-2xl bg-[#d6b26a]/12 text-[#ecd8a0]">
                      {index + 1}
                    </div>
                    <div>
                      <p className="text-[0.66rem] uppercase tracking-[0.18em] text-[#c8b37a]">
                        {chapter.era}
                      </p>
                      <h3 className="mt-1 font-heading text-[1.55rem] leading-tight text-white">
                        {chapter.title}
                      </h3>
                    </div>
                  </div>
                  <p className="mt-5 text-[0.95rem] leading-8 text-[#d3c6b4]">{chapter.body}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="scene-section px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8">
            <div className="inline-flex items-center gap-3 text-[#ecd8a0]">
              <Crown className="size-4.5" />
              <p className="text-[0.66rem] uppercase tracking-[0.2em] sm:text-[0.7rem]">
                {heritage.sections.valuesEyebrow}
              </p>
            </div>
            <h2 className="mt-3 max-w-4xl font-heading text-[2.3rem] leading-tight text-white sm:text-[2.95rem]">
              {heritage.sections.valuesTitle}
            </h2>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {heritage.values.map((value) => (
              <div key={value.id} className="lux-panel-soft rounded-[2rem] p-5">
                <p className="text-[0.66rem] uppercase tracking-[0.18em] text-[#c8b37a]">
                  {heritage.sections.valuesEyebrow}
                </p>
                <h3 className="mt-3 font-heading text-[1.55rem] leading-tight text-white">{value.title}</h3>
                <p className="mt-4 text-[0.93rem] leading-7 text-[#d1c3b1]">{value.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="house-team" className="scene-section px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8">
            <div className="inline-flex items-center gap-3 text-[#ecd8a0]">
              <Users className="size-4.5" />
              <p className="text-[0.66rem] uppercase tracking-[0.2em] sm:text-[0.7rem]">
                {heritage.sections.teamEyebrow}
              </p>
            </div>
            <h2 className="mt-3 font-heading text-[2.3rem] leading-tight text-white sm:text-[2.95rem]">
              {heritage.sections.teamTitle}
            </h2>
            <p className="mt-4 max-w-4xl text-[0.98rem] leading-8 text-[#d1c4b2]">
              {heritage.sections.teamBody}
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
            {heritage.team.map((member) => (
              <article key={member.id} className="lux-panel overflow-hidden rounded-[2rem]">
                <div className="aspect-[4/4.5] bg-black/18 p-4">
                  <TeamPortrait
                    id={member.id}
                    name={member.name}
                    kind={member.kind}
                    palette={member.palette}
                  />
                </div>
                <div className="space-y-3 px-5 pt-5 pb-6">
                  <div className="flex flex-wrap gap-2">
                    <span className="glass-chip rounded-full px-3 py-1 text-[0.64rem] uppercase tracking-[0.16em] text-[#ecd8a0]">
                      {crewKindLabel[member.kind][locale]}
                    </span>
                    <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[0.64rem] uppercase tracking-[0.16em] text-white/85">
                      {member.specialty}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-heading text-[1.55rem] leading-tight text-white">{member.name}</h3>
                    <p className="mt-1 text-sm uppercase tracking-[0.16em] text-[#c8b37a]">{member.role}</p>
                  </div>
                  <p className="text-[0.93rem] leading-7 text-[#d1c3b1]">{member.duty}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="scene-section px-4 pt-14 pb-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8">
            <div className="inline-flex items-center gap-3 text-[#ecd8a0]">
              <BadgeCheck className="size-4.5" />
              <p className="text-[0.66rem] uppercase tracking-[0.2em] sm:text-[0.7rem]">
                {heritage.sections.supportEyebrow}
              </p>
            </div>
            <h2 className="mt-3 font-heading text-[2.3rem] leading-tight text-white sm:text-[2.95rem]">
              {heritage.sections.supportTitle}
            </h2>
            <p className="mt-4 max-w-4xl text-[0.98rem] leading-8 text-[#d1c4b2]">
              {heritage.sections.supportBody}
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {heritage.supportRoles.map((role) => (
              <div key={role.id} className="lux-panel-soft rounded-[2rem] p-5">
                <p className="text-[0.66rem] uppercase tracking-[0.18em] text-[#c8b37a]">
                  {heritage.sections.supportEyebrow}
                </p>
                <h3 className="mt-3 font-heading text-[1.45rem] leading-tight text-white">{role.title}</h3>
                <p className="mt-4 text-[0.92rem] leading-7 text-[#d1c3b1]">{role.duty}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
