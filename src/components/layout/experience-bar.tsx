"use client";

import {
  CalendarDays,
  CircleHelp,
  Gift,
  Heart,
  LocateFixed,
  MapPinHouse,
  PartyPopper,
  Sparkles,
  TicketPercent,
  UserRound,
} from "lucide-react";

import type { AppLocale } from "@/i18n/routing";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getExperienceCopy, getFeatureLinks, getLocalizedBranches } from "@/lib/experience";
import { useExperienceStore } from "@/store/experience-store";

const iconMap = {
  specials: Sparkles,
  "build-set": Sparkles,
  "gift-cards": Gift,
  rewards: TicketPercent,
  catering: PartyPopper,
  reservation: CalendarDays,
  tracking: LocateFixed,
  favorites: Heart,
  account: UserRound,
  contact: MapPinHouse,
  help: CircleHelp,
} as const;

export function ExperienceBar({ locale }: { locale: AppLocale }) {
  const selectedBranchId = useExperienceStore((state) => state.selectedBranchId);
  const serviceMode = useExperienceStore((state) => state.serviceMode);
  const setSelectedBranchId = useExperienceStore((state) => state.setSelectedBranchId);
  const setServiceMode = useExperienceStore((state) => state.setServiceMode);
  const copy = getExperienceCopy(locale);
  const branches = getLocalizedBranches(locale);
  const featureLinks = getFeatureLinks(locale).filter((item) =>
    [
      "specials",
      "build-set",
      "gift-cards",
      "rewards",
      "catering",
      "reservation",
      "tracking",
      "favorites",
      "account",
      "contact",
      "help",
    ].includes(item.id),
  );
  const selectedBranch = branches.find((branch) => branch.id === selectedBranchId) ?? branches[0];

  return (
    <div className="relative z-30 border-b border-white/6 bg-[#0b0909]/78 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="grid gap-3 sm:grid-cols-[minmax(0,18rem)_minmax(0,18rem)]">
            <label className="space-y-2">
              <span className="text-[0.66rem] uppercase tracking-[0.18em] text-[#cdb37d]">
                {copy.labels.branch}
              </span>
              <Select value={selectedBranchId} onValueChange={(value) => setSelectedBranchId(value as typeof selectedBranchId)}>
                <SelectTrigger className="h-11 w-full rounded-full border-white/10 bg-white/5 px-4 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-2xl border-white/10 bg-[#120d0d]/96 text-white">
                  {branches.map((branch) => (
                    <SelectItem key={branch.id} value={branch.id}>
                      {branch.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </label>
            <div className="space-y-2">
              <span className="text-[0.66rem] uppercase tracking-[0.18em] text-[#cdb37d]">
                {copy.labels.serviceMode}
              </span>
              <div className="flex rounded-full border border-white/10 bg-white/5 p-1">
                {(["delivery", "pickup"] as const).map((mode) => (
                  <Button
                    key={mode}
                    type="button"
                    size="sm"
                    variant={serviceMode === mode ? "default" : "ghost"}
                    className={
                      serviceMode === mode
                        ? "flex-1 rounded-full bg-[#d6b26a] text-[#1b130f] hover:bg-[#e4c987]"
                        : "flex-1 rounded-full text-white hover:bg-white/8"
                    }
                    onClick={() => setServiceMode(mode)}
                  >
                    {copy.serviceModes[mode]}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          <div className="max-w-xl">
            <p className="text-[0.66rem] uppercase tracking-[0.18em] text-[#cdb37d]">
              {copy.labels.branchReady.replace("{branch}", selectedBranch.name)}
            </p>
            <p className="mt-2 text-sm text-[#d0c3b1]">
              {selectedBranch.neighborhood} · {selectedBranch.hours}
            </p>
            <p className="mt-1 text-sm text-[#a99b8c]">{selectedBranch.features.join(" • ")}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {featureLinks.map((item) => {
            const Icon = iconMap[item.id as keyof typeof iconMap] ?? Sparkles;

            return (
              <Link
                key={item.id}
                href={item.href}
                locale={locale}
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-[#e8ddd0] transition-colors hover:bg-white/9 hover:text-white"
              >
                <Icon className="size-4 text-[#d6b26a]" />
                <span className="line-clamp-1">{item.title}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
