"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { z } from "zod";

import type { AppLocale } from "@/i18n/routing";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { getExperienceCopy, getFeatureLinks, getLocalizedBranches } from "@/lib/experience";
import { useExperienceStore } from "@/store/experience-store";

const reservationText = {
  th: {
    subtitle: "เลือกสาขา เวลา จำนวนแขก และบรรยากาศที่ต้องการใน flow เดียวแบบร้านจริง",
    formTitle: "รายละเอียดการจอง",
    branch: "สาขา",
    guests: "จำนวนแขก",
    date: "วันที่",
    time: "เวลา",
    occasion: "โอกาสพิเศษ",
    seatingLabel: "รูปแบบที่นั่ง",
    contactName: "ชื่อผู้จอง",
    phone: "เบอร์โทรศัพท์",
    notes: "หมายเหตุเพิ่มเติม",
    submit: "ส่งคำขอจองโต๊ะ",
    branchTitle: "บรรยากาศของสาขา",
    summaryTitle: "สิ่งที่ลูกค้าจะได้",
    successTitle: "รับคำขอจองโต๊ะแล้ว",
    successBody: "หน้า frontend ได้จำลอง flow การจองสำเร็จ พร้อมต่อ backend และ availability จริงในภายหลัง",
    viewContact: "ดูข้อมูลสาขา",
    browseMenu: "กลับไปดูเมนู",
    occasions: {
      casual: "มื้อทั่วไป",
      date: "เดท / ฉลองคู่",
      celebration: "ฉลองโอกาสพิเศษ",
      business: "รับรองลูกค้า",
    },
    seatingOptions: {
      salon: "โซนหลักของร้าน",
      terrace: "มุมสวน / terrace",
      counter: "chef counter",
      private: "private room",
    },
    errors: {
      branch: "กรุณาเลือกสาขา",
      guests: "กรุณาเลือกจำนวนแขก",
      date: "กรุณาเลือกวันที่",
      time: "กรุณาเลือกเวลา",
      occasion: "กรุณาเลือกโอกาส",
      seating: "กรุณาเลือกรูปแบบที่นั่ง",
      contactName: "กรุณากรอกชื่ออย่างน้อย 2 ตัวอักษร",
      phone: "กรุณากรอกเบอร์โทรศัพท์ที่ถูกต้อง",
    },
  },
  en: {
    subtitle: "Choose branch, time, party size, and dining mood in one polished reservation flow.",
    formTitle: "Reservation details",
    branch: "Branch",
    guests: "Guests",
    date: "Date",
    time: "Time",
    occasion: "Occasion",
    seatingLabel: "Seating",
    contactName: "Guest name",
    phone: "Phone",
    notes: "Additional notes",
    submit: "Submit reservation",
    branchTitle: "Branch atmosphere",
    summaryTitle: "What the flow covers",
    successTitle: "Reservation request captured",
    successBody: "The frontend reservation flow is complete and structured for real availability and backend integration later.",
    viewContact: "View locations",
    browseMenu: "Browse menu",
    occasions: {
      casual: "Casual dinner",
      date: "Date night",
      celebration: "Celebration",
      business: "Business dining",
    },
    seatingOptions: {
      salon: "Main salon",
      terrace: "Garden terrace",
      counter: "Chef counter",
      private: "Private room",
    },
    errors: {
      branch: "Please select a branch",
      guests: "Please select a party size",
      date: "Please choose a date",
      time: "Please choose a time",
      occasion: "Please select an occasion",
      seating: "Please select a seating style",
      contactName: "Please enter at least 2 characters",
      phone: "Please enter a valid phone number",
    },
  },
  ja: {
    subtitle: "店舗、時間、人数、利用シーンを一つの予約フローで選べます。",
    formTitle: "予約内容",
    branch: "店舗",
    guests: "人数",
    date: "日付",
    time: "時間",
    occasion: "利用シーン",
    seatingLabel: "席タイプ",
    contactName: "予約名",
    phone: "電話番号",
    notes: "追加メモ",
    submit: "予約リクエスト送信",
    branchTitle: "店舗の雰囲気",
    summaryTitle: "このフローでできること",
    successTitle: "予約リクエストを受け付けました",
    successBody: "フロントエンドの予約導線は完成しており、後から実在庫や API を接続しやすい構成です。",
    viewContact: "店舗案内を見る",
    browseMenu: "メニューを見る",
    occasions: {
      casual: "通常利用",
      date: "デート",
      celebration: "お祝い",
      business: "接待",
    },
    seatingOptions: {
      salon: "メインサロン",
      terrace: "テラス",
      counter: "シェフカウンター",
      private: "個室",
    },
    errors: {
      branch: "店舗を選択してください",
      guests: "人数を選択してください",
      date: "日付を選択してください",
      time: "時間を選択してください",
      occasion: "利用シーンを選択してください",
      seating: "席タイプを選択してください",
      contactName: "2文字以上で入力してください",
      phone: "有効な電話番号を入力してください",
    },
  },
  zh: {
    subtitle: "在一个完整预约流程中选择门店、时间、人数与用餐场景。",
    formTitle: "预约详情",
    branch: "门店",
    guests: "人数",
    date: "日期",
    time: "时间",
    occasion: "场合",
    seatingLabel: "座位偏好",
    contactName: "预订姓名",
    phone: "联系电话",
    notes: "补充说明",
    submit: "提交预约",
    branchTitle: "门店氛围",
    summaryTitle: "本流程涵盖",
    successTitle: "预约请求已记录",
    successBody: "前端预约流程已就绪，后续可以平滑连接真实库存与后端接口。",
    viewContact: "查看门店信息",
    browseMenu: "浏览菜单",
    occasions: {
      casual: "日常用餐",
      date: "约会晚餐",
      celebration: "庆祝聚餐",
      business: "商务接待",
    },
    seatingOptions: {
      salon: "主厅",
      terrace: "露台 / 花园区",
      counter: "主厨吧台",
      private: "包厢",
    },
    errors: {
      branch: "请选择门店",
      guests: "请选择人数",
      date: "请选择日期",
      time: "请选择时间",
      occasion: "请选择场合",
      seating: "请选择座位偏好",
      contactName: "请至少输入 2 个字符",
      phone: "请输入有效电话号码",
    },
  },
  ko: {
    subtitle: "지점, 시간, 인원, 방문 목적을 하나의 예약 흐름에서 선택합니다.",
    formTitle: "예약 정보",
    branch: "지점",
    guests: "인원",
    date: "날짜",
    time: "시간",
    occasion: "방문 목적",
    seatingLabel: "좌석 유형",
    contactName: "예약자 이름",
    phone: "전화번호",
    notes: "추가 메모",
    submit: "예약 요청 보내기",
    branchTitle: "지점 분위기",
    summaryTitle: "이 흐름에 포함된 내용",
    successTitle: "예약 요청이 접수되었습니다",
    successBody: "프런트엔드 예약 흐름이 준비되어 있어 이후 실제 예약 가능 여부와 API를 쉽게 연결할 수 있습니다.",
    viewContact: "지점 정보 보기",
    browseMenu: "메뉴 보기",
    occasions: {
      casual: "일반 식사",
      date: "데이트",
      celebration: "기념일",
      business: "비즈니스 다이닝",
    },
    seatingOptions: {
      salon: "메인 살롱",
      terrace: "테라스",
      counter: "셰프 카운터",
      private: "프라이빗 룸",
    },
    errors: {
      branch: "지점을 선택해 주세요",
      guests: "인원을 선택해 주세요",
      date: "날짜를 선택해 주세요",
      time: "시간을 선택해 주세요",
      occasion: "방문 목적을 선택해 주세요",
      seating: "좌석 유형을 선택해 주세요",
      contactName: "이름을 2자 이상 입력해 주세요",
      phone: "올바른 전화번호를 입력해 주세요",
    },
  },
} as const;

function createSchema(locale: AppLocale) {
  const copy = reservationText[locale];

  return z.object({
    branchId: z.string().min(1, copy.errors.branch),
    guestCount: z.string().min(1, copy.errors.guests),
    date: z.string().min(1, copy.errors.date),
    timeSlot: z.string().min(1, copy.errors.time),
    occasion: z.string().min(1, copy.errors.occasion),
    seating: z.string().min(1, copy.errors.seating),
    contactName: z.string().min(2, copy.errors.contactName),
    phone: z.string().regex(/^[+\d][\d\s-]{7,}$/, copy.errors.phone),
    notes: z.string().optional(),
  });
}

type ReservationValues = z.infer<ReturnType<typeof createSchema>>;

export function ReservationExperience({ locale }: { locale: AppLocale }) {
  const copy = reservationText[locale];
  const experienceCopy = getExperienceCopy(locale);
  const feature = getFeatureLinks(locale).find((item) => item.id === "reservation");
  const branches = getLocalizedBranches(locale);
  const selectedBranchId = useExperienceStore((state) => state.selectedBranchId);
  const setSelectedBranchId = useExperienceStore((state) => state.setSelectedBranchId);
  const serviceMode = useExperienceStore((state) => state.serviceMode);
  const [submitted, setSubmitted] = useState<ReservationValues | null>(null);

  const form = useForm<ReservationValues>({
    resolver: zodResolver(createSchema(locale)),
    defaultValues: {
      branchId: selectedBranchId,
      guestCount: "2",
      date: "",
      timeSlot: "19:00",
      occasion: "casual",
      seating: "salon",
      contactName: "",
      phone: "",
      notes: "",
    },
  });

  const branchId = useWatch({ control: form.control, name: "branchId" });
  const activeBranch = branches.find((branch) => branch.id === branchId) ?? branches[0];

  if (submitted) {
    const branch = branches.find((item) => item.id === submitted.branchId) ?? branches[0];

    return (
      <div className="lux-panel mx-auto max-w-3xl rounded-[2.25rem] px-6 py-16 text-center sm:px-10">
        <CheckCircle2 className="mx-auto size-16 text-[#d6b26a]" />
        <h1 className="mt-6 font-heading text-[2.4rem] leading-tight text-white sm:text-[2.9rem]">{copy.successTitle}</h1>
        <p className="mx-auto mt-4 max-w-2xl text-[#d1c4b2]">{copy.successBody}</p>
        <div className="mx-auto mt-8 max-w-xl rounded-[1.8rem] border border-white/10 bg-white/4 p-5 text-left">
          <p className="text-[0.66rem] uppercase tracking-[0.18em] text-[#cdb37d]">{branch.name}</p>
          <p className="mt-2 text-white">
            {submitted.date} · {submitted.timeSlot} · {submitted.guestCount}
          </p>
          <p className="mt-1 text-sm text-[#cdbfae]">{branch.neighborhood}</p>
        </div>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Button
            type="button"
            className="button-shine rounded-full bg-[#d6b26a] px-5 text-[#1b130f] hover:bg-[#e4c987]"
            render={<Link href="/contact" locale={locale} />}
          >
            {copy.viewContact}
          </Button>
          <Button
            type="button"
            variant="outline"
            className="rounded-full border-white/10 bg-white/5 text-white hover:bg-white/10"
            render={<Link href="/menu" locale={locale} />}
          >
            {copy.browseMenu}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-8 xl:grid-cols-[1.02fr_0.98fr]">
      <div className="lux-panel rounded-[2.25rem] p-6 sm:p-8">
        <div className="mb-8">
          <p className="text-[0.66rem] uppercase tracking-[0.18em] text-[#cdb37d]">
            {feature?.eyebrow ?? "Reservation"}
          </p>
          <h1 className="mt-3 font-heading text-[2.55rem] leading-tight text-white sm:text-[3rem]">
            {feature?.title ?? experienceCopy.labels.reservationTitle}
          </h1>
          <p className="mt-3 max-w-2xl text-[0.96rem] leading-7 text-[#d1c4b2]">{copy.subtitle}</p>
        </div>

        <form
          className="space-y-6"
          onSubmit={form.handleSubmit((values) => {
            setSelectedBranchId(values.branchId as typeof selectedBranchId);
            setSubmitted(values);
          })}
        >
          <div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-2">
              <Label className="text-[#d9ccbb]">{copy.branch}</Label>
              <Controller
                control={form.control}
                name="branchId"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="h-12 w-full rounded-2xl border-white/10 bg-white/4 px-4 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl border-white/10 bg-[#120d0d]/96 text-white">
                      {branches.map((branch) => (
                        <SelectItem key={branch.id} value={branch.id}>
                          {branch.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[#d9ccbb]">{copy.guests}</Label>
              <Controller
                control={form.control}
                name="guestCount"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="h-12 w-full rounded-2xl border-white/10 bg-white/4 px-4 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl border-white/10 bg-[#120d0d]/96 text-white">
                      {["2", "4", "6", "8"].map((value) => (
                        <SelectItem key={value} value={value}>
                          {value}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-2">
              <Label className="text-[#d9ccbb]">{copy.date}</Label>
              <Input
                type="date"
                {...form.register("date")}
                className="h-12 rounded-2xl border-white/10 bg-white/4 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[#d9ccbb]">{copy.time}</Label>
              <Controller
                control={form.control}
                name="timeSlot"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="h-12 w-full rounded-2xl border-white/10 bg-white/4 px-4 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl border-white/10 bg-[#120d0d]/96 text-white">
                      {["18:00", "19:00", "20:30", "21:30"].map((time) => (
                        <SelectItem key={time} value={time}>
                          {time}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-2">
              <Label className="text-[#d9ccbb]">{copy.occasion}</Label>
              <Controller
                control={form.control}
                name="occasion"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="h-12 w-full rounded-2xl border-white/10 bg-white/4 px-4 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl border-white/10 bg-[#120d0d]/96 text-white">
                      {Object.entries(copy.occasions).map(([key, value]) => (
                        <SelectItem key={key} value={key}>
                          {value}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[#d9ccbb]">{copy.seatingLabel}</Label>
              <Controller
                control={form.control}
                name="seating"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="h-12 w-full rounded-2xl border-white/10 bg-white/4 px-4 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl border-white/10 bg-[#120d0d]/96 text-white">
                      {Object.entries(copy.seatingOptions).map(([key, value]) => (
                        <SelectItem key={key} value={key}>
                          {value}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-2">
              <Label className="text-[#d9ccbb]">{copy.contactName}</Label>
              <Input
                {...form.register("contactName")}
                className="h-12 rounded-2xl border-white/10 bg-white/4 text-white"
              />
              {form.formState.errors.contactName ? (
                <p className="text-sm text-[#f0aaa4]">{form.formState.errors.contactName.message}</p>
              ) : null}
            </div>
            <div className="space-y-2">
              <Label className="text-[#d9ccbb]">{copy.phone}</Label>
              <Input
                {...form.register("phone")}
                className="h-12 rounded-2xl border-white/10 bg-white/4 text-white"
              />
              {form.formState.errors.phone ? (
                <p className="text-sm text-[#f0aaa4]">{form.formState.errors.phone.message}</p>
              ) : null}
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-[#d9ccbb]">{copy.notes}</Label>
            <Textarea
              {...form.register("notes")}
              className="min-h-28 rounded-2xl border-white/10 bg-white/4 text-white"
            />
          </div>

          <Button
            type="submit"
            size="lg"
            className="button-shine h-12 rounded-full bg-[#d6b26a] px-6 text-[#1b130f] hover:bg-[#e4c987]"
          >
            {copy.submit}
          </Button>
        </form>
      </div>

      <aside className="space-y-4 xl:sticky xl:top-28 xl:self-start">
        <div className="lux-panel rounded-[2.25rem] p-6 sm:p-8">
          <p className="text-[0.66rem] uppercase tracking-[0.18em] text-[#cdb37d]">{copy.branchTitle}</p>
          <h2 className="mt-3 font-heading text-[2rem] leading-tight text-white">{activeBranch.name}</h2>
          <p className="mt-2 text-[#d1c4b2]">{activeBranch.neighborhood}</p>
          <p className="mt-1 text-sm text-[#a99b8c]">{activeBranch.address}</p>
          <div className="thai-divider my-6" />
          <div className="space-y-3 text-sm text-[#d1c4b2]">
            <p>{activeBranch.hours}</p>
            <p>{activeBranch.phone}</p>
            <p>
              {experienceCopy.labels.serviceMode}: {experienceCopy.serviceModes[serviceMode]}
            </p>
          </div>
        </div>

        <div className="lux-panel-soft rounded-[2rem] p-6">
          <p className="text-[0.66rem] uppercase tracking-[0.18em] text-[#cdb37d]">{copy.summaryTitle}</p>
          <ul className="mt-4 space-y-3 text-sm leading-7 text-[#d0c3b1]">
            {activeBranch.features.map((feature) => (
              <li key={feature}>• {feature}</li>
            ))}
            <li>• {feature?.description}</li>
            <li>• {experienceCopy.labels.pickupHint}</li>
          </ul>
        </div>
      </aside>
    </div>
  );
}
