"use client";

import { Star } from "lucide-react";

import type { AppLocale } from "@/i18n/routing";
import { getLocalizedDishes } from "@/lib/catalog";
import { getExperienceCopy, getLocalizedDishReviews, getLocalizedTestimonials } from "@/lib/experience";

const reviewText = {
  th: {
    title: "รีวิวจากแขกและคะแนนเมนู",
    overall: "คะแนนรวม",
    published: "รีวิวที่เผยแพร่แล้ว",
  },
  en: {
    title: "Reviews, ratings, and guest notes",
    overall: "Overall rating",
    published: "published guest notes",
  },
  ja: {
    title: "レビュー、評価、ゲストの声",
    overall: "総合評価",
    published: "公開済みレビュー",
  },
  zh: {
    title: "点评、评分与食客笔记",
    overall: "综合评分",
    published: "已发布点评",
  },
  ko: {
    title: "리뷰, 평점, 게스트 노트",
    overall: "종합 평점",
    published: "게시된 후기",
  },
} as const;

export function ReviewCenter({ locale }: { locale: AppLocale }) {
  const copy = getExperienceCopy(locale);
  const text = reviewText[locale];
  const testimonials = getLocalizedTestimonials(locale);
  const reviews = getLocalizedDishReviews(locale);
  const dishes = getLocalizedDishes(locale);
  const average = reviews.reduce((sum, review) => sum + review.rating, 0) / Math.max(1, reviews.length);

  return (
    <section className="scene-section px-4 pt-10 pb-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-10">
        <div className="max-w-3xl">
          <p className="text-[0.66rem] uppercase tracking-[0.18em] text-[#cdb37d]">{copy.labels.reviewsTitle}</p>
          <h1 className="mt-3 font-heading text-[2.75rem] leading-tight text-white sm:text-[3.2rem]">
            {text.title}
          </h1>
          <p className="mt-4 text-[0.98rem] leading-8 text-[#d1c4b2]">{copy.labels.reviewsBody}</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
          <div className="lux-panel rounded-[2rem] p-6 sm:p-8">
            <p className="text-[0.66rem] uppercase tracking-[0.18em] text-[#cdb37d]">{text.overall}</p>
            <h2 className="mt-3 font-heading text-[3rem] text-white">{average.toFixed(1)}</h2>
            <p className="mt-2 text-sm text-[#d1c4b2]">{reviews.length} {text.published}</p>
            <div className="mt-6 space-y-3">
              {testimonials.map((item) => (
                <div key={item.id} className="rounded-[1.5rem] border border-white/10 bg-white/4 p-4">
                  <p className="text-sm leading-6 text-[#d7cab8]">“{item.quote}”</p>
                  <p className="mt-3 text-white">{item.name}</p>
                  <p className="text-sm text-[#bcae9b]">{item.role}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {reviews.map((review) => {
              const dish = dishes.find((item) => item.id === review.dishId);

              return (
                <div key={review.id} className="lux-panel-soft rounded-[1.8rem] p-5">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-white">{dish?.name ?? review.dishId}</p>
                      <p className="mt-1 text-sm text-[#bcae9b]">{review.guest} · {review.region}</p>
                    </div>
                    <span className="inline-flex items-center gap-1 text-[#ecd8a0]">
                      <Star className="size-4 fill-current" />
                      {review.rating.toFixed(1)}
                    </span>
                  </div>
                  <p className="mt-4 text-sm leading-7 text-[#d1c4b2]">{review.body}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
