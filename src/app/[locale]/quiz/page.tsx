import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";

import { RecommendationQuiz } from "@/components/quiz/recommendation-quiz";
import { routing, type AppLocale } from "@/i18n/routing";

export default async function QuizPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  return <RecommendationQuiz locale={locale as AppLocale} />;
}
