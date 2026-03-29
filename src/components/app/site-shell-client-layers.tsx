"use client";

import dynamic from "next/dynamic";

import type { AppLocale } from "@/i18n/routing";

const CartDrawer = dynamic(() => import("@/components/cart/cart-drawer").then((mod) => mod.CartDrawer), {
  ssr: false,
});
const MobileCartBar = dynamic(
  () => import("@/components/cart/mobile-cart-bar").then((mod) => mod.MobileCartBar),
  {
    ssr: false,
  },
);
const ToastViewport = dynamic(
  () => import("@/components/ui/toast-viewport").then((mod) => mod.ToastViewport),
  {
    ssr: false,
  },
);
const PwaRegister = dynamic(() => import("@/components/app/pwa-register").then((mod) => mod.PwaRegister), {
  ssr: false,
});
const AuthSessionSync = dynamic(
  () => import("@/components/auth/auth-session-sync").then((mod) => mod.AuthSessionSync),
  {
    ssr: false,
  },
);

export function SiteShellClientLayers({ locale }: { locale: AppLocale }) {
  return (
    <>
      <AuthSessionSync />
      <CartDrawer locale={locale} />
      <MobileCartBar locale={locale} />
      <ToastViewport />
      <PwaRegister />
    </>
  );
}
