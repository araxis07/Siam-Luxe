import Image from "next/image";
import { Crown, ScrollText, Users } from "lucide-react";

import { Link } from "@/i18n/navigation";
import type { AppLocale } from "@/i18n/routing";
import { getLocalizedHeritageData } from "@/lib/heritage";

const teaserIconMap = [ScrollText, Crown, Users] as const;

export function HeritageTeaser({ locale }: { locale: AppLocale }) {
  const heritage = getLocalizedHeritageData(locale);

  return (
    <section className="scene-section px-4 py-14 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl items-center gap-8 lg:grid-cols-[0.92fr_1.08fr]">
        <div className="relative h-[360px] overflow-hidden rounded-[2.4rem] border border-white/10 bg-gradient-to-br from-[#431319] via-[#1c1110] to-[#090808] shadow-[0_35px_100px_rgba(0,0,0,0.42)]">
          <div className="thai-pattern absolute inset-0 opacity-16" />
          <div className="depth-layer depth-0 absolute left-6 top-6 h-40 w-40 rounded-full bg-[#d7b970]/18 blur-3xl" />
          <div className="depth-layer depth-1 absolute right-6 bottom-6 h-40 w-40 rounded-full bg-[#165640]/20 blur-3xl" />
          <Image
            src="/images/heritage/royal-origins.svg"
            alt={heritage.overview.title}
            fill
            sizes="(max-width: 1024px) 100vw, 46vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#080606] via-transparent to-transparent" />
        </div>

        <div className="space-y-6">
          <div className="glass-chip inline-flex rounded-full px-4 py-2 text-[0.66rem] uppercase tracking-[0.2em] text-[#ecd8a0]">
            {heritage.overview.eyebrow}
          </div>
          <h2 className="max-w-3xl font-heading text-[2.3rem] leading-tight text-white sm:text-[2.8rem]">
            {heritage.overview.title}
          </h2>
          <p className="max-w-3xl text-[0.96rem] leading-8 text-[#d0c3b1]">
            {heritage.overview.body}
          </p>

          <div className="grid gap-4 md:grid-cols-3">
            {heritage.stats.map((stat, index) => {
              const Icon = teaserIconMap[index] ?? Crown;

              return (
                <div key={stat.value} className="lux-panel-soft rounded-[1.8rem] p-4">
                  <div className="inline-flex size-10 items-center justify-center rounded-2xl bg-[#d6b26a]/12 text-[#ecd8a0]">
                    <Icon className="size-4.5" />
                  </div>
                  <p className="mt-4 font-heading text-[1.8rem] text-white">{stat.value}</p>
                  <p className="mt-1 text-[0.78rem] uppercase tracking-[0.16em] text-[#c8b37a]">
                    {stat.label}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/heritage"
              locale={locale}
              className="button-shine inline-flex h-12 items-center justify-center rounded-full bg-[#d6b26a] px-6 text-sm font-semibold text-[#1b130f] transition-colors hover:bg-[#e4c987]"
            >
              {heritage.overview.secondaryCta}
            </Link>
            <Link
              href="/menu"
              locale={locale}
              className="inline-flex h-12 items-center justify-center rounded-full border border-white/10 bg-white/5 px-6 text-sm font-semibold text-white transition-colors hover:bg-white/10"
            >
              {heritage.overview.primaryCta}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
