import { Quote } from "lucide-react";

import type { AppLocale } from "@/i18n/routing";
import { getExperienceCopy, getLocalizedTestimonials } from "@/lib/experience";

export function TestimonialsStrip({ locale }: { locale: AppLocale }) {
  const copy = getExperienceCopy(locale);
  const testimonials = getLocalizedTestimonials(locale);

  return (
    <section className="scene-section px-4 py-14 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 max-w-3xl">
          <p className="text-[0.66rem] uppercase tracking-[0.18em] text-[#cdb37d]">
            {copy.labels.reviewsTitle}
          </p>
          <h2 className="mt-3 font-heading text-[2.3rem] leading-tight text-white sm:text-[2.8rem]">
            {copy.labels.reviewsTitle}
          </h2>
          <p className="mt-3 text-[0.96rem] leading-7 text-[#d1c4b2]">{copy.labels.reviewsBody}</p>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          {testimonials.map((item) => (
            <div key={item.id} className="lux-panel-soft rounded-[2rem] p-6">
              <div className="inline-flex size-11 items-center justify-center rounded-2xl bg-[#d6b26a]/12 text-[#ecd8a0]">
                <Quote className="size-4.5" />
              </div>
              <p className="mt-5 text-[0.96rem] leading-7 text-[#d7c9b8]">“{item.quote}”</p>
              <div className="mt-5">
                <p className="font-medium text-white">{item.name}</p>
                <p className="text-sm text-[#bcae9b]">{item.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
