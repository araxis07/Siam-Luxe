import { useTranslations } from "next-intl";

export function SiteFooter() {
  const tCommon = useTranslations("common");
  const tFooter = useTranslations("footer");

  return (
    <footer className="border-t border-white/6 bg-[#0a0909]/90">
      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-10 text-sm text-[#d8cbbb] sm:px-6 md:grid-cols-[1.2fr_0.8fr] lg:px-8">
        <div className="space-y-3">
          <p className="font-heading text-2xl tracking-[0.2em] text-white uppercase">
            {tCommon("brand")}
          </p>
          <p className="max-w-xl text-[#c9bda9]">{tFooter("note")}</p>
        </div>
        <div className="space-y-2 md:text-right">
          <p>{tFooter("hours")}</p>
          <p className="text-[#9f9386]">{tFooter("rights")}</p>
        </div>
      </div>
    </footer>
  );
}
