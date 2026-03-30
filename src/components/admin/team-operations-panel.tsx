"use client";

import { useEffect, useState } from "react";

import type { AppLocale } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { requestJson } from "@/lib/backend/client";

type TeamUser = {
  id: string;
  email: string | null;
  full_name: string;
  phone: string;
  preferred_locale: AppLocale;
  role: "customer" | "staff" | "admin";
  notes: string;
  payment_method: "cash" | "card" | "promptpay";
  created_at: string;
  current_points: number;
};

const copy = {
  th: {
    title: "สิทธิ์ทีมงานและบทบาทผู้ใช้",
    empty: "ยังไม่มีบัญชีในระบบ",
    role: "สิทธิ์",
    locale: "ภาษา",
    note: "หมายเหตุทีม",
    payment: "ช่องทางหลัก",
    points: "คะแนนสะสม",
    save: "บันทึกบัญชี",
    saving: "กำลังบันทึก",
    updated: "อัปเดตสิทธิ์ผู้ใช้แล้ว",
    roles: {
      customer: "ลูกค้า",
      staff: "พนักงาน",
      admin: "แอดมิน",
    },
  },
  en: {
    title: "Team roles and account control",
    empty: "No member records yet",
    role: "Role",
    locale: "Locale",
    note: "Team note",
    payment: "Primary payment",
    points: "Loyalty points",
    save: "Save account",
    saving: "Saving",
    updated: "Account updated",
    roles: {
      customer: "Customer",
      staff: "Staff",
      admin: "Admin",
    },
  },
  ja: {
    title: "チーム権限とアカウント管理",
    empty: "まだアカウントがありません",
    role: "権限",
    locale: "言語",
    note: "チームメモ",
    payment: "既定の支払い方法",
    points: "ロイヤルティポイント",
    save: "アカウント保存",
    saving: "保存中",
    updated: "アカウントを更新しました",
    roles: {
      customer: "顧客",
      staff: "スタッフ",
      admin: "管理者",
    },
  },
  zh: {
    title: "团队权限与账号管理",
    empty: "暂无账号记录",
    role: "权限",
    locale: "语言",
    note: "团队备注",
    payment: "默认支付方式",
    points: "会员积分",
    save: "保存账号",
    saving: "保存中",
    updated: "账号已更新",
    roles: {
      customer: "顾客",
      staff: "员工",
      admin: "管理员",
    },
  },
  ko: {
    title: "팀 권한 및 계정 운영",
    empty: "아직 계정 기록이 없습니다",
    role: "권한",
    locale: "언어",
    note: "팀 메모",
    payment: "기본 결제 수단",
    points: "로열티 포인트",
    save: "계정 저장",
    saving: "저장 중",
    updated: "계정이 업데이트되었습니다",
    roles: {
      customer: "고객",
      staff: "스태프",
      admin: "관리자",
    },
  },
} as const;

export function TeamOperationsPanel({ locale }: { locale: AppLocale }) {
  const text = copy[locale];
  const { toast } = useToast();
  const [users, setUsers] = useState<TeamUser[]>([]);
  const [drafts, setDrafts] = useState<Record<string, { role: TeamUser["role"]; preferredLocale: AppLocale; paymentMethod: TeamUser["payment_method"]; notes: string }>>({});
  const [actionKey, setActionKey] = useState("");

  useEffect(() => {
    let cancelled = false;

    void requestJson<TeamUser[]>("/api/admin/users", {
      method: "GET",
      cache: "no-store",
    })
      .then((data) => {
        if (cancelled) {
          return;
        }

        setUsers(data);
        setDrafts(
          Object.fromEntries(
            data.map((user) => [
              user.id,
              {
                role: user.role,
                preferredLocale: user.preferred_locale,
                paymentMethod: user.payment_method,
                notes: user.notes,
              },
            ]),
          ),
        );
      })
      .catch(() => {
        if (!cancelled) {
          setUsers([]);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const saveUser = async (userId: string) => {
    const draft = drafts[userId];

    if (!draft) {
      return;
    }

    setActionKey(userId);

    try {
      const updated = await requestJson<TeamUser>(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          role: draft.role,
          preferredLocale: draft.preferredLocale,
          paymentMethod: draft.paymentMethod,
          notes: draft.notes,
        }),
      });

      setUsers((current) => current.map((item) => (item.id === userId ? { ...item, ...updated, current_points: item.current_points } : item)));
      toast({
        title: text.updated,
        description: updated.email ?? updated.id,
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
      <div className="mt-4 space-y-4">
        {users.length === 0 ? (
          <p className="rounded-[1.4rem] border border-white/10 bg-white/4 px-4 py-4 text-sm text-[#d1c4b2]">{text.empty}</p>
        ) : (
          users.map((user) => {
            const draft = drafts[user.id];

            if (!draft) {
              return null;
            }

            return (
              <div key={user.id} className="rounded-[1.6rem] border border-white/10 bg-white/4 p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-medium text-white">{user.full_name || user.email || user.id}</p>
                    <p className="mt-1 text-sm text-[#bcae9b]">{user.email ?? user.id}</p>
                    <p className="mt-2 text-sm text-[#ecd8a0]">
                      {text.points}: {user.current_points}
                    </p>
                  </div>
                </div>

                <div className="mt-4 grid gap-3 xl:grid-cols-3">
                  <div className="space-y-2">
                    <Label className="text-[#d9ccbb]">{text.role}</Label>
                    <Select
                      value={draft.role}
                      onValueChange={(value) => {
                        if (!value) {
                          return;
                        }

                        setDrafts((current) => ({
                          ...current,
                          [user.id]: {
                            ...current[user.id],
                            role: value as TeamUser["role"],
                          },
                        }));
                      }}
                    >
                      <SelectTrigger className="h-11 w-full rounded-2xl border-white/10 bg-white/4 px-4 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-2xl border-white/10 bg-[#120d0d]/96 text-white">
                        {(["customer", "staff", "admin"] as const).map((role) => (
                          <SelectItem key={role} value={role}>
                            {text.roles[role]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-[#d9ccbb]">{text.locale}</Label>
                    <Select
                      value={draft.preferredLocale}
                      onValueChange={(value) => {
                        if (!value) {
                          return;
                        }

                        setDrafts((current) => ({
                          ...current,
                          [user.id]: {
                            ...current[user.id],
                            preferredLocale: value as AppLocale,
                          },
                        }));
                      }}
                    >
                      <SelectTrigger className="h-11 w-full rounded-2xl border-white/10 bg-white/4 px-4 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-2xl border-white/10 bg-[#120d0d]/96 text-white">
                        {(["th", "en", "ja", "zh", "ko"] as const).map((entry) => (
                          <SelectItem key={entry} value={entry}>
                            {entry}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-[#d9ccbb]">{text.payment}</Label>
                    <Select
                      value={draft.paymentMethod}
                      onValueChange={(value) => {
                        if (!value) {
                          return;
                        }

                        setDrafts((current) => ({
                          ...current,
                          [user.id]: {
                            ...current[user.id],
                            paymentMethod: value as TeamUser["payment_method"],
                          },
                        }));
                      }}
                    >
                      <SelectTrigger className="h-11 w-full rounded-2xl border-white/10 bg-white/4 px-4 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-2xl border-white/10 bg-[#120d0d]/96 text-white">
                        {(["cash", "card", "promptpay"] as const).map((entry) => (
                          <SelectItem key={entry} value={entry}>
                            {entry}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="mt-4 space-y-2">
                  <Label className="text-[#d9ccbb]">{text.note}</Label>
                  <Textarea
                    value={draft.notes}
                    onChange={(event) => {
                      const nextValue = event.target.value;
                      setDrafts((current) => ({
                        ...current,
                        [user.id]: {
                          ...current[user.id],
                          notes: nextValue,
                        },
                      }));
                    }}
                    className="min-h-[5.5rem] rounded-[1.6rem] border-white/10 bg-white/4 px-4 py-3 text-white"
                  />
                </div>

                <div className="mt-4 flex justify-end">
                  <Button
                    type="button"
                    className="button-shine rounded-full bg-[#d6b26a] px-5 text-[#1b130f] hover:bg-[#e4c987]"
                    disabled={actionKey === user.id}
                    onClick={() => {
                      void saveUser(user.id);
                    }}
                  >
                    {actionKey === user.id ? text.saving : text.save}
                  </Button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
