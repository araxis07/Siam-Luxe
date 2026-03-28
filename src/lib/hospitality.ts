import type { AppLocale } from "@/i18n/routing";
import type { BranchId } from "@/lib/experience";

type LocalizedText = Record<AppLocale, string>;

export interface SocialProofMetric {
  todayOrders: number;
  label: string;
  note: string;
}

export interface AuthPanel {
  eyebrow: string;
  title: string;
  body: string;
  memberBenefits: string[];
  guestBenefits: string[];
  highlights: Array<{ label: string; value: string }>;
}

export interface OccasionMoment {
  id: string;
  title: string;
  body: string;
  recommendedDishIds: string[];
}

export interface PairingEntry {
  id: string;
  title: string;
  body: string;
  beverage: string;
  mood: string;
  dishIds: string[];
}

export interface BranchComparisonRow {
  id: BranchId;
  title: string;
  body: string;
  bestFor: string[];
  strengths: string[];
  deliveryWindow: string;
}

export interface PolicySection {
  id: string;
  title: string;
  body: string;
  bullets: string[];
}

const authPanels: Record<AppLocale, AuthPanel> = {
  th: {
    eyebrow: "เข้าสู่ระบบและโปรไฟล์แขก",
    title: "สลับระหว่างแขกทั่วไปและสมาชิกประจำของร้าน",
    body: "หน้าเว็บนี้จำลองทั้งการซื้อแบบ guest checkout และการเข้าใช้สิทธิ์ของสมาชิก เพื่อให้พร้อมต่อระบบยืนยันตัวตนจริงในภายหลังโดยไม่ต้อง refactor ใหญ่",
    memberBenefits: [
      "บันทึกที่อยู่และวิธีชำระเงินหลายชุด",
      "เก็บสิทธิ์สะสมแต้มและบัตรของขวัญไว้ในบัญชีเดียว",
      "จัดการการจอง ใบเสร็จ และการแจ้งเตือนจากแดชบอร์ดเดียว",
    ],
    guestBenefits: [
      "เข้าสู่ checkout ได้ทันทีโดยไม่ต้องสมัคร",
      "คง flow การสั่งอาหารแบบรวดเร็วบนมือถือ",
      "พร้อมแปลงเป็นสมาชิกภายหลังโดยไม่เสียข้อมูลเดิม",
    ],
    highlights: [
      { label: "สมาชิกจำลอง", value: "Siam Society" },
      { label: "สถานะบัญชี", value: "พร้อมต่อ auth จริง" },
      { label: "ข้อมูลที่ซิงก์", value: "ที่อยู่ · แต้ม · การจอง" },
    ],
  },
  en: {
    eyebrow: "Sign in and guest profile",
    title: "Switch between guest checkout and a returning member account",
    body: "This frontend now covers both guest checkout and member-ready profile flows so real authentication can connect later without a major rewrite.",
    memberBenefits: [
      "Save multiple addresses and payment methods",
      "Keep rewards, vouchers, and gift balances in one account",
      "Manage reservations, receipts, and notifications from one dashboard",
    ],
    guestBenefits: [
      "Move through checkout without mandatory signup",
      "Keep mobile ordering fast and low-friction",
      "Upgrade into a member profile later without losing the order context",
    ],
    highlights: [
      { label: "Mock membership", value: "Siam Society" },
      { label: "Account state", value: "Auth-ready frontend" },
      { label: "Synced surfaces", value: "Address · rewards · bookings" },
    ],
  },
  ja: {
    eyebrow: "サインインとゲストプロフィール",
    title: "ゲスト購入と会員アカウントを切り替えられる設計",
    body: "このフロントエンドはゲスト購入と会員利用の両方を想定しており、後から本番の認証基盤をつないでも大きな改修を避けられます。",
    memberBenefits: [
      "複数の住所と支払い方法を保存",
      "特典、ギフト残高、バウチャーを一元管理",
      "予約、領収書、通知設定を一つの画面で管理",
    ],
    guestBenefits: [
      "登録なしですぐに注文へ進める",
      "モバイルでの注文導線を軽く保てる",
      "後から会員化しても注文文脈を引き継げる",
    ],
    highlights: [
      { label: "会員モデル", value: "Siam Society" },
      { label: "画面状態", value: "認証接続待ち" },
      { label: "連携対象", value: "住所・特典・予約" },
    ],
  },
  zh: {
    eyebrow: "登录与宾客档案",
    title: "同时支持游客结账与会员账户体验",
    body: "当前前端已同时覆盖游客结账和会员档案流程，后续接入真实认证系统时无需大规模重构。",
    memberBenefits: [
      "保存多个地址与支付方式",
      "统一管理积分、礼品卡与券包",
      "在一个仪表板中管理预订、收据与通知",
    ],
    guestBenefits: [
      "无需注册即可快速下单",
      "保持移动端点餐流程足够轻快",
      "后续升级成会员时不丢失当前上下文",
    ],
    highlights: [
      { label: "模拟会员", value: "Siam Society" },
      { label: "账户状态", value: "前端已可接 auth" },
      { label: "同步范围", value: "地址 · 积分 · 预订" },
    ],
  },
  ko: {
    eyebrow: "로그인과 게스트 프로필",
    title: "게스트 체크아웃과 멤버 계정을 모두 지원하는 흐름",
    body: "이 프런트엔드는 비회원 주문과 멤버 계정 흐름을 모두 갖추고 있어 이후 실제 인증 시스템을 붙여도 큰 리팩터링이 필요하지 않습니다.",
    memberBenefits: [
      "여러 주소와 결제 수단 저장",
      "리워드, 바우처, 기프트 밸런스를 한 계정에서 관리",
      "예약, 영수증, 알림을 하나의 대시보드에서 관리",
    ],
    guestBenefits: [
      "회원가입 없이 바로 체크아웃 가능",
      "모바일 주문 흐름을 빠르게 유지",
      "나중에 멤버 전환 시 현재 주문 문맥 유지",
    ],
    highlights: [
      { label: "멤버십 예시", value: "Siam Society" },
      { label: "계정 상태", value: "실 auth 연결 준비" },
      { label: "동기화 범위", value: "주소 · 리워드 · 예약" },
    ],
  },
};

const occasionMoments = [
  {
    id: "date-night",
    title: {
      th: "ค่ำคืนสำหรับคู่รัก",
      en: "Date Night",
      ja: "デートナイト",
      zh: "约会之夜",
      ko: "데이트 나이트",
    },
    body: {
      th: "เน้นจานแชร์ง่าย ของหวานปิดท้าย และบรรยากาศโทนแสงนุ่ม",
      en: "Built around shareable mains, a refined dessert finish, and soft evening pacing.",
      ja: "取り分けやすい料理、上質な甘味、やわらかな夜の流れに向きます。",
      zh: "适合分享主菜、精致甜品与柔和晚间节奏。",
      ko: "함께 나누기 좋은 메인과 디저트, 부드러운 저녁 분위기에 맞춘 구성입니다.",
    },
    recommendedDishIds: ["royal-tom-yum", "central-crab-omelette", "mango-sticky-cloud"],
  },
  {
    id: "business-hosting",
    title: {
      th: "รับรองลูกค้าและงานธุรกิจ",
      en: "Business Hosting",
      ja: "接待利用",
      zh: "商务宴请",
      ko: "비즈니스 호스팅",
    },
    body: {
      th: "เหมาะกับเมนูที่ดูสงบ เสิร์ฟง่าย และใช้เล่าเรื่องภูมิภาคไทยได้ดี",
      en: "Favors polished courses that host well and tell a regional Thai story.",
      ja: "上品で配膳しやすく、地域性も伝えられる料理構成です。",
      zh: "更适合正式、好分餐、且能体现泰式地域故事的组合。",
      ko: "단정하고 호스팅에 적합하며 태국 지역성을 전하기 좋은 구성입니다.",
    },
    recommendedDishIds: ["central-massaman-lamb", "northern-hanglay-curry", "southern-yellow-curry-crab"],
  },
  {
    id: "family-table",
    title: {
      th: "มื้อครอบครัว",
      en: "Family Table",
      ja: "ファミリーテーブル",
      zh: "家庭聚餐",
      ko: "패밀리 테이블",
    },
    body: {
      th: "เน้นจานกลาง รสชาติบาลานซ์ และมีทั้งคาวหวานครบโต๊ะ",
      en: "Balanced sharing plates with enough variety for all ages at the table.",
      ja: "幅広い世代で楽しみやすい、分けやすい料理を中心にしています。",
      zh: "适合多人共享、口味平衡、老少都容易选择。",
      ko: "여럿이 나눠 먹기 좋고 세대별로 고르기 쉬운 밸런스 구성을 지향합니다.",
    },
    recommendedDishIds: ["pad-thai-river-prawn", "green-curry-chicken", "tubtim-krob"],
  },
];

const pairingEntries = [
  {
    id: "sparkling-herbal",
    title: {
      th: "Sparkling Herbal Pairing",
      en: "Sparkling Herbal Pairing",
      ja: "ハーバル スパークリング",
      zh: "香草气泡搭配",
      ko: "허벌 스파클링 페어링",
    },
    body: {
      th: "โซดาสมุนไพรกลิ่นมะลิและใบเตย ช่วยให้จานรสเข้มคมขึ้นแต่ยังสด",
      en: "A jasmine-pandan sparkling pour that keeps richer dishes bright and lifted.",
      ja: "ジャスミンとパンダンの香りで、濃い料理にも軽さを与えます。",
      zh: "以茉莉与香兰为基调的气泡饮，能让浓郁菜肴更显清爽。",
      ko: "자스민과 판단 향의 스파클링으로 진한 요리도 산뜻하게 정리합니다.",
    },
    beverage: {
      th: "Jasmine Pandan Sparkling",
      en: "Jasmine Pandan Sparkling",
      ja: "ジャスミン・パンダンスパークリング",
      zh: "茉莉香兰气泡饮",
      ko: "자스민 판단 스파클링",
    },
    mood: {
      th: "สดใสและเบา",
      en: "Bright and lifted",
      ja: "軽やかで明るい",
      zh: "清亮提神",
      ko: "산뜻하고 가벼운 무드",
    },
    dishIds: ["royal-tom-yum", "green-mango-salad", "som-tum-blue-crab"],
  },
  {
    id: "smoked-tea",
    title: {
      th: "Smoked Tea Service",
      en: "Smoked Tea Service",
      ja: "スモークティーサービス",
      zh: "烟熏茶饮搭配",
      ko: "스모크 티 서비스",
    },
    body: {
      th: "ชาดำกลิ่นควันอ่อนช่วยรองรับแกงเข้มและจานย่างได้ดี",
      en: "A faintly smoked black tea structured to support grilled and curry-led dishes.",
      ja: "ほのかな燻香の紅茶で、焼き物や濃い煮込みを支えます。",
      zh: "微烟熏红茶适合搭配烧烤与厚重咖喱类菜肴。",
      ko: "은은한 훈연 홍차가 그릴 메뉴와 진한 커리에 잘 맞습니다.",
    },
    beverage: {
      th: "Chiang Mai Smoked Black Tea",
      en: "Chiang Mai Smoked Black Tea",
      ja: "チェンマイ スモークブラックティー",
      zh: "清迈烟熏红茶",
      ko: "치앙마이 스모크 블랙티",
    },
    mood: {
      th: "ลึกและเงียบ",
      en: "Deep and composed",
      ja: "深く落ち着いた印象",
      zh: "深沉稳重",
      ko: "깊고 차분한 무드",
    },
    dishIds: ["central-massaman-lamb", "northern-hanglay-curry", "fire-basil-wagyu"],
  },
  {
    id: "coconut-nightcap",
    title: {
      th: "Coconut Nightcap",
      en: "Coconut Nightcap",
      ja: "ココナッツ ナイトキャップ",
      zh: "椰香夜饮",
      ko: "코코넛 나이트캡",
    },
    body: {
      th: "เครื่องดื่มกะทิและน้ำตาลโตนดแบบนุ่ม เหมาะกับของหวานไทยปิดท้าย",
      en: "A soft coconut-palm profile built for Thai sweets and slower endings.",
      ja: "ココナッツと椰子糖のやわらかな余韻で甘味の締めに向きます。",
      zh: "柔和椰香与棕榈糖尾韵，适合搭配泰式甜品收尾。",
      ko: "코코넛과 팜슈가의 부드러운 결로 디저트 마무리에 어울립니다.",
    },
    beverage: {
      th: "Palm Sugar Coconut Cooler",
      en: "Palm Sugar Coconut Cooler",
      ja: "パームシュガー ココナッツクーラー",
      zh: "棕榈糖椰香冷饮",
      ko: "팜슈가 코코넛 쿨러",
    },
    mood: {
      th: "นุ่มและปิดมื้ออย่างหรู",
      en: "Soft and luxurious",
      ja: "やわらかく上品な締め",
      zh: "柔和而讲究",
      ko: "부드럽고 고급스러운 마무리",
    },
    dishIds: ["mango-sticky-cloud", "tubtim-krob", "palm-sugar-coconut-ice"],
  },
];

const branchComparisonRows: Array<{
  id: BranchId;
  title: LocalizedText;
  body: LocalizedText;
  bestFor: Record<AppLocale, string[]>;
  strengths: Record<AppLocale, string[]>;
  deliveryWindow: LocalizedText;
}> = [
  {
    id: "bangrak",
    title: {
      th: "Bangrak Salon",
      en: "Bangrak Salon",
      ja: "Bangrak Salon",
      zh: "Bangrak Salon",
      ko: "Bangrak Salon",
    },
    body: {
      th: "เด่นเรื่องริมน้ำ ห้องส่วนตัว และมื้อค่ำแบบรับรองแขก",
      en: "Best for riverfront dinners, private rooms, and formal hosted evenings.",
      ja: "川沿いの夜席、個室、接待利用に強い店舗です。",
      zh: "强在河岸晚餐、包厢与正式招待场景。",
      ko: "리버프런트 디너와 프라이빗 룸, 포멀 호스팅에 강합니다.",
    },
    bestFor: {
      th: ["รับรองลูกค้า", "เดทกลางคืน", "ห้องส่วนตัว"],
      en: ["Client hosting", "Date nights", "Private dining"],
      ja: ["接待", "夜デート", "個室利用"],
      zh: ["商务宴请", "夜间约会", "包厢聚会"],
      ko: ["고객 접대", "저녁 데이트", "프라이빗 다이닝"],
    },
    strengths: {
      th: ["สำรับค่ำ", "โทนหรูสงบ", "เดลิเวอรีเขตธุรกิจ"],
      en: ["Signature dinners", "Calm luxury mood", "Strong CBD delivery"],
      ja: ["シグネチャー夕食", "静かな高級感", "都心配送"],
      zh: ["招牌晚宴", "安静高级感", "商务区配送强"],
      ko: ["시그니처 디너", "차분한 럭셔리 무드", "도심 배송 강점"],
    },
    deliveryWindow: {
      th: "28-38 นาที",
      en: "28-38 mins",
      ja: "28-38 分",
      zh: "28-38 分钟",
      ko: "28-38분",
    },
  },
  {
    id: "sukhumvit",
    title: {
      th: "Sukhumvit House",
      en: "Sukhumvit House",
      ja: "Sukhumvit House",
      zh: "Sukhumvit House",
      ko: "Sukhumvit House",
    },
    body: {
      th: "เด่นเรื่องรับเองไว เคาน์เตอร์ชิมเมนู และดินเนอร์คู่",
      en: "Best for fast pickup, counter tasting, and compact premium dinners.",
      ja: "受取、カウンター体験、少人数ディナーに最適です。",
      zh: "强在快速自取、吧台体验与双人晚餐。",
      ko: "빠른 픽업과 카운터 체험, 소규모 프리미엄 디너에 적합합니다.",
    },
    bestFor: {
      th: ["รับเอง", "เชฟคาวน์เตอร์", "มื้อหลังเลิกงาน"],
      en: ["Pickup", "Chef counter", "After-work dining"],
      ja: ["受取", "シェフカウンター", "仕事帰り"],
      zh: ["自取", "主厨吧台", "下班后用餐"],
      ko: ["픽업", "셰프 카운터", "퇴근 후 식사"],
    },
    strengths: {
      th: ["รับอาหารเร็ว", "โต๊ะคู่", "ย่านกลางเมือง"],
      en: ["Fast handoff", "Date tables", "Central location"],
      ja: ["受取が速い", "二人席向き", "中心地立地"],
      zh: ["交接快速", "适合双人桌", "中心城区"],
      ko: ["빠른 수령", "데이트 테이블", "중심 입지"],
    },
    deliveryWindow: {
      th: "22-32 นาที",
      en: "22-32 mins",
      ja: "22-32 分",
      zh: "22-32 分钟",
      ko: "22-32분",
    },
  },
  {
    id: "chiangmai",
    title: {
      th: "Lanna Pavilion",
      en: "Lanna Pavilion",
      ja: "Lanna Pavilion",
      zh: "Lanna Pavilion",
      ko: "Lanna Pavilion",
    },
    body: {
      th: "เด่นเรื่องจานเหนือ สวนสงบ และมื้อกลางวัน/ของหวาน",
      en: "Best for northern dishes, garden pacing, and dessert-led visits.",
      ja: "北部料理、庭席、甘味体験が魅力の店舗です。",
      zh: "强在北部风味、花园座位与甜品体验。",
      ko: "북부 메뉴와 가든 좌석, 디저트 중심 방문에 강합니다.",
    },
    bestFor: {
      th: ["มื้อกลางวัน", "น้ำชาและของหวาน", "บรรยากาศสวน"],
      en: ["Long lunches", "Tea and desserts", "Garden dining"],
      ja: ["ゆったりランチ", "甘味と茶", "ガーデン席"],
      zh: ["悠闲午餐", "下午茶与甜品", "花园座位"],
      ko: ["런치", "티와 디저트", "가든 다이닝"],
    },
    strengths: {
      th: ["เมนูเหนือ", "โทนสงบ", "เหมาะกับครอบครัว"],
      en: ["Northern menu depth", "Calm mood", "Family-friendly flow"],
      ja: ["北部メニュー", "落ち着いた空気", "家族利用向き"],
      zh: ["北部菜单深度", "安静氛围", "适合家庭"],
      ko: ["북부 메뉴 깊이", "차분한 분위기", "가족 방문에 적합"],
    },
    deliveryWindow: {
      th: "24-34 นาที",
      en: "24-34 mins",
      ja: "24-34 分",
      zh: "24-34 分钟",
      ko: "24-34분",
    },
  },
];

const legalSections = [
  {
    id: "privacy",
    title: {
      th: "นโยบายความเป็นส่วนตัว",
      en: "Privacy Policy",
      ja: "プライバシーポリシー",
      zh: "隐私政策",
      ko: "개인정보 처리방침",
    },
    body: {
      th: "อธิบายการเก็บข้อมูลเพื่อคำสั่งซื้อ การจอง และการสื่อสารทางการตลาดในระดับหน้าบ้านพร้อมต่อระบบจริง",
      en: "Explains how guest information is prepared for ordering, reservations, and optional marketing communication.",
      ja: "注文、予約、任意のマーケティング連絡に向けた情報の取り扱いを説明します。",
      zh: "说明前端如何准备与订单、预订及可选营销沟通相关的数据。",
      ko: "주문, 예약, 선택적 마케팅 커뮤니케이션을 위한 정보 취급 방식을 설명합니다.",
    },
    bullets: {
      th: ["ข้อมูลโปรไฟล์และที่อยู่เก็บในอุปกรณ์ผู้ใช้ก่อนเชื่อม backend", "สิทธิ์ขอลบหรือแก้ไขข้อมูลรองรับที่ระดับ UI", "การแจ้งเตือนเชิงการตลาดสามารถเปิด/ปิดได้"],
      en: ["Profile and address state stays client-side until a backend exists", "Delete and edit controls are exposed in the UI", "Marketing notifications can be toggled off independently"],
      ja: ["バックエンド接続前はプロフィールと住所情報を端末側に保持", "削除・編集導線を UI 上で用意", "マーケティング通知は個別に無効化可能"],
      zh: ["在接入后端前，资料与地址数据保留在本地端", "UI 已提供编辑与删除入口", "营销通知可单独关闭"],
      ko: ["백엔드 연결 전까지 프로필과 주소는 클라이언트 측에 저장", "수정 및 삭제 제어를 UI에 제공", "마케팅 알림은 개별적으로 끌 수 있음"],
    },
  },
  {
    id: "terms",
    title: {
      th: "ข้อกำหนดการใช้งาน",
      en: "Terms of Use",
      ja: "利用規約",
      zh: "使用条款",
      ko: "이용약관",
    },
    body: {
      th: "กำหนดขอบเขตของบริการ frontend, promo, gift card, reservation request และเนื้อหาหลายภาษา",
      en: "Defines the scope of frontend ordering, promos, gift balances, reservation requests, and multilingual content.",
      ja: "注文 UI、特典、ギフト残高、予約リクエスト、多言語表記の取り扱い範囲を定めます。",
      zh: "规定前端点餐、优惠、礼卡余额、预约请求与多语言内容的使用范围。",
      ko: "주문 UI, 프로모션, 기프트 밸런스, 예약 요청, 다국어 콘텐츠의 이용 범위를 정의합니다.",
    },
    bullets: {
      th: ["ราคาและเวลาเป็นข้อมูลจำลองพร้อมต่อ backend จริง", "เมนูบางรายการอาจถูกจำกัดตามสาขาหรือช่วงเวลา", "การจองผ่านหน้าเว็บเป็น request flow จนกว่าจะเชื่อม availability จริง"],
      en: ["Prices and timings are frontend-ready values intended for backend connection", "Some items can be limited by branch or service window", "Reservation capture remains request-based until live availability is connected"],
      ja: ["価格と時間はバックエンド接続を前提にしたフロント表示値", "一部メニューは店舗や時間帯で制限される場合がある", "予約は実在庫接続までリクエスト方式で扱う"],
      zh: ["价格与时段信息为前端预留值，待后端接入", "部分菜品会因门店或时段受限", "在接入实时库存前，预约仍为请求型流程"],
      ko: ["가격과 시간은 백엔드 연결을 염두에 둔 프런트 값", "일부 메뉴는 지점이나 시간대에 따라 제한될 수 있음", "실시간 재고 연결 전까지 예약은 요청 기반으로 처리됨"],
    },
  },
  {
    id: "cookies",
    title: {
      th: "คุกกี้และสถานะในอุปกรณ์",
      en: "Cookies & Device Storage",
      ja: "Cookie と端末保存",
      zh: "Cookie 与设备存储",
      ko: "쿠키 및 기기 저장소",
    },
    body: {
      th: "อธิบายการใช้ local storage เพื่อเก็บตะกร้า รายการโปรด ภาษา และข้อมูลโปรไฟล์จำลอง",
      en: "Covers local storage for cart, favorites, language, and guest convenience data.",
      ja: "カート、お気に入り、言語、ゲスト補助情報に使うローカル保存を説明します。",
      zh: "说明购物车、收藏、语言与宾客便捷资料使用的本地存储。",
      ko: "장바구니, 즐겨찾기, 언어, 게스트 편의 데이터에 대한 로컬 저장 사용을 설명합니다.",
    },
    bullets: {
      th: ["ลบสถานะได้ด้วยการล้าง storage ของเบราว์เซอร์", "ยังไม่มี third-party tracker ภายนอก", "analytics รอบนี้เป็น client event พร้อมต่อ provider ภายหลัง"],
      en: ["State can be cleared through browser storage reset", "No third-party external tracker is required today", "Analytics events are prepared client-side for later provider wiring"],
      ja: ["ブラウザ保存の消去で状態をリセット可能", "現時点で外部サードパーティ追跡は必須ではない", "分析イベントは後続連携向けにクライアント側で準備済み"],
      zh: ["可通过清除浏览器存储重置状态", "当前不依赖第三方外部追踪器", "分析事件已在前端预留，后续可接入 provider"],
      ko: ["브라우저 저장소 초기화로 상태를 지울 수 있음", "현재 외부 서드파티 추적기가 필수는 아님", "분석 이벤트는 나중에 provider 연결 가능하도록 클라이언트 측에 준비됨"],
    },
  },
];

const trustSections = [
  {
    id: "allergens",
    title: {
      th: "นโยบายสารก่อภูมิแพ้",
      en: "Allergen Guidance",
      ja: "アレルゲン案内",
      zh: "过敏原说明",
      ko: "알레르기 안내",
    },
    body: {
      th: "หน้าเมนูและ detail modal มี dietary badge และ preference note เพื่อเตรียมต่อครัวจริง",
      en: "Menu cards and detail modals surface dietary badges and guest preference notes.",
      ja: "メニューカードと詳細モーダルで食事条件ラベルと注意事項を案内します。",
      zh: "菜单卡与详情弹层会显示饮食标签与偏好说明。",
      ko: "메뉴 카드와 상세 모달에서 식단 라벨과 선호 메모를 안내합니다.",
    },
    bullets: {
      th: ["มี tag สำหรับ vegetarian, seafood, nuts, halal-friendly, spicy", "ลูกค้าบันทึก allergen notes ได้ในโปรไฟล์", "ควรมี backend kitchen confirmation ใน production จริง"],
      en: ["Tags exist for vegetarian, seafood, nuts, halal-friendly, and spicy", "Guests can save allergen notes in profile preferences", "Production should still confirm with kitchen-side data"],
      ja: ["vegetarian, seafood, nuts, halal-friendly, spicy のタグを表示", "プロフィールでアレルゲン注意を保存可能", "本番では厨房側データ連携が望ましい"],
      zh: ["已提供 vegetarian、seafood、nuts、halal-friendly、spicy 标签", "用户可在偏好中保存过敏备注", "正式环境仍应接厨房侧确认数据"],
      ko: ["vegetarian, seafood, nuts, halal-friendly, spicy 태그를 제공", "프로필 선호 설정에 알레르기 메모 저장 가능", "실서비스에서는 주방 데이터 연동이 필요"],
    },
  },
  {
    id: "delivery",
    title: {
      th: "นโยบายเดลิเวอรีและรับเอง",
      en: "Delivery & Pickup Policy",
      ja: "配送と受取ポリシー",
      zh: "配送与自取政策",
      ko: "배달 및 픽업 정책",
    },
    body: {
      th: "สรุปเวลารับผิดชอบของแต่ละสาขา ช่วงเวลา delivery และการรับเองที่สาขา",
      en: "Summarizes branch service windows for delivery and pickup handling.",
      ja: "店舗ごとの配送時間帯と受取対応範囲を整理しています。",
      zh: "概览各门店的配送时段与自取窗口。",
      ko: "지점별 배달 시간대와 픽업 대응 범위를 정리합니다.",
    },
    bullets: {
      th: ["มี branch selector และ availability matrix แล้ว", "checkout แสดงสาขาและ service mode ชัดเจน", "tracking มี live delivery map mock สำหรับต่อระบบจริง"],
      en: ["Branch selector and availability matrix are already integrated", "Checkout shows branch and service mode clearly", "Tracking includes a live delivery map mock for later integration"],
      ja: ["店舗選択と availability matrix を実装済み", "checkout で店舗と受取方式を明確に表示", "tracking に配送マップのモックを搭載"],
      zh: ["已集成门店选择器与可用矩阵", "结账页会明确显示门店与服务方式", "追踪页已提供配送地图 mock"],
      ko: ["지점 선택기와 availability matrix를 이미 통합", "체크아웃에서 지점과 서비스 모드를 명확히 표시", "추적 화면에 라이브 배달 맵 목업 제공"],
    },
  },
  {
    id: "refunds",
    title: {
      th: "นโยบายคืนเงินและการจอง",
      en: "Refund & Reservation Policy",
      ja: "返金と予約ポリシー",
      zh: "退款与预订政策",
      ko: "환불 및 예약 정책",
    },
    body: {
      th: "อธิบายการยกเลิกคำสั่งซื้อ การจองแบบ confirmed/waitlist และการออกใบเสร็จหรือ tax invoice",
      en: "Covers cancellation behavior, confirmed vs waitlist reservations, and receipt or tax invoice requests.",
      ja: "注文キャンセル、確定予約・ウェイトリスト、領収書や税務書類の扱いを案内します。",
      zh: "说明订单取消、确认/候补预约以及收据与发票申请流程。",
      ko: "주문 취소, 확정/웨이트리스트 예약, 영수증 및 세금계산서 요청을 설명합니다.",
    },
    bullets: {
      th: ["account page ยกเลิกหรือเลื่อนเวลาการจองได้", "checkout รองรับ invoice profile และ receipt request", "สถานะ waitlist ถูกแยกชัดเจนใน flow การจอง"],
      en: ["The account page can reschedule or cancel reservations", "Checkout now supports invoice profiles and receipt requests", "Waitlist state is clearly separated in the reservation flow"],
      ja: ["account 画面で予約変更やキャンセルが可能", "checkout が invoice profile と receipt request をサポート", "waitlist 状態を予約導線で明確に分離"],
      zh: ["账户页可改期或取消预约", "结账页已支持发票资料与收据申请", "预约流程中明确区分候补状态"],
      ko: ["account 화면에서 예약 변경과 취소 가능", "체크아웃이 invoice profile과 영수증 요청을 지원", "예약 흐름에서 웨이트리스트 상태를 명확히 분리"],
    },
  },
];

const socialProofMap: Record<string, { todayOrders: number; label: LocalizedText; note: LocalizedText }> = {
  "royal-tom-yum": {
    todayOrders: 84,
    label: {
      th: "ขายดีวันนี้",
      en: "Trending tonight",
      ja: "今夜の人気",
      zh: "今晚热门",
      ko: "오늘 저녁 인기",
    },
    note: {
      th: "ถูกเลือกบ่อยทั้งสายรับรองแขกและเดลิเวอรี",
      en: "Picked often across hosted dinners and delivery orders.",
      ja: "接待利用と配送注文の両方でよく選ばれています。",
      zh: "在正式晚宴与外送订单中都很常被选择。",
      ko: "호스팅 디너와 배달 주문 모두에서 자주 선택됩니다.",
    },
  },
  "pad-thai-river-prawn": {
    todayOrders: 67,
    label: {
      th: "จานฮิตของสัปดาห์",
      en: "Weekly favorite",
      ja: "今週の人気皿",
      zh: "本周热门",
      ko: "이번 주 인기 메뉴",
    },
    note: {
      th: "เหมาะกับมื้อครอบครัวและสั่งซ้ำสูง",
      en: "A repeat-order staple for shared tables and family meals.",
      ja: "家族利用や再注文で安定して選ばれる一皿です。",
      zh: "适合家庭共享，也是复购率很高的招牌。",
      ko: "가족 식사와 재주문 비중이 높은 대표 메뉴입니다.",
    },
  },
  "green-curry-chicken": {
    todayOrders: 52,
    label: {
      th: "ซิกเนเจอร์ภาคกลาง",
      en: "Signature central plate",
      ja: "中央部の定番",
      zh: "中部招牌",
      ko: "중부 시그니처",
    },
    note: {
      th: "มักถูกเลือกใน set menu และ business dinner",
      en: "Often chosen inside set menus and business dinner formats.",
      ja: "セット利用やビジネスディナーで選ばれやすい料理です。",
      zh: "常出现在套餐与商务用餐组合中。",
      ko: "세트 메뉴와 비즈니스 디너 구성에서 자주 선택됩니다.",
    },
  },
};

export function getAuthPanel(locale: AppLocale) {
  return authPanels[locale];
}

export function getOccasionMoments(locale: AppLocale): OccasionMoment[] {
  return occasionMoments.map((item) => ({
    id: item.id,
    title: item.title[locale],
    body: item.body[locale],
    recommendedDishIds: item.recommendedDishIds,
  }));
}

export function getBeveragePairings(locale: AppLocale): PairingEntry[] {
  return pairingEntries.map((item) => ({
    id: item.id,
    title: item.title[locale],
    body: item.body[locale],
    beverage: item.beverage[locale],
    mood: item.mood[locale],
    dishIds: item.dishIds,
  }));
}

export function getBranchComparisonRows(locale: AppLocale): BranchComparisonRow[] {
  return branchComparisonRows.map((row) => ({
    id: row.id,
    title: row.title[locale],
    body: row.body[locale],
    bestFor: row.bestFor[locale],
    strengths: row.strengths[locale],
    deliveryWindow: row.deliveryWindow[locale],
  }));
}

export function getLegalSections(locale: AppLocale): PolicySection[] {
  return legalSections.map((item) => ({
    id: item.id,
    title: item.title[locale],
    body: item.body[locale],
    bullets: item.bullets[locale],
  }));
}

export function getTrustSections(locale: AppLocale): PolicySection[] {
  return trustSections.map((item) => ({
    id: item.id,
    title: item.title[locale],
    body: item.body[locale],
    bullets: item.bullets[locale],
  }));
}

export function getSocialProof(locale: AppLocale, dishId: string): SocialProofMetric {
  const metric = socialProofMap[dishId];

  if (!metric) {
    return {
      todayOrders: 28,
      label: {
        th: "แขกเลือกต่อเนื่อง",
        en: "Steady guest favorite",
        ja: "安定した人気",
        zh: "稳定受欢迎",
        ko: "꾸준한 인기",
      }[locale],
      note: {
        th: "เป็นเมนูที่ถูกเลือกสม่ำเสมอในหลายช่วงเวลา",
        en: "A steady pick across lunch, dinner, and reorder flows.",
        ja: "ランチ、ディナー、再注文で安定して選ばれています。",
        zh: "在午餐、晚餐与复购中都保持稳定热度。",
        ko: "런치, 디너, 재주문 흐름에서 꾸준히 선택됩니다.",
      }[locale],
    };
  }

  return {
    todayOrders: metric.todayOrders,
    label: metric.label[locale],
    note: metric.note[locale],
  };
}
