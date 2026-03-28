import type { MetadataRoute } from "next";

import { routing } from "@/i18n/routing";
import { siteConfig } from "@/lib/site";

const routePaths = [
  "",
  "/menu",
  "/specials",
  "/reservation",
  "/tracking",
  "/reviews",
  "/heritage",
  "/account",
  "/auth",
  "/contact",
  "/help",
  "/favorites",
  "/gift-cards",
  "/rewards",
  "/build-a-set",
  "/catering",
  "/festivals",
  "/quiz",
  "/private-dining",
  "/compare-branches",
  "/pairings",
  "/policies",
  "/trust",
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return routing.locales.flatMap((locale) =>
    routePaths.map((path) => ({
      url: `${siteConfig.url}/${locale}${path}`,
      lastModified: now,
      changeFrequency: path === "" ? "daily" : "weekly",
      priority: path === "" ? 1 : 0.7,
    })),
  );
}
