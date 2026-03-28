"use client";

import Image from "next/image";
import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState, useTransition } from "react";
import { CheckCircle2 } from "lucide-react";
import { useTranslations } from "next-intl";

import type { AppLocale } from "@/i18n/routing";
import { Link } from "@/i18n/navigation";
import { PromoCodePanel } from "@/components/cart/promo-code-panel";
import { SmartUpsellPanel } from "@/components/cart/smart-upsell-panel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useHydrated } from "@/hooks/use-hydrated";
import { useToast } from "@/hooks/use-toast";
import { getLocalizedDish } from "@/lib/catalog";
import { formatPrice } from "@/lib/format";
import { getExperienceCopy, getLocalizedBranch, getOrderTotals } from "@/lib/experience";
import {
  getLocalizedAddressLabel,
  getLocalizedPaymentLabel,
  normalizeSeedGuestName,
} from "@/lib/user-display";
import { useCartStore } from "@/store/cart-store";
import { useExperienceStore } from "@/store/experience-store";
import { useUserStore } from "@/store/user-store";

const checkoutEnhancementText = {
  th: {
    savedAddresses: "ที่อยู่ที่บันทึกไว้",
    paymentProfiles: "ช่องทางชำระเงินที่บันทึกไว้",
    active: "กำลังใช้",
    apply: "ใช้ข้อมูลนี้",
    walletTitle: "เครดิตในกระเป๋า",
    walletEntries: "เครดิตในกระเป๋า {count} รายการ",
  },
  en: {
    savedAddresses: "Saved addresses",
    paymentProfiles: "Saved payment methods",
    active: "Active",
    apply: "Apply",
    walletTitle: "Wallet credits",
    walletEntries: "{count} wallet entries",
  },
  ja: {
    savedAddresses: "保存済み住所",
    paymentProfiles: "保存済み支払い方法",
    active: "使用中",
    apply: "使う",
    walletTitle: "ウォレット残高",
    walletEntries: "ウォレット {count} 件",
  },
  zh: {
    savedAddresses: "已保存地址",
    paymentProfiles: "已保存支付方式",
    active: "当前使用",
    apply: "使用此项",
    walletTitle: "钱包余额",
    walletEntries: "钱包项目 {count} 条",
  },
  ko: {
    savedAddresses: "저장된 주소",
    paymentProfiles: "저장된 결제 수단",
    active: "사용 중",
    apply: "적용",
    walletTitle: "월렛 잔액",
    walletEntries: "월렛 항목 {count}개",
  },
} as const;

function createCheckoutSchema(t: ReturnType<typeof useTranslations<"checkout">>) {
  return z.object({
    fullName: z.string().min(2, t("errors.name")),
    phone: z
      .string()
      .regex(/^[+\d][\d\s-]{7,}$/, t("errors.phone")),
    addressLine: z.string().min(5, t("errors.address")),
    district: z.string().min(2, t("errors.district")),
    city: z.string().min(2, t("errors.city")),
    notes: z.string().optional(),
    deliveryTime: z.enum(["asap", "tonight", "lateNight"]),
    paymentMethod: z.enum(["cash", "card", "promptpay"]),
  });
}

type CheckoutValues = z.infer<ReturnType<typeof createCheckoutSchema>>;

export function CheckoutExperience({ locale }: { locale: AppLocale }) {
  const t = useTranslations("checkout");
  const tCart = useTranslations("cart");
  const tDish = useTranslations("dish");
  const hydrated = useHydrated();
  const [isPending, startOrderTransition] = useTransition();
  const [orderPlaced, setOrderPlaced] = useState(false);
  const experienceCopy = getExperienceCopy(locale);
  const { toast } = useToast();
  const items = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);
  const selectedBranchId = useExperienceStore((state) => state.selectedBranchId);
  const serviceMode = useExperienceStore((state) => state.serviceMode);
  const appliedPromoCode = useExperienceStore((state) => state.appliedPromoCode);
  const fullName = useUserStore((state) => state.fullName);
  const phone = useUserStore((state) => state.phone);
  const addressLine = useUserStore((state) => state.addressLine);
  const district = useUserStore((state) => state.district);
  const city = useUserStore((state) => state.city);
  const notes = useUserStore((state) => state.notes);
  const paymentMethod = useUserStore((state) => state.paymentMethod);
  const savedAddresses = useUserStore((state) => state.savedAddresses);
  const paymentProfiles = useUserStore((state) => state.paymentProfiles);
  const giftWallet = useUserStore((state) => state.giftWallet);
  const activeAddressId = useUserStore((state) => state.activeAddressId);
  const activePaymentProfileId = useUserStore((state) => state.activePaymentProfileId);
  const setActiveAddress = useUserStore((state) => state.setActiveAddress);
  const setActivePaymentProfile = useUserStore((state) => state.setActivePaymentProfile);
  const saveCheckoutProfile = useUserStore((state) => state.saveCheckoutProfile);
  const text = checkoutEnhancementText[locale];
  const activeAddress = savedAddresses.find((item) => item.id === activeAddressId) ?? savedAddresses[0];
  const activePaymentProfile = paymentProfiles.find((item) => item.id === activePaymentProfileId) ?? paymentProfiles[0];

  const seedName = normalizeSeedGuestName(fullName);
  const getPaymentKindLabel = (kind: "cash" | "card" | "promptpay") => {
    if (kind === "card") return t("payments.card");
    if (kind === "cash") return t("payments.cash");
    return t("payments.promptpay");
  };

  const form = useForm<CheckoutValues>({
    resolver: zodResolver(createCheckoutSchema(t)),
    defaultValues: {
      fullName: normalizeSeedGuestName(activeAddress?.recipient ?? "") || seedName,
      phone: activeAddress?.phone || phone,
      addressLine: activeAddress?.addressLine || addressLine,
      district: activeAddress?.district || district,
      city: activeAddress?.city || city,
      notes,
      paymentMethod: activePaymentProfile?.kind || paymentMethod,
      deliveryTime: "asap",
    },
  });

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    form.reset({
      fullName: normalizeSeedGuestName(activeAddress?.recipient ?? "") || seedName,
      phone: activeAddress?.phone || phone,
      addressLine: activeAddress?.addressLine || addressLine,
      district: activeAddress?.district || district,
      city: activeAddress?.city || city,
      notes,
      paymentMethod: activePaymentProfile?.kind || paymentMethod,
      deliveryTime: "asap",
    });
  }, [
    activeAddress?.addressLine,
    activeAddress?.city,
    activeAddress?.district,
    activeAddress?.id,
    activeAddress?.phone,
    activeAddress?.recipient,
    activePaymentProfile?.id,
    activePaymentProfile?.kind,
    addressLine,
    city,
    district,
    form,
    fullName,
    hydrated,
    notes,
    paymentMethod,
    phone,
    seedName,
  ]);

  if (!hydrated) {
    return <div className="h-[520px] animate-pulse rounded-[2rem] bg-white/5" />;
  }

  if (orderPlaced) {
    return (
      <div className="lux-panel mx-auto max-w-3xl rounded-[2.25rem] px-6 py-16 text-center sm:px-10">
        <CheckCircle2 className="mx-auto size-16 text-[#d6b26a]" />
        <h2 className="mt-6 font-heading text-[2.5rem] leading-tight text-white sm:text-[3rem]">{t("successTitle")}</h2>
        <p className="mx-auto mt-4 max-w-2xl text-[#d1c4b2]">{t("successBody")}</p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Button
            type="button"
            className="button-shine rounded-full bg-[#d6b26a] px-5 text-[#1b130f] hover:bg-[#e4c987]"
            render={<Link href="/menu" locale={locale} />}
          >
            {t("orderAgain")}
          </Button>
          <Button
            type="button"
            variant="outline"
            className="rounded-full border-white/10 bg-white/5 text-white hover:bg-white/10"
            render={<Link href="/" locale={locale} />}
          >
            {t("backToMenu")}
          </Button>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="lux-panel rounded-[2.25rem] px-6 py-16 text-center sm:px-10">
        <h2 className="font-heading text-[2.5rem] leading-tight text-white sm:text-[3rem]">{t("emptyTitle")}</h2>
        <p className="mx-auto mt-4 max-w-2xl text-[#d1c4b2]">{t("emptyBody")}</p>
        <Button
          type="button"
          className="button-shine mt-8 rounded-full bg-[#d6b26a] px-5 text-[#1b130f] hover:bg-[#e4c987]"
          render={<Link href="/menu" locale={locale} />}
        >
          {t("backToMenu")}
        </Button>
      </div>
    );
  }

  const branch = getLocalizedBranch(locale, selectedBranchId);
  const totals = getOrderTotals(items, appliedPromoCode);

  return (
    <div className="grid gap-8 xl:grid-cols-[1.02fr_0.98fr]">
      <div className="lux-panel rounded-[2.25rem] p-6 sm:p-8">
        <div className="mb-8">
          <p className="text-[0.66rem] uppercase tracking-[0.18em] text-[#cdb37d] sm:text-[0.7rem]">
            {t("deliveryDetails")}
          </p>
          <h2 className="mt-3 font-heading text-[2.5rem] leading-tight text-white sm:text-[3rem]">{t("title")}</h2>
          <p className="mt-3 max-w-2xl text-[0.96rem] leading-7 text-[#d1c4b2]">{t("subtitle")}</p>
          <div className="mt-5 rounded-[1.6rem] border border-white/10 bg-white/4 px-4 py-4 text-sm text-[#d1c4b2]">
            <p className="text-[0.66rem] uppercase tracking-[0.18em] text-[#cdb37d]">{experienceCopy.labels.branch}</p>
            <p className="mt-2 text-white">{branch.name}</p>
            <p className="mt-1 text-sm text-[#bcae9b]">
              {experienceCopy.serviceModes[serviceMode]} · {branch.neighborhood}
            </p>
          </div>
        </div>

        <form
          className="space-y-8"
          onSubmit={form.handleSubmit((values) => {
            startOrderTransition(() => {
              saveCheckoutProfile({
                fullName: values.fullName,
                phone: values.phone,
                addressLine: values.addressLine,
                district: values.district,
                city: values.city,
                notes: values.notes ?? "",
                paymentMethod: values.paymentMethod,
              });
              clearCart();
              setOrderPlaced(true);
              toast({
                title: t("successTitle"),
                description: t("successBody"),
                tone: "success",
              });
            });
          })}
        >
          <div className="grid gap-5 lg:grid-cols-2">
            <div className="space-y-3">
              <Label className="text-[#d9ccbb]">{text.savedAddresses}</Label>
              <div className="space-y-3">
                {savedAddresses.map((item) => {
                  const isActive = item.id === activeAddress?.id;

                  return (
                    <div key={item.id} className="rounded-[1.5rem] border border-white/10 bg-white/4 p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-white">{getLocalizedAddressLabel(locale, item)}</p>
                          <p className="mt-1 text-sm text-[#bcae9b]">{normalizeSeedGuestName(item.recipient) || experienceCopy.labels.accountGreeting}</p>
                          <p className="mt-2 text-sm text-[#d1c4b2]">{item.addressLine}</p>
                        </div>
                        <Button
                          type="button"
                          size="sm"
                          variant={isActive ? "default" : "outline"}
                          className={
                            isActive
                              ? "rounded-full bg-[#d6b26a] text-[#1b130f] hover:bg-[#e4c987]"
                              : "rounded-full border-white/10 bg-white/5 text-white hover:bg-white/10"
                          }
                          onClick={() => {
                            setActiveAddress(item.id);
                            form.setValue("fullName", normalizeSeedGuestName(item.recipient), { shouldDirty: true });
                            form.setValue("phone", item.phone, { shouldDirty: true });
                            form.setValue("addressLine", item.addressLine, { shouldDirty: true });
                            form.setValue("district", item.district, { shouldDirty: true });
                            form.setValue("city", item.city, { shouldDirty: true });
                          }}
                        >
                          {isActive ? text.active : text.apply}
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-[#d9ccbb]">{text.paymentProfiles}</Label>
              <div className="space-y-3">
                {paymentProfiles.map((item) => {
                  const isActive = item.id === activePaymentProfile?.id;

                  return (
                    <div key={item.id} className="rounded-[1.5rem] border border-white/10 bg-white/4 p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-white">{getLocalizedPaymentLabel(locale, item)}</p>
                          <p className="mt-1 text-sm text-[#bcae9b]">{getPaymentKindLabel(item.kind)}</p>
                        </div>
                        <Button
                          type="button"
                          size="sm"
                          variant={isActive ? "default" : "outline"}
                          className={
                            isActive
                              ? "rounded-full bg-[#d6b26a] text-[#1b130f] hover:bg-[#e4c987]"
                              : "rounded-full border-white/10 bg-white/5 text-white hover:bg-white/10"
                          }
                          onClick={() => {
                            setActivePaymentProfile(item.id);
                            form.setValue("paymentMethod", item.kind, { shouldDirty: true });
                          }}
                        >
                          {isActive ? text.active : text.apply}
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
              {giftWallet.length > 0 ? (
                <div className="rounded-[1.5rem] border border-white/10 bg-black/15 p-4">
                  <p className="text-[0.66rem] uppercase tracking-[0.18em] text-[#cdb37d]">{text.walletTitle}</p>
                  <p className="mt-3 font-heading text-[1.8rem] text-white">
                    {formatPrice(giftWallet.reduce((sum, item) => sum + item.amount, 0), locale)}
                  </p>
                  <p className="mt-2 text-sm text-[#d1c4b2]">{text.walletEntries.replace("{count}", String(giftWallet.length))}</p>
                </div>
              ) : null}
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <Label className="text-[#d9ccbb]">{t("fields.fullName")}</Label>
              <Input
                {...form.register("fullName")}
                className="h-12 rounded-2xl border-white/10 bg-white/4 text-white placeholder:text-[#8f8579]"
              />
              {form.formState.errors.fullName ? (
                <p className="text-sm text-[#f0a8a0]">{form.formState.errors.fullName.message}</p>
              ) : null}
            </div>
            <div className="space-y-2">
              <Label className="text-[#d9ccbb]">{t("fields.phone")}</Label>
              <Input
                {...form.register("phone")}
                className="h-12 rounded-2xl border-white/10 bg-white/4 text-white placeholder:text-[#8f8579]"
              />
              {form.formState.errors.phone ? (
                <p className="text-sm text-[#f0a8a0]">{form.formState.errors.phone.message}</p>
              ) : null}
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-[#d9ccbb]">{t("fields.addressLine")}</Label>
            <Input
              {...form.register("addressLine")}
              className="h-12 rounded-2xl border-white/10 bg-white/4 text-white placeholder:text-[#8f8579]"
            />
            {form.formState.errors.addressLine ? (
              <p className="text-sm text-[#f0a8a0]">{form.formState.errors.addressLine.message}</p>
            ) : null}
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <Label className="text-[#d9ccbb]">{t("fields.district")}</Label>
              <Input
                {...form.register("district")}
                className="h-12 rounded-2xl border-white/10 bg-white/4 text-white placeholder:text-[#8f8579]"
              />
              {form.formState.errors.district ? (
                <p className="text-sm text-[#f0a8a0]">{form.formState.errors.district.message}</p>
              ) : null}
            </div>
            <div className="space-y-2">
              <Label className="text-[#d9ccbb]">{t("fields.city")}</Label>
              <Input
                {...form.register("city")}
                className="h-12 rounded-2xl border-white/10 bg-white/4 text-white placeholder:text-[#8f8579]"
              />
              {form.formState.errors.city ? (
                <p className="text-sm text-[#f0a8a0]">{form.formState.errors.city.message}</p>
              ) : null}
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-[#d9ccbb]">{t("fields.notes")}</Label>
            <Textarea
              {...form.register("notes")}
              className="min-h-28 rounded-2xl border-white/10 bg-white/4 text-white placeholder:text-[#8f8579]"
            />
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-2">
              <Label className="text-[#d9ccbb]">{t("fields.deliveryTime")}</Label>
              <Controller
                name="deliveryTime"
                control={form.control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="h-12 w-full rounded-2xl border-white/10 bg-white/4 px-4 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl border-white/10 bg-[#120d0d]/96 text-white">
                      <SelectItem value="asap">{t("deliveryWindows.asap")}</SelectItem>
                      <SelectItem value="tonight">{t("deliveryWindows.tonight")}</SelectItem>
                      <SelectItem value="lateNight">{t("deliveryWindows.lateNight")}</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            <div className="space-y-3">
              <Label className="text-[#d9ccbb]">{t("paymentTitle")}</Label>
              <Controller
                name="paymentMethod"
                control={form.control}
                render={({ field }) => (
                  <RadioGroup
                    value={field.value}
                    onValueChange={field.onChange}
                    className="grid gap-3"
                  >
                    {(["promptpay", "card", "cash"] as const).map((method) => (
                      <label
                        key={method}
                        className="lux-panel-soft flex cursor-pointer items-center gap-3 rounded-2xl px-4 py-3"
                      >
                        <RadioGroupItem id={`payment-${method}`} value={method} />
                        <div>
                          <p className="font-medium text-white">
                            {t(`payments.${method}`)}
                          </p>
                        </div>
                      </label>
                    ))}
                  </RadioGroup>
                )}
              />
            </div>
          </div>

          <Button
            type="submit"
            size="lg"
            className="button-shine h-12 rounded-full bg-[#d6b26a] px-6 text-[#1b130f] hover:bg-[#e4c987]"
            disabled={isPending}
          >
            {t("submit")}
          </Button>
        </form>
      </div>

      <aside className="space-y-4 xl:sticky xl:top-28 xl:self-start">
        <div className="lux-panel rounded-[2.25rem] p-6 sm:p-8">
          <p className="text-[0.66rem] uppercase tracking-[0.18em] text-[#cdb37d] sm:text-[0.7rem]">
            {t("summaryTitle")}
          </p>
          <h3 className="mt-3 font-heading text-[2rem] leading-tight text-white sm:text-[2.25rem]">{t("summarySubtitle")}</h3>

          <div className="mt-6 space-y-4">
            {items.map((item) => {
              const dish = getLocalizedDish(locale, item.dishId);

              if (!dish) {
                return null;
              }

              return (
                <div key={item.key} className="lux-panel-soft flex gap-4 rounded-3xl p-4">
                  <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl">
                    <Image
                      src={dish.image}
                      alt={dish.name}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-white">{dish.name}</p>
                    <p className="mt-1 text-xs text-[#cabda9]">
                      {item.quantity} × {formatPrice(item.unitPrice, locale)}
                    </p>
                    <p className="mt-2 text-xs text-[#b19f89]">
                      {item.toppings.length > 0
                        ? item.toppings
                            .map(
                              (toppingId) =>
                                dish.availableToppings.find((entry) => entry.id === toppingId)?.label,
                            )
                            .filter(Boolean)
                            .join(", ")
                        : tDish("none")}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="thai-divider my-6" />
          <PromoCodePanel locale={locale} subtotal={totals.subtotal} />
          <div className="my-6">
            <SmartUpsellPanel locale={locale} />
          </div>
          <div className="thai-divider my-6" />
          <div className="space-y-3 text-sm text-[#d1c4b2]">
            <div className="flex items-center justify-between">
              <span>{tCart("subtotal")}</span>
              <span>{formatPrice(totals.subtotal, locale)}</span>
            </div>
            {totals.discount > 0 ? (
              <div className="flex items-center justify-between">
                <span>{experienceCopy.labels.discount}</span>
                <span>-{formatPrice(totals.discount, locale)}</span>
              </div>
            ) : null}
            <div className="flex items-center justify-between">
              <span>{tCart("delivery")}</span>
              <span>{formatPrice(totals.delivery, locale)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>{tCart("service")}</span>
              <span>{formatPrice(totals.service, locale)}</span>
            </div>
          </div>
          <div className="thai-divider my-6" />
          <div className="flex items-center justify-between">
            <span className="text-[0.66rem] uppercase tracking-[0.18em] text-[#cdb37d] sm:text-[0.7rem]">
              {tCart("total")}
            </span>
            <span className="font-heading text-[2rem] text-white sm:text-[2.25rem]">
              {formatPrice(totals.total, locale)}
            </span>
          </div>
        </div>
      </aside>
    </div>
  );
}
