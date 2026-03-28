"use client";

import { Crown, Gift, Sparkles } from "lucide-react";

import type { AppLocale } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { formatPrice } from "@/lib/format";
import { getRewardOptions, getRewardTierSnapshot } from "@/lib/guest-experience";
import { useUserStore } from "@/store/user-store";

const pageText = {
  th: {
    eyebrow: "แลกรางวัล",
    title: "ใช้แต้มสะสมเป็นเครดิตสำหรับมื้อถัดไป",
    body: "ดูระดับสมาชิก เครดิตที่แลกได้ และประวัติ reward ที่สร้างไว้ใน wallet ของคุณ",
    points: "แต้มสะสมปัจจุบัน",
    redeem: "แลกรางวัลนี้",
    walletCredit: "เครดิตที่ได้รับ",
    recentRedemptions: "รายการแลกล่าสุด",
    successTitle: "เพิ่มเครดิตจากรางวัลแล้ว",
    notEnough: "แต้มยังไม่เพียงพอ",
  },
  en: {
    eyebrow: "Rewards",
    title: "Turn loyalty points into usable dining credit",
    body: "Review your tier, unlockable credits, and the reward history already added to your wallet.",
    points: "Current points",
    redeem: "Redeem this reward",
    walletCredit: "Wallet value",
    recentRedemptions: "Recent redemptions",
    successTitle: "Reward credit added",
    notEnough: "Not enough points yet",
  },
  ja: {
    eyebrow: "ポイント交換",
    title: "ポイントを次回使えるクレジットへ変える",
    body: "会員ランク、交換可能な特典、ウォレットへ追加済みの履歴を確認できます。",
    points: "現在のポイント",
    redeem: "この特典を交換",
    walletCredit: "付与クレジット",
    recentRedemptions: "最近の交換履歴",
    successTitle: "特典クレジットを追加しました",
    notEnough: "ポイントが不足しています",
  },
  zh: {
    eyebrow: "积分兑换",
    title: "把积分兑换成下一次用餐可用额度",
    body: "查看当前等级、可兑换奖励以及已加入钱包的兑换记录。",
    points: "当前积分",
    redeem: "兑换此奖励",
    walletCredit: "到账额度",
    recentRedemptions: "最近兑换",
    successTitle: "奖励额度已加入钱包",
    notEnough: "积分不足",
  },
  ko: {
    eyebrow: "리워드",
    title: "포인트를 다음 식사에 쓸 수 있는 크레딧으로 전환",
    body: "현재 등급, 교환 가능한 혜택, 월렛에 추가된 이력을 함께 확인합니다.",
    points: "현재 포인트",
    redeem: "이 혜택 교환",
    walletCredit: "지급 크레딧",
    recentRedemptions: "최근 교환 내역",
    successTitle: "리워드 크레딧이 추가되었습니다",
    notEnough: "포인트가 부족합니다",
  },
} as const;

export function RewardRedemptionPage({ locale }: { locale: AppLocale }) {
  const text = pageText[locale];
  const { toast } = useToast();
  const rewardPoints = useUserStore((state) => state.rewardPoints);
  const redeemedRewards = useUserStore((state) => state.redeemedRewards);
  const redeemReward = useUserStore((state) => state.redeemReward);
  const rewards = getRewardOptions(locale);
  const snapshot = getRewardTierSnapshot(locale, rewardPoints);

  return (
    <section className="scene-section px-4 pt-10 pb-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="max-w-3xl">
          <p className="text-[0.66rem] uppercase tracking-[0.18em] text-[#cdb37d]">{text.eyebrow}</p>
          <h1 className="mt-3 font-heading text-[2.8rem] leading-tight text-white sm:text-[3.2rem]">{text.title}</h1>
          <p className="mt-4 text-[0.98rem] leading-8 text-[#d1c4b2]">{text.body}</p>
        </div>

        <div className="grid gap-6 xl:grid-cols-[0.92fr_1.08fr]">
          <div className="space-y-6">
            <div className="lux-panel rounded-[2rem] p-6 sm:p-8">
              <div className="flex items-center gap-3">
                <div className="inline-flex size-12 items-center justify-center rounded-2xl bg-[#d6b26a]/12 text-[#ecd8a0]">
                  <Crown className="size-5" />
                </div>
                <div>
                  <p className="text-[0.66rem] uppercase tracking-[0.18em] text-[#cdb37d]">{text.points}</p>
                  <h2 className="mt-1 font-heading text-[2rem] text-white">{snapshot.currentTier}</h2>
                </div>
              </div>
              <p className="mt-4 text-[#d1c4b2]">{snapshot.currentTierBody}</p>
              <div className="mt-6 rounded-[1.6rem] border border-white/10 bg-white/4 p-5">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm text-[#bcae9b]">{text.points}</span>
                  <span className="font-heading text-[1.6rem] text-[#f2d78d]">{snapshot.currentPoints}</span>
                </div>
                <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/8">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#9b1d27] via-[#d6b26a] to-[#1d624b]"
                    style={{ width: `${Math.min(100, (snapshot.currentPoints / Math.max(snapshot.nextThreshold, 1)) * 100)}%` }}
                  />
                </div>
                <p className="mt-3 text-sm text-[#d1c4b2]">
                  {snapshot.nextTier === snapshot.currentTier ? snapshot.currentTier : `${snapshot.pointsToNext} → ${snapshot.nextTier}`}
                </p>
              </div>
            </div>

            <div className="lux-panel-soft rounded-[2rem] p-6">
              <p className="text-[0.66rem] uppercase tracking-[0.18em] text-[#cdb37d]">{text.recentRedemptions}</p>
              <div className="mt-4 space-y-3">
                {redeemedRewards.length === 0 ? (
                  <div className="rounded-[1.4rem] border border-dashed border-white/10 bg-white/3 px-4 py-5 text-sm text-[#bcae9b]">
                    {text.recentRedemptions}
                  </div>
                ) : (
                  redeemedRewards.slice(0, 4).map((entry) => (
                    <div key={entry.id} className="rounded-[1.5rem] border border-white/10 bg-white/4 px-4 py-4">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="text-white">{entry.title}</p>
                          <p className="mt-1 text-sm text-[#bcae9b]">{entry.pointsUsed} pts</p>
                        </div>
                        <span className="text-[#ecd8a0]">{formatPrice(entry.walletAmount, locale)}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {rewards.map((reward) => (
              <div key={reward.id} className={`lux-panel relative overflow-hidden rounded-[2rem] bg-gradient-to-br p-6 ${reward.accentClass}`}>
                <div className="absolute inset-0 bg-gradient-to-br opacity-88" />
                <div className="relative">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-[0.66rem] uppercase tracking-[0.18em] text-[#ecd8a0]">{reward.points} pts</p>
                      <h2 className="mt-3 font-heading text-[1.8rem] leading-tight text-white">{reward.title}</h2>
                    </div>
                    <Gift className="mt-1 size-5 text-[#ecd8a0]" />
                  </div>
                  <p className="mt-4 text-sm leading-7 text-[#ddd0be]">{reward.body}</p>
                  <p className="mt-5 text-sm text-[#bcae9b]">{text.walletCredit}</p>
                  <p className="mt-1 font-heading text-[1.5rem] text-[#f2d78d]">{formatPrice(reward.walletAmount, locale)}</p>
                  <Button
                    type="button"
                    data-testid={`reward-${reward.id}`}
                    className="button-shine mt-6 h-11 rounded-full bg-[#d6b26a] px-5 text-[#1b130f] hover:bg-[#e4c987]"
                    onClick={() => {
                      const result = redeemReward({
                        rewardId: reward.id,
                        title: reward.title,
                        points: reward.points,
                        walletAmount: reward.walletAmount,
                      });

                      toast({
                        title: result.ok ? text.successTitle : text.notEnough,
                        description: reward.title,
                        tone: result.ok ? "success" : "error",
                      });
                    }}
                  >
                    <Sparkles className="size-4" />
                    {text.redeem}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
