import type { AppLocale } from "@/i18n/routing";
import { Link } from "@/i18n/navigation";
import { getExperienceCopy, getFeatureLinks } from "@/lib/experience";

export function FeatureLinkGrid({ locale }: { locale: AppLocale }) {
  const copy = getExperienceCopy(locale);
  const featureLinks = getFeatureLinks(locale);

  return (
    <section className="scene-section px-4 py-14 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 max-w-3xl">
          <p className="text-[0.66rem] uppercase tracking-[0.2em] text-[#cdb37d] sm:text-[0.7rem]">{copy.labels.quickAccess}</p>
          <h2 className="mt-3 font-heading text-[2.3rem] leading-tight text-white sm:text-[2.8rem]">
            {copy.labels.accountBody}
          </h2>
          <p className="mt-3 text-[0.96rem] leading-7 text-[#d1c4b2]">
            {copy.labels.contactBody}
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {featureLinks.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              locale={locale}
              className={`lux-panel group relative overflow-hidden rounded-[2rem] bg-gradient-to-br p-6 transition-transform duration-300 hover:-translate-y-1 ${item.accentClass}`}
            >
              <div className="absolute inset-0 bg-gradient-to-br opacity-85" />
              <div className="relative">
                <p className="text-[0.66rem] uppercase tracking-[0.18em] text-[#ecd8a0]">{item.eyebrow}</p>
                <h3 className="mt-4 font-heading text-[1.9rem] leading-tight text-white">{item.title}</h3>
                <p className="mt-4 text-[0.92rem] leading-7 text-[#d9ccbb]">{item.description}</p>
                <span className="mt-6 inline-flex rounded-full border border-white/10 bg-white/8 px-3 py-2 text-[0.7rem] uppercase tracking-[0.16em] text-white transition-colors group-hover:bg-white/14">
                  {copy.labels.viewAll}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
