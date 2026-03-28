"use client";

type AnalyticsPayload = Record<string, string | number | boolean | null | undefined>;

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
  }
}

export function trackEvent(event: string, payload: AnalyticsPayload = {}) {
  if (typeof window === "undefined") {
    return;
  }

  const entry = {
    event,
    ...payload,
    ts: new Date().toISOString(),
  };

  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push(entry);

  if (process.env.NODE_ENV !== "production") {
    console.info("[analytics]", entry);
  }
}

export function trackPageView(pathname: string, locale: string) {
  trackEvent("page_view", { pathname, locale });
}
