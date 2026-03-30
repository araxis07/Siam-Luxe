"use client";

import { useEffect, useState } from "react";

import type { AppLocale } from "@/i18n/routing";
import { requestJson } from "@/lib/backend/client";

type AuditEntry = {
  id: string;
  actor_email: string | null;
  scope: string;
  action: string;
  target_table: string;
  target_id: string;
  summary: string;
  created_at: string;
};

const copy = {
  th: {
    title: "activity log",
    empty: "ยังไม่มีรายการล่าสุด",
  },
  en: {
    title: "Activity log",
    empty: "No recent activity",
  },
  ja: {
    title: "アクティビティログ",
    empty: "最近の記録はありません",
  },
  zh: {
    title: "活动日志",
    empty: "暂无最近记录",
  },
  ko: {
    title: "활동 로그",
    empty: "최근 기록이 없습니다",
  },
} as const;

function formatDateLabel(locale: AppLocale, value: string) {
  try {
    return new Intl.DateTimeFormat(locale, {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(value));
  } catch {
    return value;
  }
}

export function AuditLogPanel({ locale }: { locale: AppLocale }) {
  const text = copy[locale];
  const [entries, setEntries] = useState<AuditEntry[]>([]);

  useEffect(() => {
    void requestJson<AuditEntry[]>("/api/admin/audit-logs", {
      method: "GET",
      cache: "no-store",
    })
      .then((data) => {
        setEntries(data);
      })
      .catch(() => {
        setEntries([]);
      });
  }, []);

  return (
    <div className="lux-panel-soft rounded-[2rem] p-6">
      <p className="text-[0.66rem] uppercase tracking-[0.18em] text-[#cdb37d]">{text.title}</p>
      <div className="mt-4 space-y-3">
        {entries.length === 0 ? (
          <p className="rounded-[1.4rem] border border-white/10 bg-white/4 px-4 py-4 text-sm text-[#d1c4b2]">{text.empty}</p>
        ) : (
          entries.map((entry) => (
            <div key={entry.id} className="rounded-[1.4rem] border border-white/10 bg-white/4 p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-medium text-white">{entry.summary || `${entry.scope} · ${entry.action}`}</p>
                  <p className="mt-1 text-sm text-[#bcae9b]">{entry.actor_email ?? "system"}</p>
                </div>
                <p className="text-sm text-[#ecd8a0]">{formatDateLabel(locale, entry.created_at)}</p>
              </div>
              <p className="mt-2 text-sm text-[#d1c4b2]">{entry.scope} · {entry.action} · {entry.target_table}/{entry.target_id}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
