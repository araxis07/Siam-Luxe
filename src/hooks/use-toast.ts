"use client";

import { useToastStore, type ToastTone } from "@/store/toast-store";

export function useToast() {
  const showToast = useToastStore((state) => state.showToast);

  return {
    toast: (payload: { title: string; description?: string; tone?: ToastTone }) =>
      showToast({
        title: payload.title,
        description: payload.description,
        tone: payload.tone ?? "info",
      }),
  };
}
