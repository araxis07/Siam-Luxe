import type { AppLocale } from "@/i18n/routing";
import { getLocalizedDishes } from "@/lib/catalog";
import { getLocalizedBranch, getLocalizedOrders, type BranchId, type OrderStatus } from "@/lib/experience";

type LocalizedText = Record<AppLocale, string>;

type ReservationDemand = "open" | "steady" | "peak";
type AvailabilityState = "open" | "limited" | "waitlist";

export interface ReservationCalendarDay {
  date: string;
  shortLabel: string;
  dayLabel: string;
  seatsLeft: number;
  demand: ReservationDemand;
  headline: string;
  note: string;
}

export interface SeatMapZone {
  id: "salon" | "terrace" | "counter" | "private";
  label: string;
  vibe: string;
  seats: number;
  seatsLeft: number;
  status: AvailabilityState;
  accentClass: string;
  tables: Array<{ id: string; x: number; y: number; size: "sm" | "md" | "lg"; state: "free" | "held" | "occupied" }>;
}

export interface GiftCardOption {
  id: string;
  amount: number;
  title: string;
  body: string;
  ribbon: string;
  accentClass: string;
}

export interface RewardOption {
  id: string;
  points: number;
  title: string;
  body: string;
  walletAmount: number;
  accentClass: string;
}

export interface SetBuilderSection {
  id: "opening" | "main" | "sweet";
  title: string;
  body: string;
  dishIds: string[];
}

export interface CateringPackage {
  id: string;
  title: string;
  body: string;
  guestRange: string;
  pricePerGuest: number;
  leadTime: string;
  dishIds: string[];
  serviceStyles: string[];
  accentClass: string;
}

export interface UpsellSuggestion {
  id: string;
  dishId: string;
  reason: string;
}

export interface DeliveryMapStop {
  id: string;
  label: string;
  time: string;
  top: number;
  left: number;
  active: boolean;
}

export interface BranchAvailabilityRow {
  id: string;
  label: string;
  dineIn: AvailabilityState;
  pickup: AvailabilityState;
  delivery: AvailabilityState;
  privateDining: AvailabilityState;
}

export interface RewardTierSnapshot {
  currentTier: string;
  currentTierBody: string;
  currentPoints: number;
  nextTier: string;
  nextThreshold: number;
  pointsToNext: number;
}

const calendarLabels: Record<AppLocale, { headline: Record<ReservationDemand, string>; note: Record<ReservationDemand, string> }> = {
  th: {
    headline: {
      open: "เหมาะกับมื้อสบาย",
      steady: "เริ่มแน่นช่วงหัวค่ำ",
      peak: "คืนยอดนิยมของสาขา",
    },
    note: {
      open: "มีเวลายืดหยุ่นและโซนให้เลือกมากที่สุด",
      steady: "แนะนำจองล่วงหน้าสำหรับโต๊ะ 4 ท่านขึ้นไป",
      peak: "เหลือรอบเด่นไม่มาก เหมาะกับการล็อกห้องหรือ waitlist",
    },
  },
  en: {
    headline: {
      open: "Easy reservation window",
      steady: "Evening demand is building",
      peak: "High-demand service window",
    },
    note: {
      open: "Best flexibility for preferred seating and pacing.",
      steady: "Reserve ahead for parties of four and above.",
      peak: "Signature seats are limited, with waitlist flow available.",
    },
  },
  ja: {
    headline: {
      open: "取りやすい時間帯",
      steady: "夜に向けて混み始めます",
      peak: "人気の高いピーク帯",
    },
    note: {
      open: "席タイプと時間の自由度が最も高い枠です。",
      steady: "4名以上は事前予約がおすすめです。",
      peak: "人気席は残りわずかで、ウェイトリストも案内します。",
    },
  },
  zh: {
    headline: {
      open: "较轻松的预订时段",
      steady: "傍晚开始升温",
      peak: "高需求黄金时段",
    },
    note: {
      open: "座位与时段选择最灵活。",
      steady: "4 人以上建议提前锁位。",
      peak: "热门座位所剩不多，可进入候补流程。",
    },
  },
  ko: {
    headline: {
      open: "여유 있는 예약 구간",
      steady: "저녁 수요가 오르는 시간대",
      peak: "가장 인기 높은 피크 구간",
    },
    note: {
      open: "좌석과 시간 선택 폭이 가장 넓습니다.",
      steady: "4인 이상은 사전 예약이 좋습니다.",
      peak: "인기 좌석이 거의 마감되어 웨이트리스트가 열립니다.",
    },
  },
};

const seatMapDefinitions: Record<
  BranchId,
  Array<{
    id: "salon" | "terrace" | "counter" | "private";
    seats: number;
    seatsLeft: number;
    status: AvailabilityState;
    accentClass: string;
    label: LocalizedText;
    vibe: LocalizedText;
    tables: Array<{ id: string; x: number; y: number; size: "sm" | "md" | "lg"; state: "free" | "held" | "occupied" }>;
  }>
> = {
  bangrak: [
    {
      id: "salon",
      seats: 22,
      seatsLeft: 6,
      status: "limited",
      accentClass: "from-[#5e1820]/88 via-[#221111]/70 to-[#0f0d0d]/94",
      label: {
        th: "ศาลาหลักใหญ่",
        en: "Grand Salon",
        ja: "グランドサロン",
        zh: "主沙龙区",
        ko: "그랜드 살롱",
      },
      vibe: {
        th: "เหมาะกับดินเนอร์รับรองและสำรับค่ำแบบนิ่งหรู",
        en: "Best for composed evening hosting and signature dinner service.",
        ja: "落ち着いた会食や夜のコース利用に向きます。",
        zh: "适合正式晚宴与沉稳的招待场景。",
        ko: "차분한 저녁 호스팅과 시그니처 디너에 적합합니다.",
      },
      tables: [
        { id: "b-s-1", x: 18, y: 18, size: "lg", state: "occupied" },
        { id: "b-s-2", x: 46, y: 16, size: "md", state: "occupied" },
        { id: "b-s-3", x: 73, y: 20, size: "md", state: "held" },
        { id: "b-s-4", x: 24, y: 58, size: "md", state: "free" },
        { id: "b-s-5", x: 56, y: 56, size: "lg", state: "free" },
      ],
    },
    {
      id: "terrace",
      seats: 12,
      seatsLeft: 4,
      status: "limited",
      accentClass: "from-[#184738]/88 via-[#132520]/70 to-[#0b0d0c]/94",
      label: {
        th: "ระเบียงริมน้ำ",
        en: "River Terrace",
        ja: "リバーテラス",
        zh: "河畔露台",
        ko: "리버 테라스",
      },
      vibe: {
        th: "ลมเย็นและแสงนุ่ม เหมาะกับโต๊ะคู่และเครื่องดื่มยามพระอาทิตย์ตก",
        en: "Soft evening light for date tables and sunset cocktails.",
        ja: "柔らかな光と風が心地よいデート向け席です。",
        zh: "柔和天光与河景，适合约会与餐前酒。",
        ko: "부드러운 저녁 빛과 강변 분위기로 데이트에 어울립니다.",
      },
      tables: [
        { id: "b-t-1", x: 22, y: 20, size: "sm", state: "occupied" },
        { id: "b-t-2", x: 52, y: 22, size: "sm", state: "free" },
        { id: "b-t-3", x: 76, y: 18, size: "sm", state: "held" },
        { id: "b-t-4", x: 36, y: 60, size: "sm", state: "free" },
      ],
    },
    {
      id: "counter",
      seats: 8,
      seatsLeft: 3,
      status: "open",
      accentClass: "from-[#61461f]/86 via-[#23170d]/70 to-[#090807]/94",
      label: {
        th: "เคาน์เตอร์เชฟ",
        en: "Chef Counter",
        ja: "シェフカウンター",
        zh: "主厨吧台",
        ko: "셰프 카운터",
      },
      vibe: {
        th: "มองเห็นไฟครัว เหมาะกับแขกที่อยากดูการจัดจานใกล้ ๆ",
        en: "Front-row seating for kitchen pacing and finishing details.",
        ja: "仕上げや盛り付けの流れを近くで楽しめます。",
        zh: "能近距离观看出菜节奏与摆盘过程。",
        ko: "주방의 마감과 플레이팅을 가까이서 볼 수 있습니다.",
      },
      tables: [
        { id: "b-c-1", x: 18, y: 28, size: "sm", state: "free" },
        { id: "b-c-2", x: 38, y: 28, size: "sm", state: "free" },
        { id: "b-c-3", x: 58, y: 28, size: "sm", state: "occupied" },
        { id: "b-c-4", x: 78, y: 28, size: "sm", state: "held" },
      ],
    },
    {
      id: "private",
      seats: 16,
      seatsLeft: 0,
      status: "waitlist",
      accentClass: "from-[#2b153a]/86 via-[#1b1022]/70 to-[#0b090c]/94",
      label: {
        th: "ห้องรับรองหลวง",
        en: "Royal Private Room",
        ja: "ロイヤル個室",
        zh: "皇家包厢",
        ko: "로열 프라이빗 룸",
      },
      vibe: {
        th: "เหมาะกับงานเลี้ยงส่วนตัวและมื้อรับรองแขกแบบเป็นทางการ",
        en: "Built for private celebrations and formal hosted dinners.",
        ja: "記念日や接待向けの個室利用に最適です。",
        zh: "适合正式招待、私宴与庆典包场。",
        ko: "프라이빗 행사와 포멀한 호스팅 디너에 맞춰져 있습니다.",
      },
      tables: [
        { id: "b-p-1", x: 50, y: 50, size: "lg", state: "occupied" },
      ],
    },
  ],
  sukhumvit: [
    {
      id: "salon",
      seats: 20,
      seatsLeft: 9,
      status: "open",
      accentClass: "from-[#4b1821]/84 via-[#201111]/70 to-[#0f0d0d]/94",
      label: {
        th: "ศาลาหลักประจำร้าน",
        en: "House Salon",
        ja: "ハウスサロン",
        zh: "主用餐区",
        ko: "하우스 살롱",
      },
      vibe: {
        th: "เหมาะกับโต๊ะกลุ่มเล็กหลังเลิกงานและมื้อคุยงานยามค่ำ",
        en: "Suited to after-work dinners and compact hosted tables.",
        ja: "仕事帰りの会食や少人数ディナー向けです。",
        zh: "适合下班聚餐与小型正式晚餐。",
        ko: "퇴근 후 식사와 소규모 호스팅에 적합합니다.",
      },
      tables: [
        { id: "s-s-1", x: 22, y: 22, size: "md", state: "free" },
        { id: "s-s-2", x: 52, y: 20, size: "md", state: "free" },
        { id: "s-s-3", x: 76, y: 24, size: "sm", state: "held" },
        { id: "s-s-4", x: 30, y: 62, size: "md", state: "occupied" },
        { id: "s-s-5", x: 64, y: 60, size: "md", state: "free" },
      ],
    },
    {
      id: "terrace",
      seats: 10,
      seatsLeft: 5,
      status: "open",
      accentClass: "from-[#1d4d3e]/84 via-[#12261f]/68 to-[#0a0c0c]/94",
      label: {
        th: "มุมสวนรับลม",
        en: "Garden Edge",
        ja: "ガーデンエッジ",
        zh: "花园边座",
        ko: "가든 엣지",
      },
      vibe: {
        th: "มุมรับลมสำหรับของว่างยามบ่ายและของหวาน",
        en: "Good for lighter courses, sweets, and a slower pace.",
        ja: "軽い食事やデザートに向く穏やかな席です。",
        zh: "适合下午茶、甜品与轻松节奏用餐。",
        ko: "가벼운 코스와 디저트, 여유로운 식사에 어울립니다.",
      },
      tables: [
        { id: "s-t-1", x: 28, y: 24, size: "sm", state: "free" },
        { id: "s-t-2", x: 56, y: 20, size: "sm", state: "free" },
        { id: "s-t-3", x: 72, y: 60, size: "sm", state: "occupied" },
      ],
    },
    {
      id: "counter",
      seats: 12,
      seatsLeft: 2,
      status: "limited",
      accentClass: "from-[#6c4c1d]/84 via-[#2a1b0e]/68 to-[#0b0908]/94",
      label: {
        th: "เคาน์เตอร์ชิมเมนู",
        en: "Tasting Counter",
        ja: "テイスティングカウンター",
        zh: "品鉴吧台",
        ko: "테이스팅 카운터",
      },
      vibe: {
        th: "ดีที่สุดสำหรับการชิมหลายจานต่อเนื่องและแขกที่ชอบครัวเปิด",
        en: "The sharpest seat for tasting sequences and open-kitchen energy.",
        ja: "テイスティングとライブ感を楽しむのに最適です。",
        zh: "最适合品鉴菜单与开放式厨房体验。",
        ko: "테이스팅 시퀀스와 오픈 키친 에너지를 즐기기 좋습니다.",
      },
      tables: [
        { id: "s-c-1", x: 18, y: 30, size: "sm", state: "occupied" },
        { id: "s-c-2", x: 36, y: 30, size: "sm", state: "occupied" },
        { id: "s-c-3", x: 54, y: 30, size: "sm", state: "occupied" },
        { id: "s-c-4", x: 72, y: 30, size: "sm", state: "free" },
      ],
    },
    {
      id: "private",
      seats: 12,
      seatsLeft: 2,
      status: "limited",
      accentClass: "from-[#2f183f]/84 via-[#1a1023]/68 to-[#0a090c]/94",
      label: {
        th: "ห้องรับรองงานศิลป์",
        en: "Gallery Room",
        ja: "ギャラリールーム",
        zh: "艺廊包间",
        ko: "갤러리 룸",
      },
      vibe: {
        th: "สำหรับคุยงานและชิมเมนูแบบส่วนตัวในบรรยากาศใกล้ชิด",
        en: "Ideal for intimate tastings and focused business hosting.",
        ja: "少人数接待とプライベート試食に向いています。",
        zh: "适合小规模商务宴请与私享品鉴。",
        ko: "소규모 비즈니스 호스팅과 프라이빗 테이스팅에 적합합니다.",
      },
      tables: [{ id: "s-p-1", x: 50, y: 50, size: "lg", state: "held" }],
    },
  ],
  chiangmai: [
    {
      id: "salon",
      seats: 18,
      seatsLeft: 10,
      status: "open",
      accentClass: "from-[#521922]/84 via-[#211110]/68 to-[#0d0c0c]/94",
      label: {
        th: "ศาลาล้านนา",
        en: "Lanna Salon",
        ja: "ラーンナーサロン",
        zh: "兰纳主厅",
        ko: "란나 살롱",
      },
      vibe: {
        th: "มื้อกลางวันช้า ๆ และโต๊ะครอบครัวที่ยังดูพรีเมียม",
        en: "Relaxed lunch pacing for family tables and signature plates.",
        ja: "家族利用やゆったりランチに向く上品な席です。",
        zh: "适合家庭午餐与从容节奏的精致用餐。",
        ko: "가족 식사와 느긋한 런치 흐름에 잘 맞습니다.",
      },
      tables: [
        { id: "c-s-1", x: 24, y: 18, size: "md", state: "free" },
        { id: "c-s-2", x: 52, y: 18, size: "md", state: "free" },
        { id: "c-s-3", x: 74, y: 22, size: "sm", state: "held" },
        { id: "c-s-4", x: 38, y: 62, size: "lg", state: "free" },
      ],
    },
    {
      id: "terrace",
      seats: 14,
      seatsLeft: 6,
      status: "limited",
      accentClass: "from-[#16513c]/84 via-[#12241d]/68 to-[#090c0b]/94",
      label: {
        th: "เฉลียงสวน",
        en: "Garden Veranda",
        ja: "ガーデンベランダ",
        zh: "花园回廊",
        ko: "가든 베란다",
      },
      vibe: {
        th: "เหมาะกับของหวาน ชาไทย และมุมสวนเงียบ",
        en: "A soft setting for desserts, tea, and slower afternoon stays.",
        ja: "甘味やお茶をゆっくり楽しめる庭側席です。",
        zh: "适合甜品、茶饮与安静的花园时光。",
        ko: "디저트와 티, 조용한 가든 타임에 어울립니다.",
      },
      tables: [
        { id: "c-t-1", x: 20, y: 22, size: "sm", state: "occupied" },
        { id: "c-t-2", x: 48, y: 22, size: "sm", state: "free" },
        { id: "c-t-3", x: 74, y: 22, size: "sm", state: "free" },
        { id: "c-t-4", x: 48, y: 60, size: "sm", state: "held" },
      ],
    },
    {
      id: "counter",
      seats: 6,
      seatsLeft: 4,
      status: "open",
      accentClass: "from-[#61451e]/84 via-[#25190d]/68 to-[#090807]/94",
      label: {
        th: "บาร์ของหวาน",
        en: "Dessert Bar",
        ja: "デザートバー",
        zh: "甜品吧台",
        ko: "디저트 바",
      },
      vibe: {
        th: "เหมาะกับของหวานไทยและชุดชาที่จัดเสิร์ฟอย่างประณีต",
        en: "Best for plated sweets and a Thai tea service finish.",
        ja: "デザートとティーサービスの締めに最適です。",
        zh: "适合甜品盘与泰式茶歇体验。",
        ko: "플레이팅 디저트와 티 서비스 마무리에 좋습니다.",
      },
      tables: [
        { id: "c-c-1", x: 22, y: 28, size: "sm", state: "free" },
        { id: "c-c-2", x: 42, y: 28, size: "sm", state: "free" },
        { id: "c-c-3", x: 62, y: 28, size: "sm", state: "free" },
      ],
    },
    {
      id: "private",
      seats: 10,
      seatsLeft: 1,
      status: "limited",
      accentClass: "from-[#2d1639]/84 via-[#1b1122]/68 to-[#0a090b]/94",
      label: {
        th: "ห้องโคม",
        en: "Lantern Room",
        ja: "ランタンルーム",
        zh: "灯影包间",
        ko: "랜턴 룸",
      },
      vibe: {
        th: "สำหรับการชิมแบบส่วนตัวและการฉลองในครอบครัว",
        en: "Reserved for private tastings and family celebrations.",
        ja: "家族のお祝いとプライベート試食向けです。",
        zh: "适合家庭庆祝与私享品鉴。",
        ko: "가족 기념일과 프라이빗 테이스팅에 적합합니다.",
      },
      tables: [{ id: "c-p-1", x: 50, y: 50, size: "lg", state: "held" }],
    },
  ],
};

const giftCardDefinitions: Array<{
  id: string;
  amount: number;
  ribbon: LocalizedText;
  title: LocalizedText;
  body: LocalizedText;
  accentClass: string;
}> = [
  {
    id: "gold-dining",
    amount: 1000,
    ribbon: {
      th: "สำหรับคนเริ่มรู้จักร้าน",
      en: "First taste",
      ja: "最初の一枚に",
      zh: "初次体验",
      ko: "첫 경험용",
    },
    title: {
      th: "บัตรมื้อค่ำสีทอง",
      en: "Golden Supper Card",
      ja: "ゴールデンサパーカード",
      zh: "金色晚宴卡",
      ko: "골든 서퍼 카드",
    },
    body: {
      th: "เหมาะกับมื้อค่ำคู่หรือการชิมเมนูซิกเนเจอร์ 2-3 จาน",
      en: "A polished starting balance for two signature plates and dessert.",
      ja: "シグネチャー料理とデザートを軽やかに楽しめる入門残高です。",
      zh: "适合两道招牌菜加甜品的轻量体验。",
      ko: "시그니처 2코스와 디저트에 맞는 입문 밸런스입니다.",
    },
    accentClass: "from-[#7d1e29]/95 via-[#2b1311]/86 to-[#110d0d]/96",
  },
  {
    id: "royal-table",
    amount: 2500,
    ribbon: {
      th: "นิยมที่สุด",
      en: "Most gifted",
      ja: "人気の贈り方",
      zh: "最受欢迎",
      ko: "가장 인기",
    },
    title: {
      th: "ของขวัญโต๊ะรับรองหลวง",
      en: "Royal Table Gift",
      ja: "ロイヤルテーブルギフト",
      zh: "皇家餐桌礼卡",
      ko: "로열 테이블 기프트",
    },
    body: {
      th: "ครอบคลุมชุดอาหารแชร์และของหวานสำหรับ 2-4 ท่าน",
      en: "Sized for a curated sharing table, sweets, and premium finishes.",
      ja: "シェア向けの構成や上質な締めまで含めやすい人気額です。",
      zh: "适合共享套餐、甜品与更完整的晚宴组合。",
      ko: "공유 테이블과 디저트까지 커버하는 가장 안정적인 금액입니다.",
    },
    accentClass: "from-[#184a39]/95 via-[#132621]/84 to-[#0d0d0d]/96",
  },
  {
    id: "heritage-evening",
    amount: 5000,
    ribbon: {
      th: "สำหรับของขวัญพรีเมียม",
      en: "Premium hosting",
      ja: "上質な贈答に",
      zh: "高端送礼",
      ko: "프리미엄 호스팅",
    },
    title: {
      th: "บัตรค่ำคืนแห่งมรดก",
      en: "Heritage Evening Card",
      ja: "ヘリテージイブニングカード",
      zh: "传承晚宴礼卡",
      ko: "헤리티지 이브닝 카드",
    },
    body: {
      th: "ออกแบบสำหรับมื้อค่ำส่วนตัว ชุดชิมเมนู และเครดิตของขวัญที่ดูจริงจัง",
      en: "Built for private dinners, tasting collections, and meaningful gifting.",
      ja: "個室利用やテイスティングにも使いやすい、格のある贈り物です。",
      zh: "适合私宴、品鉴套餐与更正式的礼赠场景。",
      ko: "프라이빗 다이닝과 테이스팅, 격식 있는 선물에 어울립니다.",
    },
    accentClass: "from-[#6c4d20]/95 via-[#27190f]/84 to-[#0d0b09]/96",
  },
];

const rewardDefinitions: Array<{
  id: string;
  points: number;
  walletAmount: number;
  title: LocalizedText;
  body: LocalizedText;
  accentClass: string;
}> = [
  {
    id: "dessert-flight",
    points: 220,
    walletAmount: 160,
    title: {
      th: "เครดิตของหวานเชฟ",
      en: "Chef dessert credit",
      ja: "デザートクレジット",
      zh: "主厨甜品抵扣",
      ko: "셰프 디저트 크레딧",
    },
    body: {
      th: "แลกเครดิตเพื่อใช้กับของหวานจานเด่นหรือขนมตามฤดูกาล",
      en: "Unlock a sweet finish credit for plated desserts and seasonal sweets.",
      ja: "デザートや季節甘味に使える小回りのよい特典です。",
      zh: "可用于招牌甜品或季节甜点的抵扣额度。",
      ko: "시그니처 디저트와 시즌 스위트에 쓰기 좋은 소형 보상입니다.",
    },
    accentClass: "from-[#7a1f2b]/90 via-[#2d1514]/82 to-[#110d0d]/96",
  },
  {
    id: "priority-pickup",
    points: 320,
    walletAmount: 220,
    title: {
      th: "เครดิตรับเองแบบด่วนพิเศษ",
      en: "Priority pickup credit",
      ja: "優先受取クレジット",
      zh: "优先自取抵扣",
      ko: "프라이어리티 픽업 크레딧",
    },
    body: {
      th: "เหมาะกับลูกค้าที่รับอาหารเองบ่อยและอยากได้เครดิตทันที",
      en: "A compact reward for frequent pickup guests and dinner repeats.",
      ja: "受取利用が多いゲスト向けの使いやすい特典です。",
      zh: "适合经常自取、想立即抵扣的回访顾客。",
      ko: "픽업 이용이 잦은 고객에게 즉시 체감되는 보상입니다.",
    },
    accentClass: "from-[#17483a]/90 via-[#132722]/82 to-[#0c0d0d]/96",
  },
  {
    id: "royal-upgrade",
    points: 640,
    walletAmount: 420,
    title: {
      th: "เครดิตอัปเกรดสำรับค่ำ",
      en: "Royal supper upgrade",
      ja: "ディナーアップグレード",
      zh: "晚宴升级抵扣",
      ko: "로열 서퍼 업그레이드",
    },
    body: {
      th: "ใช้เป็นเครดิตก้อนใหญ่สำหรับชุดพิเศษ มื้อค่ำ หรือรอบเฉลิมฉลอง",
      en: "A larger loyalty unlock for celebratory dinners and premium set menus.",
      ja: "記念日や上位セットへの背中を押す上級特典です。",
      zh: "适合庆祝晚宴与更高级套餐的高等级兑换。",
      ko: "기념일 디너와 프리미엄 세트에 쓰기 좋은 상위 보상입니다.",
    },
    accentClass: "from-[#6b4c1d]/90 via-[#281a10]/82 to-[#0c0b09]/96",
  },
];

const rewardTiers: Array<{
  threshold: number;
  title: LocalizedText;
  body: LocalizedText;
}> = [
  {
    threshold: 0,
    title: {
      th: "แขกบัวงาม",
      en: "Lotus Guest",
      ja: "ロータスゲスト",
      zh: "莲华来宾",
      ko: "로터스 게스트",
    },
    body: {
      th: "เริ่มสะสมเพื่อปลดล็อกเครดิตของหวานและสิทธิพิเศษสำหรับมื้อถัดไป",
      en: "Building toward dessert credits and premium repeat-order perks.",
      ja: "まずはデザート特典と再訪向けの優待を目指す段階です。",
      zh: "正在累积解锁甜品抵扣与回访礼遇。",
      ko: "디저트 크레딧과 재주문 혜택을 모으는 시작 단계입니다.",
    },
  },
  {
    threshold: 700,
    title: {
      th: "ผู้อุปถัมภ์ทอง",
      en: "Golden Patron",
      ja: "ゴールデンパトロン",
      zh: "金辉贵宾",
      ko: "골든 패트런",
    },
    body: {
      th: "เริ่มแลกเครดิตมื้อค่ำและสิทธิ์ลำดับพิเศษได้ชัดเจนขึ้น",
      en: "Strong enough to redeem dinner credits and priority house benefits.",
      ja: "ディナー利用に効く特典を取りやすくなる中位ランクです。",
      zh: "可稳定兑换晚宴抵扣与优先礼遇的中阶等级。",
      ko: "디너 크레딧과 우선 혜택을 체감하기 시작하는 중간 단계입니다.",
    },
  },
  {
    threshold: 1500,
    title: {
      th: "วงรับรองหลวง",
      en: "Royal Circle",
      ja: "ロイヤルサークル",
      zh: "御享会席",
      ko: "로열 서클",
    },
    body: {
      th: "พร้อมสำหรับเครดิตก้อนใหญ่ ห้องรับรองส่วนตัว และของขวัญระดับร้านจริง",
      en: "Positioned for premium dining credits, gifting, and private-table privileges.",
      ja: "上位クレジットや個室利用の特典に手が届く上級ランクです。",
      zh: "适合兑换高额抵扣、礼卡与私宴礼遇的高阶等级。",
      ko: "고액 크레딧과 프라이빗 다이닝 혜택을 노릴 수 있는 상위 등급입니다.",
    },
  },
];

const setBuilderDefinitions: Array<{
  id: "opening" | "main" | "sweet";
  title: LocalizedText;
  body: LocalizedText;
  dishIds: string[];
}> = [
  {
    id: "opening",
    title: {
      th: "จานเปิดสำรับ",
      en: "Opening plate",
      ja: "オープニングプレート",
      zh: "开场菜",
      ko: "오프닝 플레이트",
    },
    body: {
      th: "เลือกจานแรกเพื่อกำหนดอารมณ์ของโต๊ะ",
      en: "Choose the first plate to set the table mood.",
      ja: "最初の一皿でテーブルのトーンを決めます。",
      zh: "用第一道菜定义整桌的开场气氛。",
      ko: "첫 번째 플레이트로 테이블의 분위기를 정합니다.",
    },
    dishIds: ["royal-tom-yum", "pandan-satay", "isaan-som-tum", "golden-crab-omelette"],
  },
  {
    id: "main",
    title: {
      th: "จานหลัก",
      en: "Main course",
      ja: "メインコース",
      zh: "主菜",
      ko: "메인 코스",
    },
    body: {
      th: "สร้างสำรับหลักจากจานเส้น ผัด หรือแกงที่คนในโต๊ะจะจำได้",
      en: "Build the main center from noodles, wok fire, or composed curry plates.",
      ja: "麺、炒め、カレーから印象に残る主役を選びます。",
      zh: "从面、炒锅或咖喱里选出整套的主心骨。",
      ko: "면, 웍, 커리 중에서 테이블의 중심이 될 메인을 고릅니다.",
    },
    dishIds: ["charcoal-pad-thai", "emerald-green-curry", "lanna-khao-soi", "fire-basil-wagyu", "river-prawn-rice"],
  },
  {
    id: "sweet",
    title: {
      th: "จบมื้อแบบหวานพอดี",
      en: "Sweet finish",
      ja: "締めの甘味",
      zh: "甜品收尾",
      ko: "스위트 피니시",
    },
    body: {
      th: "ปิดท้ายด้วยของหวานที่บาลานซ์เครื่องเทศและทำให้โต๊ะดูสมบูรณ์",
      en: "Finish with a dessert that softens spice and completes the table.",
      ja: "甘味で辛味をほどき、食卓全体を完成させます。",
      zh: "用甜品收束香辣层次，让整桌更完整。",
      ko: "디저트로 향신의 여운을 정리하고 구성을 완성합니다.",
    },
    dishIds: ["mango-sticky-cloud", "ruby-water-chestnut", "roti-kaya-gold", "palm-sugar-coconut-ice"],
  },
];

const cateringDefinitions: Array<{
  id: string;
  title: LocalizedText;
  body: LocalizedText;
  guestRange: LocalizedText;
  leadTime: LocalizedText;
  pricePerGuest: number;
  dishIds: string[];
  serviceStyles: LocalizedText[];
  accentClass: string;
}> = [
  {
    id: "royal-reception",
    title: {
      th: "สำรับรับรองแบบหลวง",
      en: "Royal Reception Table",
      ja: "王室迎賓テーブル",
      zh: "皇室迎宾宴席",
      ko: "로열 리셉션 테이블",
    },
    body: {
      th: "ชุดรับรองสำหรับแขก 8-12 ท่าน เน้นจานไทยกลางและเมนูที่แชร์ง่าย",
      en: "An 8-12 guest format centered on polished central Thai hosting plates.",
      ja: "8〜12名の会食に向く、中央タイ中心の上品な構成です。",
      zh: "适合 8-12 位宾客的中部泰式招待组合。",
      ko: "8-12인 호스팅에 맞춘 정제된 중부 태국 스타일 패키지입니다.",
    },
    guestRange: {
      th: "8-12 ท่าน",
      en: "8-12 guests",
      ja: "8〜12名",
      zh: "8-12 位",
      ko: "8-12명",
    },
    leadTime: {
      th: "ล่วงหน้า 48 ชม.",
      en: "48 hours lead time",
      ja: "48時間前予約",
      zh: "需提前 48 小时",
      ko: "48시간 전 예약",
    },
    pricePerGuest: 890,
    dishIds: ["royal-tom-yum", "golden-crab-omelette", "river-prawn-rice", "mango-sticky-cloud"],
    serviceStyles: [
      {
        th: "แชร์แบบจัดจาน",
        en: "plated sharing",
        ja: "シェアプレート",
        zh: "共享摆盘",
        ko: "플레이티드 셰어링",
      },
      {
        th: "ห้องส่วนตัว",
        en: "private room",
        ja: "個室",
        zh: "包厢",
        ko: "프라이빗 룸",
      },
    ],
    accentClass: "from-[#7d1e29]/94 via-[#301412]/82 to-[#100d0d]/96",
  },
  {
    id: "chef-counter-party",
    title: {
      th: "งานเลี้ยงหน้าเคาน์เตอร์เชฟ",
      en: "Chef Counter Party",
      ja: "シェフカウンターパーティー",
      zh: "主厨吧台宴会",
      ko: "셰프 카운터 파티",
    },
    body: {
      th: "สำหรับงาน 12-18 ท่านที่ต้องการชิมหลายจาน เห็นครัวชัด และมีจังหวะเสิร์ฟที่ชัดเจน",
      en: "A 12-18 guest flow for chef-led tastings and visible kitchen energy.",
      ja: "12〜18名向けのライブ感あるテイスティング構成です。",
      zh: "适合 12-18 位宾客、强调主厨节奏与开放厨房体验。",
      ko: "12-18인 규모의 셰프 주도 테이스팅과 오픈 키친 흐름에 맞춥니다.",
    },
    guestRange: {
      th: "12-18 ท่าน",
      en: "12-18 guests",
      ja: "12〜18名",
      zh: "12-18 位",
      ko: "12-18명",
    },
    leadTime: {
      th: "ล่วงหน้า 72 ชม.",
      en: "72 hours lead time",
      ja: "72時間前予約",
      zh: "需提前 72 小时",
      ko: "72시간 전 예약",
    },
    pricePerGuest: 1150,
    dishIds: ["pandan-satay", "charcoal-pad-thai", "fire-basil-wagyu", "roti-kaya-gold"],
    serviceStyles: [
      {
        th: "ชิมเมนูหน้าเคาน์เตอร์",
        en: "counter tasting",
        ja: "カウンターテイスティング",
        zh: "吧台品鉴",
        ko: "카운터 테이스팅",
      },
      {
        th: "คำอธิบายจากเชฟ",
        en: "chef remarks",
        ja: "シェフ解説",
        zh: "主厨讲解",
        ko: "셰프 코멘트",
      },
    ],
    accentClass: "from-[#184a39]/94 via-[#142722]/82 to-[#0d0d0d]/96",
  },
  {
    id: "garden-dessert-social",
    title: {
      th: "งานพบปะสวนของหวาน",
      en: "Garden Dessert Social",
      ja: "ガーデンデザートソーシャル",
      zh: "花园甜品雅集",
      ko: "가든 디저트 소셜",
    },
    body: {
      th: "สำหรับ 20-40 ท่าน เน้นการรับรองยามบ่าย ของหวานไทย และการจับคู่ชา",
      en: "A 20-40 guest format for receptions, Thai sweets, and tea pairings.",
      ja: "20〜40名のレセプション向け、甘味とティーを主役にした構成です。",
      zh: "适合 20-40 位宾客的下午接待与甜品茶会形式。",
      ko: "20-40인 규모의 리셉션과 태국 디저트, 티 페어링에 맞춘 구성입니다.",
    },
    guestRange: {
      th: "20-40 ท่าน",
      en: "20-40 guests",
      ja: "20〜40名",
      zh: "20-40 位",
      ko: "20-40명",
    },
    leadTime: {
      th: "ล่วงหน้า 5 วัน",
      en: "5 days lead time",
      ja: "5日前予約",
      zh: "需提前 5 天",
      ko: "5일 전 예약",
    },
    pricePerGuest: 720,
    dishIds: ["kanom-buang-royale", "foi-thong-custard", "mango-sticky-cloud", "palm-sugar-coconut-ice"],
    serviceStyles: [
      {
        th: "บาร์ของหวาน",
        en: "dessert bar",
        ja: "デザートバー",
        zh: "甜品吧",
        ko: "디저트 바",
      },
      {
        th: "ชาจับคู่เมนู",
        en: "tea pairing",
        ja: "ティーペアリング",
        zh: "茶饮搭配",
        ko: "티 페어링",
      },
    ],
    accentClass: "from-[#6f4d1f]/94 via-[#2b1c10]/82 to-[#0f0c09]/96",
  },
];

const branchAvailabilityDefinitions: Record<
  BranchId,
  Array<{
    id: string;
    label: LocalizedText;
    dineIn: AvailabilityState;
    pickup: AvailabilityState;
    delivery: AvailabilityState;
    privateDining: AvailabilityState;
  }>
> = {
  bangrak: [
    {
      id: "lunch",
      label: { th: "กลางวัน", en: "Lunch", ja: "ランチ", zh: "午餐", ko: "런치" },
      dineIn: "open",
      pickup: "open",
      delivery: "limited",
      privateDining: "limited",
    },
    {
      id: "sunset",
      label: { th: "ช่วงเย็น", en: "Sunset", ja: "夕方", zh: "傍晚", ko: "선셋" },
      dineIn: "limited",
      pickup: "open",
      delivery: "open",
      privateDining: "waitlist",
    },
    {
      id: "dinner",
      label: { th: "ค่ำ", en: "Dinner", ja: "ディナー", zh: "晚餐", ko: "디너" },
      dineIn: "waitlist",
      pickup: "limited",
      delivery: "open",
      privateDining: "waitlist",
    },
  ],
  sukhumvit: [
    {
      id: "lunch",
      label: { th: "กลางวัน", en: "Lunch", ja: "ランチ", zh: "午餐", ko: "런치" },
      dineIn: "open",
      pickup: "open",
      delivery: "open",
      privateDining: "limited",
    },
    {
      id: "afterwork",
      label: { th: "หลังเลิกงาน", en: "After work", ja: "仕事帰り", zh: "下班后", ko: "퇴근 후" },
      dineIn: "limited",
      pickup: "open",
      delivery: "open",
      privateDining: "limited",
    },
    {
      id: "late",
      label: { th: "รอบดึก", en: "Late service", ja: "遅い時間", zh: "夜间时段", ko: "야간 서비스" },
      dineIn: "limited",
      pickup: "limited",
      delivery: "open",
      privateDining: "limited",
    },
  ],
  chiangmai: [
    {
      id: "brunch",
      label: { th: "บรันช์", en: "Brunch", ja: "ブランチ", zh: "早午餐", ko: "브런치" },
      dineIn: "open",
      pickup: "limited",
      delivery: "limited",
      privateDining: "limited",
    },
    {
      id: "tea",
      label: { th: "ชายามบ่าย", en: "Tea hour", ja: "ティータイム", zh: "下午茶", ko: "티 타임" },
      dineIn: "open",
      pickup: "open",
      delivery: "limited",
      privateDining: "open",
    },
    {
      id: "evening",
      label: { th: "ค่ำ", en: "Evening", ja: "夕方", zh: "夜晚", ko: "저녁" },
      dineIn: "limited",
      pickup: "open",
      delivery: "limited",
      privateDining: "limited",
    },
  ],
};

const upsellDefinitions: Record<
  string,
  Array<{ dishId: string; reason: LocalizedText }>
> = {
  "royal-tom-yum": [
    {
      dishId: "mango-sticky-cloud",
      reason: {
        th: "ปิดรสเผ็ดด้วยของหวานมะม่วงยอดนิยม",
        en: "A bright dessert finish to soften the spice arc.",
        ja: "辛味の余韻をほどく定番の甘味です。",
        zh: "用经典芒果甜品收住辛香层次。",
        ko: "매운 여운을 부드럽게 정리하는 디저트입니다.",
      },
    },
    {
      dishId: "pandan-satay",
      reason: {
        th: "จับคู่กับของย่างหอมเพื่อให้โต๊ะดูสมบูรณ์ขึ้น",
        en: "Adds a charcoal note for a more complete table.",
        ja: "炭火の香りを足して食卓の厚みを出せます。",
        zh: "补上一道炭香前菜让整桌更完整。",
        ko: "숯향이 있는 스타터를 더해 테이블 구성을 완성합니다.",
      },
    },
  ],
  "charcoal-pad-thai": [
    {
      dishId: "ruby-water-chestnut",
      reason: {
        th: "จบมื้อด้วยของหวานเบาและเย็น",
        en: "A cooling sweet to follow wok heat and tamarind.",
        ja: "甘酸っぱい余韻のあとに軽やかな冷菓が合います。",
        zh: "炒锅香与酸甜之后，最适合来一份清凉甜品。",
        ko: "웍 향과 새콤함 뒤에 가벼운 디저트가 잘 맞습니다.",
      },
    },
  ],
  "fire-basil-wagyu": [
    {
      dishId: "golden-crab-omelette",
      reason: {
        th: "เพิ่มจานแชร์ที่ทำให้มื้อดูพรีเมียมขึ้นทันที",
        en: "An easy premium add-on that turns the order into a fuller dinner.",
        ja: "上質感を一段引き上げるシェア向け追加です。",
        zh: "补上一道更有场面的共享菜，整单会更完整。",
        ko: "주문 전체를 한 단계 더 고급스럽게 만드는 추가 메뉴입니다.",
      },
    },
  ],
};

const trackingMapText = {
  th: {
    destination: "จุดส่ง",
    rider: "ไรเดอร์",
    kitchen: "ครัวสาขา",
    completed: "เสร็จแล้ว",
  },
  en: {
    destination: "Drop-off",
    rider: "Rider",
    kitchen: "Kitchen",
    completed: "Completed",
  },
  ja: {
    destination: "お届け先",
    rider: "ライダー",
    kitchen: "キッチン",
    completed: "完了",
  },
  zh: {
    destination: "送达点",
    rider: "骑手",
    kitchen: "后厨",
    completed: "已完成",
  },
  ko: {
    destination: "도착지",
    rider: "라이더",
    kitchen: "주방",
    completed: "완료",
  },
} as const;

const localeMap: Record<AppLocale, string> = {
  th: "th-TH",
  en: "en-US",
  ja: "ja-JP",
  zh: "zh-CN",
  ko: "ko-KR",
};

function formatShortDate(locale: AppLocale, date: string) {
  return new Intl.DateTimeFormat(localeMap[locale], {
    month: "short",
    day: "numeric",
  }).format(new Date(`${date}T00:00:00`));
}

function formatDay(locale: AppLocale, date: string) {
  return new Intl.DateTimeFormat(localeMap[locale], {
    weekday: "short",
  }).format(new Date(`${date}T00:00:00`));
}

function stateToSeats(demand: ReservationDemand) {
  if (demand === "open") return 12;
  if (demand === "steady") return 6;
  return 2;
}

const calendarDemandPattern: Record<BranchId, ReservationDemand[]> = {
  bangrak: ["steady", "peak", "peak", "steady", "open", "open", "steady", "peak", "steady", "open"],
  sukhumvit: ["open", "steady", "steady", "peak", "steady", "open", "open", "steady", "peak", "steady"],
  chiangmai: ["open", "open", "steady", "steady", "peak", "steady", "open", "open", "steady", "peak"],
};

export function getReservationCalendar(locale: AppLocale, branchId: BranchId) {
  const pattern = calendarDemandPattern[branchId];

  return pattern.map((demand, index) => {
    const date = `2026-04-${String(index + 3).padStart(2, "0")}`;

    return {
      date,
      shortLabel: formatShortDate(locale, date),
      dayLabel: formatDay(locale, date),
      seatsLeft: Math.max(0, stateToSeats(demand) - (index % 3)),
      demand,
      headline: calendarLabels[locale].headline[demand],
      note: calendarLabels[locale].note[demand],
    } satisfies ReservationCalendarDay;
  });
}

export function getSeatMapZones(locale: AppLocale, branchId: BranchId) {
  return seatMapDefinitions[branchId].map((zone) => ({
    ...zone,
    label: zone.label[locale],
    vibe: zone.vibe[locale],
  })) satisfies SeatMapZone[];
}

export function getGiftCardOptions(locale: AppLocale) {
  return giftCardDefinitions.map((item) => ({
    id: item.id,
    amount: item.amount,
    title: item.title[locale],
    body: item.body[locale],
    ribbon: item.ribbon[locale],
    accentClass: item.accentClass,
  })) satisfies GiftCardOption[];
}

export function getRewardOptions(locale: AppLocale) {
  return rewardDefinitions.map((item) => ({
    id: item.id,
    points: item.points,
    walletAmount: item.walletAmount,
    title: item.title[locale],
    body: item.body[locale],
    accentClass: item.accentClass,
  })) satisfies RewardOption[];
}

export function getRewardTierSnapshot(locale: AppLocale, currentPoints: number): RewardTierSnapshot {
  const current =
    [...rewardTiers].reverse().find((item) => currentPoints >= item.threshold) ?? rewardTiers[0];
  const next = rewardTiers.find((item) => item.threshold > current.threshold) ?? current;

  return {
    currentTier: current.title[locale],
    currentTierBody: current.body[locale],
    currentPoints,
    nextTier: next.title[locale],
    nextThreshold: next.threshold || Math.max(currentPoints, current.threshold),
    pointsToNext: Math.max(0, (next.threshold || current.threshold) - currentPoints),
  };
}

export function getSetBuilderSections(locale: AppLocale) {
  return setBuilderDefinitions.map((item) => ({
    id: item.id,
    title: item.title[locale],
    body: item.body[locale],
    dishIds: item.dishIds,
  })) satisfies SetBuilderSection[];
}

export function getCateringPackages(locale: AppLocale) {
  return cateringDefinitions.map((item) => ({
    id: item.id,
    title: item.title[locale],
    body: item.body[locale],
    guestRange: item.guestRange[locale],
    pricePerGuest: item.pricePerGuest,
    leadTime: item.leadTime[locale],
    dishIds: item.dishIds,
    serviceStyles: item.serviceStyles.map((style) => style[locale]),
    accentClass: item.accentClass,
  })) satisfies CateringPackage[];
}

export function getLocalizedBuilderDishes(locale: AppLocale, ids: string[]) {
  const dishes = getLocalizedDishes(locale);
  return ids
    .map((id) => dishes.find((dish) => dish.id === id))
    .filter((dish): dish is NonNullable<typeof dish> => Boolean(dish));
}

export function getUpsellSuggestions(locale: AppLocale, dishIds: string[]) {
  const allDishes = getLocalizedDishes(locale);
  const seen = new Set<string>();
  const suggestions: UpsellSuggestion[] = [];

  for (const dishId of dishIds) {
    for (const pairing of upsellDefinitions[dishId] ?? []) {
      if (dishIds.includes(pairing.dishId) || seen.has(pairing.dishId)) {
        continue;
      }

      const dish = allDishes.find((item) => item.id === pairing.dishId);
      if (!dish) {
        continue;
      }

      seen.add(pairing.dishId);
      suggestions.push({
        id: `${dishId}-${pairing.dishId}`,
        dishId: pairing.dishId,
        reason: pairing.reason[locale],
      });
    }
  }

  if (suggestions.length > 0) {
    return suggestions;
  }

  return allDishes
    .filter((dish) => dish.featured && !dishIds.includes(dish.id))
    .slice(0, 2)
    .map((dish) => ({
      id: `fallback-${dish.id}`,
      dishId: dish.id,
      reason:
        locale === "th"
          ? "เมนูเด่นที่ช่วยเติมโต๊ะให้ดูครบขึ้น"
          : locale === "ja"
            ? "テーブル全体を整える定番の追加候補です。"
            : locale === "zh"
              ? "用一道人气菜把整桌补完整。"
              : locale === "ko"
                ? "테이블 구성을 더 완성해 주는 추천 추가 메뉴입니다."
                : "A featured add-on that rounds out the table.",
    }));
}

export function getBranchAvailabilityMatrix(locale: AppLocale, branchId?: BranchId) {
  const branchIds = branchId ? [branchId] : (Object.keys(branchAvailabilityDefinitions) as BranchId[]);

  return branchIds.map((id) => ({
    branch: getLocalizedBranch(locale, id),
    rows: branchAvailabilityDefinitions[id].map((row) => ({
      id: row.id,
      label: row.label[locale],
      dineIn: row.dineIn,
      pickup: row.pickup,
      delivery: row.delivery,
      privateDining: row.privateDining,
    })),
  }));
}

export function getDeliveryMapStops(locale: AppLocale, orderId?: string) {
  const orders = getLocalizedOrders(locale);
  const activeOrder = orders.find((order) => order.id === orderId) ?? orders[0];
  const copy = trackingMapText[locale];

  if (!activeOrder) {
    return [] as DeliveryMapStop[];
  }

  const statusOrder: OrderStatus[] = ["confirmed", "preparing", "ready", "dispatching", "arriving", "completed"];
  const activeIndex = statusOrder.indexOf(activeOrder.status);

  return [
    {
      id: "branch",
      label: `${copy.kitchen} · ${activeOrder.branch.name}`,
      time: activeOrder.placedAt,
      top: 18,
      left: 22,
      active: true,
    },
    {
      id: "ready",
      label: activeOrder.stages[2]?.label ?? activeOrder.stages[1]?.label ?? copy.completed,
      time: activeOrder.stages[2]?.time ?? activeOrder.placedAt,
      top: 34,
      left: 40,
      active: activeIndex >= 2,
    },
    {
      id: "rider",
      label: copy.rider,
      time: activeOrder.stages[3]?.time ?? activeOrder.etaLabel,
      top: 52,
      left: 62,
      active: activeIndex >= 3,
    },
    {
      id: "destination",
      label: copy.destination,
      time: activeOrder.etaLabel,
      top: 70,
      left: 80,
      active: activeIndex >= 4,
    },
  ];
}
