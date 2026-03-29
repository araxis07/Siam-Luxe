"use client";

import { Gift, Sparkles } from "lucide-react";
import { useState } from "react";

import type { AppLocale } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { requestJson } from "@/lib/backend/client";
import { formatPrice } from "@/lib/format";
import { getGiftCardOptions } from "@/lib/guest-experience";
import { useUserStore } from "@/store/user-store";

const pageText = {
  th: {
    eyebrow: "บัตรของขวัญ",
    title: "เลือกเครดิตของขวัญสำหรับมื้อไทยแบบพรีเมียม",
    body: "ซื้อบัตรของขวัญ ส่งต่อเครดิตเข้ากระเป๋า และทำให้การเลี้ยงแขกหรือมอบสำรับพิเศษดูเป็นร้านจริงมากขึ้น",
    recipient: "ชื่อผู้รับ",
    email: "อีเมลผู้รับ",
    note: "ข้อความสั้นถึงผู้รับ",
    purchase: "เพิ่มบัตรของขวัญเข้ากระเป๋า",
    activeWallet: "บัตรที่อยู่ใน wallet",
    preview: "บัตรที่เลือก",
    successTitle: "เพิ่มบัตรของขวัญแล้ว",
  },
  en: {
    eyebrow: "Gift cards",
    title: "Choose a premium Thai dining gift balance",
    body: "Purchase a gift balance, place it into the guest wallet, and make hosted dinners feel like a real brand flow.",
    recipient: "Recipient name",
    email: "Recipient email",
    note: "Short note",
    purchase: "Add gift card to wallet",
    activeWallet: "Wallet balances",
    preview: "Selected card",
    successTitle: "Gift card added",
  },
  ja: {
    eyebrow: "ギフトカード",
    title: "上質なタイダイニング向けギフト残高を選ぶ",
    body: "ギフト残高を購入してウォレットへ追加し、贈答体験を店舗らしく整えます。",
    recipient: "受取人名",
    email: "受取人メール",
    note: "メッセージ",
    purchase: "ギフトカードをウォレットへ追加",
    activeWallet: "ウォレット残高",
    preview: "選択中のカード",
    successTitle: "ギフトカードを追加しました",
  },
  zh: {
    eyebrow: "礼品卡",
    title: "选择一张适合高级泰式晚宴的礼卡",
    body: "购买礼品卡并加入钱包，让送礼和宴请场景更像真实品牌体验。",
    recipient: "收件人姓名",
    email: "收件人邮箱",
    note: "附言",
    purchase: "将礼品卡加入钱包",
    activeWallet: "钱包余额",
    preview: "当前选择",
    successTitle: "礼品卡已加入",
  },
  ko: {
    eyebrow: "기프트 카드",
    title: "프리미엄 태국 다이닝용 기프트 밸런스를 고르기",
    body: "기프트 밸런스를 월렛에 추가해 실제 매장 같은 선물 흐름을 만듭니다.",
    recipient: "수령인 이름",
    email: "수령인 이메일",
    note: "짧은 메시지",
    purchase: "기프트 카드를 월렛에 추가",
    activeWallet: "월렛 잔액",
    preview: "선택된 카드",
    successTitle: "기프트 카드가 추가되었습니다",
  },
} as const;

export function GiftCardShowcase({ locale }: { locale: AppLocale }) {
  const text = pageText[locale];
  const cards = getGiftCardOptions(locale);
  const { toast } = useToast();
  const authStatus = useUserStore((state) => state.authStatus);
  const [selectedId, setSelectedId] = useState(cards[1]?.id ?? cards[0]?.id ?? "");
  const [recipient, setRecipient] = useState("");
  const [email, setEmail] = useState("");
  const [note, setNote] = useState("");
  const giftWallet = useUserStore((state) => state.giftWallet);
  const addGiftWalletEntry = useUserStore((state) => state.addGiftWalletEntry);
  const prependGiftWalletEntry = useUserStore((state) => state.prependGiftWalletEntry);
  const activeCard = cards.find((item) => item.id === selectedId) ?? cards[0];

  if (!activeCard) {
    return null;
  }

  return (
    <section className="scene-section px-4 pt-10 pb-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="max-w-3xl">
          <p className="text-[0.66rem] uppercase tracking-[0.18em] text-[#cdb37d]">{text.eyebrow}</p>
          <h1 className="mt-3 font-heading text-[2.8rem] leading-tight text-white sm:text-[3.2rem]">{text.title}</h1>
          <p className="mt-4 text-[0.98rem] leading-8 text-[#d1c4b2]">{text.body}</p>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
          <div className="grid gap-4 md:grid-cols-3">
            {cards.map((card) => {
              const active = card.id === selectedId;

              return (
                <button
                  key={card.id}
                  type="button"
                  data-testid={`gift-card-${card.id}`}
                  className={`lux-panel relative overflow-hidden rounded-[2rem] bg-gradient-to-br p-6 text-left transition-transform hover:-translate-y-1 ${card.accentClass} ${
                    active ? "ring-2 ring-[#d6b26a]/55" : ""
                  }`}
                  onClick={() => setSelectedId(card.id)}
                >
                  <div className="absolute inset-0 bg-gradient-to-br opacity-88" />
                  <div className="relative">
                    <p className="text-[0.66rem] uppercase tracking-[0.18em] text-[#ecd8a0]">{card.ribbon}</p>
                    <h2 className="mt-4 font-heading text-[1.7rem] leading-tight text-white">{card.title}</h2>
                    <p className="mt-3 text-sm leading-7 text-[#ded0bf]">{card.body}</p>
                    <p className="mt-5 font-heading text-[1.8rem] text-[#f2d78d]">{formatPrice(card.amount, locale)}</p>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="space-y-6">
            <div className="lux-panel rounded-[2rem] p-6 sm:p-8">
              <div className="flex items-center gap-3">
                <div className="inline-flex size-12 items-center justify-center rounded-2xl bg-[#d6b26a]/12 text-[#ecd8a0]">
                  <Gift className="size-5" />
                </div>
                <div>
                  <p className="text-[0.66rem] uppercase tracking-[0.18em] text-[#cdb37d]">{text.preview}</p>
                  <h2 className="mt-1 font-heading text-[2rem] text-white">{activeCard.title}</h2>
                </div>
              </div>
              <p className="mt-4 text-[#d1c4b2]">{activeCard.body}</p>
              <div className="thai-divider my-6" />
              <div className="grid gap-5">
                <div className="space-y-2">
                  <Label htmlFor="gift-recipient" className="text-[#d9ccbb]">{text.recipient}</Label>
                  <Input
                    id="gift-recipient"
                    value={recipient}
                    onChange={(event) => setRecipient(event.target.value)}
                    className="h-12 rounded-2xl border-white/10 bg-white/4 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gift-email" className="text-[#d9ccbb]">{text.email}</Label>
                  <Input
                    id="gift-email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    className="h-12 rounded-2xl border-white/10 bg-white/4 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gift-note" className="text-[#d9ccbb]">{text.note}</Label>
                  <Textarea
                    id="gift-note"
                    value={note}
                    onChange={(event) => setNote(event.target.value)}
                    className="min-h-28 rounded-2xl border-white/10 bg-white/4 text-white"
                  />
                </div>
                <Button
                  type="button"
                  data-testid="purchase-gift-card"
                  className="button-shine h-12 rounded-full bg-[#d6b26a] px-6 text-[#1b130f] hover:bg-[#e4c987]"
                  onClick={() => {
                    void (async () => {
                      if (authStatus === "member") {
                        try {
                          const result = await requestJson<{
                            ok: boolean;
                            giftWalletEntry: {
                              id: string;
                              code: string;
                              amount: number;
                              title: string;
                              expiresAt: string;
                              note?: string;
                            };
                          }>("/api/gift-cards/purchase", {
                            method: "POST",
                            headers: {
                              "Content-Type": "application/json",
                            },
                            body: JSON.stringify({
                              cardId: activeCard.id,
                              locale,
                              recipient,
                              recipientEmail: email,
                              note,
                            }),
                          });

                          prependGiftWalletEntry(result.giftWalletEntry);
                          toast({
                            title: text.successTitle,
                            description: recipient || activeCard.title,
                            tone: "success",
                          });
                          setRecipient("");
                          setEmail("");
                          setNote("");
                          return;
                        } catch (error) {
                          toast({
                            title: text.successTitle,
                            description: error instanceof Error ? error.message : activeCard.title,
                            tone: "error",
                          });
                          return;
                        }
                      }

                      addGiftWalletEntry({
                        code: activeCard.id.toUpperCase(),
                        amount: activeCard.amount,
                        title: recipient ? `${activeCard.title} · ${recipient}` : activeCard.title,
                        expiresAt: "2026-12-31",
                      });
                      toast({
                        title: text.successTitle,
                        description: recipient || activeCard.title,
                        tone: "success",
                      });
                      setRecipient("");
                      setEmail("");
                      setNote("");
                    })();
                  }}
                >
                  <Sparkles className="size-4" />
                  {text.purchase}
                </Button>
              </div>
            </div>

            <div className="lux-panel-soft rounded-[2rem] p-6">
              <p className="text-[0.66rem] uppercase tracking-[0.18em] text-[#cdb37d]">{text.activeWallet}</p>
              <div className="mt-4 space-y-3">
                {giftWallet.slice(0, 4).map((entry) => (
                  <div key={entry.id} className="rounded-[1.5rem] border border-white/10 bg-white/4 px-4 py-4">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-white">{entry.title}</p>
                        <p className="mt-1 text-sm text-[#bcae9b]">{entry.code}</p>
                      </div>
                      <span className="font-heading text-[1.3rem] text-[#f2d78d]">{formatPrice(entry.amount, locale)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
