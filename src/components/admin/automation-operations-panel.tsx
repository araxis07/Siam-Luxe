"use client";

import { useCallback, useEffect, useState } from "react";

import type { AppLocale } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { requestJson } from "@/lib/backend/client";

type ReservationSnapshot = {
  waitlistPending: number;
  remindersPending: number;
  noShowsPending: number;
};

type EmailSnapshot = {
  queued: number;
  sent: number;
  failed: number;
  skipped: number;
};

const copy = {
  th: {
    title: "งานอัตโนมัติของระบบ",
    runReservations: "รัน reservation automation",
    runEmails: "ส่ง email queue",
    running: "กำลังประมวลผล",
    waitlist: "คิวรอที่รอ promote",
    reminders: "reminder ที่ยังไม่ส่ง",
    noShows: "รายการ no-show ที่รอตรวจ",
    queued: "อีเมลค้างส่ง",
    sent: "ส่งแล้ว",
    failed: "ล้มเหลว",
    skipped: "ข้าม",
  },
  en: {
    title: "Automation operations",
    runReservations: "Run reservation automation",
    runEmails: "Dispatch email queue",
    running: "Processing",
    waitlist: "Waitlist pending",
    reminders: "Reminders pending",
    noShows: "No-shows pending",
    queued: "Queued emails",
    sent: "Sent",
    failed: "Failed",
    skipped: "Skipped",
  },
  ja: {
    title: "自動運用ジョブ",
    runReservations: "予約自動処理を実行",
    runEmails: "メールキューを送信",
    running: "処理中",
    waitlist: "昇格待ちウェイトリスト",
    reminders: "未送信リマインダー",
    noShows: "未処理 no-show",
    queued: "未送信メール",
    sent: "送信済み",
    failed: "失敗",
    skipped: "スキップ",
  },
  zh: {
    title: "自动化任务",
    runReservations: "运行预约自动化",
    runEmails: "发送邮件队列",
    running: "处理中",
    waitlist: "待提升候补",
    reminders: "待发送提醒",
    noShows: "待处理 no-show",
    queued: "待发送邮件",
    sent: "已发送",
    failed: "失败",
    skipped: "已跳过",
  },
  ko: {
    title: "자동 운영 작업",
    runReservations: "예약 자동화 실행",
    runEmails: "이메일 큐 전송",
    running: "처리 중",
    waitlist: "승격 대기 웨이트리스트",
    reminders: "미발송 리마인더",
    noShows: "처리 대기 no-show",
    queued: "대기 이메일",
    sent: "전송됨",
    failed: "실패",
    skipped: "건너뜀",
  },
} as const;

export function AutomationOperationsPanel({ locale }: { locale: AppLocale }) {
  const text = copy[locale];
  const { toast } = useToast();
  const [reservationSnapshot, setReservationSnapshot] = useState<ReservationSnapshot | null>(null);
  const [emailSnapshot, setEmailSnapshot] = useState<EmailSnapshot | null>(null);
  const [actionKey, setActionKey] = useState("");

  const load = useCallback(async () => {
    const [reservations, email] = await Promise.all([
      requestJson<ReservationSnapshot>("/api/admin/automation/reservations", {
        method: "GET",
        cache: "no-store",
      }),
      requestJson<EmailSnapshot>("/api/admin/email-outbox/dispatch", {
        method: "GET",
        cache: "no-store",
      }),
    ]);

    setReservationSnapshot(reservations);
    setEmailSnapshot(email);
  }, []);

  useEffect(() => {
    void load().catch(() => {
      setReservationSnapshot(null);
      setEmailSnapshot(null);
    });
  }, [load]);

  const runReservations = async () => {
    setActionKey("reservations");

    try {
      const summary = await requestJson<{ remindersSent: number; waitlistPromoted: number; noShowsMarked: number }>(
        "/api/admin/automation/reservations",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({}),
        },
      );

      await load();
      toast({
        title: text.title,
        description: `${summary.waitlistPromoted}/${summary.remindersSent}/${summary.noShowsMarked}`,
        tone: "success",
      });
    } catch (error) {
      toast({
        title: text.title,
        description: error instanceof Error ? error.message : text.title,
        tone: "error",
      });
    } finally {
      setActionKey("");
    }
  };

  const runEmails = async () => {
    setActionKey("emails");

    try {
      const summary = await requestJson<{ processed: number; sent: number; failed: number; skipped: number }>(
        "/api/admin/email-outbox/dispatch",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({}),
        },
      );

      await load();
      toast({
        title: text.title,
        description: `${summary.processed} processed`,
        tone: "success",
      });
    } catch (error) {
      toast({
        title: text.title,
        description: error instanceof Error ? error.message : text.title,
        tone: "error",
      });
    } finally {
      setActionKey("");
    }
  };

  return (
    <div className="lux-panel-soft rounded-[2rem] p-6">
      <p className="text-[0.66rem] uppercase tracking-[0.18em] text-[#cdb37d]">{text.title}</p>
      <div className="mt-4 grid gap-4 xl:grid-cols-2">
        <div className="rounded-[1.6rem] border border-white/10 bg-white/4 p-4">
          <div className="space-y-2 text-sm text-[#d1c4b2]">
            <p>{text.waitlist}: {reservationSnapshot?.waitlistPending ?? 0}</p>
            <p>{text.reminders}: {reservationSnapshot?.remindersPending ?? 0}</p>
            <p>{text.noShows}: {reservationSnapshot?.noShowsPending ?? 0}</p>
          </div>
          <Button
            type="button"
            className="button-shine mt-4 rounded-full bg-[#d6b26a] px-5 text-[#1b130f] hover:bg-[#e4c987]"
            disabled={actionKey === "reservations"}
            onClick={() => {
              void runReservations();
            }}
          >
            {actionKey === "reservations" ? text.running : text.runReservations}
          </Button>
        </div>

        <div className="rounded-[1.6rem] border border-white/10 bg-white/4 p-4">
          <div className="space-y-2 text-sm text-[#d1c4b2]">
            <p>{text.queued}: {emailSnapshot?.queued ?? 0}</p>
            <p>{text.sent}: {emailSnapshot?.sent ?? 0}</p>
            <p>{text.failed}: {emailSnapshot?.failed ?? 0}</p>
            <p>{text.skipped}: {emailSnapshot?.skipped ?? 0}</p>
          </div>
          <Button
            type="button"
            className="button-shine mt-4 rounded-full bg-[#d6b26a] px-5 text-[#1b130f] hover:bg-[#e4c987]"
            disabled={actionKey === "emails"}
            onClick={() => {
              void runEmails();
            }}
          >
            {actionKey === "emails" ? text.running : text.runEmails}
          </Button>
        </div>
      </div>
    </div>
  );
}
