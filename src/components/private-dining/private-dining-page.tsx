"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import type { AppLocale } from "@/i18n/routing";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

const pageText = {
  th: {
    eyebrow: "ห้องส่วนตัวและจัดเลี้ยง",
    title: "ฟอร์มสำหรับห้องส่วนตัว งานฉลอง และรับรองลูกค้า",
    body: "หน้านี้ถูกออกแบบให้เป็นฟอร์มคุณภาพสูง สำหรับสอบถามงานอีเวนต์ เหมาปิดเชฟเทเบิล และดินเนอร์มูลค่าสูง",
    bullets: [
      "รองรับห้องส่วนตัว 8-18 ท่าน",
      "รับงานเลี้ยงกลางวันองค์กรและมื้อรับรองลูกค้า",
      "มีลำดับชุดชิมเมนูและเมนูฉลอง",
    ],
    successTitle: "ส่งคำขอจัดเลี้ยงแล้ว",
    successBody: "ทีมร้านได้รับคำขอของคุณแล้ว และสามารถติดตามต่อในขั้นตอนงานอีเวนต์ของแต่ละสาขาได้",
    submit: "ส่งคำขอ",
    catering: "เปิด Catering Builder",
    fields: {
      name: "ชื่อผู้ติดต่อ",
      company: "บริษัท / องค์กร",
      guests: "จำนวนแขก",
      phone: "เบอร์โทรศัพท์",
      eventDate: "วันที่ต้องการจัดงาน",
      notes: "รายละเอียดงาน",
    },
    toastTitle: "รับคำขอแล้ว",
  },
  en: {
    eyebrow: "Private dining & catering",
    title: "Inquiry flow for private rooms, celebrations, and corporate hosting",
    body: "This page is designed for event inquiries, chef table buyouts, and high-value booking requests.",
    bullets: [
      "Private dining for 8-18 guests",
      "Corporate lunch and hosted dinners",
      "Celebration menus and curated tasting sequences",
    ],
    successTitle: "Private dining inquiry sent",
    successBody: "The house team can later connect this UI to CRM, catering workflows, and branch-specific availability.",
    submit: "Send inquiry",
    catering: "Open catering builder",
    fields: {
      name: "Name",
      company: "Company",
      guests: "Guests",
      phone: "Phone",
      eventDate: "Preferred event date",
      notes: "Event notes",
    },
    toastTitle: "Inquiry captured",
  },
  ja: {
    eyebrow: "プライベート利用",
    title: "個室会食、祝宴、接待向け問い合わせフロー",
    body: "イベント、シェフズテーブル貸切、高単価予約向けの問い合わせ UI として設計しています。",
    bullets: [
      "8〜18名向けプライベートダイニング",
      "法人ランチと接待ディナー",
      "お祝い向けコースとテイスティング構成",
    ],
    successTitle: "問い合わせを受け付けました",
    successBody: "この UI は将来 CRM、イベント運用、店舗ごとの空席管理へ接続できます。",
    submit: "問い合わせ送信",
    catering: "ケータリング構成を見る",
    fields: {
      name: "担当者名",
      company: "会社名",
      guests: "人数",
      phone: "電話番号",
      eventDate: "希望日",
      notes: "内容メモ",
    },
    toastTitle: "問い合わせを記録しました",
  },
  zh: {
    eyebrow: "包厢与宴会",
    title: "包厢、庆典与商务宴请咨询流程",
    body: "该页面按高质量线索表单设计，适合后续连接宴会销售、CRM 与门店可用性系统。",
    bullets: [
      "支持 8-18 位包厢用餐",
      "企业午宴与商务接待",
      "庆典菜单与品鉴流程",
    ],
    successTitle: "咨询请求已发送",
    successBody: "我们已收到你的咨询请求，接下来可继续安排 CRM、宴会流程与分店档期确认。",
    submit: "提交咨询",
    catering: "打开宴会构建器",
    fields: {
      name: "联系人姓名",
      company: "公司 / 机构",
      guests: "人数",
      phone: "联系电话",
      eventDate: "期望日期",
      notes: "活动说明",
    },
    toastTitle: "咨询已记录",
  },
  ko: {
    eyebrow: "프라이빗 다이닝",
    title: "프라이빗 룸, 기념 행사, 비즈니스 호스팅 문의 흐름",
    body: "이 페이지는 이벤트 문의, 셰프 테이블 대관, 고가 예약 요청을 정교하게 접수하기 위해 설계되었습니다.",
    bullets: [
      "8-18인 프라이빗 다이닝",
      "기업 런치와 호스팅 디너",
      "기념일 메뉴와 테이스팅 시퀀스",
    ],
    successTitle: "문의가 접수되었습니다",
    successBody: "이 UI는 이후 CRM, 이벤트 운영, 지점별 가능 일정과 연결할 수 있습니다.",
    submit: "문의 보내기",
    catering: "케이터링 빌더 열기",
    fields: {
      name: "담당자 이름",
      company: "회사",
      guests: "인원",
      phone: "전화번호",
      eventDate: "희망 날짜",
      notes: "행사 메모",
    },
    toastTitle: "문의가 저장되었습니다",
  },
} as const;

function createSchema() {
  return z.object({
    name: z.string().min(2),
    company: z.string().optional(),
    guests: z.string().min(1),
    phone: z.string().min(7),
    eventDate: z.string().min(1),
    notes: z.string().optional(),
  });
}

type Values = z.infer<ReturnType<typeof createSchema>>;

export function PrivateDiningPage({ locale }: { locale: AppLocale }) {
  const text = pageText[locale];
  const { toast } = useToast();
  const [submitted, setSubmitted] = useState(false);
  const form = useForm<Values>({
    resolver: zodResolver(createSchema()),
    defaultValues: {
      name: "",
      company: "",
      guests: "16",
      phone: "",
      eventDate: "",
      notes: "",
    },
  });

  if (submitted) {
    return (
      <section className="scene-section px-4 pt-10 pb-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl lux-panel rounded-[2rem] px-6 py-16 text-center">
          <CheckCircle2 className="mx-auto size-16 text-[#d6b26a]" />
          <h1 className="mt-6 font-heading text-[2.7rem] text-white">{text.successTitle}</h1>
          <p className="mx-auto mt-4 max-w-2xl text-[#d1c4b2]">
            {text.successBody}
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="scene-section px-4 pt-10 pb-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-4">
          <p className="text-[0.66rem] uppercase tracking-[0.18em] text-[#cdb37d]">{text.eyebrow}</p>
          <h1 className="font-heading text-[2.8rem] leading-tight text-white sm:text-[3.2rem]">
            {text.title}
          </h1>
          <p className="text-[0.98rem] leading-8 text-[#d1c4b2]">
            {text.body}
          </p>
          <div className="grid gap-3">
            {text.bullets.map((item) => (
              <div key={item} className="rounded-[1.5rem] border border-white/10 bg-white/4 px-4 py-4 text-[#d1c4b2]">
                {item}
              </div>
            ))}
          </div>
          <Button
            type="button"
            variant="outline"
            className="rounded-full border-white/10 bg-white/5 text-white hover:bg-white/10"
            render={<Link href="/catering" locale={locale} />}
          >
            {text.catering}
          </Button>
        </div>
        <div className="lux-panel rounded-[2rem] p-6 sm:p-8">
          <form
            className="space-y-5"
            onSubmit={form.handleSubmit(() => {
              setSubmitted(true);
              toast({
                title: text.toastTitle,
                description: text.successBody,
                tone: "success",
              });
            })}
          >
            <div className="grid gap-5 md:grid-cols-2">
              <div className="space-y-2">
                <Label>{text.fields.name}</Label>
                <Input {...form.register("name")} className="h-12 rounded-2xl border-white/10 bg-white/4 text-white" />
              </div>
              <div className="space-y-2">
                <Label>{text.fields.company}</Label>
                <Input {...form.register("company")} className="h-12 rounded-2xl border-white/10 bg-white/4 text-white" />
              </div>
            </div>
            <div className="grid gap-5 md:grid-cols-2">
              <div className="space-y-2">
                <Label>{text.fields.guests}</Label>
                <Input {...form.register("guests")} className="h-12 rounded-2xl border-white/10 bg-white/4 text-white" />
              </div>
              <div className="space-y-2">
                <Label>{text.fields.phone}</Label>
                <Input {...form.register("phone")} className="h-12 rounded-2xl border-white/10 bg-white/4 text-white" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>{text.fields.eventDate}</Label>
              <Input type="date" {...form.register("eventDate")} className="h-12 rounded-2xl border-white/10 bg-white/4 text-white" />
            </div>
            <div className="space-y-2">
              <Label>{text.fields.notes}</Label>
              <Textarea {...form.register("notes")} className="min-h-28 rounded-2xl border-white/10 bg-white/4 text-white" />
            </div>
            <Button type="submit" className="button-shine h-12 rounded-full bg-[#d6b26a] px-6 text-[#1b130f] hover:bg-[#e4c987]">
              {text.submit}
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
}
