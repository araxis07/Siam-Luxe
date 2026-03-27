import type { AppLocale } from "@/i18n/routing";

const uiText = {
  th: {
    close: "ปิด",
    dismissToast: "ปิดข้อความแจ้งเตือน",
    openNavigation: "เปิดเมนูนำทาง",
  },
  en: {
    close: "Close",
    dismissToast: "Dismiss toast",
    openNavigation: "Open navigation",
  },
  ja: {
    close: "閉じる",
    dismissToast: "通知を閉じる",
    openNavigation: "ナビゲーションを開く",
  },
  zh: {
    close: "关闭",
    dismissToast: "关闭提示",
    openNavigation: "打开导航",
  },
  ko: {
    close: "닫기",
    dismissToast: "알림 닫기",
    openNavigation: "내비게이션 열기",
  },
} as const;

export function getUiText(locale: AppLocale) {
  return uiText[locale];
}
