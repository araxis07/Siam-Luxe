"use client";

import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, CheckCircle2, Info, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useHydrated } from "@/hooks/use-hydrated";
import { useToastStore } from "@/store/toast-store";

const iconMap = {
  success: CheckCircle2,
  error: AlertCircle,
  info: Info,
} as const;

const toneClasses = {
  success: "border-emerald-400/20 bg-emerald-400/10 text-emerald-50",
  error: "border-rose-400/20 bg-rose-400/10 text-rose-50",
  info: "border-[#d6b26a]/20 bg-[#d6b26a]/10 text-[#f4e4ba]",
} as const;

export function ToastViewport() {
  const hydrated = useHydrated();
  const toasts = useToastStore((state) => state.toasts);
  const dismissToast = useToastStore((state) => state.dismissToast);

  if (!hydrated || toasts.length === 0) {
    return null;
  }

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-4 z-[90] flex justify-center px-4">
      <div className="flex w-full max-w-md flex-col gap-3">
        <AnimatePresence initial={false}>
          {toasts.map((toast) => {
            const Icon = iconMap[toast.tone];

            return (
              <motion.div
                key={toast.id}
                initial={{ opacity: 0, y: 16, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 16, scale: 0.98 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className={`pointer-events-auto rounded-[1.6rem] border px-4 py-4 shadow-2xl shadow-black/30 backdrop-blur-xl ${toneClasses[toast.tone]}`}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5">
                    <Icon className="size-4.5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium">{toast.title}</p>
                    {toast.description ? (
                      <p className="mt-1 text-sm leading-6 opacity-90">{toast.description}</p>
                    ) : null}
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    aria-label="Dismiss toast"
                    className="rounded-full text-current hover:bg-black/10"
                    onClick={() => dismissToast(toast.id)}
                  >
                    <X className="size-4" />
                  </Button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
