"use client";

import type { AppLocale } from "@/i18n/routing";
import type { BranchId } from "@/lib/experience";
import { getReservationCalendar } from "@/lib/guest-experience";

const panelText = {
  th: {
    title: "ปฏิทินการจอง",
    open: "โล่ง",
    steady: "เริ่มแน่น",
    peak: "พีค",
  },
  en: {
    title: "Reservation calendar",
    open: "Open",
    steady: "Steady",
    peak: "Peak",
  },
  ja: {
    title: "予約カレンダー",
    open: "空きあり",
    steady: "混み始め",
    peak: "ピーク",
  },
  zh: {
    title: "预约日历",
    open: "宽松",
    steady: "升温",
    peak: "高峰",
  },
  ko: {
    title: "예약 캘린더",
    open: "여유",
    steady: "보통",
    peak: "피크",
  },
} as const;

function demandClass(demand: "open" | "steady" | "peak") {
  if (demand === "open") return "border-[#1d624b]/24 bg-[#1d624b]/12";
  if (demand === "steady") return "border-[#d6b26a]/24 bg-[#d6b26a]/12";
  return "border-[#9b1d27]/24 bg-[#9b1d27]/12";
}

export function ReservationCalendarPanel({
  locale,
  branchId,
  selectedDate,
  onPickDate,
}: {
  locale: AppLocale;
  branchId: BranchId;
  selectedDate: string;
  onPickDate: (date: string) => void;
}) {
  const text = panelText[locale];
  const days = getReservationCalendar(locale, branchId);

  return (
    <div className="lux-panel-soft rounded-[2rem] p-6">
      <p className="text-[0.66rem] uppercase tracking-[0.18em] text-[#cdb37d]">{text.title}</p>
      <div className="mt-4 grid gap-3 md:grid-cols-5">
        {days.map((day) => (
          <button
            key={day.date}
            type="button"
            data-testid={`calendar-day-${day.date}`}
            className={`rounded-[1.45rem] border p-4 text-left transition-colors ${demandClass(day.demand)} ${
              selectedDate === day.date ? "ring-2 ring-[#d6b26a]/55" : ""
            }`}
            onClick={() => onPickDate(day.date)}
          >
            <p className="text-[0.66rem] uppercase tracking-[0.18em] text-[#cdb37d]">{day.dayLabel}</p>
            <p className="mt-2 font-heading text-[1.35rem] text-white">{day.shortLabel}</p>
            <p className="mt-3 text-sm text-[#d1c4b2]">{day.headline}</p>
            <p className="mt-2 text-sm text-[#bcae9b]">{day.seatsLeft}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
