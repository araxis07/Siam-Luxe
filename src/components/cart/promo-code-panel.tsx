"use client";

import { useMemo, useState } from "react";

import type { AppLocale } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { formatPrice } from "@/lib/format";
import { getDiscountValue, getExperienceCopy, getPromoOfferByCode, getPromoOffers } from "@/lib/experience";
import { useExperienceStore } from "@/store/experience-store";

export function PromoCodePanel({
  locale,
  subtotal,
}: {
  locale: AppLocale;
  subtotal: number;
}) {
  const appliedPromoCode = useExperienceStore((state) => state.appliedPromoCode);
  const setAppliedPromoCode = useExperienceStore((state) => state.setAppliedPromoCode);
  const copy = getExperienceCopy(locale);
  const offers = getPromoOffers(locale);
  const { toast } = useToast();
  const [draftValue, setDraftValue] = useState<string | null>(null);
  const [error, setError] = useState("");
  const value = draftValue ?? appliedPromoCode ?? "";

  const appliedOffer = useMemo(
    () => offers.find((offer) => offer.code === appliedPromoCode),
    [appliedPromoCode, offers],
  );
  const discount = getDiscountValue(subtotal, appliedPromoCode);

  function applyPromo(code: string) {
    const normalizedCode = code.trim().toUpperCase();
    const offer = getPromoOfferByCode(normalizedCode);
    const localizedOffer = offers.find((entry) => entry.code === normalizedCode);

    if (!offer || subtotal < offer.minimumSubtotal) {
      setError(copy.labels.invalidPromo);
      toast({
        title: copy.labels.promoTitle,
        description: copy.labels.invalidPromo,
        tone: "error",
      });
      return;
    }

    setAppliedPromoCode(normalizedCode);
    setDraftValue(normalizedCode);
    setError("");
    toast({
      title: copy.labels.promoApplied.replace("{code}", normalizedCode),
      description: localizedOffer?.description ?? copy.labels.promoTitle,
      tone: "success",
    });
  }

  return (
    <div className="space-y-3 rounded-[1.5rem] border border-white/10 bg-white/4 p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-[0.66rem] uppercase tracking-[0.18em] text-[#cdb37d]">
            {copy.labels.promoTitle}
          </p>
          <p className="mt-1 text-sm text-[#cdbfae]">{copy.labels.promoPlaceholder}</p>
        </div>
        {discount > 0 ? (
          <span className="rounded-full border border-[#d6b26a]/20 bg-[#d6b26a]/10 px-3 py-1 text-[0.68rem] uppercase tracking-[0.14em] text-[#ecd8a0]">
            {copy.labels.discount}: {formatPrice(discount, locale)}
          </span>
        ) : null}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Input
          value={value}
          onChange={(event) => setDraftValue(event.target.value)}
          placeholder={copy.labels.promoPlaceholder}
          className="h-11 rounded-full border-white/10 bg-black/20 text-white placeholder:text-[#8f8579]"
        />
        <div className="flex gap-2">
          <Button
            type="button"
            className="button-shine rounded-full bg-[#d6b26a] text-[#1b130f] hover:bg-[#e4c987]"
            onClick={() => applyPromo(value)}
          >
            {copy.labels.applyPromo}
          </Button>
          {appliedPromoCode ? (
            <Button
              type="button"
              variant="outline"
              className="rounded-full border-white/10 bg-white/5 text-white hover:bg-white/10"
              onClick={() => {
                setAppliedPromoCode(null);
                setDraftValue("");
                setError("");
                toast({
                  title: copy.labels.clearPromo,
                  description: copy.labels.promoTitle,
                  tone: "info",
                });
              }}
            >
              {copy.labels.clearPromo}
            </Button>
          ) : null}
        </div>
      </div>

      {error ? <p className="text-sm text-[#f0aaa4]">{error}</p> : null}
      {appliedOffer && discount > 0 ? (
        <p className="text-sm text-[#ecd8a0]">
          {copy.labels.promoApplied.replace("{code}", appliedOffer.code)}
        </p>
      ) : null}

      <div className="flex flex-wrap gap-2">
        {offers.map((offer) => {
          const isActive = appliedPromoCode === offer.code && discount > 0;

          return (
            <button
              key={offer.code}
              type="button"
              className={`rounded-full border px-3 py-2 text-left text-xs transition-colors ${
                isActive
                  ? "border-[#d6b26a]/40 bg-[#d6b26a]/10 text-[#ecd8a0]"
                  : "border-white/10 bg-black/20 text-[#d7c9b7] hover:bg-white/8"
              }`}
              onClick={() => {
                setDraftValue(offer.code);
                applyPromo(offer.code);
              }}
            >
              <span className="block font-semibold tracking-[0.12em] uppercase">{offer.code}</span>
              <span className="mt-1 block leading-5">{offer.description}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
