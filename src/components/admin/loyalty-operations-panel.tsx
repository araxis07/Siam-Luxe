"use client";

import { useEffect, useState } from "react";

import type { AppLocale } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { requestJson } from "@/lib/backend/client";
import { formatPrice } from "@/lib/format";

type LoyaltyAccount = {
  user_id: string;
  current_points: number;
  lifetime_points: number;
  updated_at: string;
  profile: {
    id: string;
    full_name: string;
    email: string | null;
  } | null;
};

type WalletEntry = {
  id: string;
  user_id: string;
  title: string;
  amount: number;
  expires_at: string;
  code: string;
  created_at: string;
};

type LoyaltyPayload = {
  accounts: LoyaltyAccount[];
  walletEntries: WalletEntry[];
};

const loyaltyPanelText = {
  th: {
    title: "คะแนนสมาชิกและเครดิตกระเป๋า",
    empty: "ยังไม่มีข้อมูลสมาชิก",
    currentPoints: "คะแนนคงเหลือ",
    lifetimePoints: "คะแนนสะสม",
    pointsDelta: "ปรับคะแนน",
    walletAmount: "เครดิตที่จะออก",
    walletTitle: "ชื่อเครดิต",
    expiresAt: "หมดอายุ",
    save: "อัปเดตสมาชิก",
    saving: "กำลังอัปเดต",
    updated: "อัปเดตข้อมูลสมาชิกแล้ว",
    error: "ยังอัปเดตคะแนนสมาชิกไม่ได้",
    recentWallet: "เครดิตล่าสุด",
  },
  en: {
    title: "Loyalty points and wallet credits",
    empty: "No loyalty members yet",
    currentPoints: "Current points",
    lifetimePoints: "Lifetime points",
    pointsDelta: "Point adjustment",
    walletAmount: "Wallet credit amount",
    walletTitle: "Wallet credit title",
    expiresAt: "Expires on",
    save: "Update member",
    saving: "Updating",
    updated: "Member balance updated",
    error: "Unable to update this loyalty account",
    recentWallet: "Recent wallet credits",
  },
  ja: {
    title: "会員ポイントとウォレット残高",
    empty: "会員データはまだありません",
    currentPoints: "現在ポイント",
    lifetimePoints: "累計ポイント",
    pointsDelta: "ポイント調整",
    walletAmount: "付与クレジット",
    walletTitle: "クレジット名",
    expiresAt: "有効期限",
    save: "会員を更新",
    saving: "更新中",
    updated: "会員残高を更新しました",
    error: "会員ポイントを更新できませんでした",
    recentWallet: "最新クレジット",
  },
  zh: {
    title: "会员积分与钱包额度",
    empty: "暂无会员数据",
    currentPoints: "当前积分",
    lifetimePoints: "累计积分",
    pointsDelta: "积分调整",
    walletAmount: "发放金额",
    walletTitle: "额度名称",
    expiresAt: "到期日",
    save: "更新会员",
    saving: "更新中",
    updated: "会员余额已更新",
    error: "暂时无法更新会员积分",
    recentWallet: "最近钱包额度",
  },
  ko: {
    title: "멤버십 포인트와 월렛 크레딧",
    empty: "멤버 데이터가 아직 없습니다",
    currentPoints: "현재 포인트",
    lifetimePoints: "누적 포인트",
    pointsDelta: "포인트 조정",
    walletAmount: "지급 금액",
    walletTitle: "크레딧 이름",
    expiresAt: "만료일",
    save: "멤버 업데이트",
    saving: "업데이트 중",
    updated: "멤버 잔액이 업데이트되었습니다",
    error: "멤버 포인트를 업데이트할 수 없습니다",
    recentWallet: "최근 월렛 크레딧",
  },
} as const;

export function LoyaltyOperationsPanel({ locale }: { locale: AppLocale }) {
  const text = loyaltyPanelText[locale];
  const { toast } = useToast();
  const [accounts, setAccounts] = useState<LoyaltyAccount[]>([]);
  const [walletEntries, setWalletEntries] = useState<WalletEntry[]>([]);
  const [drafts, setDrafts] = useState<Record<string, Record<string, string>>>({});
  const [actionKey, setActionKey] = useState("");

  useEffect(() => {
    let cancelled = false;

    void requestJson<LoyaltyPayload>("/api/admin/loyalty", {
      method: "GET",
      cache: "no-store",
    })
      .then((data) => {
        if (cancelled) {
          return;
        }

        setAccounts(data.accounts);
        setWalletEntries(data.walletEntries);
        setDrafts(
          Object.fromEntries(
            data.accounts.map((account) => [
              account.user_id,
              {
                pointsDelta: "",
                issueWalletAmount: "",
                issueWalletTitle: "",
                expiresAt: "2026-12-31",
              },
            ]),
          ),
        );
      })
      .catch(() => {
        if (!cancelled) {
          setAccounts([]);
          setWalletEntries([]);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const updateAccount = async (userId: string) => {
    const draft = drafts[userId];

    if (!draft) {
      return;
    }

    setActionKey(userId);

    try {
      const payload = await requestJson<{
        account: LoyaltyAccount;
        walletEntries: WalletEntry[];
      }>(`/api/admin/loyalty/${userId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...(draft.pointsDelta.trim() ? { pointsDelta: Number(draft.pointsDelta) } : {}),
          ...(draft.issueWalletAmount.trim() ? { issueWalletAmount: Number(draft.issueWalletAmount) } : {}),
          ...(draft.issueWalletTitle.trim() ? { issueWalletTitle: draft.issueWalletTitle } : {}),
          ...(draft.expiresAt.trim() ? { expiresAt: draft.expiresAt } : {}),
        }),
      });

      setAccounts((current) =>
        current.map((account) => (account.user_id === userId ? { ...account, ...payload.account } : account)),
      );
      setWalletEntries((current) => {
        const nextById = new Map(current.map((entry) => [entry.id, entry]));
        payload.walletEntries.forEach((entry) => nextById.set(entry.id, entry));
        return [...nextById.values()].sort((left, right) => right.created_at.localeCompare(left.created_at));
      });
      setDrafts((current) => ({
        ...current,
        [userId]: {
          pointsDelta: "",
          issueWalletAmount: "",
          issueWalletTitle: "",
          expiresAt: "2026-12-31",
        },
      }));
      toast({
        title: text.updated,
        description: payload.account.profile?.full_name || payload.account.profile?.email || userId,
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
        <span className="text-sm text-[#bcae9b]">{accounts.length}</span>
      </div>

      <div className="mt-4 space-y-4">
        {accounts.length === 0 ? (
          <p className="rounded-[1.4rem] border border-white/10 bg-white/4 px-4 py-4 text-sm text-[#d1c4b2]">{text.empty}</p>
        ) : (
          accounts.map((account) => {
            const draft = drafts[account.user_id];

            if (!draft) {
              return null;
            }

            return (
              <div key={account.user_id} className="rounded-[1.6rem] border border-white/10 bg-white/4 p-4">
                <p className="font-medium text-white">{account.profile?.full_name || account.profile?.email || account.user_id}</p>
                <p className="mt-1 text-sm text-[#bcae9b]">{account.profile?.email || account.user_id}</p>
                <div className="mt-4 grid gap-3 md:grid-cols-2">
                  <div className="rounded-[1.3rem] border border-white/10 bg-black/15 px-4 py-3">
                    <p className="text-xs uppercase tracking-[0.18em] text-[#cdb37d]">{text.currentPoints}</p>
                    <p className="mt-2 text-white">{account.current_points}</p>
                  </div>
                  <div className="rounded-[1.3rem] border border-white/10 bg-black/15 px-4 py-3">
                    <p className="text-xs uppercase tracking-[0.18em] text-[#cdb37d]">{text.lifetimePoints}</p>
                    <p className="mt-2 text-white">{account.lifetime_points}</p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[#d9ccbb]">{text.pointsDelta}</Label>
                    <Input
                      type="number"
                      value={draft.pointsDelta}
                      onChange={(event) =>
                        setDrafts((current) => ({
                          ...current,
                          [account.user_id]: { ...current[account.user_id], pointsDelta: event.target.value },
                        }))
                      }
                      className="h-11 rounded-2xl border-white/10 bg-white/4 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[#d9ccbb]">{text.walletAmount}</Label>
                    <Input
                      type="number"
                      value={draft.issueWalletAmount}
                      onChange={(event) =>
                        setDrafts((current) => ({
                          ...current,
                          [account.user_id]: { ...current[account.user_id], issueWalletAmount: event.target.value },
                        }))
                      }
                      className="h-11 rounded-2xl border-white/10 bg-white/4 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[#d9ccbb]">{text.walletTitle}</Label>
                    <Input
                      value={draft.issueWalletTitle}
                      onChange={(event) =>
                        setDrafts((current) => ({
                          ...current,
                          [account.user_id]: { ...current[account.user_id], issueWalletTitle: event.target.value },
                        }))
                      }
                      className="h-11 rounded-2xl border-white/10 bg-white/4 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[#d9ccbb]">{text.expiresAt}</Label>
                    <Input
                      type="date"
                      value={draft.expiresAt}
                      onChange={(event) =>
                        setDrafts((current) => ({
                          ...current,
                          [account.user_id]: { ...current[account.user_id], expiresAt: event.target.value },
                        }))
                      }
                      className="h-11 rounded-2xl border-white/10 bg-white/4 text-white"
                    />
                  </div>
                </div>
                <Button
                  type="button"
                  className="button-shine mt-4 rounded-full bg-[#d6b26a] px-5 text-[#1b130f] hover:bg-[#e4c987]"
                  disabled={actionKey === account.user_id}
                  onClick={() => {
                    void updateAccount(account.user_id);
                  }}
                >
                  {actionKey === account.user_id ? text.saving : text.save}
                </Button>
              </div>
            );
          })
        )}
      </div>

      <div className="mt-6 rounded-[1.6rem] border border-white/10 bg-black/15 p-4">
        <p className="text-[0.66rem] uppercase tracking-[0.18em] text-[#cdb37d]">{text.recentWallet}</p>
        <div className="mt-4 space-y-3">
          {walletEntries.slice(0, 8).map((entry) => (
            <div key={entry.id} className="rounded-[1.3rem] border border-white/10 bg-white/4 px-4 py-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-white">{entry.title}</p>
                  <p className="mt-1 text-sm text-[#bcae9b]">{entry.code}</p>
                </div>
                <span className="text-sm text-[#ecd8a0]">{formatPrice(Number(entry.amount ?? 0), locale)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
