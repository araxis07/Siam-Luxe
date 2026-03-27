"use client";

import Image from "next/image";
import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { startTransition, useEffect, useState, useTransition } from "react";
import { CheckCircle2 } from "lucide-react";
import { useTranslations } from "next-intl";

import type { AppLocale } from "@/i18n/routing";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useHydrated } from "@/hooks/use-hydrated";
import { getLocalizedDish } from "@/lib/catalog";
import { formatPrice } from "@/lib/format";
import { useCartStore } from "@/store/cart-store";
import { useUserStore } from "@/store/user-store";

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
  const items = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);
  const userProfile = useUserStore((state) => ({
    fullName: state.fullName,
    phone: state.phone,
    addressLine: state.addressLine,
    district: state.district,
    city: state.city,
    notes: state.notes,
    paymentMethod: state.paymentMethod,
  }));
  const saveCheckoutProfile = useUserStore((state) => state.saveCheckoutProfile);

  const form = useForm<CheckoutValues>({
    resolver: zodResolver(createCheckoutSchema(t)),
    defaultValues: {
      fullName: userProfile.fullName,
      phone: userProfile.phone,
      addressLine: userProfile.addressLine,
      district: userProfile.district,
      city: userProfile.city,
      notes: userProfile.notes,
      paymentMethod: userProfile.paymentMethod,
      deliveryTime: "asap",
    },
  });

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    startTransition(() => {
      form.reset({
        fullName: userProfile.fullName,
        phone: userProfile.phone,
        addressLine: userProfile.addressLine,
        district: userProfile.district,
        city: userProfile.city,
        notes: userProfile.notes,
        paymentMethod: userProfile.paymentMethod,
        deliveryTime: "asap",
      });
    });
  }, [form, hydrated, userProfile]);

  if (!hydrated) {
    return <div className="h-[520px] animate-pulse rounded-[2rem] bg-white/5" />;
  }

  if (orderPlaced) {
    return (
      <div className="lux-panel mx-auto max-w-3xl rounded-[2.25rem] px-6 py-16 text-center sm:px-10">
        <CheckCircle2 className="mx-auto size-16 text-[#d6b26a]" />
        <h2 className="mt-6 font-heading text-5xl text-white">{t("successTitle")}</h2>
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
        <h2 className="font-heading text-5xl text-white">{t("emptyTitle")}</h2>
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

  const subtotal = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const delivery = subtotal >= 1600 ? 0 : 79;
  const service = Math.round(subtotal * 0.05);
  const total = subtotal + delivery + service;

  return (
    <div className="grid gap-8 xl:grid-cols-[1.02fr_0.98fr]">
      <div className="lux-panel rounded-[2.25rem] p-6 sm:p-8">
        <div className="mb-8">
          <p className="text-xs uppercase tracking-[0.24em] text-[#cdb37d]">
            {t("deliveryDetails")}
          </p>
          <h2 className="mt-3 font-heading text-5xl text-white">{t("title")}</h2>
          <p className="mt-3 max-w-2xl text-[#d1c4b2]">{t("subtitle")}</p>
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
            });
          })}
        >
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
          <p className="text-xs uppercase tracking-[0.24em] text-[#cdb37d]">
            {t("summaryTitle")}
          </p>
          <h3 className="mt-3 font-heading text-4xl text-white">{t("summarySubtitle")}</h3>

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
          <div className="space-y-3 text-sm text-[#d1c4b2]">
            <div className="flex items-center justify-between">
              <span>{tCart("subtotal")}</span>
              <span>{formatPrice(subtotal, locale)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>{tCart("delivery")}</span>
              <span>{formatPrice(delivery, locale)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>{tCart("service")}</span>
              <span>{formatPrice(service, locale)}</span>
            </div>
          </div>
          <div className="thai-divider my-6" />
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-[0.24em] text-[#cdb37d]">
              {tCart("total")}
            </span>
            <span className="font-heading text-4xl text-white">
              {formatPrice(total, locale)}
            </span>
          </div>
        </div>
      </aside>
    </div>
  );
}
