"use client";

import type { AppLocale } from "@/i18n/routing";
import type { BranchId } from "@/lib/experience";
import { getSeatMapZones } from "@/lib/guest-experience";

const seatMapText = {
  th: {
    title: "Seat Map Visual",
    open: "พร้อม",
    limited: "เหลือน้อย",
    waitlist: "รอคิว",
  },
  en: {
    title: "Seat Map Visual",
    open: "Open",
    limited: "Limited",
    waitlist: "Waitlist",
  },
  ja: {
    title: "席マップ",
    open: "案内可",
    limited: "残り少",
    waitlist: "待機",
  },
  zh: {
    title: "座位图",
    open: "可用",
    limited: "有限",
    waitlist: "候补",
  },
  ko: {
    title: "좌석 맵",
    open: "가능",
    limited: "제한적",
    waitlist: "웨이트리스트",
  },
} as const;

function tableClass(state: "free" | "held" | "occupied") {
  if (state === "free") return "bg-[#1d624b]";
  if (state === "held") return "bg-[#d6b26a]";
  return "bg-[#9b1d27]";
}

export function SeatMapVisual({
  locale,
  branchId,
  selectedZone,
  onSelectZone,
}: {
  locale: AppLocale;
  branchId: BranchId;
  selectedZone: string;
  onSelectZone: (zone: "salon" | "terrace" | "counter" | "private") => void;
}) {
  const text = seatMapText[locale];
  const zones = getSeatMapZones(locale, branchId);

  return (
    <div className="lux-panel-soft rounded-[2rem] p-6">
      <p className="text-[0.66rem] uppercase tracking-[0.18em] text-[#cdb37d]">{text.title}</p>
      <div className="mt-4 grid gap-4 xl:grid-cols-2">
        {zones.map((zone) => (
          <button
            key={zone.id}
            type="button"
            data-testid={`seat-zone-${zone.id}`}
            className={`rounded-[1.6rem] border p-4 text-left transition-colors ${
              selectedZone === zone.id
                ? "border-[#d6b26a]/35 bg-[#d6b26a]/10"
                : "border-white/10 bg-white/4 hover:bg-white/8"
            }`}
            onClick={() => onSelectZone(zone.id)}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-white">{zone.label}</p>
                <p className="mt-2 text-sm leading-6 text-[#bcae9b]">{zone.vibe}</p>
              </div>
              <span className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-xs uppercase tracking-[0.16em] text-[#ecd8a0]">
                {text[zone.status]}
              </span>
            </div>
            <div className="relative mt-4 h-36 overflow-hidden rounded-[1.2rem] border border-white/10 bg-[#0f0d0d]">
              {zone.tables.map((table) => (
                <span
                  key={table.id}
                  className={`absolute rounded-full ${tableClass(table.state)}`}
                  style={{
                    left: `${table.x}%`,
                    top: `${table.y}%`,
                    width: table.size === "lg" ? "2.8rem" : table.size === "md" ? "2.2rem" : "1.6rem",
                    height: table.size === "lg" ? "2.8rem" : table.size === "md" ? "2.2rem" : "1.6rem",
                    transform: "translate(-50%, -50%)",
                  }}
                />
              ))}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
