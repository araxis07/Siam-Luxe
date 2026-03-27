import type { AppLocale } from "@/i18n/routing";
import { getAllDietaryLabels, getExperienceCopy, getFeatureLinks, getLocalizedFaqs } from "@/lib/experience";

export function HelpPage({ locale }: { locale: AppLocale }) {
  const feature = getFeatureLinks(locale).find((item) => item.id === "help");
  const copy = getExperienceCopy(locale);
  const faqs = getLocalizedFaqs(locale);
  const dietaryLabels = getAllDietaryLabels(locale);

  return (
    <section className="scene-section px-4 pt-10 pb-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-10">
        <div className="max-w-3xl">
          <p className="text-[0.66rem] uppercase tracking-[0.18em] text-[#cdb37d]">{feature?.eyebrow}</p>
          <h1 className="mt-3 font-heading text-[2.75rem] leading-tight text-white sm:text-[3.2rem]">{feature?.title}</h1>
          <p className="mt-4 text-[0.98rem] leading-8 text-[#d1c4b2]">{feature?.description}</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="lux-panel rounded-[2rem] p-6 sm:p-8">
            <p className="text-[0.66rem] uppercase tracking-[0.18em] text-[#cdb37d]">{copy.labels.faqTitle}</p>
            <div className="mt-5 space-y-4">
              {faqs.map((item) => (
                <details key={item.id} className="rounded-[1.6rem] border border-white/10 bg-white/4 p-5">
                  <summary className="cursor-pointer list-none text-white">{item.question}</summary>
                  <p className="mt-4 text-sm leading-7 text-[#d0c3b1]">{item.answer}</p>
                </details>
              ))}
            </div>
          </div>

          <div className="lux-panel-soft rounded-[2rem] p-6 sm:p-8">
            <p className="text-[0.66rem] uppercase tracking-[0.18em] text-[#cdb37d]">{copy.labels.dietaryTitle}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              {dietaryLabels.map((label) => (
                <span
                  key={label.id}
                  className={`rounded-full border px-3 py-2 text-[0.68rem] uppercase tracking-[0.14em] ${label.className}`}
                >
                  {label.label}
                </span>
              ))}
            </div>
            <p className="mt-5 text-sm leading-7 text-[#d0c3b1]">{copy.labels.dietaryNote}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
