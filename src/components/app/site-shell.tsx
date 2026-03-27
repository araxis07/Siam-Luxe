import type { ReactNode } from "react";

import type { AppLocale } from "@/i18n/routing";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { MobileCartBar } from "@/components/cart/mobile-cart-bar";
import { PwaRegister } from "@/components/app/pwa-register";
import { ExperienceBar } from "@/components/layout/experience-bar";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { ToastViewport } from "@/components/ui/toast-viewport";

export function SiteShell({
  children,
  locale,
}: {
  children: ReactNode;
  locale: AppLocale;
}) {
  return (
    <div className="relative flex min-h-screen flex-col">
      <div className="pointer-events-none absolute inset-x-0 top-0 z-0 h-[520px]">
        <div className="depth-layer depth-0 mx-auto mt-[-5rem] h-72 w-72 rounded-full bg-[#7d1821]/35 blur-3xl" />
        <div className="depth-layer depth-1 ml-auto mt-20 h-60 w-60 rounded-full bg-[#15563f]/28 blur-3xl" />
      </div>
      <SiteHeader locale={locale} />
      <ExperienceBar locale={locale} />
      <main className="relative z-10 flex-1">{children}</main>
      <SiteFooter locale={locale} />
      <CartDrawer locale={locale} />
      <MobileCartBar locale={locale} />
      <ToastViewport />
      <PwaRegister />
    </div>
  );
}
