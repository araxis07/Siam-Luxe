"use client";

import { useLocale } from "next-intl";

import { Link } from "@/i18n/navigation";
import type { AppLocale } from "@/i18n/routing";

const notFoundText = {
  th: {
    title: "ไม่พบหน้าที่คุณกำลังมองหา",
    body: "ลิงก์นี้อาจถูกย้าย หน้าอาจหายไป หรือ locale ของเส้นทางนี้ไม่ถูกต้อง",
    home: "กลับหน้าแรก",
    menu: "ดูเมนู",
  },
  en: {
    title: "This page could not be found",
    body: "The route may have moved, the page may no longer exist, or the locale is invalid.",
    home: "Back to home",
    menu: "Browse menu",
  },
  ja: {
    title: "このページは見つかりませんでした",
    body: "リンク先が変更されたか、ページが存在しないか、ロケールが正しくありません。",
    home: "ホームへ戻る",
    menu: "メニューを見る",
  },
  zh: {
    title: "未找到该页面",
    body: "该链接可能已变更、页面已移除，或当前语言路径无效。",
    home: "返回首页",
    menu: "查看菜单",
  },
  ko: {
    title: "이 페이지를 찾을 수 없습니다",
    body: "링크가 이동되었거나 페이지가 삭제되었거나 현재 로케일 경로가 올바르지 않습니다.",
    home: "홈으로 돌아가기",
    menu: "메뉴 보기",
  },
} as const;

export default function LocaleNotFound() {
  const locale = useLocale() as AppLocale;
  const text = notFoundText[locale];

  return (
    <section className="scene-section px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl lux-panel rounded-[2.4rem] px-6 py-16 text-center sm:px-10">
        <p className="text-[0.7rem] uppercase tracking-[0.22em] text-[#d6b26a]">404</p>
        <h1 className="mt-4 font-heading text-[3rem] leading-tight text-white">{text.title}</h1>
        <p className="mt-4 max-w-xl text-[#d1c4b2] mx-auto">{text.body}</p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/"
            locale={locale}
            className="button-shine inline-flex h-12 items-center justify-center rounded-full bg-[#d6b26a] px-6 text-sm font-semibold text-[#1b130f] transition-colors hover:bg-[#e4c987]"
          >
            {text.home}
          </Link>
          <Link
            href="/menu"
            locale={locale}
            className="inline-flex h-12 items-center justify-center rounded-full border border-white/10 bg-white/5 px-6 text-sm font-semibold text-white transition-colors hover:bg-white/10"
          >
            {text.menu}
          </Link>
        </div>
      </div>
    </section>
  );
}
