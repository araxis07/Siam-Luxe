"use client";

import { useEffect, useState } from "react";

import type { AppLocale } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { requestJson } from "@/lib/backend/client";

type EmailOutboxEntry = {
  id: string;
  to_email: string;
  subject: string;
  status: string;
  created_at: string;
  template_key: string;
  error_message: string | null;
};

const emailPanelText = {
  th: {
    title: "คิวอีเมลและการส่งออก",
    empty: "ยังไม่มีอีเมลในคิว",
    dispatch: "ส่งตอนนี้",
    skip: "ข้าม",
    sending: "กำลังส่ง",
    updated: "อัปเดตอีเมลแล้ว",
    error: "ยังจัดการอีเมลไม่ได้",
  },
  en: {
    title: "Email outbox and dispatch",
    empty: "No email outbox entries yet",
    dispatch: "Send now",
    skip: "Skip",
    sending: "Sending",
    updated: "Email entry updated",
    error: "Unable to manage this email entry",
  },
  ja: {
    title: "メールアウトボックス",
    empty: "メールキューはまだありません",
    dispatch: "今すぐ送信",
    skip: "スキップ",
    sending: "送信中",
    updated: "メール状態を更新しました",
    error: "メールを処理できませんでした",
  },
  zh: {
    title: "邮件队列与发送",
    empty: "暂无邮件队列",
    dispatch: "立即发送",
    skip: "跳过",
    sending: "发送中",
    updated: "邮件状态已更新",
    error: "暂时无法处理该邮件",
  },
  ko: {
    title: "이메일 아웃박스",
    empty: "이메일 큐가 아직 없습니다",
    dispatch: "지금 전송",
    skip: "건너뛰기",
    sending: "전송 중",
    updated: "이메일 상태가 업데이트되었습니다",
    error: "이 이메일을 처리할 수 없습니다",
  },
} as const;

function formatDate(locale: AppLocale, value: string) {
  try {
    return new Intl.DateTimeFormat(locale, { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
  } catch {
    return value;
  }
}

export function EmailOutboxPanel({ locale }: { locale: AppLocale }) {
  const text = emailPanelText[locale];
  const { toast } = useToast();
  const [entries, setEntries] = useState<EmailOutboxEntry[]>([]);
  const [actionKey, setActionKey] = useState("");

  useEffect(() => {
    let cancelled = false;

    void requestJson<EmailOutboxEntry[]>("/api/admin/email-outbox", {
      method: "GET",
      cache: "no-store",
    })
      .then((data) => {
        if (!cancelled) {
          setEntries(data);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setEntries([]);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const updateEntry = async (entryId: string, action: "dispatch" | "skip") => {
    setActionKey(`${action}:${entryId}`);

    try {
      const updated = await requestJson<EmailOutboxEntry>(`/api/admin/email-outbox/${entryId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ action }),
      });

      setEntries((current) => current.map((entry) => (entry.id === entryId ? updated : entry)));
      toast({
        title: text.updated,
        description: updated.subject,
        tone: "success",
      });
    } catch (error) {
      toast({
        title: text.error,
        description: error instanceof Error ? error.message : text.error,
        tone: "error",
      });
    } finally {
      setActionKey("");
    }
  };

  return (
    <section className="lux-panel-soft rounded-[2rem] p-6">
      <div className="flex items-center justify-between gap-3">
        <p className="text-[0.66rem] uppercase tracking-[0.18em] text-[#cdb37d]">{text.title}</p>
        <span className="text-sm text-[#bcae9b]">{entries.length}</span>
      </div>

      <div className="mt-4 space-y-4">
        {entries.length === 0 ? (
          <p className="rounded-[1.4rem] border border-white/10 bg-white/4 px-4 py-4 text-sm text-[#d1c4b2]">{text.empty}</p>
        ) : (
          entries.slice(0, 12).map((entry) => (
            <div key={entry.id} className="rounded-[1.6rem] border border-white/10 bg-white/4 p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-medium text-white">{entry.subject}</p>
                  <p className="mt-1 text-sm text-[#bcae9b]">{entry.to_email}</p>
                  <p className="mt-2 text-sm text-[#d1c4b2]">{entry.template_key} · {formatDate(locale, entry.created_at)}</p>
                  {entry.error_message ? <p className="mt-2 text-sm text-[#f0a8a0]">{entry.error_message}</p> : null}
                </div>
                <div className="rounded-full border border-white/10 bg-black/15 px-3 py-1 text-sm text-[#ecd8a0]">
                  {entry.status}
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-3">
                <Button
                  type="button"
                  className="button-shine rounded-full bg-[#d6b26a] px-5 text-[#1b130f] hover:bg-[#e4c987]"
                  disabled={actionKey === `dispatch:${entry.id}`}
                  onClick={() => {
                    void updateEntry(entry.id, "dispatch");
                  }}
                >
                  {actionKey === `dispatch:${entry.id}` ? text.sending : text.dispatch}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-full border-white/10 bg-white/5 text-white hover:bg-white/10"
                  disabled={actionKey === `skip:${entry.id}`}
                  onClick={() => {
                    void updateEntry(entry.id, "skip");
                  }}
                >
                  {actionKey === `skip:${entry.id}` ? text.sending : text.skip}
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
