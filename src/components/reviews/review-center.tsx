"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Star } from "lucide-react";
import { useTransition } from "react";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";

import type { AppLocale } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { trackEvent } from "@/lib/analytics";
import type { BackendSubmittedReview } from "@/lib/backend/types";
import { requestJson } from "@/lib/backend/client";
import { getLocalizedDishes } from "@/lib/catalog";
import { getExperienceCopy, getLocalizedDishReviews, getLocalizedTestimonials } from "@/lib/experience";
import { useReviewStore } from "@/store/review-store";

const reviewText = {
  th: {
    title: "รีวิวจากแขกและคะแนนเมนู",
    overall: "คะแนนรวม",
    published: "รีวิวที่เผยแพร่แล้ว",
    formTitle: "ส่งรีวิวใหม่",
    guest: "ชื่อ",
    region: "พื้นที่ของคุณ",
    dish: "เมนูที่รีวิว",
    rating: "คะแนน",
    bodyLabel: "ความเห็น",
    submit: "ส่งรีวิว",
    submitError: "ยังส่งรีวิวไม่ได้ในตอนนี้",
    submitting: "กำลังส่งรีวิว",
    errors: {
      guest: "กรุณากรอกชื่ออย่างน้อย 2 ตัวอักษร",
      region: "กรุณาระบุพื้นที่",
      dish: "กรุณาเลือกเมนู",
      rating: "กรุณาเลือกคะแนน",
      body: "กรุณาเขียนรีวิวอย่างน้อย 12 ตัวอักษร",
    },
  },
  en: {
    title: "Reviews, ratings, and guest notes",
    overall: "Overall rating",
    published: "published guest notes",
    formTitle: "Submit a review",
    guest: "Name",
    region: "Region",
    dish: "Dish",
    rating: "Rating",
    bodyLabel: "Review",
    submit: "Submit review",
    submitError: "Unable to submit the review right now.",
    submitting: "Submitting review",
    errors: {
      guest: "Please enter at least 2 characters",
      region: "Please enter your region",
      dish: "Please choose a dish",
      rating: "Please choose a rating",
      body: "Please write at least 12 characters",
    },
  },
  ja: {
    title: "レビュー、評価、ゲストの声",
    overall: "総合評価",
    published: "公開済みレビュー",
    formTitle: "レビューを投稿",
    guest: "名前",
    region: "地域",
    dish: "料理",
    rating: "評価",
    bodyLabel: "コメント",
    submit: "投稿する",
    submitError: "現在レビューを送信できません。",
    submitting: "レビューを送信しています",
    errors: {
      guest: "2文字以上で入力してください",
      region: "地域を入力してください",
      dish: "料理を選択してください",
      rating: "評価を選択してください",
      body: "12文字以上で入力してください",
    },
  },
  zh: {
    title: "点评、评分与食客笔记",
    overall: "综合评分",
    published: "已发布点评",
    formTitle: "提交点评",
    guest: "姓名",
    region: "地区",
    dish: "菜品",
    rating: "评分",
    bodyLabel: "评价内容",
    submit: "提交点评",
    submitError: "当前无法提交点评。",
    submitting: "正在提交点评",
    errors: {
      guest: "请至少输入 2 个字符",
      region: "请输入地区",
      dish: "请选择菜品",
      rating: "请选择评分",
      body: "请至少输入 12 个字符",
    },
  },
  ko: {
    title: "리뷰, 평점, 게스트 노트",
    overall: "종합 평점",
    published: "게시된 후기",
    formTitle: "리뷰 남기기",
    guest: "이름",
    region: "지역",
    dish: "메뉴",
    rating: "평점",
    bodyLabel: "후기",
    submit: "리뷰 제출",
    submitError: "지금은 리뷰를 제출할 수 없습니다.",
    submitting: "리뷰를 제출하는 중",
    errors: {
      guest: "이름을 2자 이상 입력해 주세요",
      region: "지역을 입력해 주세요",
      dish: "메뉴를 선택해 주세요",
      rating: "평점을 선택해 주세요",
      body: "후기를 12자 이상 입력해 주세요",
    },
  },
} as const;

function createSchema(locale: AppLocale) {
  const errors = reviewText[locale].errors;
  return z.object({
    guest: z.string().min(2, errors.guest),
    region: z.string().min(2, errors.region),
    dishId: z.string().min(1, errors.dish),
    rating: z.string().min(1, errors.rating),
    body: z.string().min(12, errors.body),
  });
}

type Values = z.infer<ReturnType<typeof createSchema>>;

export function ReviewCenter({ locale }: { locale: AppLocale }) {
  const copy = getExperienceCopy(locale);
  const text = reviewText[locale];
  const testimonials = getLocalizedTestimonials(locale);
  const dishes = getLocalizedDishes(locale);
  const seededReviews = getLocalizedDishReviews(locale);
  const submittedReviews = useReviewStore((state) => state.submittedReviews);
  const setSubmittedReviews = useReviewStore((state) => state.setSubmittedReviews);
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const form = useForm<Values>({
    resolver: zodResolver(createSchema(locale)),
    defaultValues: {
      guest: "",
      region: "",
      dishId: dishes[0]?.id ?? "",
      rating: "5",
      body: "",
    },
  });
  const selectedDishId = useWatch({ control: form.control, name: "dishId" });
  const selectedRating = useWatch({ control: form.control, name: "rating" });

  const reviews = [
    ...submittedReviews.map((review) => ({
      id: review.id,
      dishId: review.dishId,
      guest: review.guest,
      region: review.region,
      body: review.body,
      rating: review.rating,
    })),
    ...seededReviews,
  ];
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

          <div className="space-y-4">
            <div className="lux-panel-soft rounded-[2rem] p-6">
              <p className="text-[0.66rem] uppercase tracking-[0.18em] text-[#cdb37d]">{text.formTitle}</p>
              <form
                className="mt-4 grid gap-4 md:grid-cols-2"
                onSubmit={form.handleSubmit((values) => {
                  startTransition(() => {
                    void (async () => {
                      try {
                        const review = await requestJson<BackendSubmittedReview>("/api/reviews", {
                          method: "POST",
                          headers: {
                            "Content-Type": "application/json",
                          },
                          body: JSON.stringify({
                            guest: values.guest,
                            region: values.region,
                            dishId: values.dishId,
                            body: values.body,
                            rating: Number(values.rating),
                            locale,
                          }),
                        });

                        setSubmittedReviews([
                          review,
                          ...submittedReviews.filter((item) => item.id !== review.id),
                        ]);
                        trackEvent("review_submit", {
                          locale,
                          dishId: values.dishId,
                          rating: Number(values.rating),
                        });
                        toast({
                          title: text.formTitle,
                          description: values.guest,
                          tone: "success",
                        });
                        form.reset({
                          guest: "",
                          region: "",
                          dishId: dishes[0]?.id ?? "",
                          rating: "5",
                          body: "",
                        });
                      } catch (error) {
                        toast({
                          title: text.formTitle,
                          description: error instanceof Error ? error.message : text.submitError,
                          tone: "error",
                        });
                      }
                    })();
                  });
                })}
              >
                <div className="space-y-2">
                  <Label htmlFor="review-guest" className="text-[#d9ccbb]">{text.guest}</Label>
                  <Input id="review-guest" {...form.register("guest")} className="h-12 rounded-2xl border-white/10 bg-white/4 text-white" />
                  {form.formState.errors.guest ? <p className="text-sm text-[#f0aaa4]">{form.formState.errors.guest.message}</p> : null}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="review-region" className="text-[#d9ccbb]">{text.region}</Label>
                  <Input id="review-region" {...form.register("region")} className="h-12 rounded-2xl border-white/10 bg-white/4 text-white" />
                  {form.formState.errors.region ? <p className="text-sm text-[#f0aaa4]">{form.formState.errors.region.message}</p> : null}
                </div>
                <div className="space-y-2">
                  <Label className="text-[#d9ccbb]">{text.dish}</Label>
                  <Select value={selectedDishId} onValueChange={(value) => form.setValue("dishId", value ?? "")}>
                    <SelectTrigger className="h-12 rounded-2xl border-white/10 bg-white/4 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl border-white/10 bg-[#120d0d]/96 text-white">
                      {dishes.map((dish) => (
                        <SelectItem key={dish.id} value={dish.id}>
                          {dish.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-[#d9ccbb]">{text.rating}</Label>
                  <Select value={selectedRating} onValueChange={(value) => form.setValue("rating", value ?? "")}>
                    <SelectTrigger className="h-12 rounded-2xl border-white/10 bg-white/4 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl border-white/10 bg-[#120d0d]/96 text-white">
                      {["5", "4", "3", "2", "1"].map((score) => (
                        <SelectItem key={score} value={score}>
                          {score}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="review-body" className="text-[#d9ccbb]">{text.bodyLabel}</Label>
                  <Textarea id="review-body" {...form.register("body")} className="min-h-28 rounded-2xl border-white/10 bg-white/4 text-white" />
                  {form.formState.errors.body ? <p className="text-sm text-[#f0aaa4]">{form.formState.errors.body.message}</p> : null}
                </div>
                <div className="md:col-span-2">
                  <Button
                    type="submit"
                    className="button-shine rounded-full bg-[#d6b26a] text-[#1b130f] hover:bg-[#e4c987]"
                    disabled={isPending}
                  >
                    {isPending ? text.submitting : text.submit}
                  </Button>
                </div>
              </form>
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
      </div>
    </section>
  );
}
