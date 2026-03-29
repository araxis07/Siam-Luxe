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
import { ReservationCalendarPanel } from "@/components/reservation/reservation-calendar-panel";
import { SeatMapVisual } from "@/components/reservation/seat-map-visual";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { trackEvent } from "@/lib/analytics";
import type { BranchId } from "@/lib/experience";
import { getExperienceCopy, getFeatureLinks, getLocalizedBranches } from "@/lib/experience";
import { useExperienceStore } from "@/store/experience-store";
import { useReservationStore, type ReservationRecord } from "@/store/reservation-store";

const reservationText = {
  th: {
    eyebrow: "การจองโต๊ะ",
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
    successBody: "ทีมร้านได้รับคำขอของคุณแล้ว และพร้อมยืนยันโต๊ะกับช่วงเวลาจากขั้นตอนถัดไป",
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
      terrace: "มุมสวน / ระเบียง",
      counter: "เคาน์เตอร์เชฟ",
      private: "ห้องส่วนตัว",
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
    eyebrow: "Reservation",
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
    successBody: "Your request has been captured and is ready to be confirmed against the house schedule.",
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
    eyebrow: "予約",
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
    successBody: "ご予約内容を受け付けました。続いて店舗側のスケジュールに合わせて確認できます。",
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
    eyebrow: "预订",
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
    successBody: "我们已收到你的预订请求，接下来可按门店档期继续确认安排。",
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
    eyebrow: "예약",
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
    successBody: "예약 요청이 접수되었으며, 다음 단계에서 매장 일정에 맞춰 확인할 수 있습니다.",
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

const reservationLiveText = {
  th: {
    seatingPreview: "แผนผังที่นั่งแบบโต้ตอบ",
    waitlistHint: "รอบนี้เต็มตามรูปแบบที่นั่งที่เลือก ระบบจะบันทึกเป็นรายชื่อรอให้แทน",
    waitlistTitle: "อยู่ในรายชื่อรอแล้ว",
    waitlistBody: "คำขอนี้ถูกบันทึกเป็นรายการรอคิวตามสาขา เวลา และรูปแบบที่นั่งที่คุณเลือก",
    waitlistSubmitted: "เพิ่มเข้ารายชื่อรอแล้ว",
    seatsLeft: "เหลือ {count} ที่",
    full: "เต็มรอบนี้",
    reserveSummary: "ภาพรวมของรอบนี้",
  },
  en: {
    seatingPreview: "Interactive seating preview",
    waitlistHint: "This seating style is currently full for the selected slot. The flow will capture a waitlist request instead.",
    waitlistTitle: "Joined the waitlist",
    waitlistBody: "This request has been recorded as a waitlist entry for the selected branch, time, and seating style.",
    waitlistSubmitted: "Added to waitlist",
    seatsLeft: "{count} seats left",
    full: "Full for this slot",
    reserveSummary: "Live slot summary",
  },
  ja: {
    seatingPreview: "席タイプのライブプレビュー",
    waitlistHint: "この席タイプは選択中の時間帯で満席です。予約ではなくウェイトリストとして受け付けます。",
    waitlistTitle: "ウェイトリストに追加しました",
    waitlistBody: "選択した店舗、時間、席タイプでウェイトリストとして記録されました。",
    waitlistSubmitted: "ウェイトリストに追加しました",
    seatsLeft: "残り {count} 席",
    full: "この時間帯は満席",
    reserveSummary: "現在の空席サマリー",
  },
  zh: {
    seatingPreview: "互动座位预览",
    waitlistHint: "当前所选座位类型在该时间段已满，系统会改为记录候补请求。",
    waitlistTitle: "已加入候补名单",
    waitlistBody: "这条请求已按所选门店、时间与座位类型记录为候补。",
    waitlistSubmitted: "已加入候补名单",
    seatsLeft: "剩余 {count} 个座位",
    full: "该时段已满",
    reserveSummary: "当前档期概览",
  },
  ko: {
    seatingPreview: "좌석 프리뷰",
    waitlistHint: "선택한 좌석 유형이 해당 시간대에 가득 찼습니다. 예약 대신 웨이트리스트 요청으로 저장됩니다.",
    waitlistTitle: "웨이트리스트에 등록되었습니다",
    waitlistBody: "선택한 지점, 시간, 좌석 유형 기준으로 웨이트리스트 항목이 저장되었습니다.",
    waitlistSubmitted: "웨이트리스트에 추가되었습니다",
    seatsLeft: "{count}석 남음",
    full: "이 시간대는 만석",
    reserveSummary: "현재 시간대 요약",
  },
} as const;

const seatingCapacities = {
  salon: 20,
  terrace: 10,
  counter: 8,
  private: 16,
} as const;

const seatingLoads: Record<BranchId, Record<string, Partial<Record<keyof typeof seatingCapacities, number>>>> = {
  bangrak: {
    "18:00": { salon: 11, terrace: 4, counter: 4, private: 8 },
    "19:00": { salon: 17, terrace: 8, counter: 7, private: 15 },
    "20:30": { salon: 18, terrace: 10, counter: 8, private: 16 },
    "21:30": { salon: 12, terrace: 6, counter: 4, private: 12 },
  },
  sukhumvit: {
    "18:00": { salon: 8, terrace: 2, counter: 5, private: 4 },
    "19:00": { salon: 15, terrace: 5, counter: 7, private: 9 },
    "20:30": { salon: 18, terrace: 8, counter: 8, private: 12 },
    "21:30": { salon: 10, terrace: 3, counter: 5, private: 6 },
  },
  chiangmai: {
    "18:00": { salon: 7, terrace: 3, counter: 2, private: 4 },
    "19:00": { salon: 13, terrace: 6, counter: 4, private: 8 },
    "20:30": { salon: 16, terrace: 8, counter: 5, private: 11 },
    "21:30": { salon: 9, terrace: 4, counter: 3, private: 6 },
  },
};

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
  const liveText = reservationLiveText[locale];
  const experienceCopy = getExperienceCopy(locale);
  const feature = getFeatureLinks(locale).find((item) => item.id === "reservation");
  const branches = getLocalizedBranches(locale);
  const selectedBranchId = useExperienceStore((state) => state.selectedBranchId);
  const setSelectedBranchId = useExperienceStore((state) => state.setSelectedBranchId);
  const serviceMode = useExperienceStore((state) => state.serviceMode);
  const createReservation = useReservationStore((state) => state.createReservation);
  const joinWaitlist = useReservationStore((state) => state.joinWaitlist);
  const { toast } = useToast();
  const [submitted, setSubmitted] = useState<ReservationRecord | null>(null);

  const form = useForm<ReservationValues>({
    resolver: zodResolver(createSchema(locale)),
    defaultValues: {
      branchId: selectedBranchId,
      guestCount: "2",
      date: "2026-04-03",
      timeSlot: "19:00",
      occasion: "casual",
      seating: "salon",
      contactName: "",
      phone: "",
      notes: "",
    },
  });

  const branchId = useWatch({ control: form.control, name: "branchId" });
  const selectedDate = useWatch({ control: form.control, name: "date" });
  const timeSlot = useWatch({ control: form.control, name: "timeSlot" });
  const seating = useWatch({ control: form.control, name: "seating" });
  const guestCount = Number(useWatch({ control: form.control, name: "guestCount" }) ?? 2);
  const activeBranch = branches.find((branch) => branch.id === branchId) ?? branches[0];
  const seatPreview = (Object.entries(copy.seatingOptions) as Array<
    [keyof typeof seatingCapacities, string]
  >).map(([id, label]) => {
    const reserved = seatingLoads[branchId as BranchId]?.[timeSlot]?.[id] ?? 0;
    const capacity = seatingCapacities[id];
    const remaining = Math.max(0, capacity - reserved);

    return {
      id,
      label,
      reserved,
      capacity,
      remaining,
      isFull: remaining < guestCount,
    };
  });
  const activeSeat = seatPreview.find((item) => item.id === seating);
  const waitlistMode = activeSeat?.isFull ?? false;

  if (submitted) {
    const branch = branches.find((item) => item.id === submitted.branchId) ?? branches[0];
    const successTitle = submitted.status === "waitlist" ? liveText.waitlistTitle : copy.successTitle;
    const successBody = submitted.status === "waitlist" ? liveText.waitlistBody : copy.successBody;

    return (
      <div className="lux-panel mx-auto max-w-3xl rounded-[2.25rem] px-6 py-16 text-center sm:px-10">
        <CheckCircle2 className="mx-auto size-16 text-[#d6b26a]" />
        <h1 className="mt-6 font-heading text-[2.4rem] leading-tight text-white sm:text-[2.9rem]">{successTitle}</h1>
        <p className="mx-auto mt-4 max-w-2xl text-[#d1c4b2]">{successBody}</p>
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
            {feature?.eyebrow ?? copy.eyebrow}
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
            const payload = {
              branchId: values.branchId as BranchId,
              guestCount: Number(values.guestCount),
              date: values.date,
              timeSlot: values.timeSlot,
              occasion: values.occasion,
              seating: values.seating,
              contactName: values.contactName,
              phone: values.phone,
              notes: values.notes ?? "",
            };
            const reservation = waitlistMode ? joinWaitlist(payload) : createReservation(payload);
            setSubmitted(reservation);
            trackEvent(waitlistMode ? "reservation_waitlist_submit" : "reservation_submit", {
              locale,
              branchId: values.branchId,
              date: values.date,
              timeSlot: values.timeSlot,
              seating: values.seating,
              guests: Number(values.guestCount),
            });
            toast({
              title: waitlistMode ? liveText.waitlistSubmitted : experienceCopy.labels.reservationSubmitted,
              description: `${activeBranch.name} · ${values.date} · ${values.timeSlot}`,
              tone: "success",
            });
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

          <ReservationCalendarPanel
            locale={locale}
            branchId={branchId as BranchId}
            selectedDate={selectedDate}
            onPickDate={(date) => form.setValue("date", date, { shouldDirty: true, shouldTouch: true })}
          />

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
                  <div className="grid gap-3 sm:grid-cols-2">
                    {(Object.entries(copy.seatingOptions) as Array<[keyof typeof seatingCapacities, string]>).map(
                      ([key, value]) => {
                        const preview = seatPreview.find((item) => item.id === key);
                        const isActive = field.value === key;

                        return (
                          <button
                            key={key}
                            type="button"
                            className={`rounded-[1.4rem] border px-4 py-4 text-left transition-colors ${
                              isActive
                                ? "border-[#d6b26a]/35 bg-[#d6b26a]/10"
                                : "border-white/10 bg-white/4 hover:bg-white/8"
                            }`}
                            onClick={() => field.onChange(key)}
                          >
                            <span className="block text-white">{value}</span>
                            <span className="mt-2 block text-sm text-[#bcae9b]">
                              {preview?.isFull
                                ? liveText.full
                                : liveText.seatsLeft.replace("{count}", String(preview?.remaining ?? 0))}
                            </span>
                          </button>
                        );
                      },
                    )}
                  </div>
                )}
              />
            </div>
          </div>

          {waitlistMode ? (
            <div className="rounded-[1.6rem] border border-[#d6b26a]/20 bg-[#d6b26a]/10 px-4 py-4 text-sm text-[#ecd8a0]">
              {liveText.waitlistHint}
            </div>
          ) : null}

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
            {waitlistMode ? liveText.waitlistSubmitted : copy.submit}
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

        <SeatMapVisual
          locale={locale}
          branchId={branchId as BranchId}
          selectedZone={seating}
          onSelectZone={(zone) => form.setValue("seating", zone, { shouldDirty: true, shouldTouch: true })}
        />

        <div className="lux-panel-soft rounded-[2rem] p-6">
          <p className="text-[0.66rem] uppercase tracking-[0.18em] text-[#cdb37d]">{liveText.seatingPreview}</p>
          <div className="mt-4 space-y-3">
            {seatPreview.map((item) => (
              <div
                key={item.id}
                className={`rounded-[1.5rem] border p-4 ${
                  item.id === seating
                    ? "border-[#d6b26a]/30 bg-[#d6b26a]/10"
                    : "border-white/10 bg-white/4"
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="text-white">{item.label}</p>
                  <span className="text-sm text-[#ecd8a0]">{item.capacity}</span>
                </div>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/8">
                  <div
                    className={`h-full rounded-full ${item.isFull ? "bg-[#9b1d27]" : "bg-gradient-to-r from-[#d6b26a] to-[#1d624b]"}`}
                    style={{ width: `${Math.min(100, (item.reserved / item.capacity) * 100)}%` }}
                  />
                </div>
                <p className="mt-3 text-sm text-[#d1c4b2]">
                  {item.isFull
                    ? liveText.full
                    : liveText.seatsLeft.replace("{count}", String(item.remaining))}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="lux-panel-soft rounded-[2rem] p-6">
          <p className="text-[0.66rem] uppercase tracking-[0.18em] text-[#cdb37d]">{liveText.reserveSummary}</p>
          <ul className="mt-4 space-y-3 text-sm leading-7 text-[#d0c3b1]">
            {activeBranch.features.map((feature) => (
              <li key={feature}>• {feature}</li>
            ))}
            <li>• {feature?.description}</li>
            <li>• {experienceCopy.labels.pickupHint}</li>
            <li>• {activeSeat?.label}: {waitlistMode ? liveText.full : liveText.seatsLeft.replace("{count}", String(activeSeat?.remaining ?? 0))}</li>
          </ul>
        </div>
      </aside>
    </div>
  );
}
