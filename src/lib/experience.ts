import type { AppLocale } from "@/i18n/routing";
import { getLocalizedDish, getLocalizedDishes, type RegionId } from "@/lib/catalog";

type LocalizedText = Record<AppLocale, string>;

export type BranchId = "bangrak" | "sukhumvit" | "chiangmai";
export type ServiceMode = "delivery" | "pickup";
export type PromoCode = "GOLD15" | "SIAM120" | "TASTING10";
export type DietaryTagId =
  | "vegetarian"
  | "seafood"
  | "containsNuts"
  | "signature"
  | "spicy"
  | "sweet"
  | "grill"
  | "halalFriendly";
export type OrderStatus = "confirmed" | "preparing" | "ready" | "dispatching" | "arriving" | "completed";

interface BranchDefinition {
  id: BranchId;
  name: LocalizedText;
  neighborhood: LocalizedText;
  address: LocalizedText;
  hours: LocalizedText;
  phone: string;
  features: LocalizedText[];
  etaMinutes: [number, number];
}

interface FeatureLinkDefinition {
  id: string;
  href: string;
  eyebrow: LocalizedText;
  title: LocalizedText;
  description: LocalizedText;
  accentClass: string;
}

interface SpecialDefinition {
  id: string;
  season: LocalizedText;
  title: LocalizedText;
  description: LocalizedText;
  serves: LocalizedText;
  highlight: LocalizedText;
  dishIds: string[];
  price: number;
  accentClass: string;
}

interface TestimonialDefinition {
  id: string;
  name: string;
  role: LocalizedText;
  quote: LocalizedText;
}

interface FaqDefinition {
  id: string;
  question: LocalizedText;
  answer: LocalizedText;
}

interface NotificationDefinition {
  id: string;
  title: LocalizedText;
  body: LocalizedText;
  time: LocalizedText;
}

interface DishReviewDefinition {
  id: string;
  dishId: string;
  guest: string;
  region: LocalizedText;
  body: LocalizedText;
  rating: number;
}

interface OrderDefinition {
  id: string;
  branchId: BranchId;
  serviceMode: ServiceMode;
  status: OrderStatus;
  etaLabel: LocalizedText;
  placedAt: LocalizedText;
  code: string;
  itemLines: Array<{ dishId: string; quantity: number }>;
  stages: Array<{
    id: OrderStatus;
    label: LocalizedText;
    time: LocalizedText;
  }>;
}

interface LoyaltyTierDefinition {
  id: string;
  title: LocalizedText;
  description: LocalizedText;
  threshold: number;
}

interface PromoDefinition {
  code: PromoCode;
  title: LocalizedText;
  description: LocalizedText;
  minimumSubtotal: number;
  kind: "percent" | "amount";
  value: number;
}

const featureLinks: FeatureLinkDefinition[] = [
  {
    id: "specials",
    href: "/specials",
    eyebrow: {
      th: "ชุดที่เชฟคัดสรร",
      en: "chef curation",
      ja: "シェフキュレーション",
      zh: "主厨策选",
      ko: "셰프 큐레이션",
    },
    title: {
      th: "ชุดอาหารและเมนูพิเศษ",
      en: "Set Menus & Seasonal Specials",
      ja: "セットメニューと季節限定",
      zh: "套餐与季节限定",
      ko: "세트 메뉴와 시즌 스페셜",
    },
    description: {
      th: "สำรับแชร์ ดินเนอร์คัดสรร และเมนูตามฤดูกาลในโทนร้านหรู",
      en: "Curated tasting sets, sharing menus, and seasonal Thai highlights.",
      ja: "コース仕立てのセットと季節のタイ料理を上品に紹介します。",
      zh: "提供可分享套餐、品鉴菜单与季节限定泰式料理。",
      ko: "공유 세트, 테이스팅 코스, 시즌 한정 메뉴를 한곳에 정리했습니다.",
    },
    accentClass: "from-[#6c1c23]/90 via-[#25100f]/80 to-[#0e0908]/95",
  },
  {
    id: "build-set",
    href: "/build-a-set",
    eyebrow: {
      th: "จัดสำรับเอง",
      en: "custom set",
      ja: "カスタムセット",
      zh: "自选套餐",
      ko: "커스텀 세트",
    },
    title: {
      th: "จัดชุดอาหารด้วยตัวเอง",
      en: "Build Your Own Set",
      ja: "自分のセットを作る",
      zh: "自选套餐",
      ko: "나만의 세트 만들기",
    },
    description: {
      th: "เลือกจานเปิด จานหลัก และของหวาน แล้วโยนลงตะกร้าเป็นชุดเดียว",
      en: "Compose a Thai set with an opener, main, and dessert in one flow.",
      ja: "前菜、主菜、甘味をまとめてセット化できます。",
      zh: "从开胃菜、主菜和甜品中组合一整套。",
      ko: "스타터, 메인, 디저트를 골라 한 번에 세트로 담습니다.",
    },
    accentClass: "from-[#17483a]/92 via-[#152620]/82 to-[#0d0d0d]/95",
  },
  {
    id: "gift-cards",
    href: "/gift-cards",
    eyebrow: {
      th: "ส่งต่อเครดิต",
      en: "gifting",
      ja: "ギフト",
      zh: "送礼",
      ko: "기프팅",
    },
    title: {
      th: "บัตรของขวัญ",
      en: "Gift Cards",
      ja: "ギフトカード",
      zh: "礼品卡",
      ko: "기프트 카드",
    },
    description: {
      th: "เลือกเครดิตของขวัญสำหรับมื้อพรีเมียมและเพิ่มเข้ากระเป๋าลูกค้า",
      en: "Purchase premium dining balances and move them into the guest wallet.",
      ja: "上質な食事ギフトをウォレットへ追加できます。",
      zh: "购买高级晚宴礼卡并加入顾客钱包。",
      ko: "프리미엄 다이닝 기프트 밸런스를 월렛에 추가합니다.",
    },
    accentClass: "from-[#6d4c1f]/92 via-[#26180f]/82 to-[#0d0b09]/95",
  },
  {
    id: "rewards",
    href: "/rewards",
    eyebrow: {
      th: "แลกแต้ม",
      en: "loyalty",
      ja: "ポイント交換",
      zh: "积分兑换",
      ko: "리워드",
    },
    title: {
      th: "สิทธิพิเศษและการแลกแต้ม",
      en: "Rewards & Redemptions",
      ja: "特典と交換",
      zh: "奖励与兑换",
      ko: "리워드 및 교환",
    },
    description: {
      th: "ดูระดับสมาชิกและแลกเครดิตสำหรับมื้อถัดไป",
      en: "Redeem loyalty points into usable dining wallet credits.",
      ja: "会員ポイントを次回使えるクレジットへ変換します。",
      zh: "把会员积分兑换成可用钱包额度。",
      ko: "포인트를 다음 식사에 쓸 수 있는 크레딧으로 교환합니다.",
    },
    accentClass: "from-[#521823]/92 via-[#231111]/82 to-[#0c0d0d]/95",
  },
  {
    id: "catering",
    href: "/catering",
    eyebrow: {
      th: "งานเลี้ยงและอีเวนต์",
      en: "hosting",
      ja: "イベント構成",
      zh: "宴会策划",
      ko: "호스팅",
    },
    title: {
      th: "ตัวจัดชุดงานเลี้ยง",
      en: "Catering Builder",
      ja: "ケータリング構成",
      zh: "宴会构建器",
      ko: "케이터링 빌더",
    },
    description: {
      th: "เลือกแพ็กเกจกลุ่มใหญ่ จำนวนแขก และสไตล์เสิร์ฟสำหรับงานพิเศษ",
      en: "Plan larger-format hosting packages, guest counts, and service styles.",
      ja: "大人数向けの構成、人数、提供形式をまとめて設計します。",
      zh: "规划大人数套餐、宾客规模与服务形式。",
      ko: "대규모 패키지와 인원, 서비스 스타일을 한 번에 설계합니다.",
    },
    accentClass: "from-[#183b4b]/92 via-[#132025]/82 to-[#0c0d0d]/95",
  },
  {
    id: "reservation",
    href: "/reservation",
    eyebrow: {
      th: "โต๊ะรับรอง",
      en: "tableside",
      ja: "テーブル予約案内",
      zh: "餐桌礼遇",
      ko: "테이블 안내",
    },
    title: {
      th: "จองโต๊ะล่วงหน้า",
      en: "Reserve a Table",
      ja: "テーブル予約",
      zh: "预订餐桌",
      ko: "테이블 예약",
    },
    description: {
      th: "เลือกสาขา จำนวนแขก โอกาสพิเศษ และช่วงเวลาแบบร้านจริง",
      en: "Choose branch, party size, occasion, and seating preferences.",
      ja: "支店、人数、利用シーン、席の希望まで選べる予約画面です。",
      zh: "可选择分店、人数、场合与座位偏好的预约界面。",
      ko: "지점, 인원, 방문 목적, 좌석 취향까지 선택하는 예약 화면입니다.",
    },
    accentClass: "from-[#184738]/92 via-[#132520]/82 to-[#0b0d0c]/95",
  },
  {
    id: "tracking",
    href: "/tracking",
    eyebrow: {
      th: "สถานะสด",
      en: "live order",
      ja: "注文ライブ",
      zh: "实时订单",
      ko: "실시간 주문",
    },
    title: {
      th: "ติดตามคำสั่งซื้อ",
      en: "Track Your Order",
      ja: "注文追跡",
      zh: "订单追踪",
      ko: "주문 추적",
    },
    description: {
      th: "ดูเวลาโดยประมาณ สาขาที่รับผิดชอบ และลำดับขั้นของออเดอร์ในตัวอย่างติดตามคำสั่งซื้อ",
      en: "Live-style status, ETA, branch handoff, and progress timeline.",
      ja: "到着予定時刻、担当店舗、進行状況を追えるトラッキング画面です。",
      zh: "查看预计到达时间、负责门店与订单阶段时间线。",
      ko: "예상 도착 시간, 담당 지점, 진행 단계를 한 화면에서 확인할 수 있습니다.",
    },
    accentClass: "from-[#5b4120]/92 via-[#24170f]/82 to-[#0b0908]/95",
  },
  {
    id: "favorites",
    href: "/favorites",
    eyebrow: {
      th: "รายการโปรด",
      en: "wishlist",
      ja: "ウィッシュリスト",
      zh: "心愿清单",
      ko: "위시리스트",
    },
    title: {
      th: "เมนูโปรดของคุณ",
      en: "Favorites & Wishlist",
      ja: "お気に入り",
      zh: "收藏心愿单",
      ko: "즐겨찾기",
    },
    description: {
      th: "บันทึกจานที่อยากสั่งซ้ำ แล้วดึงกลับเข้าตะกร้าได้เร็วขึ้น",
      en: "Save dishes you want to reorder and bring them back faster.",
      ja: "また食べたい料理を保存し、すばやく再注文できます。",
      zh: "保存想再次点的菜品，之后可快速加入购物车。",
      ko: "다시 주문하고 싶은 메뉴를 저장해 빠르게 장바구니로 가져옵니다.",
    },
    accentClass: "from-[#5d1c39]/92 via-[#241018]/82 to-[#0d090b]/95",
  },
  {
    id: "account",
    href: "/account",
    eyebrow: {
      th: "โปรไฟล์แขก",
      en: "guest profile",
      ja: "ゲストプロフィール",
      zh: "宾客档案",
      ko: "게스트 프로필",
    },
    title: {
      th: "บัญชีและสะสมแต้ม",
      en: "Account, Orders & Loyalty",
      ja: "アカウント・履歴・特典",
      zh: "账户、订单与会员",
      ko: "계정, 주문, 멤버십",
    },
    description: {
      th: "โปรไฟล์ ที่อยู่เดิม ประวัติออเดอร์ แต้ม และการแจ้งเตือนในที่เดียว",
      en: "Profile, saved details, order history, points, and notifications.",
      ja: "プロフィール、保存情報、注文履歴、ポイント、通知を一画面に。",
      zh: "整合资料、历史订单、积分与通知中心。",
      ko: "프로필, 저장 주소, 주문 내역, 포인트, 알림을 한곳에 모았습니다.",
    },
    accentClass: "from-[#142c4f]/92 via-[#121821]/82 to-[#0b0c10]/95",
  },
  {
    id: "contact",
    href: "/contact",
    eyebrow: {
      th: "ทีมบริการร้าน",
      en: "house service",
      ja: "ハウスサービス",
      zh: "门店服务",
      ko: "하우스 서비스",
    },
    title: {
      th: "ติดต่อร้านและสาขา",
      en: "Contact & Locations",
      ja: "連絡先と店舗案内",
      zh: "联系与门店位置",
      ko: "연락처와 지점 안내",
    },
    description: {
      th: "ข้อมูลสาขา เบอร์โทร เวลาเปิดปิด และพื้นที่จัดส่งแบบพร้อมใช้งาน",
      en: "Branches, hours, phones, service zones, and location guidance.",
      ja: "店舗情報、営業時間、配送エリア、連絡先をまとめました。",
      zh: "查看分店、营业时间、联系电话与配送范围。",
      ko: "지점 정보, 운영 시간, 배송 권역, 연락처를 확인할 수 있습니다.",
    },
    accentClass: "from-[#17403a]/92 via-[#111f1d]/82 to-[#090b0b]/95",
  },
  {
    id: "reviews",
    href: "/reviews",
    eyebrow: {
      th: "เสียงจากแขก",
      en: "guest notes",
      ja: "ゲストノート",
      zh: "食客笔记",
      ko: "게스트 노트",
    },
    title: {
      th: "รีวิวและเสียงจากแขก",
      en: "Reviews & Guest Notes",
      ja: "レビューとゲストの声",
      zh: "点评与食客笔记",
      ko: "리뷰와 게스트 노트",
    },
    description: {
      th: "รวมรีวิวลูกค้า คะแนนเมนู และมุมมองจากแขกหลายกลุ่มในหน้าเดียว",
      en: "A review hub with dish ratings, testimonials, and guest perspectives in one place.",
      ja: "料理ごとの評価、レビュー、ゲストの声をまとめた専用ページです。",
      zh: "集中展示菜品评分、顾客评价与不同客群反馈的评论中心。",
      ko: "메뉴 평점, 후기, 고객 의견을 한곳에 모은 리뷰 허브입니다.",
    },
    accentClass: "from-[#50341e]/92 via-[#1f140d]/82 to-[#090807]/95",
  },
  {
    id: "festivals",
    href: "/festivals",
    eyebrow: {
      th: "เทศกาลไทย",
      en: "thai festivals",
      ja: "タイ祝祭",
      zh: "泰国节庆",
      ko: "태국 축제",
    },
    title: {
      th: "แคมเปญเทศกาลไทย",
      en: "Festival Campaigns",
      ja: "タイ祝祭キャンペーン",
      zh: "泰国节庆企划",
      ko: "태국 축제 캠페인",
    },
    description: {
      th: "หน้าฤดูกาลสำหรับสงกรานต์ ลอยกระทง และช่วงพิเศษอื่น ๆ ในโทนพรีเมียม",
      en: "Premium landing pages for Songkran, Loy Krathong, and seasonal Thai moments.",
      ja: "ソンクラーンやロイクラトン向けの季節キャンペーンページです。",
      zh: "为宋干节、水灯节与节令主题打造的高端活动页面。",
      ko: "송끄란, 러이끄라통 등 시즌 행사용 프리미엄 랜딩입니다.",
    },
    accentClass: "from-[#5d1f30]/92 via-[#241019]/82 to-[#0d090b]/95",
  },
  {
    id: "quiz",
    href: "/quiz",
    eyebrow: {
      th: "ตัวช่วยอัจฉริยะ",
      en: "smart guide",
      ja: "スマートガイド",
      zh: "智能向导",
      ko: "스마트 가이드",
    },
    title: {
      th: "แบบเลือกเมนูอัจฉริยะ",
      en: "Recommendation Quiz",
      ja: "おすすめクイズ",
      zh: "智能推荐测验",
      ko: "추천 퀴즈",
    },
    description: {
      th: "ช่วยลูกค้าเลือกเมนูตามอารมณ์ ความเผ็ด และข้อจำกัดด้านอาหาร",
      en: "Guide guests by mood, spice level, and dietary focus to a tighter set of dishes.",
      ja: "気分、辛さ、食事条件から料理を絞り込む案内フローです。",
      zh: "根据心情、辣度与饮食偏好推荐更合适的菜品组合。",
      ko: "기분, 매운맛, 식단 조건에 맞춰 메뉴를 좁혀 주는 흐름입니다.",
    },
    accentClass: "from-[#1b4254]/92 via-[#111b24]/82 to-[#090b0d]/95",
  },
  {
    id: "private-dining",
    href: "/private-dining",
    eyebrow: {
      th: "งานพิเศษ",
      en: "events",
      ja: "イベント案内",
      zh: "活动咨询",
      ko: "이벤트",
    },
    title: {
      th: "ห้องส่วนตัวและจัดเลี้ยง",
      en: "Private Dining & Catering",
      ja: "個室利用とケータリング",
      zh: "包厢与宴会咨询",
      ko: "프라이빗 다이닝 & 케이터링",
    },
    description: {
      th: "หน้าแบบฟอร์มสำหรับห้องส่วนตัว งานรับรองลูกค้า งานฉลอง และเชฟเทเบิล",
      en: "Inquiry flow for private rooms, hosted dinners, celebrations, and chef-table events.",
      ja: "個室、接待、祝宴、シェフズテーブル向け問い合わせ導線です。",
      zh: "面向包厢、商务宴请、庆典与主厨餐桌的咨询页面。",
      ko: "프라이빗 룸, 비즈니스 다이닝, 기념 행사, 셰프 테이블 문의 흐름입니다.",
    },
    accentClass: "from-[#3e203d]/92 via-[#180d18]/82 to-[#090709]/95",
  },
  {
    id: "help",
    href: "/help",
    eyebrow: {
      th: "ช่วยเหลือ",
      en: "support",
      ja: "サポート",
      zh: "支持中心",
      ko: "지원",
    },
    title: {
      th: "ศูนย์ช่วยเหลือ",
      en: "Help Center & FAQ",
      ja: "ヘルプセンター",
      zh: "帮助中心",
      ko: "도움말 센터",
    },
    description: {
      th: "รวมคำถามที่พบบ่อย เรื่องแพ้อาหาร วิธีรับสินค้า และการใช้งานเว็บไซต์",
      en: "Answers for orders, allergens, pickups, reservations, and vouchers.",
      ja: "注文、アレルゲン、受取、予約、特典に関するよくある質問を掲載。",
      zh: "集中解答订单、过敏原、自取、预订与优惠券问题。",
      ko: "주문, 알레르기, 픽업, 예약, 바우처 관련 자주 묻는 질문을 제공합니다.",
    },
    accentClass: "from-[#48321c]/92 via-[#1e140d]/82 to-[#090807]/95",
  },
];

const branches: BranchDefinition[] = [
  {
    id: "bangrak",
    name: {
      th: "Siam Lux Bangrak Salon",
      en: "Siam Lux Bangrak Salon",
      ja: "Siam Lux Bangrak Salon",
      zh: "Siam Lux Bangrak Salon",
      ko: "Siam Lux Bangrak Salon",
    },
    neighborhood: {
      th: "บางรัก ริเวอร์ฟรอนต์",
      en: "Bangrak Riverfront",
      ja: "バンラック リバーフロント",
      zh: "曼谷挽叻河岸",
      ko: "방락 리버프런트",
    },
    address: {
      th: "98 ถ.เจริญกรุง แขวงบางรัก กรุงเทพฯ",
      en: "98 Charoen Krung Rd, Bangrak, Bangkok",
      ja: "バンコク バンラック地区 Charoen Krung Rd 98",
      zh: "曼谷 Bangrak 区 Charoen Krung 路 98 号",
      ko: "방콕 Bangrak Charoen Krung Rd 98",
    },
    hours: {
      th: "11:00 - 23:00 ทุกวัน",
      en: "11:00 - 23:00 daily",
      ja: "毎日 11:00 - 23:00",
      zh: "每日 11:00 - 23:00",
      ko: "매일 11:00 - 23:00",
    },
    phone: "+66 2 118 4500",
    features: [
      {
        th: "ห้องรับรองส่วนตัว 3 ห้อง",
        en: "3 private dining salons",
        ja: "個室ダイニング 3 室",
        zh: "3 间包厢",
        ko: "프라이빗 다이닝 룸 3개",
      },
      {
        th: "ส่งเดลิเวอรีรวดเร็วในย่านธุรกิจใจกลางเมือง",
        en: "Fast CBD delivery coverage",
        ja: "都心業務エリアへの高速デリバリー",
        zh: "覆盖核心商务区的快速配送",
        ko: "도심 업무 지구 빠른 배송",
      },
    ],
    etaMinutes: [28, 38],
  },
  {
    id: "sukhumvit",
    name: {
      th: "Siam Lux Sukhumvit House",
      en: "Siam Lux Sukhumvit House",
      ja: "Siam Lux Sukhumvit House",
      zh: "Siam Lux Sukhumvit House",
      ko: "Siam Lux Sukhumvit House",
    },
    neighborhood: {
      th: "สุขุมวิท พร้อมพงษ์",
      en: "Sukhumvit Phrom Phong",
      ja: "スクンビット プロンポン",
      zh: "素坤逸 Phrom Phong",
      ko: "수쿰윗 프롬퐁",
    },
    address: {
      th: "22 ซ.สุขุมวิท 39 เขตวัฒนา กรุงเทพฯ",
      en: "22 Sukhumvit 39, Watthana, Bangkok",
      ja: "バンコク Watthana 区 Sukhumvit 39 22",
      zh: "曼谷 Watthana 区 Sukhumvit 39 22 号",
      ko: "방콕 Watthana Sukhumvit 39 22",
    },
    hours: {
      th: "11:30 - 23:30 ทุกวัน",
      en: "11:30 - 23:30 daily",
      ja: "毎日 11:30 - 23:30",
      zh: "每日 11:30 - 23:30",
      ko: "매일 11:30 - 23:30",
    },
    phone: "+66 2 118 4522",
    features: [
      {
        th: "เคาน์เตอร์ชิมเมนูของเชฟ",
        en: "Chef tasting counter",
        ja: "シェフズテイスティングカウンター",
        zh: "主厨品鉴吧台",
        ko: "셰프 테이스팅 카운터",
      },
      {
        th: "เหมาะกับรับเองและดินเนอร์คู่",
        en: "Best for pickup and date nights",
        ja: "テイクアウトとデート利用に最適",
        zh: "适合自取与双人晚餐",
        ko: "픽업과 데이트 디너에 적합",
      },
    ],
    etaMinutes: [22, 32],
  },
  {
    id: "chiangmai",
    name: {
      th: "Siam Lux Lanna Pavilion",
      en: "Siam Lux Lanna Pavilion",
      ja: "Siam Lux Lanna Pavilion",
      zh: "Siam Lux Lanna Pavilion",
      ko: "Siam Lux Lanna Pavilion",
    },
    neighborhood: {
      th: "เชียงใหม่ นิมมาน",
      en: "Chiang Mai Nimman",
      ja: "チェンマイ ニマン",
      zh: "清迈 Nimman",
      ko: "치앙마이 님만",
    },
    address: {
      th: "17 ถ.นิมมานเหมินท์ ซ.5 อ.เมือง เชียงใหม่",
      en: "17 Nimmanhaemin Soi 5, Chiang Mai",
      ja: "チェンマイ Nimmanhaemin Soi 5 17",
      zh: "清迈 Nimmanhaemin 巷 5 号 17",
      ko: "치앙마이 Nimmanhaemin Soi 5 17",
    },
    hours: {
      th: "11:00 - 22:30 ทุกวัน",
      en: "11:00 - 22:30 daily",
      ja: "毎日 11:00 - 22:30",
      zh: "每日 11:00 - 22:30",
      ko: "매일 11:00 - 22:30",
    },
    phone: "+66 53 181 909",
    features: [
      {
        th: "เด่นเมนูเหนือและของหวานฤดูกาล",
        en: "Northern specialties and seasonal desserts",
        ja: "北部料理と季節の甘味が充実",
        zh: "北部特色菜与季节甜品",
        ko: "북부 특선과 시즌 디저트 강화",
      },
      {
        th: "มีโซนสวนและห้องชิมเมนูแบบส่วนตัว",
        en: "Garden seats and private tasting room",
        ja: "ガーデン席とプライベートルーム完備",
        zh: "设有花园座位与私享品鉴室",
        ko: "가든 좌석과 프라이빗 룸 제공",
      },
    ],
    etaMinutes: [26, 36],
  },
];

const promoOffers: PromoDefinition[] = [
  {
    code: "GOLD15",
    title: {
      th: "ลด 15% สำหรับสำรับหรู",
      en: "15% off for luxury spreads",
      ja: "上質な注文に 15% オフ",
      zh: "精致餐单 15% 优惠",
      ko: "프리미엄 주문 15% 할인",
    },
    description: {
      th: "ใช้ได้เมื่อยอดอาหารตั้งแต่ ฿1,200",
      en: "Valid on food subtotal over ฿1,200",
      ja: "料理小計 ฿1,200 以上で利用可能",
      zh: "菜品小计满 ฿1,200 可用",
      ko: "음식 소계 ฿1,200 이상 시 사용 가능",
    },
    minimumSubtotal: 1200,
    kind: "percent",
    value: 15,
  },
  {
    code: "SIAM120",
    title: {
      th: "ลดทันที ฿120",
      en: "Instant ฿120 off",
      ja: "その場で ฿120 オフ",
      zh: "立减 ฿120",
      ko: "즉시 ฿120 할인",
    },
    description: {
      th: "ใช้ได้เมื่อยอดอาหารตั้งแต่ ฿900",
      en: "Valid on food subtotal over ฿900",
      ja: "料理小計 ฿900 以上で利用可能",
      zh: "菜品小计满 ฿900 可用",
      ko: "음식 소계 ฿900 이상 시 사용 가능",
    },
    minimumSubtotal: 900,
    kind: "amount",
    value: 120,
  },
  {
    code: "TASTING10",
    title: {
      th: "ลด 10% สำหรับชุดชิมเมนู",
      en: "10% off tasting collections",
      ja: "テイスティングセット 10% オフ",
      zh: "品鉴套餐 10% 优惠",
      ko: "테이스팅 세트 10% 할인",
    },
    description: {
      th: "ใช้ได้เมื่อยอดอาหารตั้งแต่ ฿1,600",
      en: "Valid on food subtotal over ฿1,600",
      ja: "料理小計 ฿1,600 以上で利用可能",
      zh: "菜品小计满 ฿1,600 可用",
      ko: "음식 소계 ฿1,600 이상 시 사용 가능",
    },
    minimumSubtotal: 1600,
    kind: "percent",
    value: 10,
  },
];

const specials: SpecialDefinition[] = [
  {
    id: "royal-evening",
    season: {
      th: "สำรับซิกเนเจอร์",
      en: "signature tasting",
      ja: "シグネチャーテイスティング",
      zh: "招牌品鉴",
      ko: "시그니처 테이스팅",
    },
    title: {
      th: "สำรับค่ำแบบราชสำนัก",
      en: "Royal Evening Tasting",
      ja: "王朝の夕べテイスティング",
      zh: "皇家夜宴品鉴",
      ko: "로열 이브닝 테이스팅",
    },
    description: {
      th: "จับคู่ต้มยำกุ้งหลวง กะเพราเนื้อวากิว และมะม่วงข้าวเหนียวสำหรับดินเนอร์ 2 คน",
      en: "Royal tom yum, fire basil wagyu, and mango sticky finale for two.",
      ja: "ロイヤルトムヤム、和牛ガパオ、マンゴーデザートを二名向けに構成。",
      zh: "为双人准备的御品冬阴功、和牛打抛与芒果糯米甜品组合。",
      ko: "로열 똠얌, 와규 바질 볶음, 망고 디저트로 구성한 2인 코스입니다.",
    },
    serves: {
      th: "เหมาะสำหรับ 2 ท่าน",
      en: "Ideal for 2 guests",
      ja: "2 名に最適",
      zh: "适合 2 位客人",
      ko: "2인 추천",
    },
    highlight: {
      th: "มาพร้อมชาดอกไม้เย็น",
      en: "Includes floral iced tea pairing",
      ja: "フローラルアイスティー付き",
      zh: "附花香冰茶",
      ko: "플로럴 아이스티 포함",
    },
    dishIds: ["royal-tom-yum", "fire-basil-wagyu", "mango-sticky-cloud"],
    price: 1380,
    accentClass: "from-[#6c1e25]/92 via-[#25100f]/82 to-[#0d0908]/95",
  },
  {
    id: "regional-journey",
    season: {
      th: "สำรับเส้นทางรสชาติ",
      en: "regional journey",
      ja: "リージョナルジャーニー",
      zh: "地域风味之旅",
      ko: "리저널 저니",
    },
    title: {
      th: "สำรับเส้นทางรสชาติไทย",
      en: "Regional Journey Samrub",
      ja: "地域の味を巡るサムラップ",
      zh: "泰国地域风味巡礼套餐",
      ko: "태국 지역 미식 사뭇랍",
    },
    description: {
      th: "รวบเหนือ อีสาน ใต้ไว้ในมื้อเดียวด้วยข้าวซอย ลาบ และคั่วกลิ้ง",
      en: "A three-region Thai course with khao soi, larb, and southern kua kling.",
      ja: "カオソーイ、ラープ、クアクリンで巡る三地域セット。",
      zh: "用咖喱面、拉拌肉与南部干炒咖喱呈现三大地区风味。",
      ko: "카오소이, 라브, 쿠아클링으로 구성한 3개 지역 코스입니다.",
    },
    serves: {
      th: "เหมาะสำหรับ 3-4 ท่าน",
      en: "Ideal for 3-4 guests",
      ja: "3〜4 名向け",
      zh: "适合 3-4 位客人",
      ko: "3-4인 추천",
    },
    highlight: {
      th: "เสิร์ฟคู่ข้าวหอมมะลิและของหวานท้ายมื้อ",
      en: "Served with jasmine rice and a dessert finish",
      ja: "ジャスミンライスとデザート付き",
      zh: "搭配香米饭与甜品收尾",
      ko: "재스민 라이스와 디저트 포함",
    },
    dishIds: ["lanna-khao-soi", "isan-larb-duck", "kua-kling-beef"],
    price: 1980,
    accentClass: "from-[#18473b]/92 via-[#132521]/82 to-[#090b0b]/95",
  },
  {
    id: "songkran-lotus",
    season: {
      th: "เมนูพิเศษฤดูกาล",
      en: "seasonal special",
      ja: "季節限定",
      zh: "季节限定",
      ko: "시즌 스페셜",
    },
    title: {
      th: "ชุดดอกบัวรับสงกรานต์",
      en: "Songkran Lotus Collection",
      ja: "ソンクラーン・ロータスコレクション",
      zh: "宋干莲影精选套餐",
      ko: "송끄란 로터스 컬렉션",
    },
    description: {
      th: "ชุดหน้าร้อนที่เน้นจานสดชื่น เบากลิ่นสมุนไพร และของหวานน้ำแข็งกะทิ",
      en: "A warm-season pairing focused on bright herbs, cooler spice, and coconut sweets.",
      ja: "ハーブの清涼感と軽やかな甘味を主役にした季節コレクション。",
      zh: "以清爽香草、较轻辛香与椰香甜点为核心的热季组合。",
      ko: "허브의 상쾌함과 코코넛 디저트를 중심으로 한 시즌 한정 컬렉션입니다.",
    },
    serves: {
      th: "เหมาะสำหรับ 2-3 ท่าน",
      en: "Ideal for 2-3 guests",
      ja: "2〜3 名向け",
      zh: "适合 2-3 位客人",
      ko: "2-3인 추천",
    },
    highlight: {
      th: "พร้อมโค้ด TASTING10",
      en: "Pairs well with code TASTING10",
      ja: "TASTING10 コード対象",
      zh: "可搭配 TASTING10 优惠码",
      ko: "TASTING10 코드 적용 추천",
    },
    dishIds: ["green-mango-salad", "central-massaman-lamb", "palm-sugar-coconut-ice"],
    price: 1540,
    accentClass: "from-[#5d4220]/92 via-[#22170f]/82 to-[#0b0908]/95",
  },
];

const testimonials: TestimonialDefinition[] = [
  {
    id: "noi",
    name: "Noi P.",
    role: {
      th: "ลูกค้าประจำสุขุมวิท",
      en: "Sukhumvit regular",
      ja: "スクンビット常連ゲスト",
      zh: "素坤逸常客",
      ko: "수쿰윗 단골 고객",
    },
    quote: {
      th: "เว็บนี้ทำให้เลือกเมนูแบบร้านจริงได้เลย ทั้งจองโต๊ะ เก็บเมนูโปรด และกลับมาสั่งซ้ำง่ายมาก",
      en: "It already feels like a real luxury restaurant app, not just a menu page.",
      ja: "単なるメニューではなく、本当に運用できる高級店の画面に見えます。",
      zh: "它已经不像普通菜单页，而像真实高级餐厅的完整前端。",
      ko: "그냥 메뉴 페이지가 아니라 실제 럭셔리 레스토랑 앱처럼 느껴집니다.",
    },
  },
  {
    id: "akari",
    name: "Akari M.",
    role: {
      th: "นักชิมต่างชาติ",
      en: "international diner",
      ja: "海外ゲスト",
      zh: "国际食客",
      ko: "해외 고객",
    },
    quote: {
      th: "การเลือกเมนูตามภูมิภาคและดูชุดชิมเมนูช่วยให้เข้าใจอาหารไทยได้ง่ายขึ้นมาก",
      en: "Regional filters and tasting sets make Thai cuisine easier to explore.",
      ja: "地域別フィルターとセット提案で、タイ料理を選びやすくなりました。",
      zh: "地区筛选与套餐建议让探索泰国菜变得很轻松。",
      ko: "지역 필터와 테이스팅 세트 덕분에 태국 요리를 훨씬 쉽게 고를 수 있어요.",
    },
  },
  {
    id: "seojun",
    name: "Seo-jun L.",
    role: {
      th: "ลูกค้ากลุ่มเดลิเวอรี",
      en: "delivery guest",
      ja: "デリバリー利用客",
      zh: "外送用户",
      ko: "배달 고객",
    },
    quote: {
      th: "ผมชอบที่มีการติดตามคำสั่งซื้อ การเลือกสาขา และโค้ดส่วนลดครบ ทำให้หน้าบ้านดูพร้อมใช้งานจริงมาก",
      en: "Tracking, branch selection, and promo flow make the frontend feel production-ready.",
      ja: "追跡、店舗選択、クーポン導線まであり、完成度が高いです。",
      zh: "追踪、门店选择与优惠码流程都很完整，前端成熟度很高。",
      ko: "트래킹, 지점 선택, 프로모 코드 흐름까지 있어 제품 완성도가 높습니다.",
    },
  },
];

const faqs: FaqDefinition[] = [
  {
    id: "allergens",
    question: {
      th: "ฉันจะดูข้อมูลแพ้อาหารได้ที่ไหน",
      en: "Where can I see allergen information?",
      ja: "アレルゲン情報はどこで確認できますか",
      zh: "在哪里可以查看过敏原信息？",
      ko: "알레르기 정보는 어디에서 볼 수 있나요?",
    },
    answer: {
      th: "แต่ละเมนูจะแสดงป้ายกำกับด้านอาหาร เช่น ซีฟู้ด มีถั่ว มังสวิรัติ และตรวจซ้ำได้ในหน้าศูนย์ช่วยเหลือนี้",
      en: "Each dish shows dietary tags such as seafood, nuts, vegetarian, and spicy guidance, with a second reference here in the Help Center.",
      ja: "各メニューにシーフード、ナッツ使用、ベジタリアンなどの表示があり、このヘルプでも再確認できます。",
      zh: "每道菜都会显示如海鲜、含坚果、素食等饮食标签，本页也可再次确认。",
      ko: "각 메뉴 카드에는 해산물, 견과류 포함, 채식 같은 태그가 표시되며 이 도움말에서도 다시 확인할 수 있습니다.",
    },
  },
  {
    id: "pickup",
    question: {
      th: "ถ้าเลือกการรับเองต้องทำอย่างไร",
      en: "How does pickup work?",
      ja: "受取注文はどう使いますか",
      zh: "自取流程是怎样的？",
      ko: "픽업 주문은 어떻게 이용하나요?",
    },
    answer: {
      th: "เลือกการรับเองจากวิธีรับสินค้า แล้วระบบจะใช้สาขาที่คุณเลือกเป็นจุดรับสินค้า พร้อมเวลารับโดยประมาณในหน้าติดตามคำสั่งซื้อ",
      en: "Switch the service mode to pickup, choose a branch, and the tracking page will show the handoff time and pickup branch.",
      ja: "受取方法を受取に切り替えて店舗を選ぶと、追跡ページに受取時間と店舗が表示されます。",
      zh: "将服务方式切换为自取后选择门店，订单追踪页会显示取餐时间与门店。",
      ko: "이용 방식을 픽업으로 바꾸고 지점을 선택하면 주문 추적 페이지에서 수령 시간과 지점을 볼 수 있습니다.",
    },
  },
  {
    id: "reservation",
    question: {
      th: "หน้าจองโต๊ะเชื่อมระบบหลังบ้านจริงหรือยัง",
      en: "Is reservation already connected to a backend?",
      ja: "予約画面はバックエンド接続済みですか",
      zh: "预订页面已经连接后端了吗？",
      ko: "예약 화면은 이미 백엔드와 연결되어 있나요?",
    },
    answer: {
      th: "ตอนนี้ยังเป็นตัวอย่างฝั่งหน้าเว็บ แต่โครงฟอร์ม เวลา ที่นั่ง และการยืนยัน ถูกวางไว้ให้เชื่อมระบบภายหลังได้ง่าย",
      en: "It is still frontend-only, but the form, seat preferences, and confirmation flow are structured to connect cleanly to APIs later.",
      ja: "現在はフロントエンドのみですが、フォームと確認導線は後続システムと連携しやすい構成です。",
      zh: "目前仍是纯前端模拟，但表单与确认流程已经按后续系统接入的方式组织。",
      ko: "현재는 프런트엔드 전용 목업이지만 폼과 확인 흐름은 이후 시스템 연동이 쉽도록 구성되어 있습니다.",
    },
  },
  {
    id: "voucher",
    question: {
      th: "ใช้โค้ดส่วนลดได้ตรงไหน",
      en: "Where do I apply a promo code?",
      ja: "クーポンコードはどこで使えますか",
      zh: "在哪里输入优惠码？",
      ko: "프로모 코드는 어디에서 적용하나요?",
    },
    answer: {
      th: "กรอกรหัสได้ทั้งในตะกร้าสินค้าแบบแถบเลื่อนและหน้าเช็กเอาต์ โดยระบบจะแสดงส่วนลดที่ใช้ได้กับยอดปัจจุบัน",
      en: "You can apply promo codes in both the cart drawer and checkout summary, where the UI validates minimum spend.",
      ja: "カートと決済画面の両方で入力でき、最低利用金額もその場で確認できます。",
      zh: "可在购物车抽屉和结账页输入，界面会即时检查最低消费条件。",
      ko: "장바구니 드로어와 결제 화면 양쪽에서 입력할 수 있으며 최소 주문 조건도 즉시 표시됩니다.",
    },
  },
  {
    id: "loyalty",
    question: {
      th: "ระบบแต้มแสดงผลอย่างไร",
      en: "How does the loyalty UI work?",
      ja: "ポイント表示はどうなっていますか",
      zh: "会员积分界面如何运作？",
      ko: "포인트 화면은 어떻게 동작하나요?",
    },
    answer: {
      th: "หน้าบัญชีจะแสดงแต้มสะสม ระดับสมาชิก สิทธิ์ถัดไป และคำสั่งซื้อก่อนหน้าในรูปแบบต้นแบบฝั่งหน้าเว็บ",
      en: "The account page shows your point balance, tier, next reward, and order history as a frontend prototype.",
      ja: "アカウント画面で保有ポイント、会員ランク、次の特典、注文履歴を確認できます。",
      zh: "账户页面会展示积分、会员等级、下一奖励与历史订单的前端原型。",
      ko: "계정 페이지에서 포인트, 등급, 다음 혜택, 주문 내역을 프런트엔드 프로토타입으로 볼 수 있습니다.",
    },
  },
];

const notifications: NotificationDefinition[] = [
  {
    id: "notif-1",
    title: {
      th: "พร้อมใช้โค้ด GOLD15 วันนี้",
      en: "GOLD15 is ready today",
      ja: "本日 GOLD15 利用可能",
      zh: "今天可使用 GOLD15",
      ko: "오늘 GOLD15 사용 가능",
    },
    body: {
      th: "ใช้ลด 15% เมื่อยอดอาหารเกินขั้นต่ำที่กำหนด",
      en: "Take 15% off when your food subtotal reaches the minimum.",
      ja: "最低利用額を超えると 15% オフになります。",
      zh: "当菜品小计达到门槛时可减免 15%。",
      ko: "음식 소계가 기준을 넘으면 15% 할인이 적용됩니다.",
    },
    time: {
      th: "อัปเดตเมื่อ 10 นาทีที่แล้ว",
      en: "Updated 10 minutes ago",
      ja: "10 分前に更新",
      zh: "10 分钟前更新",
      ko: "10분 전 업데이트",
    },
  },
  {
    id: "notif-2",
    title: {
      th: "สาขา Bangrak Salon มีโต๊ะว่างรอบค่ำ",
      en: "Bangrak Salon has evening tables",
      ja: "Bangrak Salon の夜枠あり",
      zh: "Bangrak Salon 晚间尚有空位",
      ko: "Bangrak Salon 저녁 좌석 가능",
    },
    body: {
      th: "เหมาะกับการจองโต๊ะสำหรับ 2-4 ท่านคืนนี้",
      en: "Great for 2-4 guest reservations tonight.",
      ja: "今夜 2〜4 名の予約におすすめです。",
      zh: "今晚适合 2-4 位客人预约。",
      ko: "오늘 저녁 2-4인 예약에 적합합니다.",
    },
    time: {
      th: "อัปเดตเมื่อ 1 ชั่วโมงที่แล้ว",
      en: "Updated 1 hour ago",
      ja: "1 時間前に更新",
      zh: "1 小时前更新",
      ko: "1시간 전 업데이트",
    },
  },
  {
    id: "notif-3",
    title: {
      th: "แต้มของคุณใกล้ถึงระดับทองหลวงของร้าน",
      en: "You are close to Royal Gold tier",
      ja: "ロイヤルゴールドまであと少し",
      zh: "你即将达到皇家金阶",
      ko: "로열 골드 등급까지 얼마 남지 않았습니다",
    },
    body: {
      th: "สั่งเพิ่มอีก 1 ครั้งเพื่อปลดล็อกสิทธิ์ของหวานฟรี",
      en: "One more order unlocks a complimentary dessert reward.",
      ja: "あと 1 回の注文で無料デザート特典が解放されます。",
      zh: "再下一单即可解锁免费甜品奖励。",
      ko: "한 번만 더 주문하면 무료 디저트 혜택이 열립니다.",
    },
    time: {
      th: "อัปเดตเมื่อวานนี้",
      en: "Updated yesterday",
      ja: "昨日更新",
      zh: "昨天更新",
      ko: "어제 업데이트",
    },
  },
];

const dishReviews: DishReviewDefinition[] = [
  {
    id: "review-1",
    dishId: "royal-tom-yum",
    guest: "Mina",
    region: {
      th: "กรุงเทพฯ",
      en: "Bangkok",
      ja: "バンコク",
      zh: "曼谷",
      ko: "방콕",
    },
    body: {
      th: "ซุปมีความหรูแต่ยังเป็นต้มยำชัดเจน หอมสมุนไพรและปลายรสสะอาดมาก",
      en: "Luxurious but unmistakably tom yum, with bright herbs and a clean finish.",
      ja: "上質なのにしっかりトムヤムらしく、香りの立ち方が美しいです。",
      zh: "高级感很强，但仍然是很纯正的冬阴功，香草层次很漂亮。",
      ko: "고급스럽지만 똠얌의 정체성이 분명하고 허브 향이 아주 좋습니다.",
    },
    rating: 5,
  },
  {
    id: "review-2",
    dishId: "lanna-khao-soi",
    guest: "Thanawat",
    region: {
      th: "เชียงใหม่",
      en: "Chiang Mai",
      ja: "チェンマイ",
      zh: "清迈",
      ko: "치앙마이",
    },
    body: {
      th: "ให้ความรู้สึกข้าวซอยร่วมสมัย แต่ยังกลิ่นเหนือครบมาก",
      en: "It feels modern, but the northern spice character still comes through clearly.",
      ja: "現代的な仕立てでも、北部らしい香りがきちんと残っています。",
      zh: "虽然做法更现代，但北部香料气息依然很完整。",
      ko: "현대적으로 다듬었지만 북부 향신료의 개성이 선명하게 살아 있습니다.",
    },
    rating: 5,
  },
  {
    id: "review-3",
    dishId: "charcoal-pad-thai",
    guest: "Luca",
    region: {
      th: "สิงคโปร์",
      en: "Singapore",
      ja: "シンガポール",
      zh: "新加坡",
      ko: "싱가포르",
    },
    body: {
      th: "เหมาะมากกับคนเริ่มต้นชิมอาหารไทย เพราะบาลานซ์ง่ายและกลิ่นถ่านน่าจำ",
      en: "A strong starter dish for new Thai food fans because it is balanced and memorable.",
      ja: "初めてのタイ料理にも選びやすく、香ばしさが印象に残ります。",
      zh: "很适合刚开始接触泰国菜的人，平衡又有记忆点。",
      ko: "처음 태국 음식을 접하는 사람에게도 좋고 불향이 인상적입니다.",
    },
    rating: 4.8,
  },
  {
    id: "review-4",
    dishId: "mango-sticky-cloud",
    guest: "Yui",
    region: {
      th: "โตเกียว",
      en: "Tokyo",
      ja: "東京",
      zh: "东京",
      ko: "도쿄",
    },
    body: {
      th: "ของหวานเบาและภาพสวยมาก เหมาะสำหรับปิดท้ายมื้อพิเศษ",
      en: "Light, elegant, and ideal for closing a special dinner.",
      ja: "軽やかで上品なので、特別な食事の締めにぴったりです。",
      zh: "很轻盈也很优雅，适合为一顿特别晚餐收尾。",
      ko: "가볍고 우아해서 특별한 식사의 마무리로 좋습니다.",
    },
    rating: 4.9,
  },
];

const loyaltyTiers: LoyaltyTierDefinition[] = [
  {
    id: "silk",
    title: {
      th: "ระดับผ้าไหม",
      en: "Silk Guest",
      ja: "シルクゲスト",
      zh: "丝绸贵宾",
      ko: "실크 게스트",
    },
    description: {
      th: "เริ่มสะสมแต้มจากทุกคำสั่งซื้อ",
      en: "Earn points on every order",
      ja: "すべての注文でポイント獲得",
      zh: "每笔订单都可累积积分",
      ko: "모든 주문에서 포인트 적립",
    },
    threshold: 0,
  },
  {
    id: "gold",
    title: {
      th: "ระดับทองหลวง",
      en: "Royal Gold",
      ja: "ロイヤルゴールド",
      zh: "皇家金阶",
      ko: "로열 골드",
    },
    description: {
      th: "รับสิทธิ์ของหวานฟรีและสิทธิ์เข้าถึงเมนูพิเศษก่อนใคร",
      en: "Complimentary desserts and early access to seasonal specials",
      ja: "無料デザートと季節限定の先行案内",
      zh: "免费甜品与季节限定优先体验",
      ko: "무료 디저트와 시즌 메뉴 선공개 혜택",
    },
    threshold: 1200,
  },
  {
    id: "emerald",
    title: {
      th: "ระดับวงมรกต",
      en: "Emerald Circle",
      ja: "エメラルドサークル",
      zh: "翡翠礼遇圈",
      ko: "에메랄드 서클",
    },
    description: {
      th: "สิทธิ์จองก่อนใครและคำเชิญเข้าร่วมเชฟเทสติ้ง",
      en: "Priority reservations and chef tasting invitations",
      ja: "優先予約とシェフイベント招待",
      zh: "优先订位与主厨品鉴邀请",
      ko: "우선 예약과 셰프 테이스팅 초청",
    },
    threshold: 2600,
  },
];

const orderDefinitions: OrderDefinition[] = [
  {
    id: "order-1",
    branchId: "bangrak",
    serviceMode: "delivery",
    status: "arriving",
    etaLabel: {
      th: "ถึงใน 12 นาที",
      en: "Arriving in 12 min",
      ja: "12 分で到着予定",
      zh: "预计 12 分钟送达",
      ko: "12분 후 도착 예정",
    },
    placedAt: {
      th: "วันนี้ 19:14",
      en: "Today 19:14",
      ja: "本日 19:14",
      zh: "今天 19:14",
      ko: "오늘 19:14",
    },
    code: "SLX-4812",
    itemLines: [
      { dishId: "royal-tom-yum", quantity: 1 },
      { dishId: "charcoal-pad-thai", quantity: 1 },
      { dishId: "mango-sticky-cloud", quantity: 1 },
    ],
    stages: [
      {
        id: "confirmed",
        label: {
          th: "รับออเดอร์แล้ว",
          en: "Order confirmed",
          ja: "注文確認済み",
          zh: "订单已确认",
          ko: "주문 확인 완료",
        },
        time: {
          th: "19:14",
          en: "19:14",
          ja: "19:14",
          zh: "19:14",
          ko: "19:14",
        },
      },
      {
        id: "preparing",
        label: {
          th: "ครัวกำลังปรุง",
          en: "Kitchen preparing",
          ja: "調理中",
          zh: "厨房制作中",
          ko: "주방 조리 중",
        },
        time: {
          th: "19:18",
          en: "19:18",
          ja: "19:18",
          zh: "19:18",
          ko: "19:18",
        },
      },
      {
        id: "dispatching",
        label: {
          th: "ออกจากสาขาแล้ว",
          en: "Left the branch",
          ja: "店舗を出発",
          zh: "已从门店出发",
          ko: "지점에서 출발",
        },
        time: {
          th: "19:31",
          en: "19:31",
          ja: "19:31",
          zh: "19:31",
          ko: "19:31",
        },
      },
      {
        id: "arriving",
        label: {
          th: "ใกล้ถึงแล้ว",
          en: "Almost there",
          ja: "まもなく到着",
          zh: "即将送达",
          ko: "곧 도착",
        },
        time: {
          th: "ถึงโดยประมาณ 19:43",
          en: "ETA 19:43",
          ja: "到着予定 19:43",
          zh: "预计到达 19:43",
          ko: "예상 도착 19:43",
        },
      },
    ],
  },
  {
    id: "order-2",
    branchId: "sukhumvit",
    serviceMode: "pickup",
    status: "ready",
    etaLabel: {
      th: "พร้อมรับใน 8 นาที",
      en: "Ready for pickup in 8 min",
      ja: "8 分後に受取可能",
      zh: "8 分钟后可取餐",
      ko: "8분 후 픽업 가능",
    },
    placedAt: {
      th: "วันนี้ 18:42",
      en: "Today 18:42",
      ja: "本日 18:42",
      zh: "今天 18:42",
      ko: "오늘 18:42",
    },
    code: "SLX-4791",
    itemLines: [
      { dishId: "fire-basil-wagyu", quantity: 1 },
      { dishId: "central-crab-omelette", quantity: 1 },
    ],
    stages: [
      {
        id: "confirmed",
        label: {
          th: "รับออเดอร์แล้ว",
          en: "Order confirmed",
          ja: "注文確認済み",
          zh: "订单已确认",
          ko: "주문 확인 완료",
        },
        time: {
          th: "18:42",
          en: "18:42",
          ja: "18:42",
          zh: "18:42",
          ko: "18:42",
        },
      },
      {
        id: "preparing",
        label: {
          th: "ครัวกำลังปรุง",
          en: "Kitchen preparing",
          ja: "調理中",
          zh: "厨房制作中",
          ko: "주방 조리 중",
        },
        time: {
          th: "18:46",
          en: "18:46",
          ja: "18:46",
          zh: "18:46",
          ko: "18:46",
        },
      },
      {
        id: "ready",
        label: {
          th: "พร้อมรับที่สาขาแล้ว",
          en: "Ready at the branch",
          ja: "店舗で受取可能",
          zh: "门店已备好",
          ko: "지점에서 수령 가능",
        },
        time: {
          th: "พร้อมรับโดยประมาณ 18:54",
          en: "ETA 18:54",
          ja: "受取予定 18:54",
          zh: "预计可取 18:54",
          ko: "수령 예정 18:54",
        },
      },
    ],
  },
  {
    id: "order-3",
    branchId: "chiangmai",
    serviceMode: "delivery",
    status: "completed",
    etaLabel: {
      th: "ส่งสำเร็จแล้ว",
      en: "Delivered successfully",
      ja: "配達完了",
      zh: "已完成配送",
      ko: "배달 완료",
    },
    placedAt: {
      th: "เมื่อวาน 20:10",
      en: "Yesterday 20:10",
      ja: "昨日 20:10",
      zh: "昨天 20:10",
      ko: "어제 20:10",
    },
    code: "SLX-4620",
    itemLines: [
      { dishId: "lanna-khao-soi", quantity: 2 },
      { dishId: "north-hang-lay", quantity: 1 },
      { dishId: "palm-sugar-coconut-ice", quantity: 1 },
    ],
    stages: [
      {
        id: "confirmed",
        label: {
          th: "รับออเดอร์แล้ว",
          en: "Order confirmed",
          ja: "注文確認済み",
          zh: "订单已确认",
          ko: "주문 확인 완료",
        },
        time: {
          th: "20:10",
          en: "20:10",
          ja: "20:10",
          zh: "20:10",
          ko: "20:10",
        },
      },
      {
        id: "completed",
        label: {
          th: "จัดส่งสำเร็จ",
          en: "Delivered",
          ja: "配達完了",
          zh: "配送完成",
          ko: "배달 완료",
        },
        time: {
          th: "20:46",
          en: "20:46",
          ja: "20:46",
          zh: "20:46",
          ko: "20:46",
        },
      },
    ],
  },
];

const dietaryLabelMap: Record<DietaryTagId, { label: LocalizedText; className: string }> = {
  vegetarian: {
    label: {
      th: "มังสวิรัติ",
      en: "vegetarian",
      ja: "ベジタリアン",
      zh: "素食",
      ko: "채식",
    },
    className: "border-emerald-400/20 bg-emerald-400/10 text-emerald-100",
  },
  seafood: {
    label: {
      th: "ซีฟู้ด",
      en: "seafood",
      ja: "シーフード",
      zh: "海鲜",
      ko: "해산물",
    },
    className: "border-sky-400/20 bg-sky-400/10 text-sky-100",
  },
  containsNuts: {
    label: {
      th: "มีถั่ว",
      en: "contains nuts",
      ja: "ナッツ使用",
      zh: "含坚果",
      ko: "견과류 포함",
    },
    className: "border-amber-400/20 bg-amber-400/10 text-amber-100",
  },
  signature: {
    label: {
      th: "จานเด่น",
      en: "signature",
      ja: "シグネチャー",
      zh: "招牌",
      ko: "시그니처",
    },
    className: "border-[#d6b26a]/20 bg-[#d6b26a]/10 text-[#f3dfae]",
  },
  spicy: {
    label: {
      th: "เผ็ดนำ",
      en: "spicy",
      ja: "辛口",
      zh: "辛辣",
      ko: "매운맛",
    },
    className: "border-rose-500/20 bg-rose-500/10 text-rose-100",
  },
  sweet: {
    label: {
      th: "ของหวาน",
      en: "dessert",
      ja: "デザート",
      zh: "甜品",
      ko: "디저트",
    },
    className: "border-fuchsia-400/20 bg-fuchsia-400/10 text-fuchsia-100",
  },
  grill: {
    label: {
      th: "ย่าง / ไฟแรง",
      en: "grill / wok heat",
      ja: "炙り / 強火鍋気",
      zh: "炙烤 / 锅气",
      ko: "그릴 / 웍 화력",
    },
    className: "border-orange-400/20 bg-orange-400/10 text-orange-100",
  },
  halalFriendly: {
    label: {
      th: "เป็นมิตรกับฮาลาล",
      en: "halal-friendly",
      ja: "ハラール配慮",
      zh: "友好清真",
      ko: "할랄 친화",
    },
    className: "border-teal-400/20 bg-teal-400/10 text-teal-100",
  },
};

const dishDietaryMap: Record<string, DietaryTagId[]> = {
  "royal-tom-yum": ["seafood", "signature", "spicy"],
  "lanna-khao-soi": ["signature"],
  "kua-kling-beef": ["grill", "spicy"],
  "charcoal-pad-thai": ["containsNuts", "signature"],
  "fire-basil-wagyu": ["grill", "signature", "spicy"],
  "mango-sticky-cloud": ["vegetarian", "sweet"],
  "emerald-green-curry": ["spicy", "signature"],
  "river-prawn-rice": ["seafood", "signature"],
  "central-crab-omelette": ["seafood"],
  "southern-roti-mataba": ["halalFriendly", "grill"],
  "roti-kaya": ["halalFriendly", "sweet"],
  "palm-sugar-coconut-ice": ["vegetarian", "sweet"],
};

const experienceCopy = {
  th: {
    serviceModes: {
      delivery: "เดลิเวอรี",
      pickup: "รับเอง",
    },
    labels: {
      branch: "สาขา",
      serviceMode: "วิธีรับสินค้า",
      quickAccess: "ฟังก์ชันเพิ่มเติม",
      promoTitle: "โค้ดส่วนลด",
      promoPlaceholder: "กรอก GOLD15 / SIAM120 / TASTING10",
      applyPromo: "ใช้โค้ด",
      clearPromo: "ล้างโค้ด",
      invalidPromo: "โค้ดไม่ถูกต้องหรือยังไม่ถึงยอดขั้นต่ำ",
      promoApplied: "ใช้โค้ด {code} แล้ว",
      discount: "ส่วนลด",
      suggestions: "คำแนะนำการค้นหา",
      branchReady: "พร้อมให้บริการจาก {branch}",
      reservationTitle: "จองโต๊ะ",
      reservationBody: "เลือกรอบเวลา สาขา จำนวนแขก และโอกาสพิเศษได้ใน flow เดียว",
      trackingTitle: "ติดตามคำสั่งซื้อ",
      trackingBody: "ดูเวลาถึงโดยประมาณและลำดับสถานะของแต่ละออเดอร์",
      favoritesTitle: "เมนูโปรด",
      favoritesBody: "บันทึกจานที่อยากสั่งซ้ำไว้ในรายการโปรด",
      accountTitle: "บัญชีของคุณ",
      accountBody: "โปรไฟล์ แต้มสะสม และการแจ้งเตือน",
      helpTitle: "ช่วยเหลือ",
      helpBody: "FAQ เรื่องการจอง รับสินค้า โปรโมชัน และแพ้อาหาร",
      noFavorites: "ยังไม่มีเมนูโปรด",
      addFavorite: "บันทึกเมนู",
      removeFavorite: "เอาออกจากโปรด",
      chefRecommendationTitle: "คำแนะนำจากเชฟ",
      chefRecommendationBody: "คัดตามรูปแบบการสั่งและภูมิภาคที่คุณกำลังดูอยู่",
      reviewsTitle: "เสียงจากแขกของร้าน",
      reviewsBody: "รีวิวสั้น ๆ เพื่อช่วยเลือกเมนูหรือชุดอาหาร",
      specialsTitle: "สำรับพิเศษและฤดูกาล",
      specialsBody: "ชุดอาหารที่พร้อมแชร์หรือดินเนอร์แบบคัดสรร",
      contactTitle: "สาขาและการติดต่อ",
      contactBody: "เลือกสาขาที่ตรงพื้นที่ของคุณและดูเบอร์โทรได้ทันที",
      accountSummaryTitle: "แดชบอร์ดลูกค้า",
      orderHistoryTitle: "คำสั่งซื้อก่อนหน้า",
      notificationsTitle: "ศูนย์แจ้งเตือน",
      loyaltyTitle: "สถานะสะสมแต้ม",
      nextReward: "อีก {points} แต้มเพื่อปลดล็อกระดับถัดไป",
      faqTitle: "คำถามที่พบบ่อย",
      dietaryTitle: "ข้อมูลอาหารและการแพ้",
      reserveNow: "จองเลย",
      viewAll: "ดูทั้งหมด",
      reorder: "สั่งซ้ำ",
      exploreMenu: "กลับไปเลือกเมนู",
      selectOrder: "เลือกออเดอร์ที่ต้องการติดตาม",
      branchFeatures: "จุดเด่นของสาขา",
      reservationSubmitted: "ส่งคำขอจองโต๊ะแล้ว",
      accountGreeting: "ยินดีต้อนรับกลับมา",
      mapLabel: "แผนที่สาขา",
      supportLine: "สายบริการร้าน",
      pickupHint: "หากเลือกการรับเอง ระบบจะยืนยันสาขาสำหรับรับสินค้าให้ทันที",
      dietaryNote: "หมายเหตุ: ป้ายกำกับนี้เป็นตัวอย่างฝั่งหน้าเว็บสำหรับเชื่อมข้อมูลครัวจริงในภายหลัง",
    },
  },
  en: {
    serviceModes: {
      delivery: "Delivery",
      pickup: "Pickup",
    },
    labels: {
      branch: "Branch",
      serviceMode: "Service mode",
      quickAccess: "More features",
      promoTitle: "Promo code",
      promoPlaceholder: "Enter GOLD15 / SIAM120 / TASTING10",
      applyPromo: "Apply",
      clearPromo: "Clear",
      invalidPromo: "Code is invalid or the minimum subtotal is not reached",
      promoApplied: "{code} applied successfully",
      discount: "Discount",
      suggestions: "Search suggestions",
      branchReady: "Serving from {branch}",
      reservationTitle: "Reservation",
      reservationBody: "Choose branch, party size, time, and special occasion in one flow.",
      trackingTitle: "Order tracking",
      trackingBody: "Follow ETA and each order milestone.",
      favoritesTitle: "Favorites",
      favoritesBody: "Save dishes you want to reorder later.",
      accountTitle: "Your account",
      accountBody: "Profile, points, saved details, and notifications.",
      helpTitle: "Help center",
      helpBody: "FAQ for pickup, reservations, promos, and allergens.",
      noFavorites: "No favorites yet",
      addFavorite: "Save favorite",
      removeFavorite: "Remove favorite",
      chefRecommendationTitle: "Chef recommendations",
      chefRecommendationBody: "Suggested from your current browsing mood and service mode.",
      reviewsTitle: "Guest notes",
      reviewsBody: "Short reviews to help decide faster.",
      specialsTitle: "Set menus & seasonal features",
      specialsBody: "Curated dining collections for sharing or special evenings.",
      contactTitle: "Branches & contact",
      contactBody: "Select the most relevant branch and service area.",
      accountSummaryTitle: "Guest dashboard",
      orderHistoryTitle: "Order history",
      notificationsTitle: "Notification center",
      loyaltyTitle: "Loyalty status",
      nextReward: "{points} more points to unlock the next tier",
      faqTitle: "Frequently asked questions",
      dietaryTitle: "Dietary & allergen guidance",
      reserveNow: "Reserve now",
      viewAll: "View all",
      reorder: "Reorder",
      exploreMenu: "Explore menu",
      selectOrder: "Choose an order to track",
      branchFeatures: "Branch highlights",
      reservationSubmitted: "Reservation request submitted",
      accountGreeting: "Welcome back",
      mapLabel: "Branch map",
      supportLine: "House service line",
      pickupHint: "When pickup is selected, the interface confirms the pickup branch automatically.",
      dietaryNote: "Note: these labels are frontend guidance mocks for future kitchen-side integrations.",
    },
  },
  ja: {
    serviceModes: {
      delivery: "デリバリー",
      pickup: "受取",
    },
    labels: {
      branch: "店舗",
      serviceMode: "受取方法",
      quickAccess: "追加機能",
      promoTitle: "クーポンコード",
      promoPlaceholder: "GOLD15 / SIAM120 / TASTING10 を入力",
      applyPromo: "適用",
      clearPromo: "解除",
      invalidPromo: "コードが無効、または最低利用額に達していません",
      promoApplied: "{code} を適用しました",
      discount: "割引",
      suggestions: "検索候補",
      branchReady: "{branch} から提供",
      reservationTitle: "予約",
      reservationBody: "店舗、人数、時間、利用目的を一つの流れで選べます。",
      trackingTitle: "注文追跡",
      trackingBody: "到着予定時刻と各ステージを確認できます。",
      favoritesTitle: "お気に入り",
      favoritesBody: "あとで再注文したい料理を保存できます。",
      accountTitle: "アカウント",
      accountBody: "プロフィール、ポイント、通知をまとめて確認。",
      helpTitle: "ヘルプセンター",
      helpBody: "受取、予約、クーポン、アレルゲンに関するよくある質問です。",
      noFavorites: "お気に入りはまだありません",
      addFavorite: "お気に入りに追加",
      removeFavorite: "お気に入りから削除",
      chefRecommendationTitle: "シェフおすすめ",
      chefRecommendationBody: "閲覧中の雰囲気と受取方法から提案します。",
      reviewsTitle: "ゲストレビュー",
      reviewsBody: "選びやすくするための短い感想です。",
      specialsTitle: "セットと季節限定",
      specialsBody: "シェアにも特別な夜にも合うコレクション。",
      contactTitle: "店舗案内",
      contactBody: "最適な店舗と対応エリアを確認できます。",
      accountSummaryTitle: "ゲストダッシュボード",
      orderHistoryTitle: "注文履歴",
      notificationsTitle: "通知センター",
      loyaltyTitle: "会員ステータス",
      nextReward: "次のランクまであと {points} ポイント",
      faqTitle: "よくある質問",
      dietaryTitle: "食事制限とアレルゲン",
      reserveNow: "予約する",
      viewAll: "すべて表示",
      reorder: "再注文",
      exploreMenu: "メニューを見る",
      selectOrder: "追跡する注文を選択",
      branchFeatures: "店舗の特徴",
      reservationSubmitted: "予約リクエストを送信しました",
      accountGreeting: "おかえりなさい",
      mapLabel: "店舗マップ",
      supportLine: "サービスライン",
      pickupHint: "受取を選ぶと受取店舗が自動で反映されます。",
      dietaryNote: "注記: これらの表示は将来の厨房データ連携を想定したフロントエンド用ガイドです。",
    },
  },
  zh: {
    serviceModes: {
      delivery: "外送",
      pickup: "自取",
    },
    labels: {
      branch: "门店",
      serviceMode: "服务方式",
      quickAccess: "扩展功能",
      promoTitle: "优惠码",
      promoPlaceholder: "输入 GOLD15 / SIAM120 / TASTING10",
      applyPromo: "使用",
      clearPromo: "清除",
      invalidPromo: "优惠码无效或未达到最低消费",
      promoApplied: "已成功使用 {code}",
      discount: "折扣",
      suggestions: "搜索建议",
      branchReady: "由 {branch} 提供服务",
      reservationTitle: "预订",
      reservationBody: "在一个流程中选择门店、人数、时间与场合。",
      trackingTitle: "订单追踪",
      trackingBody: "查看预计到达时间与订单阶段。",
      favoritesTitle: "收藏夹",
      favoritesBody: "保存之后想再次点的菜品。",
      accountTitle: "我的账户",
      accountBody: "资料、积分、地址与通知整合在一起。",
      helpTitle: "帮助中心",
      helpBody: "关于自取、预订、优惠与过敏原的常见问题。",
      noFavorites: "还没有收藏菜品",
      addFavorite: "加入收藏",
      removeFavorite: "取消收藏",
      chefRecommendationTitle: "主厨推荐",
      chefRecommendationBody: "根据当前浏览偏好与服务方式生成建议。",
      reviewsTitle: "顾客评价",
      reviewsBody: "帮助更快决定菜单的短评。",
      specialsTitle: "套餐与季节限定",
      specialsBody: "适合分享或特别晚餐的策展组合。",
      contactTitle: "门店与联系",
      contactBody: "选择最适合你的门店与服务区域。",
      accountSummaryTitle: "顾客面板",
      orderHistoryTitle: "历史订单",
      notificationsTitle: "通知中心",
      loyaltyTitle: "会员等级",
      nextReward: "再累积 {points} 积分即可升级",
      faqTitle: "常见问题",
      dietaryTitle: "饮食与过敏原信息",
      reserveNow: "立即预订",
      viewAll: "查看全部",
      reorder: "再次下单",
      exploreMenu: "浏览菜单",
      selectOrder: "选择要追踪的订单",
      branchFeatures: "门店亮点",
      reservationSubmitted: "预订请求已提交",
      accountGreeting: "欢迎回来",
      mapLabel: "门店地图",
      supportLine: "门店服务专线",
      pickupHint: "选择自取后，界面会自动确认取餐门店。",
      dietaryNote: "说明：这些标签是前端示意，用于未来连接厨房真实数据。",
    },
  },
  ko: {
    serviceModes: {
      delivery: "배달",
      pickup: "픽업",
    },
    labels: {
      branch: "지점",
      serviceMode: "이용 방식",
      quickAccess: "추가 기능",
      promoTitle: "프로모 코드",
      promoPlaceholder: "GOLD15 / SIAM120 / TASTING10 입력",
      applyPromo: "적용",
      clearPromo: "해제",
      invalidPromo: "코드가 유효하지 않거나 최소 주문 금액이 부족합니다",
      promoApplied: "{code} 코드가 적용되었습니다",
      discount: "할인",
      suggestions: "검색 제안",
      branchReady: "{branch} 지점에서 서비스 중",
      reservationTitle: "예약",
      reservationBody: "지점, 인원, 시간, 방문 목적을 한 번에 선택합니다.",
      trackingTitle: "주문 추적",
      trackingBody: "예상 도착 시간과 진행 단계를 확인할 수 있습니다.",
      favoritesTitle: "즐겨찾기",
      favoritesBody: "나중에 다시 주문할 메뉴를 저장합니다.",
      accountTitle: "내 계정",
      accountBody: "프로필, 포인트, 저장 정보, 알림을 확인합니다.",
      helpTitle: "도움말 센터",
      helpBody: "픽업, 예약, 프로모, 알레르기 관련 자주 묻는 질문입니다.",
      noFavorites: "아직 즐겨찾기한 메뉴가 없습니다",
      addFavorite: "즐겨찾기 추가",
      removeFavorite: "즐겨찾기 해제",
      chefRecommendationTitle: "셰프 추천",
      chefRecommendationBody: "현재 보고 있는 취향과 서비스 모드에 맞춰 제안합니다.",
      reviewsTitle: "고객 후기",
      reviewsBody: "메뉴 선택을 돕는 짧은 리뷰입니다.",
      specialsTitle: "세트 메뉴와 시즌 한정",
      specialsBody: "공유 식사나 특별한 저녁을 위한 큐레이션입니다.",
      contactTitle: "지점 및 연락처",
      contactBody: "가장 적합한 지점과 서비스 권역을 확인하세요.",
      accountSummaryTitle: "고객 대시보드",
      orderHistoryTitle: "주문 내역",
      notificationsTitle: "알림 센터",
      loyaltyTitle: "멤버십 상태",
      nextReward: "다음 등급까지 {points}포인트 남았습니다",
      faqTitle: "자주 묻는 질문",
      dietaryTitle: "식단 및 알레르기 안내",
      reserveNow: "예약하기",
      viewAll: "전체 보기",
      reorder: "재주문",
      exploreMenu: "메뉴 보기",
      selectOrder: "추적할 주문 선택",
      branchFeatures: "지점 특징",
      reservationSubmitted: "예약 요청이 접수되었습니다",
      accountGreeting: "다시 오신 것을 환영합니다",
      mapLabel: "지점 지도",
      supportLine: "서비스 전용 라인",
      pickupHint: "픽업을 선택하면 수령 지점이 자동으로 반영됩니다.",
      dietaryNote: "참고: 이 표시는 향후 주방 데이터 연동을 위한 프런트엔드 가이드 목업입니다.",
    },
  },
} as const;

function resolveLocalizedText(text: LocalizedText, locale: AppLocale) {
  return text[locale] ?? text.en ?? text.th;
}

function formatPrice(value: number, locale: AppLocale) {
  return new Intl.NumberFormat(
    {
      th: "th-TH",
      en: "en-US",
      ja: "ja-JP",
      zh: "zh-CN",
      ko: "ko-KR",
    }[locale],
    { style: "currency", currency: "THB", maximumFractionDigits: 0 },
  ).format(value);
}

export function getExperienceCopy(locale: AppLocale) {
  return experienceCopy[locale];
}

export function getFeatureLinks(locale: AppLocale) {
  return featureLinks.map((item) => ({
    id: item.id,
    href: item.href,
    eyebrow: resolveLocalizedText(item.eyebrow, locale),
    title: resolveLocalizedText(item.title, locale),
    description: resolveLocalizedText(item.description, locale),
    accentClass: item.accentClass,
  }));
}

export function getLocalizedBranches(locale: AppLocale) {
  return branches.map((branch) => ({
    ...branch,
    name: resolveLocalizedText(branch.name, locale),
    neighborhood: resolveLocalizedText(branch.neighborhood, locale),
    address: resolveLocalizedText(branch.address, locale),
    hours: resolveLocalizedText(branch.hours, locale),
    features: branch.features.map((feature) => resolveLocalizedText(feature, locale)),
  }));
}

export function getBranchById(id: BranchId) {
  return branches.find((branch) => branch.id === id) ?? branches[0];
}

export function getLocalizedBranch(locale: AppLocale, id: BranchId) {
  const branch = getBranchById(id);

  return {
    ...branch,
    name: resolveLocalizedText(branch.name, locale),
    neighborhood: resolveLocalizedText(branch.neighborhood, locale),
    address: resolveLocalizedText(branch.address, locale),
    hours: resolveLocalizedText(branch.hours, locale),
    features: branch.features.map((feature) => resolveLocalizedText(feature, locale)),
  };
}

export function getPromoOffers(locale: AppLocale) {
  return promoOffers.map((offer) => ({
    code: offer.code,
    title: resolveLocalizedText(offer.title, locale),
    description: resolveLocalizedText(offer.description, locale),
    minimumSubtotal: offer.minimumSubtotal,
    value: offer.value,
    kind: offer.kind,
  }));
}

export function getPromoOfferByCode(code: string | null | undefined) {
  if (!code) return null;

  return promoOffers.find((offer) => offer.code === code.toUpperCase()) ?? null;
}

export function getDiscountValue(subtotal: number, promoCode: string | null | undefined) {
  const offer = getPromoOfferByCode(promoCode);

  if (!offer || subtotal < offer.minimumSubtotal) {
    return 0;
  }

  if (offer.kind === "percent") {
    return Math.round((subtotal * offer.value) / 100);
  }

  return offer.value;
}

export function getOrderTotals(
  items: Array<{ quantity: number; unitPrice: number }>,
  promoCode: string | null | undefined,
) {
  const subtotal = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const discount = getDiscountValue(subtotal, promoCode);
  const discountedSubtotal = Math.max(0, subtotal - discount);
  const delivery = discountedSubtotal === 0 ? 0 : discountedSubtotal >= 1600 ? 0 : 79;
  const service = discountedSubtotal === 0 ? 0 : Math.round(discountedSubtotal * 0.05);
  const total = discountedSubtotal + delivery + service;

  return { subtotal, discount, discountedSubtotal, delivery, service, total };
}

export function getLocalizedSpecials(locale: AppLocale) {
  return specials.map((special) => ({
    id: special.id,
    season: resolveLocalizedText(special.season, locale),
    title: resolveLocalizedText(special.title, locale),
    description: resolveLocalizedText(special.description, locale),
    serves: resolveLocalizedText(special.serves, locale),
    highlight: resolveLocalizedText(special.highlight, locale),
    dishIds: special.dishIds,
    dishes: special.dishIds
      .map((dishId) => getLocalizedDish(locale, dishId))
      .filter(Boolean),
    price: formatPrice(special.price, locale),
    rawPrice: special.price,
    accentClass: special.accentClass,
  }));
}

export function getLocalizedTestimonials(locale: AppLocale) {
  return testimonials.map((item) => ({
    id: item.id,
    name: item.name,
    role: resolveLocalizedText(item.role, locale),
    quote: resolveLocalizedText(item.quote, locale),
  }));
}

export function getLocalizedFaqs(locale: AppLocale) {
  return faqs.map((item) => ({
    id: item.id,
    question: resolveLocalizedText(item.question, locale),
    answer: resolveLocalizedText(item.answer, locale),
  }));
}

export function getLocalizedNotifications(locale: AppLocale) {
  return notifications.map((item) => ({
    id: item.id,
    title: resolveLocalizedText(item.title, locale),
    body: resolveLocalizedText(item.body, locale),
    time: resolveLocalizedText(item.time, locale),
  }));
}

export function getLocalizedDishReviews(locale: AppLocale, dishId?: string) {
  return dishReviews
    .filter((entry) => (dishId ? entry.dishId === dishId : true))
    .map((entry) => ({
      id: entry.id,
      dishId: entry.dishId,
      guest: entry.guest,
      region: resolveLocalizedText(entry.region, locale),
      body: resolveLocalizedText(entry.body, locale),
      rating: entry.rating,
    }));
}

export function getDietaryLabels(locale: AppLocale, dishId: string) {
  return (dishDietaryMap[dishId] ?? []).map((id) => ({
    id,
    label: resolveLocalizedText(dietaryLabelMap[id].label, locale),
    className: dietaryLabelMap[id].className,
  }));
}

export function getAllDietaryLabels(locale: AppLocale) {
  return Object.entries(dietaryLabelMap).map(([id, definition]) => ({
    id: id as DietaryTagId,
    label: resolveLocalizedText(definition.label, locale),
    className: definition.className,
  }));
}

export function getLocalizedOrders(locale: AppLocale) {
  return orderDefinitions.map((order) => ({
    id: order.id,
    code: order.code,
    branch: getLocalizedBranch(locale, order.branchId),
    serviceMode: resolveLocalizedText(
      {
        th: experienceCopy.th.serviceModes[order.serviceMode],
        en: experienceCopy.en.serviceModes[order.serviceMode],
        ja: experienceCopy.ja.serviceModes[order.serviceMode],
        zh: experienceCopy.zh.serviceModes[order.serviceMode],
        ko: experienceCopy.ko.serviceModes[order.serviceMode],
      },
      locale,
    ),
    status: order.status,
    etaLabel: resolveLocalizedText(order.etaLabel, locale),
    placedAt: resolveLocalizedText(order.placedAt, locale),
    items: order.itemLines.map((line) => ({
      ...line,
      dish: getLocalizedDish(locale, line.dishId),
    })),
    stages: order.stages.map((stage) => ({
      id: stage.id,
      label: resolveLocalizedText(stage.label, locale),
      time: resolveLocalizedText(stage.time, locale),
    })),
  }));
}

export function getLoyaltySnapshot(locale: AppLocale) {
  const currentPoints = 1840;
  const currentTier = loyaltyTiers[1];
  const nextTier = loyaltyTiers[2];

  return {
    currentPoints,
    currentTier: resolveLocalizedText(currentTier.title, locale),
    currentTierBody: resolveLocalizedText(currentTier.description, locale),
    nextTier: resolveLocalizedText(nextTier.title, locale),
    nextTierBody: resolveLocalizedText(nextTier.description, locale),
    nextThreshold: nextTier.threshold,
    pointsToNext: nextTier.threshold - currentPoints,
    tiers: loyaltyTiers.map((tier) => ({
      id: tier.id,
      title: resolveLocalizedText(tier.title, locale),
      description: resolveLocalizedText(tier.description, locale),
      threshold: tier.threshold,
    })),
  };
}

export function getChefRecommendations(locale: AppLocale, options?: {
  favoriteIds?: string[];
  region?: RegionId | "all";
  serviceMode?: ServiceMode;
}) {
  const allDishes = getLocalizedDishes(locale);
  const favoriteIds = options?.favoriteIds ?? [];
  const serviceMode = options?.serviceMode ?? "delivery";
  const region = options?.region ?? "all";

  if (favoriteIds.length > 0) {
    return allDishes
      .filter((dish) => favoriteIds.includes(dish.id))
      .slice(0, 3);
  }

  if (region !== "all") {
    return allDishes
      .filter((dish) => dish.region === region)
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 3);
  }

  if (serviceMode === "pickup") {
    return allDishes
      .filter((dish) => dish.prepMinutes <= 15)
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 3);
  }

  return allDishes.filter((dish) => dish.featured).slice(0, 3);
}
