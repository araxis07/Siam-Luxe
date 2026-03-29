"use client";

import { LoaderCircle, LockKeyhole, Mail, ShieldCheck, Sparkles, UserRound } from "lucide-react";
import { useState } from "react";

import type { AppLocale } from "@/i18n/routing";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { trackEvent } from "@/lib/analytics";
import { getAuthPanel } from "@/lib/hospitality";
import { createClient as createSupabaseClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { normalizeSeedGuestName } from "@/lib/user-display";
import { useUserStore } from "@/store/user-store";

const authText = {
  th: {
    member: "เข้าสู่บัญชีสมาชิก",
    guest: "ดำเนินการแบบแขก",
    name: "ชื่อสำหรับบัญชี",
    email: "อีเมล",
    phone: "เบอร์โทรศัพท์",
    password: "รหัสผ่าน",
    signIn: "เข้าสู่บัญชีสมาชิก",
    continueGuest: "ใช้โหมดแขก",
    signedIn: "อัปเดตบัญชีสมาชิกแล้ว",
    guestMode: "เปลี่ยนกลับเป็นโหมดแขกแล้ว",
    account: "ไปยังแดชบอร์ดบัญชี",
    checkout: "ไปยัง checkout",
    createAccount: "สร้างบัญชีใหม่แล้ว",
    checkEmail: "กรุณายืนยันอีเมลจากลิงก์ที่ส่งไป",
    missingFields: "กรอกอีเมลและรหัสผ่านก่อน",
    setupNeeded: "ยังขาด Publishable key ของ Supabase",
    authFailed: "ไม่สามารถเข้าสู่ระบบได้ในขณะนี้",
  },
  en: {
    member: "Member access",
    guest: "Continue as guest",
    name: "Profile name",
    email: "Email",
    phone: "Phone",
    password: "Password",
    signIn: "Continue with member profile",
    continueGuest: "Use guest mode",
    signedIn: "Member profile updated",
    guestMode: "Switched back to guest mode",
    account: "Open account dashboard",
    checkout: "Go to checkout",
    createAccount: "New member account created",
    checkEmail: "Check your inbox to confirm your email",
    missingFields: "Enter both email and password first",
    setupNeeded: "Supabase publishable key is still missing",
    authFailed: "Unable to sign in right now",
  },
  ja: {
    member: "会員サインイン",
    guest: "ゲスト利用",
    name: "プロフィール名",
    email: "メール",
    phone: "電話番号",
    password: "パスワード",
    signIn: "会員プロフィールで続ける",
    continueGuest: "ゲストモードを使う",
    signedIn: "会員プロフィールを更新しました",
    guestMode: "ゲストモードへ戻しました",
    account: "アカウントへ",
    checkout: "checkout へ",
    createAccount: "新しい会員アカウントを作成しました",
    checkEmail: "受信メールから確認を完了してください",
    missingFields: "先にメールとパスワードを入力してください",
    setupNeeded: "Supabase の公開キーがまだ未設定です",
    authFailed: "現在サインインできません",
  },
  zh: {
    member: "会员登录",
    guest: "游客模式",
    name: "档案姓名",
    email: "邮箱",
    phone: "电话",
    password: "密码",
    signIn: "以会员档案继续",
    continueGuest: "使用游客模式",
    signedIn: "会员档案已更新",
    guestMode: "已切换回游客模式",
    account: "前往账户页",
    checkout: "前往结账",
    createAccount: "已创建新的会员账户",
    checkEmail: "请前往邮箱完成确认",
    missingFields: "请先填写邮箱和密码",
    setupNeeded: "Supabase publishable key 仍未填写",
    authFailed: "暂时无法登录",
  },
  ko: {
    member: "멤버 로그인",
    guest: "게스트 모드",
    name: "프로필 이름",
    email: "이메일",
    phone: "전화번호",
    password: "비밀번호",
    signIn: "멤버 프로필로 계속",
    continueGuest: "게스트 모드 사용",
    signedIn: "멤버 프로필을 업데이트했습니다",
    guestMode: "게스트 모드로 전환했습니다",
    account: "계정으로 이동",
    checkout: "체크아웃으로 이동",
    createAccount: "새 멤버 계정을 만들었습니다",
    checkEmail: "이메일 확인을 완료해 주세요",
    missingFields: "이메일과 비밀번호를 먼저 입력해 주세요",
    setupNeeded: "Supabase publishable key가 아직 없습니다",
    authFailed: "지금은 로그인할 수 없습니다",
  },
} as const;

export function AuthExperience({ locale }: { locale: AppLocale }) {
  const copy = getAuthPanel(locale);
  const text = authText[locale];
  const { toast } = useToast();
  const authStatus = useUserStore((state) => state.authStatus);
  const fullName = useUserStore((state) => state.fullName);
  const email = useUserStore((state) => state.email);
  const phone = useUserStore((state) => state.phone);
  const signInMember = useUserStore((state) => state.signInMember);
  const continueAsGuest = useUserStore((state) => state.continueAsGuest);
  const [draftName, setDraftName] = useState(normalizeSeedGuestName(fullName));
  const [draftEmail, setDraftEmail] = useState(email);
  const [draftPhone, setDraftPhone] = useState(phone);
  const [draftPassword, setDraftPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const statusCopy = {
    th: { guest: "แขก", guestCheckout: "ซื้อแบบแขก", memberReady: "พร้อมเป็นสมาชิก" },
    en: { guest: "Guest", guestCheckout: "Guest checkout", memberReady: "Member ready" },
    ja: { guest: "ゲスト", guestCheckout: "ゲスト購入", memberReady: "会員準備完了" },
    zh: { guest: "游客", guestCheckout: "游客结账", memberReady: "会员就绪" },
    ko: { guest: "게스트", guestCheckout: "게스트 체크아웃", memberReady: "멤버 준비 완료" },
  } as const;

  async function handleMemberAccess() {
    if (!draftEmail.trim() || !draftPassword.trim()) {
      toast({
        title: text.missingFields,
        description: draftEmail || draftName || "Siam Lux",
        tone: "info",
      });
      return;
    }

    if (!isSupabaseConfigured()) {
      toast({
        title: text.setupNeeded,
        description: "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
        tone: "info",
      });
      return;
    }

    const supabase = createSupabaseClient();

    if (!supabase) {
      toast({
        title: text.setupNeeded,
        description: "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
        tone: "info",
      });
      return;
    }

    setIsSubmitting(true);

    const profileName = draftName.trim() || "Siam Lux Guest";
    const emailValue = draftEmail.trim();
    const phoneValue = draftPhone.trim();

    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: emailValue,
      password: draftPassword,
    });

    if (!signInError && signInData.user) {
      signInMember({
        fullName: normalizeSeedGuestName(
          typeof signInData.user.user_metadata.full_name === "string"
            ? signInData.user.user_metadata.full_name
            : profileName,
        ),
        email: signInData.user.email ?? emailValue,
        phone:
          typeof signInData.user.user_metadata.phone === "string"
            ? signInData.user.user_metadata.phone
            : phoneValue,
        memberSince: signInData.user.created_at?.slice(0, 10),
      });
      trackEvent("auth_member_sign_in", { locale, provider: "supabase_password" });
      toast({
        title: text.signedIn,
        description: signInData.user.email ?? emailValue,
        tone: "success",
      });
      setIsSubmitting(false);
      return;
    }

    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: emailValue,
      password: draftPassword,
      options: {
        data: {
          full_name: profileName,
          phone: phoneValue,
        },
      },
    });

    if (signUpError) {
      toast({
        title: text.authFailed,
        description: signUpError.message,
        tone: "error",
      });
      setIsSubmitting(false);
      return;
    }

    if (signUpData.user) {
      signInMember({
        fullName: profileName,
        email: signUpData.user.email ?? emailValue,
        phone: phoneValue,
        memberSince: signUpData.user.created_at?.slice(0, 10),
      });
      trackEvent("auth_member_sign_up", { locale, provider: "supabase_password" });
      toast({
        title: signUpData.session ? text.createAccount : text.checkEmail,
        description: signUpData.user.email ?? emailValue,
        tone: "success",
      });
    }

    setIsSubmitting(false);
  }

  async function handleGuestMode() {
    const supabase = createSupabaseClient();

    if (supabase) {
      await supabase.auth.signOut();
    }

    continueAsGuest();
    trackEvent("auth_guest_mode", { locale });
    toast({
      title: text.guestMode,
      description: statusCopy[locale].guestCheckout,
      tone: "info",
    });
  }

  return (
    <section className="scene-section px-4 pt-10 pb-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="max-w-3xl">
          <p className="text-[0.66rem] uppercase tracking-[0.18em] text-[#cdb37d]">{copy.eyebrow}</p>
          <h1 className="mt-3 font-heading text-[2.75rem] leading-tight text-white sm:text-[3.2rem]">
            {copy.title}
          </h1>
          <p className="mt-4 text-[0.98rem] leading-8 text-[#d1c4b2]">{copy.body}</p>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1fr_0.92fr]">
          <div className="lux-panel rounded-[2rem] p-6 sm:p-8">
            <div className="grid gap-4 md:grid-cols-3">
              {copy.highlights.map((item) => (
                <div key={item.label} className="rounded-[1.5rem] border border-white/10 bg-white/4 p-4">
                  <p className="text-[0.66rem] uppercase tracking-[0.18em] text-[#cdb37d]">{item.label}</p>
                  <p className="mt-3 font-heading text-[1.6rem] text-white">{item.value}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 grid gap-5 lg:grid-cols-2">
              <div className="rounded-[1.7rem] border border-white/10 bg-black/15 p-5">
                <div className="flex items-center gap-3">
                  <div className="inline-flex size-11 items-center justify-center rounded-2xl bg-[#d6b26a]/12 text-[#ecd8a0]">
                    <ShieldCheck className="size-5" />
                  </div>
                  <div>
                    <p className="text-[0.66rem] uppercase tracking-[0.18em] text-[#cdb37d]">{text.member}</p>
                    <p className="mt-1 text-white">{authStatus === "member" ? "Siam Society" : statusCopy[locale].guest}</p>
                  </div>
                </div>
                <ul className="mt-5 space-y-3 text-sm leading-6 text-[#d1c4b2]">
                  {copy.memberBenefits.map((item) => (
                    <li key={item}>• {item}</li>
                  ))}
                </ul>
              </div>

              <div className="rounded-[1.7rem] border border-white/10 bg-black/15 p-5">
                <div className="flex items-center gap-3">
                  <div className="inline-flex size-11 items-center justify-center rounded-2xl bg-[#1d624b]/16 text-[#d1f2e4]">
                    <Sparkles className="size-5" />
                  </div>
                  <div>
                    <p className="text-[0.66rem] uppercase tracking-[0.18em] text-[#cdb37d]">{text.guest}</p>
                    <p className="mt-1 text-white">
                      {authStatus === "guest" ? statusCopy[locale].guestCheckout : statusCopy[locale].memberReady}
                    </p>
                  </div>
                </div>
                <ul className="mt-5 space-y-3 text-sm leading-6 text-[#d1c4b2]">
                  {copy.guestBenefits.map((item) => (
                    <li key={item}>• {item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="lux-panel-soft rounded-[2rem] p-6 sm:p-8">
            <div className="grid gap-4">
              <div className="space-y-2">
                <Label htmlFor="auth-name" className="text-[#d9ccbb]">{text.name}</Label>
                <div className="relative">
                  <UserRound className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-[#9f9487]" />
                  <Input
                    id="auth-name"
                    value={draftName}
                    onChange={(event) => setDraftName(event.target.value)}
                    className="h-12 rounded-2xl border-white/10 bg-white/4 pl-11 text-white placeholder:text-[#8f8579]"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="auth-email" className="text-[#d9ccbb]">{text.email}</Label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-[#9f9487]" />
                  <Input
                    id="auth-email"
                    type="email"
                    value={draftEmail}
                    onChange={(event) => setDraftEmail(event.target.value)}
                    className="h-12 rounded-2xl border-white/10 bg-white/4 pl-11 text-white placeholder:text-[#8f8579]"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="auth-phone" className="text-[#d9ccbb]">{text.phone}</Label>
                <div className="relative">
                  <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-[#9f9487]" />
                  <Input
                    id="auth-phone"
                    value={draftPhone}
                    onChange={(event) => setDraftPhone(event.target.value)}
                    className="h-12 rounded-2xl border-white/10 bg-white/4 pl-11 text-white placeholder:text-[#8f8579]"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="auth-password" className="text-[#d9ccbb]">{text.password}</Label>
                <div className="relative">
                  <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-[#9f9487]" />
                  <Input
                    id="auth-password"
                    type="password"
                    value={draftPassword}
                    onChange={(event) => setDraftPassword(event.target.value)}
                    className="h-12 rounded-2xl border-white/10 bg-white/4 pl-11 text-white placeholder:text-[#8f8579]"
                  />
                </div>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-3">
              <Button
                type="button"
                className="button-shine rounded-full bg-[#d6b26a] text-[#1b130f] hover:bg-[#e4c987]"
                disabled={isSubmitting}
                onClick={() => {
                  void handleMemberAccess();
                }}
              >
                {isSubmitting ? <LoaderCircle className="size-4 animate-spin" /> : null}
                {text.signIn}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="rounded-full border-white/10 bg-white/5 text-white hover:bg-white/10"
                disabled={isSubmitting}
                onClick={() => {
                  void handleGuestMode();
                }}
              >
                {text.continueGuest}
              </Button>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <Button
                type="button"
                variant="outline"
                className="rounded-full border-white/10 bg-white/5 text-white hover:bg-white/10"
                render={<Link href="/account" locale={locale} />}
              >
                {text.account}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="rounded-full border-white/10 bg-white/5 text-white hover:bg-white/10"
                render={<Link href="/checkout" locale={locale} />}
              >
                {text.checkout}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
