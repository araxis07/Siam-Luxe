import type { Metadata } from "next";

import type { AppLocale } from "@/i18n/routing";
import { siteConfig } from "@/lib/site";

type LocalizedText = Record<AppLocale, string>;

export type PageMetadataKey =
  | "home"
  | "menu"
  | "reservation"
  | "tracking"
  | "reviews"
  | "auth"
  | "giftCards"
  | "rewards"
  | "buildSet"
  | "catering"
  | "specials"
  | "heritage"
  | "account"
  | "compareBranches"
  | "pairings"
  | "contact"
  | "help"
  | "policies"
  | "trust";

const pageCopy: Record<PageMetadataKey, { title: LocalizedText; description: LocalizedText }> = {
  home: {
    title: {
      th: "Siam Lux | ประสบการณ์สั่งอาหารไทยพรีเมียม",
      en: "Siam Lux | Premium Thai Ordering Atelier",
      ja: "Siam Lux | 上質なタイ料理オーダー体験",
      zh: "Siam Lux | 高级泰式点餐体验",
      ko: "Siam Lux | 프리미엄 태국 요리 주문 경험",
    },
    description: {
      th: "สั่งอาหารไทยพรีเมียมหลายภูมิภาค พร้อมจองโต๊ะ ติดตามออเดอร์ รีวิว ของขวัญ และประสบการณ์ร้านแบบครบหน้าเว็บ",
      en: "A premium Thai ordering experience with regional menus, reservations, tracking, reviews, gifting, and rich guest flows.",
      ja: "地域別メニュー、予約、追跡、レビュー、ギフトまで備えたタイ料理の上質な注文体験。",
      zh: "集区域菜单、预订、追踪、点评与礼卡于一体的高级泰式点餐体验。",
      ko: "지역 메뉴, 예약, 추적, 리뷰, 기프트까지 갖춘 프리미엄 태국 요리 주문 경험.",
    },
  },
  menu: {
    title: {
      th: "เมนูอาหารไทย | Siam Lux",
      en: "Thai Menu | Siam Lux",
      ja: "タイ料理メニュー | Siam Lux",
      zh: "泰式菜单 | Siam Lux",
      ko: "태국 메뉴 | Siam Lux",
    },
    description: {
      th: "รวมอาหารไทยคลาสสิก เมนูประจำภูมิภาค ของคาว ของหวาน และโหมดภาพใหญ่สำหรับเลือกเมนูแบบพรีเมียม",
      en: "Browse Thai classics, regional dishes, desserts, gallery view, recently viewed plates, and curated set-building.",
      ja: "定番料理、郷土料理、甘味、ギャラリーモード、最近見た料理まで揃えたメニューページです。",
      zh: "浏览经典泰菜、地方风味、甜品、画廊模式与最近浏览菜品。",
      ko: "태국 클래식, 지역 요리, 디저트, 갤러리 모드, 최근 본 메뉴까지 제공하는 메뉴 페이지입니다.",
    },
  },
  reservation: {
    title: {
      th: "จองโต๊ะและปฏิทินที่นั่ง | Siam Lux",
      en: "Reservations & Seating Calendar | Siam Lux",
      ja: "予約と席カレンダー | Siam Lux",
      zh: "预订与座位日历 | Siam Lux",
      ko: "예약 및 좌석 캘린더 | Siam Lux",
    },
    description: {
      th: "ดูปฏิทินจองโต๊ะ แผนผังที่นั่ง โซนของแต่ละสาขา และลำดับคิวรอแบบร้านจริง",
      en: "Explore reservation heatmaps, seat maps, branch zones, and waitlist flows in one elevated reservation experience.",
      ja: "予約ヒートマップ、席マップ、支店別ゾーン、ウェイトリストまで備えた予約体験です。",
      zh: "在一个完整预约体验中查看预约热度、座位图、分店区域与候补流程。",
      ko: "예약 히트맵, 좌석 맵, 지점별 존, 웨이트리스트 흐름까지 담은 예약 경험입니다.",
    },
  },
  tracking: {
    title: {
      th: "ติดตามออเดอร์และแผนที่ส่งอาหาร | Siam Lux",
      en: "Order Tracking & Delivery Map | Siam Lux",
      ja: "注文追跡と配送マップ | Siam Lux",
      zh: "订单追踪与配送地图 | Siam Lux",
      ko: "주문 추적 및 딜리버리 맵 | Siam Lux",
    },
    description: {
      th: "ติดตามสถานะออเดอร์ด้วยเส้นเวลาสถานะ แผนที่เส้นทางจัดส่ง และทางลัดสำหรับสั่งซ้ำ",
      en: "Track progress with an elevated order timeline, delivery route map, and reorder shortcuts.",
      ja: "上質な進行タイムライン、配送ルートマップ、再注文導線をまとめた追跡画面です。",
      zh: "结合时间线、配送路线地图与再次下单入口的高质感追踪体验。",
      ko: "타임라인, 배달 경로 맵, 재주문 흐름을 결합한 프리미엄 추적 화면입니다.",
    },
  },
  reviews: {
    title: {
      th: "รีวิวและส่งความคิดเห็น | Siam Lux",
      en: "Reviews & Guest Submission | Siam Lux",
      ja: "レビューと投稿 | Siam Lux",
      zh: "点评与用户投稿 | Siam Lux",
      ko: "리뷰 및 게스트 제출 | Siam Lux",
    },
    description: {
      th: "ดูรีวิวเมนูจริงและส่งความคิดเห็นใหม่พร้อมให้คะแนนในรูปแบบพร้อมใช้งานฝั่งหน้าเว็บ",
      en: "Browse guest reviews and submit new dish feedback in one polished review journey.",
      ja: "既存レビューの閲覧と新規投稿を両立したレビュー体験です。",
      zh: "查看菜品点评并通过精致流畅的流程提交新评价。",
      ko: "기존 리뷰 열람과 새 후기 제출을 함께 제공하는 리뷰 경험입니다.",
    },
  },
  auth: {
    title: {
      th: "เข้าสู่ระบบและโหมดแขก | Siam Lux",
      en: "Sign In & Guest Mode | Siam Lux",
      ja: "サインインとゲストモード | Siam Lux",
      zh: "登录与游客模式 | Siam Lux",
      ko: "로그인 및 게스트 모드 | Siam Lux",
    },
    description: {
      th: "สลับระหว่าง guest checkout และ member-ready account พร้อมบันทึกสิทธิ์ ที่อยู่ และการแจ้งเตือน",
      en: "Switch between guest checkout and a member-ready account with saved rewards, addresses, and preferences.",
      ja: "ゲスト購入と会員アカウントを切り替え、住所や特典、設定を管理できます。",
      zh: "在游客结账与会员账户之间切换，并管理地址、奖励与偏好设置。",
      ko: "게스트 체크아웃과 멤버 계정을 전환하며 주소, 리워드, 선호 설정을 관리합니다.",
    },
  },
  giftCards: {
    title: {
      th: "บัตรของขวัญอาหารไทย | Siam Lux",
      en: "Gift Cards | Siam Lux",
      ja: "ギフトカード | Siam Lux",
      zh: "礼品卡 | Siam Lux",
      ko: "기프트 카드 | Siam Lux",
    },
    description: {
      th: "ซื้อบัตรของขวัญสำหรับมื้อค่ำ ชุดพิเศษ หรือการมอบเครดิตให้แขกคนสำคัญ",
      en: "Purchase premium gift cards for dinners, tasting menus, and meaningful guest gifting.",
      ja: "ディナーやコース利用に向けた上質なギフトカード購入ページです。",
      zh: "购买适用于晚宴、套餐与送礼场景的高级礼品卡。",
      ko: "디너와 테이스팅, 의미 있는 선물에 맞춘 프리미엄 기프트 카드 페이지입니다.",
    },
  },
  rewards: {
    title: {
      th: "แลกแต้มและรางวัล | Siam Lux",
      en: "Rewards & Redemptions | Siam Lux",
      ja: "ポイント交換 | Siam Lux",
      zh: "积分兑换 | Siam Lux",
      ko: "리워드 교환 | Siam Lux",
    },
    description: {
      th: "ดูระดับสมาชิก เครดิตสะสม และแลกรางวัลเป็นเครดิตสำหรับมื้อถัดไป",
      en: "Review loyalty tiers, available reward credits, and redeem points into usable wallet value.",
      ja: "会員ランク、利用可能特典、ポイント交換を一画面で管理します。",
      zh: "查看会员等级、可用奖励并把积分兑换为钱包额度。",
      ko: "멤버십 등급과 사용 가능한 보상을 확인하고 포인트를 크레딧으로 교환합니다.",
    },
  },
  buildSet: {
    title: {
      th: "จัดชุดอาหารเอง | Siam Lux",
      en: "Build Your Own Set | Siam Lux",
      ja: "セットを組み立てる | Siam Lux",
      zh: "自选套餐 | Siam Lux",
      ko: "세트 직접 구성 | Siam Lux",
    },
    description: {
      th: "เลือกจานเปิด สำรับหลัก และของหวานเพื่อสร้างชุดอาหารไทยในสไตล์ของคุณ",
      en: "Compose your own Thai set menu from opening plates, mains, and desserts.",
      ja: "前菜、主菜、甘味を選んで自分だけのタイセットを作れます。",
      zh: "从开胃菜、主菜与甜品中组合属于自己的泰式套餐。",
      ko: "스타터, 메인, 디저트를 골라 나만의 태국 세트를 구성합니다.",
    },
  },
  catering: {
    title: {
      th: "จัดเลี้ยงและสำรับงานพิเศษ | Siam Lux",
      en: "Catering & Event Builder | Siam Lux",
      ja: "ケータリングとイベント構成 | Siam Lux",
      zh: "宴会与活动配置 | Siam Lux",
      ko: "케이터링 및 이벤트 빌더 | Siam Lux",
    },
    description: {
      th: "ออกแบบชุดจัดเลี้ยง เลือกแพ็กเกจ จำนวนแขก และสไตล์เสิร์ฟสำหรับงานพรีเมียม",
      en: "Build Thai catering packages with guest counts, service styles, and premium hosting formats.",
      ja: "人数、提供形式、構成を選んで上質なケータリングを組み立てられます。",
      zh: "按人数、服务形式与高端场景搭配宴会套餐。",
      ko: "인원과 서비스 스타일, 프리미엄 호스팅 포맷으로 케이터링을 구성합니다.",
    },
  },
  specials: {
    title: {
      th: "ชุดพิเศษและฤดูกาล | Siam Lux",
      en: "Specials & Seasonal Menus | Siam Lux",
      ja: "特集と季節メニュー | Siam Lux",
      zh: "精选套餐与季节限定 | Siam Lux",
      ko: "스페셜 및 시즌 메뉴 | Siam Lux",
    },
    description: {
      th: "รวมชุดอาหารคัดสรร ชุดชิมเมนู และเมนูเด่นตามฤดูกาลของร้าน",
      en: "A curated home for tasting menus, festive collections, and premium specials.",
      ja: "テイスティングや季節企画をまとめた特集ページです。",
      zh: "集中展示品鉴套餐、节庆企划与高级限定菜单。",
      ko: "테이스팅과 시즌 기획, 프리미엄 스페셜을 모아 둔 공간입니다.",
    },
  },
  heritage: {
    title: {
      th: "เรื่องราวร้าน | Siam Lux",
      en: "Heritage Story | Siam Lux",
      ja: "ブランドストーリー | Siam Lux",
      zh: "品牌传承 | Siam Lux",
      ko: "브랜드 헤리티지 | Siam Lux",
    },
    description: {
      th: "อ่านประวัติร้าน ทีมครัว และแนวคิดอาหารไทยพรีเมียมในสไตล์ Siam Lux",
      en: "Discover the house heritage, kitchen team, and premium Thai brand story behind Siam Lux.",
      ja: "Siam Lux の背景にある物語、料理チーム、世界観を紹介します。",
      zh: "了解 Siam Lux 的品牌传承、厨房团队与高级泰式定位。",
      ko: "Siam Lux의 브랜드 스토리와 키친 팀, 프리미엄 태국 다이닝 세계관을 소개합니다.",
    },
  },
  account: {
    title: {
      th: "บัญชีผู้ใช้และสิทธิพิเศษ | Siam Lux",
      en: "Account & Privileges | Siam Lux",
      ja: "アカウントと特典 | Siam Lux",
      zh: "账户与礼遇 | Siam Lux",
      ko: "계정 및 혜택 | Siam Lux",
    },
    description: {
      th: "รวมคำสั่งซื้อ ที่อยู่ วิธีชำระเงิน กระเป๋าของขวัญ และการจองไว้ในแดชบอร์ดเดียว",
      en: "Manage saved addresses, payments, rewards, reservations, and order history from one guest dashboard.",
      ja: "住所、支払い、特典、予約、注文履歴を一つの画面で管理します。",
      zh: "在同一仪表板中管理地址、支付方式、奖励、预订与订单历史。",
      ko: "주소, 결제, 리워드, 예약, 주문 이력을 하나의 대시보드에서 관리합니다.",
    },
  },
  compareBranches: {
    title: {
      th: "เปรียบเทียบสาขา | Siam Lux",
      en: "Compare Branches | Siam Lux",
      ja: "店舗比較 | Siam Lux",
      zh: "门店对比 | Siam Lux",
      ko: "지점 비교 | Siam Lux",
    },
    description: {
      th: "เทียบจุดเด่นของแต่ละสาขา ทั้งห้องส่วนตัว รับเอง เดลิเวอรี และบรรยากาศที่เหมาะกับแต่ละโอกาส",
      en: "Compare branch strengths across hosting, pickup, delivery, private dining, and different guest occasions.",
      ja: "店舗ごとの強みを、接待、受取、配送、個室、利用シーンごとに比較できます。",
      zh: "从招待、自取、配送、包厢与不同场景角度对比分店差异。",
      ko: "호스팅, 픽업, 배달, 프라이빗 다이닝, 방문 목적별로 지점 강점을 비교합니다.",
    },
  },
  pairings: {
    title: {
      th: "เครื่องดื่มจับคู่ | Siam Lux",
      en: "Beverage Pairings | Siam Lux",
      ja: "ペアリング | Siam Lux",
      zh: "饮品搭配 | Siam Lux",
      ko: "음료 페어링 | Siam Lux",
    },
    description: {
      th: "ดูการจับคู่เครื่องดื่มกับเมนูไทยเพื่อเพิ่มประสบการณ์ร้านให้สมบูรณ์และพรีเมียมขึ้น",
      en: "Explore beverage pairings that elevate Thai dishes and complete the premium house experience.",
      ja: "料理体験を引き上げる飲み物ペアリングをまとめたページです。",
      zh: "查看提升泰式菜品体验的饮品搭配建议。",
      ko: "태국 요리 경험을 한층 끌어올리는 음료 페어링을 소개합니다.",
    },
  },
  contact: {
    title: {
      th: "สาขาและเวลาพร้อมให้บริการ | Siam Lux",
      en: "Branches & Availability | Siam Lux",
      ja: "店舗と提供時間 | Siam Lux",
      zh: "门店与营业可用性 | Siam Lux",
      ko: "지점 및 이용 가능 시간 | Siam Lux",
    },
    description: {
      th: "ดูสาขา จุดเด่น และตารางสรุปความพร้อมของการนั่งทานที่ร้าน รับเอง เดลิเวอรี และห้องส่วนตัวในแต่ละช่วงเวลา",
      en: "Explore branches with dine-in, pickup, delivery, and private dining availability by time window.",
      ja: "店舗ごとの来店、受取、配送、個室の提供状況を時間帯ごとに確認できます。",
      zh: "查看各门店在不同时间段的堂食、自取、配送与包厢可用性。",
      ko: "지점별 다이닝, 픽업, 딜리버리, 프라이빗 다이닝 가용성을 시간대별로 확인합니다.",
    },
  },
  help: {
    title: {
      th: "ศูนย์ช่วยเหลือ | Siam Lux",
      en: "Help Center | Siam Lux",
      ja: "ヘルプセンター | Siam Lux",
      zh: "帮助中心 | Siam Lux",
      ko: "도움말 센터 | Siam Lux",
    },
    description: {
      th: "รวมคำถามที่พบบ่อย ข้อมูลแพ้อาหาร การรับสินค้า การจอง และการใช้โค้ดส่วนลด",
      en: "Find answers for allergens, pickup, reservations, promo codes, and ordering flows.",
      ja: "アレルゲン、受取、予約、クーポン、注文導線に関する答えをまとめています。",
      zh: "集中整理过敏原、自取、预订、优惠码与点餐流程的常见解答。",
      ko: "알레르기, 픽업, 예약, 프로모 코드, 주문 흐름에 대한 답변을 모았습니다.",
    },
  },
  policies: {
    title: {
      th: "นโยบายการใช้งาน | Siam Lux",
      en: "Policies | Siam Lux",
      ja: "ポリシー | Siam Lux",
      zh: "政策说明 | Siam Lux",
      ko: "정책 안내 | Siam Lux",
    },
    description: {
      th: "รวม privacy, terms และคำอธิบายการเก็บสถานะบนอุปกรณ์สำหรับเว็บร้านอาหารที่พร้อม production มากขึ้น",
      en: "A clear legal hub for privacy, terms, and device storage guidance across the restaurant experience.",
      ja: "プライバシー、利用規約、端末保存に関する案内をまとめた法務ページです。",
      zh: "集中展示隐私、条款与设备存储说明的法律页面。",
      ko: "개인정보, 이용약관, 기기 저장소 안내를 모아 둔 정책 허브입니다.",
    },
  },
  trust: {
    title: {
      th: "ศูนย์ความเชื่อมั่น | Siam Lux",
      en: "Trust Center | Siam Lux",
      ja: "信頼センター | Siam Lux",
      zh: "信任中心 | Siam Lux",
      ko: "트러스트 센터 | Siam Lux",
    },
    description: {
      th: "รวมนโยบายแพ้อาหาร เดลิเวอรี รับเอง การยกเลิก การจอง และใบเสร็จในหน้าที่อ่านง่าย",
      en: "A trust hub for allergens, delivery, pickup, cancellations, reservations, and receipt guidance.",
      ja: "アレルゲン、配送、受取、返金、予約、領収書に関する案内をまとめています。",
      zh: "汇总过敏原、配送、自取、取消、预订与收据说明的信任中心。",
      ko: "알레르기, 배달, 픽업, 취소, 예약, 영수증 안내를 모아 둔 신뢰 허브입니다.",
    },
  },
};

export function getPageMetadata(locale: AppLocale, key: PageMetadataKey, path: string): Metadata {
  const copy = pageCopy[key];
  const title = copy.title[locale];
  const description = copy.description[locale];
  const url = `${siteConfig.url}${path}`;

  return {
    title,
    description,
    alternates: {
      canonical: path,
    },
    openGraph: {
      title,
      description,
      type: "website",
      url,
      siteName: siteConfig.name,
      images: [{ url: siteConfig.ogImage, alt: title }],
      locale,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [siteConfig.ogImage],
    },
  };
}

export function getRestaurantSchema(locale: AppLocale, path: string, title: string, description: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name: siteConfig.name,
    url: `${siteConfig.url}${path}`,
    image: `${siteConfig.url}${siteConfig.ogImage}`,
    servesCuisine: "Thai",
    areaServed: "Thailand",
    inLanguage: locale,
    description,
    slogan: title,
    priceRange: "$$",
  };
}
