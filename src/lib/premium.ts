import type { AppLocale } from "@/i18n/routing";
import type { BranchId, DietaryTagId } from "@/lib/experience";

type LocalizedText = Record<AppLocale, string>;

export type DishStatusId = "available" | "limited" | "soldOut" | "chefToday";

interface BranchStoryDefinition {
  id: BranchId;
  heroTitle: LocalizedText;
  body: LocalizedText;
  serviceZones: LocalizedText[];
  diningMoments: LocalizedText[];
  privateDining: LocalizedText;
}

interface FestivalDefinition {
  slug: string;
  title: LocalizedText;
  season: LocalizedText;
  body: LocalizedText;
  highlight: LocalizedText;
  dishIds: string[];
}

const branchStories: BranchStoryDefinition[] = [
  {
    id: "bangrak",
    heroTitle: {
      th: "Bangrak Salon ริมน้ำสำหรับสำรับค่ำและห้องรับรองส่วนตัว",
      en: "Bangrak Salon for riverfront dinners and private dining",
      ja: "川沿いの夜席と個室が映える Bangrak Salon",
      zh: "适合河畔晚餐与包厢聚会的 Bangrak Salon",
      ko: "리버프런트 디너와 프라이빗 다이닝에 강한 Bangrak Salon",
    },
    body: {
      th: "สาขานี้เน้นดินเนอร์บรรยากาศนิ่ง หรู และเหมาะกับการรับรองแขกหรือฉลองช่วงค่ำ",
      en: "This branch is composed around calm, luxurious evening dining and elegant hosting.",
      ja: "静かで上質な夜の食事と接待利用に向いた店舗です。",
      zh: "这家门店偏向安静、雅致的晚餐氛围与正式接待场景。",
      ko: "차분하고 고급스러운 저녁 식사와 호스팅에 맞춘 지점입니다.",
    },
    serviceZones: [
      {
        th: "สีลม สาทร บางรัก ริเวอร์ฟรอนต์",
        en: "Silom, Sathorn, Bangrak riverfront",
        ja: "シーロム、サトーン、バンラック周辺",
        zh: "Silom、Sathorn、Bangrak 河岸区域",
        ko: "실롬, 사톤, 방락 리버프런트",
      },
    ],
    diningMoments: [
      {
        th: "ดินเนอร์คู่และงานฉลองแบบส่วนตัว",
        en: "Date nights and private celebrations",
        ja: "デート利用とプライベートなお祝い",
        zh: "约会晚餐与私密庆祝",
        ko: "데이트와 프라이빗 기념일",
      },
      {
        th: "รับรองแขกต่างประเทศ",
        en: "International guest hosting",
        ja: "海外ゲストの接待",
        zh: "国际客人接待",
        ko: "해외 고객 접대",
      },
    ],
    privateDining: {
      th: "รองรับห้องรับรองส่วนตัว 12-18 ท่าน",
      en: "Private dining for 12-18 guests",
      ja: "12〜18名向け個室ダイニング",
      zh: "可承接 12-18 位包厢用餐",
      ko: "12-18인 프라이빗 다이닝 가능",
    },
  },
  {
    id: "sukhumvit",
    heroTitle: {
      th: "Sukhumvit House สำหรับเคาน์เตอร์ชิมเมนูและการรับอาหารที่รวดเร็ว",
      en: "Sukhumvit House for tasting counter nights and fast pickup",
      ja: "テイスティングカウンターと受取導線が強い Sukhumvit House",
      zh: "适合主厨吧台体验与快速自取的 Sukhumvit House",
      ko: "테이스팅 카운터와 빠른 픽업에 강한 Sukhumvit House",
    },
    body: {
      th: "เหมาะกับลูกค้าที่ต้องการทั้งค่ำคืนแบบเชฟเทเบิลและการรับอาหารกลับที่คล่องตัว",
      en: "Designed for guests who want both chef-led tasting moments and smooth order-ahead pickup.",
      ja: "シェフ体験とスムーズな受取動線の両方を重視するゲスト向けです。",
      zh: "适合既想体验主厨吧台又重视高效自取流程的客人。",
      ko: "셰프 체험과 빠른 픽업 흐름을 함께 원하는 고객에게 맞춘 지점입니다.",
    },
    serviceZones: [
      {
        th: "พร้อมพงษ์ ทองหล่อ เอกมัย อโศก",
        en: "Phrom Phong, Thonglor, Ekkamai, Asok",
        ja: "プロンポン、トンロー、エカマイ、アソーク",
        zh: "Phrom Phong、Thonglor、Ekkamai、Asok",
        ko: "프롬퐁, 통로, 에까마이, 아속",
      },
    ],
    diningMoments: [
      {
        th: "เคาน์เตอร์เชฟและชุดชิมเมนู",
        en: "Chef counter tasting menus",
        ja: "シェフカウンターとテイスティング",
        zh: "主厨吧台与品鉴套餐",
        ko: "셰프 카운터와 테이스팅 메뉴",
      },
      {
        th: "รับอาหารกลับหลังเลิกงาน",
        en: "After-work pickup",
        ja: "仕事帰りの受取",
        zh: "下班后自取",
        ko: "퇴근 후 픽업",
      },
    ],
    privateDining: {
      th: "ห้องส่วนตัวขนาด 8-12 ท่าน",
      en: "Private room for 8-12 guests",
      ja: "8〜12名向け個室",
      zh: "可容纳 8-12 位客人的私享空间",
      ko: "8-12인 프라이빗 룸",
    },
  },
  {
    id: "chiangmai",
    heroTitle: {
      th: "Lanna Pavilion สำหรับเมนูเหนือ สวนสงบ และของหวานตามฤดูกาล",
      en: "Lanna Pavilion for northern plates, calm gardens, and seasonal desserts",
      ja: "北部料理と庭席が魅力の Lanna Pavilion",
      zh: "主打北部风味、花园座位与季节甜品的 Lanna Pavilion",
      ko: "북부 메뉴와 가든 좌석이 매력적인 Lanna Pavilion",
    },
    body: {
      th: "สาขานี้เหมาะกับมื้อกลางวันช้า ๆ การนั่งสวน และประสบการณ์ขนมไทยแบบภาคเหนือ",
      en: "This branch leans into slower lunches, garden dining, and northern dessert moments.",
      ja: "ゆったりした昼食、ガーデン席、北部由来の甘味体験が映える店舗です。",
      zh: "这家门店更适合悠闲午餐、花园座位与北部甜品体验。",
      ko: "느긋한 점심, 가든 좌석, 북부 디저트 경험에 어울리는 지점입니다.",
    },
    serviceZones: [
      {
        th: "นิมมาน สุเทพ เมืองเชียงใหม่",
        en: "Nimman, Suthep, Chiang Mai old town",
        ja: "ニマン、ステープ、チェンマイ旧市街",
        zh: "Nimman、Suthep、清迈古城区",
        ko: "님만, 수텝, 치앙마이 올드타운",
      },
    ],
    diningMoments: [
      {
        th: "มื้อกลางวันแบบสบายแต่พรีเมียม",
        en: "Relaxed but premium lunches",
        ja: "ゆったりした上質ランチ",
        zh: "轻松但精致的午餐场景",
        ko: "여유롭지만 고급스러운 런치",
      },
      {
        th: "ของหวานและน้ำชายามบ่ายแบบไทย",
        en: "Dessert and Thai afternoon tea",
        ja: "デザートとタイ式アフタヌーンティー",
        zh: "泰式下午茶与甜品体验",
        ko: "디저트와 태국식 애프터눈 티",
      },
    ],
    privateDining: {
      th: "รองรับการชิมแบบส่วนตัว 10 ท่าน",
      en: "Private tasting room for 10 guests",
      ja: "10名向けプライベートテイスティング",
      zh: "可承接 10 位私享品鉴",
      ko: "10인 프라이빗 테이스팅 룸",
    },
  },
];

const festivals: FestivalDefinition[] = [
  {
    slug: "songkran",
    title: {
      th: "สำรับสวนรับสงกรานต์",
      en: "Songkran Garden Supper",
      ja: "ソンクラーン・ガーデンサパー",
      zh: "宋干花园晚宴",
      ko: "송끄란 가든 서퍼",
    },
    season: {
      th: "เทศกาลสงกรานต์",
      en: "Songkran Festival",
      ja: "ソンクラーン",
      zh: "宋干节",
      ko: "송끄란",
    },
    body: {
      th: "สำรับเย็นรับหน้าร้อน เน้นจานสดชื่น สมุนไพรใส และของหวานน้ำแข็งกะทิ",
      en: "A warm-season Thai supper built around herbs, cooling spice, and coconut sweets.",
      ja: "涼感あるハーブ、軽やかな辛味、ココナッツ甘味を主役にした季節企画です。",
      zh: "以清爽香草、轻盈辛香与椰香甜品为核心的热季限定企划。",
      ko: "허브의 상쾌함과 코코넛 디저트를 중심으로 한 더운 계절 한정 기획입니다.",
    },
    highlight: {
      th: "มีการจัดโต๊ะพิเศษโทนดอกบัวและทองอ่อน",
      en: "Features a lotus-toned table setting and seasonal set menu pairings.",
      ja: "ロータスを思わせる卓上演出と季節セットを用意します。",
      zh: "搭配莲花意象桌面陈设与节令套餐。",
      ko: "연꽃 톤 테이블 세팅과 시즌 세트 구성을 함께 제공합니다.",
    },
    dishIds: ["green-mango-salad", "central-massaman-lamb", "palm-sugar-coconut-ice"],
  },
  {
    slug: "loy-krathong",
    title: {
      th: "สำรับค่ำคืนลอยกระทง",
      en: "Loy Krathong Night Table",
      ja: "ロイクラトン・ナイトテーブル",
      zh: "水灯夜宴餐桌",
      ko: "러이끄라통 나이트 테이블",
    },
    season: {
      th: "เทศกาลลอยกระทง",
      en: "Loy Krathong",
      ja: "ロイクラトン",
      zh: "水灯节",
      ko: "러이끄라통",
    },
    body: {
      th: "มื้อค่ำที่ใช้แสงเทียน ดอกไม้ และสำรับภาคกลางกับของหวานโทนมะพร้าว",
      en: "An evening collection built around candlelit dining, central Thai plates, and floral desserts.",
      ja: "灯り、花、中央タイ料理、優しい甘味を軸にした夜の企画です。",
      zh: "以烛光用餐、中部风味与花香甜点为核心的节庆晚宴。",
      ko: "촛불, 꽃, 중부 요리, 디저트로 구성한 저녁 페스티벌 컬렉션입니다.",
    },
    highlight: {
      th: "เหมาะกับคู่รักและจองโต๊ะล่วงหน้า",
      en: "Ideal for date-night reservations and premium tasting bookings.",
      ja: "デート利用や事前予約に最適です。",
      zh: "适合情侣预约与提前订位。",
      ko: "데이트 예약과 프리미엄 좌석 예약에 적합합니다.",
    },
    dishIds: ["royal-tom-yum", "central-crab-omelette", "mango-sticky-cloud"],
  },
];

const dishStatusMap: Record<string, DishStatusId> = {
  "royal-tom-yum": "chefToday",
  "fire-basil-wagyu": "limited",
  "southern-roti-mataba": "soldOut",
  "palm-sugar-coconut-ice": "chefToday",
  "central-crab-omelette": "limited",
};

const dishStatusLabels: Record<DishStatusId, { label: LocalizedText; className: string }> = {
  available: {
    label: {
      th: "พร้อมสั่ง",
      en: "available",
      ja: "提供中",
      zh: "可点",
      ko: "주문 가능",
    },
    className: "border-white/10 bg-white/5 text-white",
  },
  limited: {
    label: {
      th: "เหลือจำกัด",
      en: "limited",
      ja: "残りわずか",
      zh: "限量",
      ko: "한정 수량",
    },
    className: "border-amber-400/20 bg-amber-400/10 text-amber-100",
  },
  soldOut: {
    label: {
      th: "หมดชั่วคราว",
      en: "sold out",
      ja: "一時完売",
      zh: "暂时售罄",
      ko: "일시 품절",
    },
    className: "border-rose-400/20 bg-rose-400/10 text-rose-100",
  },
  chefToday: {
    label: {
      th: "เชฟแนะนำวันนี้",
      en: "chef today",
      ja: "本日のおすすめ",
      zh: "今日主厨推荐",
      ko: "오늘의 셰프 추천",
    },
    className: "border-[#d6b26a]/20 bg-[#d6b26a]/10 text-[#f4e4ba]",
  },
};

const quizDietaryMap: Record<Exclude<DietaryTagId, "signature" | "sweet" | "grill">, string[]> = {
  vegetarian: ["mango-sticky-cloud", "palm-sugar-coconut-ice"],
  seafood: ["royal-tom-yum", "river-prawn-rice", "central-crab-omelette"],
  containsNuts: ["charcoal-pad-thai"],
  spicy: ["royal-tom-yum", "kua-kling-beef", "fire-basil-wagyu"],
  halalFriendly: ["southern-roti-mataba", "roti-kaya"],
};

function resolveText(text: LocalizedText, locale: AppLocale) {
  return text[locale] ?? text.en ?? text.th;
}

export function getBranchStory(locale: AppLocale, branchId: BranchId) {
  const story = branchStories.find((item) => item.id === branchId) ?? branchStories[0];

  return {
    id: story.id,
    heroTitle: resolveText(story.heroTitle, locale),
    body: resolveText(story.body, locale),
    serviceZones: story.serviceZones.map((item) => resolveText(item, locale)),
    diningMoments: story.diningMoments.map((item) => resolveText(item, locale)),
    privateDining: resolveText(story.privateDining, locale),
  };
}

export function getAllBranchStories(locale: AppLocale) {
  return branchStories.map((story) => getBranchStory(locale, story.id));
}

export function getFestivals(locale: AppLocale) {
  return festivals.map((festival) => ({
    slug: festival.slug,
    title: resolveText(festival.title, locale),
    season: resolveText(festival.season, locale),
    body: resolveText(festival.body, locale),
    highlight: resolveText(festival.highlight, locale),
    dishIds: festival.dishIds,
  }));
}

export function getDishStatus(locale: AppLocale, dishId: string) {
  const status = dishStatusMap[dishId] ?? "available";
  const descriptor = dishStatusLabels[status];

  return {
    id: status,
    label: resolveText(descriptor.label, locale),
    className: descriptor.className,
  };
}

export function getDishIdsForQuiz(dietary: Exclude<DietaryTagId, "signature" | "sweet" | "grill"> | "none") {
  if (dietary === "none") {
    return [];
  }

  return quizDietaryMap[dietary] ?? [];
}
