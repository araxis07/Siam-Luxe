"use client";

import { useLocale } from "next-intl";

import { Link } from "@/i18n/navigation";
import type { AppLocale } from "@/i18n/routing";

const errorText = {
  th: {
    eyebrow: "เกิดข้อผิดพลาด",
    title: "มีบางอย่างผิดพลาดในหน้าเว็บ",
    fallback: "เกิดข้อผิดพลาดที่ไม่คาดคิด คุณสามารถลองโหลดหน้าเดิมอีกครั้งหรือกลับไปหน้าแรก",
    retry: "ลองอีกครั้ง",
    home: "กลับหน้าแรก",
  },
  en: {
    eyebrow: "Unexpected error",
    title: "Something broke in the frontend layer",
    fallback: "An unknown rendering error occurred. You can retry this route or go back home.",
    retry: "Try again",
    home: "Back to home",
  },
  ja: {
    eyebrow: "予期しないエラー",
    title: "フロントエンドで問題が発生しました",
    fallback: "描画中に不明なエラーが発生しました。再試行するかホームへ戻ってください。",
    retry: "再試行",
    home: "ホームへ戻る",
  },
  zh: {
    eyebrow: "发生错误",
    title: "前端页面发生问题",
    fallback: "渲染过程中出现未知错误。你可以重试当前页面或返回首页。",
    retry: "重试",
    home: "返回首页",
  },
  ko: {
    eyebrow: "예상치 못한 오류",
    title: "프런트엔드 레이어에서 문제가 발생했습니다",
    fallback: "렌더링 중 알 수 없는 오류가 발생했습니다. 다시 시도하거나 홈으로 돌아갈 수 있습니다.",
    retry: "다시 시도",
    home: "홈으로 돌아가기",
  },
} as const;

export default function LocaleError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const locale = useLocale() as AppLocale;
  const text = errorText[locale];

  return (
    <section className="scene-section px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl lux-panel rounded-[2.4rem] px-6 py-16 text-center sm:px-10">
        <p className="text-[0.7rem] uppercase tracking-[0.22em] text-[#d6b26a]">{text.eyebrow}</p>
        <h1 className="mt-4 font-heading text-[3rem] leading-tight text-white">{text.title}</h1>
        <p className="mt-4 max-w-xl text-[#d1c4b2] mx-auto">
          {error.message || text.fallback}
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button
            type="button"
            onClick={reset}
            className="button-shine inline-flex h-12 items-center justify-center rounded-full bg-[#d6b26a] px-6 text-sm font-semibold text-[#1b130f] transition-colors hover:bg-[#e4c987]"
          >
            {text.retry}
          </button>
          <Link
            href="/"
            locale={locale}
            className="inline-flex h-12 items-center justify-center rounded-full border border-white/10 bg-white/5 px-6 text-sm font-semibold text-white transition-colors hover:bg-white/10"
          >
            {text.home}
          </Link>
        </div>
      </div>
    </section>
  );
}
