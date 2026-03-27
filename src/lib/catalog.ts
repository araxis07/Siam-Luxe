import type { AppLocale } from "@/i18n/routing";

type LocalizedText = Partial<Record<AppLocale, string>> & {
  th: string;
  en: string;
};

export type CategoryId =
  | "signature"
  | "curries"
  | "wokGrill"
  | "riceNoodles"
  | "sweetFinish";

export type RegionId = "nationwide" | "central" | "north" | "northeast" | "south";

export type ToppingId =
  | "jasmineRice"
  | "softEgg"
  | "crispyShallots"
  | "extraHerbs"
  | "pickledMango"
  | "coconutFoam"
  | "stickyRice";

interface CategoryDefinition {
  id: CategoryId;
  label: LocalizedText;
  description: LocalizedText;
  icon: "crown" | "leaf" | "flame" | "bowl" | "sparkles";
}

interface RegionDefinition {
  id: RegionId;
  label: LocalizedText;
  description: LocalizedText;
}

interface ToppingDefinition {
  id: ToppingId;
  label: LocalizedText;
  price: number;
}

interface PromotionDefinition {
  id: string;
  code: string;
  title: LocalizedText;
  description: LocalizedText;
  accentClass: string;
}

interface DishDefinition {
  id: string;
  category: CategoryId;
  region: RegionId;
  image: string;
  name: LocalizedText;
  description: LocalizedText;
  price: number;
  rating: number;
  prepMinutes: number;
  baseSpice: number;
  featured: boolean;
  accentClass: string;
  availableToppings: ToppingId[];
}

export interface LocalizedCategory {
  id: CategoryId;
  label: string;
  description: string;
  icon: CategoryDefinition["icon"];
}

export interface LocalizedRegion {
  id: RegionId;
  label: string;
  description: string;
}

export interface LocalizedPromotion {
  id: string;
  code: string;
  title: string;
  description: string;
  accentClass: string;
}

export interface LocalizedTopping {
  id: ToppingId;
  label: string;
  price: number;
}

export interface LocalizedMenuDish {
  id: string;
  category: CategoryId;
  categoryLabel: string;
  region: RegionId;
  regionLabel: string;
  image: string;
  name: string;
  description: string;
  price: number;
  rating: number;
  prepMinutes: number;
  baseSpice: number;
  featured: boolean;
  accentClass: string;
  availableToppings: LocalizedTopping[];
}

const categories: CategoryDefinition[] = [
  {
    id: "signature",
    icon: "crown",
    label: {
      th: "ซิกเนเจอร์",
      en: "Signature",
      ja: "シグネチャー",
      zh: "招牌",
      ko: "시그니처",
    },
    description: {
      th: "เมนูที่สะท้อนรสชาติไทยแบบหรูหราและร่วมสมัย",
      en: "Polished house signatures with a refined Thai identity.",
      ja: "上質なタイらしさを映す看板料理。",
      zh: "体现现代泰式高级感的招牌菜。",
      ko: "세련된 태국 감성을 담은 대표 메뉴.",
    },
  },
  {
    id: "curries",
    icon: "leaf",
    label: {
      th: "แกง",
      en: "Curries",
      ja: "カレー",
      zh: "咖喱",
      ko: "커리",
    },
    description: {
      th: "เครื่องแกงสด กลิ่นสมุนไพร และความเข้มข้นที่สมดุล",
      en: "Herb-forward curries with deep, composed spice.",
      ja: "香り高いハーブと奥行きある辛さ。",
      zh: "草本香气鲜明、层次丰富的泰式咖喱。",
      ko: "허브 향과 깊은 풍미가 살아 있는 커리.",
    },
  },
  {
    id: "wokGrill",
    icon: "flame",
    label: {
      th: "ผัดและย่าง",
      en: "Wok & Grill",
      ja: "炒め・グリル",
      zh: "炒锅与炙烤",
      ko: "웍 & 그릴",
    },
    description: {
      th: "จานไฟแรงและกลิ่นถ่านที่ให้สัมผัสเข้มข้นชัดเจน",
      en: "High-heat wok notes and charcoal smoke in balance.",
      ja: "高火力の香ばしさと炭火の余韻。",
      zh: "锅气与炭香兼具的强烈风味。",
      ko: "강한 웍 향과 숯불 향의 균형.",
    },
  },
  {
    id: "riceNoodles",
    icon: "bowl",
    label: {
      th: "ข้าวและเส้น",
      en: "Rice & Noodles",
      ja: "ご飯・麺",
      zh: "饭与面",
      ko: "라이스 & 누들",
    },
    description: {
      th: "จานหลักที่อิ่มสบายแต่ยังคงโทนพรีเมียม",
      en: "Comfort plates with a premium, composed finish.",
      ja: "満足感がありつつ上品に仕上げた主食。",
      zh: "兼具满足感与高级感的主食选择。",
      ko: "편안함과 고급스러움을 함께 담은 메인 플레이트.",
    },
  },
  {
    id: "sweetFinish",
    icon: "sparkles",
    label: {
      th: "ของหวาน",
      en: "Sweet Finish",
      ja: "デザート",
      zh: "甜品",
      ko: "디저트",
    },
    description: {
      th: "ของหวานไทยตีความใหม่ด้วยสัมผัสเบาและหอมละมุน",
      en: "Contemporary Thai desserts with a soft, elegant lift.",
      ja: "軽やかで現代的に再解釈したタイデザート。",
      zh: "以轻盈方式重新演绎的泰式甜点。",
      ko: "부드럽고 현대적으로 재해석한 태국식 디저트.",
    },
  },
];

const regions: RegionDefinition[] = [
  {
    id: "nationwide",
    label: {
      th: "อาหารไทยคลาสสิก",
      en: "Thai Classics",
    },
    description: {
      th: "จานประจำชาติที่คนทั่วโลกรู้จักและสั่งซ้ำได้ทุกโอกาส",
      en: "National favorites that define the most recognizable Thai table.",
    },
  },
  {
    id: "central",
    label: {
      th: "ภาคกลาง",
      en: "Central Thailand",
    },
    description: {
      th: "รสกลมกล่อมแบบราชสำนัก กรุงเทพฯ และลุ่มเจ้าพระยา",
      en: "Balanced royal-style flavors from Bangkok and the Chao Phraya heartland.",
    },
  },
  {
    id: "north",
    label: {
      th: "ภาคเหนือ",
      en: "Northern Thailand",
    },
    description: {
      th: "กลิ่นเครื่องเทศลานนา ซุปเส้นเข้มข้น และของหวานละมุนจากวัตถุดิบพื้นถิ่น",
      en: "Lanna spice, comforting broths, and softer sweets shaped by mountain ingredients.",
    },
  },
  {
    id: "northeast",
    label: {
      th: "อีสาน",
      en: "Northeastern Thailand",
    },
    description: {
      th: "รสจัด เปรี้ยว เค็ม หอมข้าวคั่ว เหมาะกับสายอาหารแซ่บแบบจริงจัง",
      en: "Bold Isan flavors with roasted rice, lime, herbs, and unapologetic heat.",
    },
  },
  {
    id: "south",
    label: {
      th: "ภาคใต้",
      en: "Southern Thailand",
    },
    description: {
      th: "รสเครื่องเทศหนักแน่น ซีฟู้ดจัดจ้าน และขนมจากมะพร้าวกับโรตี",
      en: "Spice-driven southern cooking with bright seafood and coconut-rich sweets.",
    },
  },
];

const toppings: ToppingDefinition[] = [
  {
    id: "jasmineRice",
    price: 40,
    label: {
      th: "ข้าวหอมมะลิ",
      en: "Jasmine rice",
      ja: "ジャスミンライス",
      zh: "香米饭",
      ko: "재스민 라이스",
    },
  },
  {
    id: "softEgg",
    price: 35,
    label: {
      th: "ไข่ลวกนุ่ม",
      en: "Soft egg",
      ja: "半熟たまご",
      zh: "溏心蛋",
      ko: "반숙 계란",
    },
  },
  {
    id: "crispyShallots",
    price: 25,
    label: {
      th: "หอมเจียวกรอบ",
      en: "Crispy shallots",
      ja: "フライドエシャロット",
      zh: "香脆红葱头",
      ko: "바삭한 샬롯",
    },
  },
  {
    id: "extraHerbs",
    price: 30,
    label: {
      th: "สมุนไพรเพิ่ม",
      en: "Extra herbs",
      ja: "ハーブ追加",
      zh: "加香草",
      ko: "허브 추가",
    },
  },
  {
    id: "pickledMango",
    price: 28,
    label: {
      th: "มะม่วงดอง",
      en: "Pickled mango",
      ja: "マンゴーピクルス",
      zh: "腌芒果",
      ko: "절인 망고",
    },
  },
  {
    id: "coconutFoam",
    price: 45,
    label: {
      th: "โฟมกะทิ",
      en: "Coconut foam",
      ja: "ココナッツフォーム",
      zh: "椰香泡沫",
      ko: "코코넛 폼",
    },
  },
  {
    id: "stickyRice",
    price: 40,
    label: {
      th: "ข้าวเหนียว",
      en: "Sticky rice",
      ja: "もち米",
      zh: "糯米饭",
      ko: "찹쌀밥",
    },
  },
];

const promotions: PromotionDefinition[] = [
  {
    id: "golden-hour",
    code: "GOLD15",
    title: {
      th: "ส่วนลด Golden Hour 15%",
      en: "Golden Hour 15% Off",
      ja: "ゴールデンアワー 15% オフ",
      zh: "黄金时段 15% 优惠",
      ko: "골든아워 15% 할인",
    },
    description: {
      th: "สั่งก่อน 18:00 สำหรับมื้อเย็นที่ดูพรีเมียมขึ้นในราคาสบายกว่า",
      en: "Order before 18:00 for a lighter price on a polished dinner spread.",
      ja: "18時前の注文で、上質なディナーを少し気軽に。",
      zh: "18:00 前下单，让精致晚餐更轻松入手。",
      ko: "오후 6시 이전 주문 시 고급스러운 저녁을 더 부담 없이.",
    },
    accentClass:
      "from-[#6d1f25]/90 via-[#2d0d12]/80 to-[#0e0908]/90 ring-[#d6b26a]/35",
  },
  {
    id: "dessert-pairing",
    code: "MANGO",
    title: {
      th: "ฟรีข้าวเหนียวมะม่วงเมื่อครบ ฿1,500",
      en: "Complimentary Mango Sweet Finish over ฿1,500",
      ja: "฿1,500 以上でマンゴーデザート進呈",
      zh: "满 ฿1,500 赠芒果甜品",
      ko: "฿1,500 이상 주문 시 망고 디저트 제공",
    },
    description: {
      th: "เติมตอนจบของมื้อให้หอมหวานในโทนไทยร่วมสมัย",
      en: "A polished Thai dessert pairing to close the meal with calm sweetness.",
      ja: "食後をやさしく締める上品なタイデザート。",
      zh: "以清雅甜味为整餐收尾的泰式甜点搭配。",
      ko: "식사의 마무리를 우아하게 완성하는 태국식 디저트.",
    },
    accentClass:
      "from-[#12372b]/95 via-[#10231d]/85 to-[#090c0b]/95 ring-[#d6b26a]/28",
  },
  {
    id: "chef-bundle",
    code: "SIAMLUX",
    title: {
      th: "ชุดลายเซ็นเชฟพร้อมชาดอกไม้เย็น",
      en: "Chef Signature Bundle with Floral Iced Tea",
      ja: "シェフシグネチャーセット + フローラルアイスティー",
      zh: "主厨招牌套餐 + 花香冰茶",
      ko: "셰프 시그니처 번들 + 플로럴 아이스티",
    },
    description: {
      th: "คัดเมนูเด่น 3 จานในเซ็ตที่พร้อมแชร์หรือดินเนอร์แบบตั้งใจ",
      en: "Three best sellers arranged for sharing, hosting, or an elevated night in.",
      ja: "シェアにも上質な夜にも似合う人気3皿セット。",
      zh: "三道热销菜组合，适合分享或精致居家晚餐。",
      ko: "공유 식사나 우아한 홈다이닝에 어울리는 인기 3종 구성.",
    },
    accentClass:
      "from-[#241713]/95 via-[#120d0c]/88 to-[#090708]/95 ring-[#d6b26a]/32",
  },
];

const dishes: DishDefinition[] = [
  {
    id: "royal-tom-yum",
    category: "signature",
    region: "nationwide",
    image: "/images/dishes/royal-tom-yum.svg",
    price: 590,
    rating: 4.9,
    prepMinutes: 18,
    baseSpice: 4,
    featured: true,
    accentClass:
      "from-[#6e1f26]/90 via-[#2d0f13]/80 to-[#120a09]/95 ring-[#c89f5a]/35",
    availableToppings: ["jasmineRice", "extraHerbs", "crispyShallots"],
    name: {
      th: "ต้มยำกุ้งหลวง",
      en: "Royal Tom Yum Lobster Broth",
      ja: "ロイヤル トムヤム ロブスターブロス",
      zh: "御品冬阴功龙虾汤",
      ko: "로열 똠얌 랍스터 브로스",
    },
    description: {
      th: "ต้มยำกุ้งน้ำใสเข้มข้น หอมสมุนไพรสดและพริกเผาในแบบอาหารไทยที่คนทั่วโลกรู้จัก",
      en: "A refined tom yum with river prawn, herbs, and the bright spice that anchors the Thai classics table.",
      ja: "川エビと香草を重ねた、タイ料理を象徴する上質なトムヤム。",
      zh: "河虾与香草层层叠出的经典冬阴功，高级而利落。",
      ko: "민물새우와 허브가 살아 있는, 태국 클래식을 대표하는 프리미엄 똠얌.",
    },
  },
  {
    id: "lanna-khao-soi",
    category: "riceNoodles",
    region: "north",
    image: "/images/dishes/emerald-green-curry.svg",
    price: 420,
    rating: 4.9,
    prepMinutes: 16,
    baseSpice: 3,
    featured: true,
    accentClass:
      "from-[#876022]/92 via-[#2a170e]/82 to-[#0c0908]/95 ring-[#d5b36f]/30",
    availableToppings: ["softEgg", "crispyShallots", "pickledMango"],
    name: {
      th: "ข้าวซอยลานนา",
      en: "Lanna Khao Soi",
    },
    description: {
      th: "เส้นไข่ในน้ำแกงกะทิเครื่องเทศเหนือ เสิร์ฟกับเส้นกรอบ ผักดอง และหอมเจียว",
      en: "Northern egg noodles in a rich coconut curry, finished with crispy noodles, pickled mustard greens, and shallots.",
    },
  },
  {
    id: "kua-kling-beef",
    category: "wokGrill",
    region: "south",
    image: "/images/dishes/fire-basil-wagyu.svg",
    price: 510,
    rating: 4.9,
    prepMinutes: 15,
    baseSpice: 5,
    featured: true,
    accentClass:
      "from-[#5f1918]/92 via-[#220d0c]/84 to-[#090708]/95 ring-[#c79d58]/32",
    availableToppings: ["jasmineRice", "softEgg", "extraHerbs"],
    name: {
      th: "คั่วกลิ้งเนื้อใต้",
      en: "Southern Kua Kling Beef",
    },
    description: {
      th: "เนื้อผัดพริกแกงใต้แห้ง ๆ หอมตะไคร้ ใบมะกรูด และความเผ็ดจัดแบบภาคใต้",
      en: "Dry southern curry beef with lemongrass, kaffir lime leaf, and the signature deep heat of the south.",
    },
  },
  {
    id: "charcoal-pad-thai",
    category: "riceNoodles",
    region: "nationwide",
    image: "/images/dishes/charcoal-pad-thai.svg",
    price: 360,
    rating: 4.8,
    prepMinutes: 14,
    baseSpice: 2,
    featured: true,
    accentClass:
      "from-[#4e2514]/92 via-[#1b0f0b]/82 to-[#0c0a08]/95 ring-[#caa66b]/30",
    availableToppings: ["softEgg", "pickledMango", "crispyShallots"],
    name: {
      th: "ผัดไทยเตาถ่าน",
      en: "Charcoal Pad Thai",
      ja: "チャコール パッタイ",
      zh: "炭香泰式炒河粉",
      ko: "차콜 팟타이",
    },
    description: {
      th: "เส้นผัดซอสเข้มข้น กลิ่นหอมถ่านบาง ๆ ถั่วลิสงคั่ว และกุ้งหวานเด้ง",
      en: "Smoky wok-fired noodles with tamarind gloss, toasted peanuts, and springy prawns.",
      ja: "炭の香りをまとったタマリンド仕立ての上品なパッタイ。",
      zh: "酸甜罗望子酱裹着炭香锅气，配烤花生与弹牙虾仁。",
      ko: "타마린드 소스와 은은한 숯향이 어우러진 세련된 팟타이.",
    },
  },
  {
    id: "fire-basil-wagyu",
    category: "wokGrill",
    region: "nationwide",
    image: "/images/dishes/fire-basil-wagyu.svg",
    price: 520,
    rating: 4.9,
    prepMinutes: 15,
    baseSpice: 5,
    featured: true,
    accentClass:
      "from-[#571a18]/92 via-[#210d0c]/84 to-[#090708]/95 ring-[#c79d58]/32",
    availableToppings: ["softEgg", "jasmineRice", "crispyShallots"],
    name: {
      th: "กะเพราเนื้อวากิวไฟแรง",
      en: "Fire Basil Wagyu",
      ja: "ファイヤー バジル 和牛",
      zh: "烈火打抛和牛",
      ko: "파이어 바질 와규",
    },
    description: {
      th: "เนื้อวากิวผัดใบกะเพรา พริกสด และซอสเค็มหวานที่คมชัดแต่ยังกลมกล่อม",
      en: "Wagyu tossed over high heat with holy basil, fresh chili, and a clean savory finish.",
      ja: "ホーリーバジルと唐辛子で仕上げた、火力のある和牛炒め。",
      zh: "高火快炒和牛、打抛叶与鲜辣椒，咸鲜利落而平衡。",
      ko: "홀리 바질과 생고추, 와규를 강한 불맛으로 완성한 대표 볶음 요리.",
    },
  },
  {
    id: "mango-sticky-cloud",
    category: "sweetFinish",
    region: "nationwide",
    image: "/images/dishes/mango-sticky-cloud.svg",
    price: 260,
    rating: 4.8,
    prepMinutes: 9,
    baseSpice: 0,
    featured: false,
    accentClass:
      "from-[#5c4318]/90 via-[#2a1d0e]/82 to-[#0c0907]/95 ring-[#e3be77]/30",
    availableToppings: ["coconutFoam", "stickyRice"],
    name: {
      th: "มะม่วงข้าวเหนียวคลาวด์",
      en: "Mango Sticky Cloud",
      ja: "マンゴー スティッキー クラウド",
      zh: "云感芒果糯米甜点",
      ko: "망고 스티키 클라우드",
    },
    description: {
      th: "มะม่วงสุก ข้าวเหนียวมูน และโฟมกะทิเบา ๆ สำหรับตอนจบที่ดูนุ่มนวล",
      en: "Ripe mango, glossy sticky rice, and an airy coconut finish for a soft landing.",
      ja: "熟したマンゴーと軽やかなココナッツで締める優美な甘味。",
      zh: "熟芒果、油润糯米与轻盈椰香泡沫构成柔和收尾。",
      ko: "잘 익은 망고와 찹쌀, 가벼운 코코넛 폼으로 마무리하는 디저트.",
    },
  },
  {
    id: "emerald-green-curry",
    category: "curries",
    region: "nationwide",
    image: "/images/dishes/emerald-green-curry.svg",
    price: 420,
    rating: 4.7,
    prepMinutes: 16,
    baseSpice: 3,
    featured: false,
    accentClass:
      "from-[#184637]/90 via-[#12251f]/82 to-[#0b0d0c]/95 ring-[#d3b06a]/28",
    availableToppings: ["jasmineRice", "extraHerbs", "softEgg"],
    name: {
      th: "แกงเขียวหวานมรกต",
      en: "Emerald Green Curry",
      ja: "エメラルド グリーンカレー",
      zh: "翡翠青咖喱",
      ko: "에메랄드 그린 커리",
    },
    description: {
      th: "แกงเขียวหวานไก่นุ่มกับมะเขือไทย โหระพา และกะทิหอมละมุนอย่างสมดุล",
      en: "Tender chicken in a vivid green curry with Thai eggplant, basil, and velvet coconut.",
      ja: "バジルとココナッツがやわらかく広がる、鮮やかなグリーンカレー。",
      zh: "鲜明青咖喱搭配嫩鸡、泰国圆茄与罗勒，椰香柔和顺滑。",
      ko: "부드러운 치킨과 태국 가지, 바질, 코코넛 풍미가 조화로운 그린 커리.",
    },
  },
  {
    id: "ruby-water-chestnut",
    category: "sweetFinish",
    region: "nationwide",
    image: "/images/dishes/mango-sticky-cloud.svg",
    price: 220,
    rating: 4.6,
    prepMinutes: 8,
    baseSpice: 0,
    featured: false,
    accentClass:
      "from-[#6d2430]/90 via-[#281318]/82 to-[#0d0908]/95 ring-[#dfb86f]/28",
    availableToppings: ["coconutFoam"],
    name: {
      th: "ทับทิมกรอบน้ำกะทิ",
      en: "Ruby Water Chestnut",
    },
    description: {
      th: "แห้วกรุบในเสื้อทับทิม เสิร์ฟกับน้ำกะทิเย็นและน้ำแข็งใสแบบหวานสดชื่น",
      en: "Classic ruby water chestnuts over chilled coconut milk for a crisp, cooling Thai dessert.",
    },
  },
  {
    id: "golden-crab-omelette",
    category: "signature",
    region: "central",
    image: "/images/dishes/river-prawn-rice.svg",
    price: 540,
    rating: 4.8,
    prepMinutes: 16,
    baseSpice: 1,
    featured: false,
    accentClass:
      "from-[#58411d]/92 via-[#1d120b]/82 to-[#090807]/95 ring-[#d4b26d]/30",
    availableToppings: ["pickledMango", "crispyShallots"],
    name: {
      th: "ไข่เจียวปูทอง",
      en: "Golden Crab Omelette",
    },
    description: {
      th: "ไข่เจียวฟูกรอบนอกนุ่มใน อัดแน่นเนื้อปูก้อน เสิร์ฟสไตล์ครัวภาคกลางร่วมสมัย",
      en: "A plush golden omelette packed with crab, inspired by the polished seafood kitchens of central Thailand.",
    },
  },
  {
    id: "boat-noodles-au-jus",
    category: "riceNoodles",
    region: "central",
    image: "/images/dishes/charcoal-pad-thai.svg",
    price: 310,
    rating: 4.7,
    prepMinutes: 13,
    baseSpice: 3,
    featured: false,
    accentClass:
      "from-[#4f2218]/92 via-[#1a0f0b]/82 to-[#090707]/95 ring-[#ca9d67]/28",
    availableToppings: ["softEgg", "crispyShallots", "extraHerbs"],
    name: {
      th: "ก๋วยเตี๋ยวเรือเข้มข้น",
      en: "Boat Noodles Au Jus",
    },
    description: {
      th: "ก๋วยเตี๋ยวเรือน้ำซุปเข้ม หอมเครื่องเทศและเลือดหมู ปรับลุคให้นิ่งแต่ยังได้รสจัดจ้าน",
      en: "Concentrated boat noodles with spice, depth, and a cleaner luxury finish for central Thai comfort.",
    },
  },
  {
    id: "massaman-short-rib",
    category: "curries",
    region: "central",
    image: "/images/dishes/emerald-green-curry.svg",
    price: 490,
    rating: 4.8,
    prepMinutes: 18,
    baseSpice: 2,
    featured: false,
    accentClass:
      "from-[#4e3217]/92 via-[#1b110b]/82 to-[#090807]/95 ring-[#d8b26a]/30",
    availableToppings: ["jasmineRice", "pickledMango"],
    name: {
      th: "มัสมั่นซี่โครงตุ๋น",
      en: "Massaman Short Rib",
    },
    description: {
      th: "แกงมัสมั่นหอมเครื่องเทศ ถั่ว มันฝรั่ง และซี่โครงเนื้อตุ๋นนุ่มในโทนภาคกลางแบบร่วมสมัย",
      en: "Slow-braised short rib in an aromatic massaman with potato and warm spice from the central table.",
    },
  },
  {
    id: "pandan-satay",
    category: "wokGrill",
    region: "central",
    image: "/images/dishes/pandan-satay.svg",
    price: 340,
    rating: 4.7,
    prepMinutes: 12,
    baseSpice: 2,
    featured: false,
    accentClass:
      "from-[#194033]/92 via-[#12211c]/82 to-[#090b0a]/95 ring-[#d1ae6c]/28",
    availableToppings: ["pickledMango", "crispyShallots", "extraHerbs"],
    name: {
      th: "สะเต๊ะไก่ใบเตย",
      en: "Pandan Chicken Satay",
      ja: "パンダン チキンサテー",
      zh: "香兰鸡肉沙嗲",
      ko: "판단 치킨 사테",
    },
    description: {
      th: "ไก่หมักหอมใบเตย ย่างนุ่ม เสิร์ฟคู่ซอสถั่วและอาจาดสไตล์มินิมัลหรู",
      en: "Fragrant pandan-marinated skewers with peanut sauce and a bright pickled finish.",
      ja: "パンダンの香りをまとわせたやわらかなサテー。",
      zh: "香兰叶腌制鸡串，搭配花生酱与清爽小菜。",
      ko: "판단 향을 머금은 닭꼬치와 산뜻한 피클, 땅콩 소스 조합.",
    },
  },
  {
    id: "river-prawn-rice",
    category: "riceNoodles",
    region: "central",
    image: "/images/dishes/river-prawn-rice.svg",
    price: 410,
    rating: 4.6,
    prepMinutes: 17,
    baseSpice: 1,
    featured: false,
    accentClass:
      "from-[#4b3218]/92 via-[#1b100b]/82 to-[#090807]/95 ring-[#d4b26d]/30",
    availableToppings: ["softEgg", "pickledMango", "extraHerbs"],
    name: {
      th: "ข้าวผัดกุ้งแม่น้ำ",
      en: "River Prawn Fried Rice",
      ja: "川エビ フライドライス",
      zh: "河虾炒饭",
      ko: "민물새우 볶음밥",
    },
    description: {
      th: "ข้าวผัดหอมกระทะกับมันกุ้ง ไข่ และมะนาวสดในโทนอบอุ่นสบายแต่หรู",
      en: "Comforting fried rice enriched with prawn fat, egg ribbon, and citrus lift.",
      ja: "海老の旨みと柑橘の軽さが合わさる、上品な炒飯。",
      zh: "以虾膏与蛋丝提升香气，再以青柠收尾的精致炒饭。",
      ko: "새우 풍미와 계란, 라임 산미가 조화로운 편안한 프리미엄 볶음밥.",
    },
  },
  {
    id: "kanom-buang-royale",
    category: "sweetFinish",
    region: "central",
    image: "/images/dishes/mango-sticky-cloud.svg",
    price: 210,
    rating: 4.5,
    prepMinutes: 7,
    baseSpice: 0,
    featured: false,
    accentClass:
      "from-[#6a4020]/90 via-[#2c1a0f]/82 to-[#0c0907]/95 ring-[#e2bc74]/28",
    availableToppings: ["coconutFoam"],
    name: {
      th: "ขนมเบื้องกรอบทอง",
      en: "Royal Kanom Buang",
    },
    description: {
      th: "แป้งกรอบบาง ไส้ครีมมะพร้าวและฝอยทอง ตีความของหวานภาคกลางให้ดูเบาและหรูขึ้น",
      en: "Crisp Thai crepes with coconut cream and golden threads, refined from a beloved central dessert.",
    },
  },
  {
    id: "foi-thong-custard",
    category: "sweetFinish",
    region: "central",
    image: "/images/dishes/mango-sticky-cloud.svg",
    price: 230,
    rating: 4.6,
    prepMinutes: 8,
    baseSpice: 0,
    featured: false,
    accentClass:
      "from-[#6a4e1d]/90 via-[#2d210e]/82 to-[#0c0907]/95 ring-[#e2c074]/28",
    availableToppings: ["coconutFoam"],
    name: {
      th: "ฝอยทองคัสตาร์ดมะพร้าว",
      en: "Foi Thong Coconut Custard",
    },
    description: {
      th: "ฝอยทองเส้นละเอียดบนคัสตาร์ดมะพร้าวเนื้อเนียน กลิ่นหอมแบบขนมไทยภาคกลาง",
      en: "Delicate egg yolk threads over silk-smooth coconut custard for a polished central Thai sweet.",
    },
  },
  {
    id: "sai-ua-charcoal",
    category: "wokGrill",
    region: "north",
    image: "/images/dishes/pandan-satay.svg",
    price: 330,
    rating: 4.7,
    prepMinutes: 12,
    baseSpice: 3,
    featured: false,
    accentClass:
      "from-[#693122]/92 via-[#1f110d]/82 to-[#090807]/95 ring-[#d8b26b]/28",
    availableToppings: ["stickyRice", "pickledMango", "extraHerbs"],
    name: {
      th: "ไส้อั่วถ่านลานนา",
      en: "Lanna Charcoal Sai Ua",
    },
    description: {
      th: "ไส้อั่วสมุนไพรเหนือย่างหอม เสิร์ฟกับผักสดและข้าวเหนียวแบบกินง่ายแต่ยังคงกลิ่นอายล้านนา",
      en: "Herb-packed northern sausage grilled over charcoal with fresh vegetables and sticky rice.",
    },
  },
  {
    id: "gaeng-hang-lay",
    category: "curries",
    region: "north",
    image: "/images/dishes/emerald-green-curry.svg",
    price: 430,
    rating: 4.7,
    prepMinutes: 17,
    baseSpice: 2,
    featured: false,
    accentClass:
      "from-[#5a3119]/92 via-[#1a100b]/82 to-[#090807]/95 ring-[#d6af68]/28",
    availableToppings: ["jasmineRice", "pickledMango"],
    name: {
      th: "แกงฮังเลหมูนุ่ม",
      en: "Northern Gaeng Hang Lay",
    },
    description: {
      th: "หมูตุ๋นในแกงฮังเลรสเปรี้ยวหวานหอมขิง กระเทียม และเครื่องเทศเหนือ",
      en: "Slow-cooked pork in a sweet-sour northern curry scented with ginger, garlic, and warm spice.",
    },
  },
  {
    id: "nam-ngiao-noodles",
    category: "riceNoodles",
    region: "north",
    image: "/images/dishes/royal-tom-yum.svg",
    price: 340,
    rating: 4.6,
    prepMinutes: 14,
    baseSpice: 4,
    featured: false,
    accentClass:
      "from-[#6a241f]/92 via-[#210d0c]/82 to-[#090707]/95 ring-[#cd9b62]/28",
    availableToppings: ["crispyShallots", "extraHerbs", "softEgg"],
    name: {
      th: "ขนมจีนน้ำเงี้ยว",
      en: "Khanom Jeen Nam Ngiao",
    },
    description: {
      th: "ซุปรสเข้มแบบเหนือจากมะเขือเทศและหมูสับ เสิร์ฟกับขนมจีนและผักสด",
      en: "Northern fermented rice noodles in a savory tomato pork broth finished with fresh herbs.",
    },
  },
  {
    id: "nam-prik-noom-set",
    category: "signature",
    region: "north",
    image: "/images/dishes/pandan-satay.svg",
    price: 290,
    rating: 4.5,
    prepMinutes: 11,
    baseSpice: 3,
    featured: false,
    accentClass:
      "from-[#214734]/92 via-[#11211a]/82 to-[#090b0a]/95 ring-[#d0ab6a]/28",
    availableToppings: ["stickyRice", "extraHerbs"],
    name: {
      th: "น้ำพริกหนุ่มชุดผักลวก",
      en: "Nam Prik Noom Set",
    },
    description: {
      th: "น้ำพริกหนุ่มย่างหอม เสิร์ฟคู่แคบหมู ผักลวก และข้าวเหนียวในสไตล์โต๊ะเหนือ",
      en: "Roasted green chili dip with pork crackling, vegetables, and sticky rice for a classic northern set.",
    },
  },
  {
    id: "khao-taen-longan",
    category: "sweetFinish",
    region: "north",
    image: "/images/dishes/mango-sticky-cloud.svg",
    price: 190,
    rating: 4.4,
    prepMinutes: 6,
    baseSpice: 0,
    featured: false,
    accentClass:
      "from-[#684521]/90 via-[#28190f]/82 to-[#0c0907]/95 ring-[#ddb86f]/26",
    availableToppings: ["coconutFoam"],
    name: {
      th: "ข้าวแต๋นลำไยคาราเมล",
      en: "Khao Taen with Longan Caramel",
    },
    description: {
      th: "ข้าวแต๋นกรอบเคลือบคาราเมลลำไย ให้กลิ่นผลไม้ภาคเหนือในรูปแบบของหวานเบา ๆ",
      en: "Crisp northern rice cakes glazed with longan caramel for a light Lanna-style finish.",
    },
  },
  {
    id: "isaan-som-tum",
    category: "signature",
    region: "northeast",
    image: "/images/dishes/royal-tom-yum.svg",
    price: 240,
    rating: 4.8,
    prepMinutes: 10,
    baseSpice: 5,
    featured: false,
    accentClass:
      "from-[#6a1f21]/92 via-[#250d0d]/82 to-[#090707]/95 ring-[#c9965f]/28",
    availableToppings: ["stickyRice", "extraHerbs", "pickledMango"],
    name: {
      th: "ส้มตำอีสาน",
      en: "Isan Som Tum",
    },
    description: {
      th: "ส้มตำรสจัด เปรี้ยว เค็ม เผ็ด หอมปลาร้าและมะนาวสดในแบบอีสานแท้",
      en: "A bold northeastern papaya salad with lime, chilies, and the savory edge that makes Isan cuisine distinct.",
    },
  },
  {
    id: "larb-moo-khual",
    category: "wokGrill",
    region: "northeast",
    image: "/images/dishes/fire-basil-wagyu.svg",
    price: 320,
    rating: 4.7,
    prepMinutes: 12,
    baseSpice: 4,
    featured: false,
    accentClass:
      "from-[#561d18]/92 via-[#1e0d0c]/82 to-[#090707]/95 ring-[#c89e63]/28",
    availableToppings: ["stickyRice", "extraHerbs"],
    name: {
      th: "ลาบหมูคั่วข้าวคั่ว",
      en: "Larb Moo Khua",
    },
    description: {
      th: "หมูสับคลุกข้าวคั่ว หอมแดง สะระแหน่ และพริกป่น กลิ่นอีสานชัดเจนทุกคำ",
      en: "Minced pork larb with toasted rice, shallots, mint, and that unmistakable Isan perfume.",
    },
  },
  {
    id: "gai-yang-khao-niao",
    category: "wokGrill",
    region: "northeast",
    image: "/images/dishes/pandan-satay.svg",
    price: 350,
    rating: 4.7,
    prepMinutes: 13,
    baseSpice: 3,
    featured: false,
    accentClass:
      "from-[#5a341e]/92 via-[#1d110c]/82 to-[#090807]/95 ring-[#d4ac68]/28",
    availableToppings: ["stickyRice", "pickledMango"],
    name: {
      th: "ไก่ย่างข้าวเหนียว",
      en: "Isan Grilled Chicken Set",
    },
    description: {
      th: "ไก่ย่างหนังหอม เสิร์ฟคู่ข้าวเหนียวและน้ำจิ้มแจ่ว เหมาะกับคนชอบรสแซ่บแบบอีสาน",
      en: "Charcoal grilled chicken with sticky rice and jaew dipping sauce, built for a proper Isan meal.",
    },
  },
  {
    id: "nam-tok-beef",
    category: "wokGrill",
    region: "northeast",
    image: "/images/dishes/fire-basil-wagyu.svg",
    price: 390,
    rating: 4.8,
    prepMinutes: 13,
    baseSpice: 4,
    featured: false,
    accentClass:
      "from-[#5a1f19]/92 via-[#220d0c]/82 to-[#090707]/95 ring-[#c79c5e]/28",
    availableToppings: ["stickyRice", "extraHerbs"],
    name: {
      th: "น้ำตกเนื้อย่าง",
      en: "Nam Tok Beef",
    },
    description: {
      th: "เนื้อย่างคลุกน้ำปลา มะนาว พริกป่น และข้าวคั่ว ให้รสเปรี้ยวเผ็ดหอมแบบอีสาน",
      en: "Grilled beef tossed with lime, fish sauce, chili, and toasted rice in a vibrant northeastern salad style.",
    },
  },
  {
    id: "tom-saep-ribs",
    category: "signature",
    region: "northeast",
    image: "/images/dishes/royal-tom-yum.svg",
    price: 360,
    rating: 4.7,
    prepMinutes: 15,
    baseSpice: 5,
    featured: false,
    accentClass:
      "from-[#6a221d]/92 via-[#220d0c]/82 to-[#090707]/95 ring-[#c99961]/28",
    availableToppings: ["extraHerbs", "stickyRice"],
    name: {
      th: "ต้มแซ่บซี่โครงอ่อน",
      en: "Tom Saep Pork Ribs",
    },
    description: {
      th: "ซุปต้มแซ่บซี่โครงน้ำใส เปรี้ยวร้อนหอมสมุนไพร เหมาะกับคนชอบอาหารอีสานแบบซดคล่องคอ",
      en: "Clear hot-and-sour rib soup with herbs and full Isan intensity in every sip.",
    },
  },
  {
    id: "black-sticky-rice-taro",
    category: "sweetFinish",
    region: "northeast",
    image: "/images/dishes/mango-sticky-cloud.svg",
    price: 210,
    rating: 4.5,
    prepMinutes: 7,
    baseSpice: 0,
    featured: false,
    accentClass:
      "from-[#53331d]/90 via-[#21150d]/82 to-[#0c0907]/95 ring-[#d8b16b]/26",
    availableToppings: ["coconutFoam"],
    name: {
      th: "ข้าวเหนียวดำเผือกกะทิ",
      en: "Black Sticky Rice with Taro",
    },
    description: {
      th: "ข้าวเหนียวดำเนื้อหนึบกับเผือกและกะทิหวานเค็มแบบขนมพื้นบ้านที่กินง่าย",
      en: "Chewy black sticky rice with taro and coconut, inspired by homestyle northeastern sweets.",
    },
  },
  {
    id: "gaeng-som-seabass",
    category: "curries",
    region: "south",
    image: "/images/dishes/royal-tom-yum.svg",
    price: 470,
    rating: 4.8,
    prepMinutes: 17,
    baseSpice: 4,
    featured: false,
    accentClass:
      "from-[#7a3818]/92 via-[#24110b]/82 to-[#090807]/95 ring-[#d2a35f]/28",
    availableToppings: ["jasmineRice", "extraHerbs"],
    name: {
      th: "แกงส้มปลากะพงใต้",
      en: "Southern Gaeng Som Seabass",
    },
    description: {
      th: "แกงส้มใต้รสจัดกับปลากะพงและผักพื้นบ้าน ให้ความเปรี้ยวเผ็ดคมชัดแบบภาคใต้",
      en: "Bright southern sour curry with seabass and vegetables, built on sharp turmeric heat and acidity.",
    },
  },
  {
    id: "sataw-prawn-wok",
    category: "wokGrill",
    region: "south",
    image: "/images/dishes/fire-basil-wagyu.svg",
    price: 450,
    rating: 4.7,
    prepMinutes: 14,
    baseSpice: 4,
    featured: false,
    accentClass:
      "from-[#3d4724]/92 via-[#172010]/82 to-[#090a08]/95 ring-[#cba863]/28",
    availableToppings: ["jasmineRice", "softEgg"],
    name: {
      th: "กุ้งผัดสะตอพริกแกง",
      en: "Prawn Stir-Fried Sataw",
    },
    description: {
      th: "กุ้งผัดพริกแกงใต้กับสะตอ หอมฉุนแบบเสน่ห์อาหารใต้แท้ ๆ",
      en: "Prawns stir-fried with southern curry paste and stink beans for an unmistakably southern bite.",
    },
  },
  {
    id: "roti-mataba-duck",
    category: "signature",
    region: "south",
    image: "/images/dishes/charcoal-pad-thai.svg",
    price: 360,
    rating: 4.6,
    prepMinutes: 13,
    baseSpice: 2,
    featured: false,
    accentClass:
      "from-[#5c3419]/92 via-[#1e120c]/82 to-[#090807]/95 ring-[#d7b16d]/28",
    availableToppings: ["pickledMango"],
    name: {
      th: "โรตีมะตะบะเป็ด",
      en: "Duck Roti Mataba",
    },
    description: {
      th: "โรตีสอดไส้เครื่องเทศและเนื้อเป็ดฉีก เสิร์ฟกับอาจาดแตงกวาในแบบครัวมุสลิมภาคใต้",
      en: "A southern Muslim-style roti stuffed with spiced duck and paired with bright cucumber relish.",
    },
  },
  {
    id: "kanom-jeen-nam-ya-pak-tai",
    category: "riceNoodles",
    region: "south",
    image: "/images/dishes/emerald-green-curry.svg",
    price: 330,
    rating: 4.6,
    prepMinutes: 13,
    baseSpice: 4,
    featured: false,
    accentClass:
      "from-[#5c401d]/92 via-[#1e140c]/82 to-[#090807]/95 ring-[#d7b16d]/28",
    availableToppings: ["extraHerbs", "softEgg"],
    name: {
      th: "ขนมจีนน้ำยาปักษ์ใต้",
      en: "Southern Khanom Jeen Nam Ya",
    },
    description: {
      th: "ขนมจีนน้ำยาปลารสเข้มข้น หอมขมิ้นและเครื่องแกงใต้ เสิร์ฟกับผักสดหลากชนิด",
      en: "Fermented rice noodles with bold southern fish curry, turmeric, and a full herb-and-vegetable side set.",
    },
  },
  {
    id: "roti-kaya-gold",
    category: "sweetFinish",
    region: "south",
    image: "/images/dishes/mango-sticky-cloud.svg",
    price: 200,
    rating: 4.5,
    prepMinutes: 6,
    baseSpice: 0,
    featured: false,
    accentClass:
      "from-[#6b4820]/90 via-[#29190f]/82 to-[#0c0907]/95 ring-[#e0bb72]/26",
    availableToppings: ["coconutFoam"],
    name: {
      th: "โรตีกายาทอง",
      en: "Roti with Kaya Gold",
    },
    description: {
      th: "โรตีกรอบนุ่มเสิร์ฟกับสังขยาใบเตยและกะทิ ตีความของหวานใต้ให้ดูสะอาดและพรีเมียม",
      en: "Warm roti with pandan kaya and coconut, a polished take on a beloved southern sweet pairing.",
    },
  },
  {
    id: "palm-sugar-coconut-ice",
    category: "sweetFinish",
    region: "south",
    image: "/images/dishes/mango-sticky-cloud.svg",
    price: 220,
    rating: 4.4,
    prepMinutes: 7,
    baseSpice: 0,
    featured: false,
    accentClass:
      "from-[#5c4324]/90 via-[#24180f]/82 to-[#0c0907]/95 ring-[#e0bb72]/26",
    availableToppings: ["coconutFoam"],
    name: {
      th: "ไอศกรีมมะพร้าวน้ำตาลโตนด",
      en: "Palm Sugar Coconut Ice",
    },
    description: {
      th: "ไอศกรีมมะพร้าวหอมมันกับซอสน้ำตาลโตนด ให้กลิ่นอายชายฝั่งใต้แบบหวานนุ่ม",
      en: "Coconut ice cream with palm sugar syrup for a cool southern finish inspired by coastal desserts.",
    },
  },
];

function resolveLocalizedText(text: LocalizedText, locale: AppLocale) {
  return text[locale] ?? text.en ?? text.th;
}

function getToppingById(id: ToppingId) {
  const topping = toppings.find((item) => item.id === id);

  if (!topping) {
    throw new Error(`Unknown topping: ${id}`);
  }

  return topping;
}

export function getLocalizedCategories(locale: AppLocale): LocalizedCategory[] {
  return categories.map((category) => ({
    id: category.id,
    label: resolveLocalizedText(category.label, locale),
    description: resolveLocalizedText(category.description, locale),
    icon: category.icon,
  }));
}

export function getLocalizedRegions(locale: AppLocale): LocalizedRegion[] {
  return regions.map((region) => ({
    id: region.id,
    label: resolveLocalizedText(region.label, locale),
    description: resolveLocalizedText(region.description, locale),
  }));
}

export function getLocalizedPromotions(locale: AppLocale): LocalizedPromotion[] {
  return promotions.map((promotion) => ({
    id: promotion.id,
    code: promotion.code,
    title: resolveLocalizedText(promotion.title, locale),
    description: resolveLocalizedText(promotion.description, locale),
    accentClass: promotion.accentClass,
  }));
}

export function getLocalizedDishes(locale: AppLocale): LocalizedMenuDish[] {
  const localizedCategories = new Map(
    getLocalizedCategories(locale).map((category) => [category.id, category.label]),
  );
  const localizedRegions = new Map(getLocalizedRegions(locale).map((region) => [region.id, region.label]));

  return dishes.map((dish) => ({
    id: dish.id,
    category: dish.category,
    categoryLabel: localizedCategories.get(dish.category) ?? dish.category,
    region: dish.region,
    regionLabel: localizedRegions.get(dish.region) ?? dish.region,
    image: dish.image,
    name: resolveLocalizedText(dish.name, locale),
    description: resolveLocalizedText(dish.description, locale),
    price: dish.price,
    rating: dish.rating,
    prepMinutes: dish.prepMinutes,
    baseSpice: dish.baseSpice,
    featured: dish.featured,
    accentClass: dish.accentClass,
    availableToppings: dish.availableToppings.map((toppingId) => {
      const topping = getToppingById(toppingId);

      return {
        id: topping.id,
        label: resolveLocalizedText(topping.label, locale),
        price: topping.price,
      };
    }),
  }));
}

export function getDishById(id: string) {
  const dish = dishes.find((entry) => entry.id === id);

  if (!dish) {
    throw new Error(`Unknown dish: ${id}`);
  }

  return dish;
}

export function getLocalizedDish(locale: AppLocale, id: string) {
  return getLocalizedDishes(locale).find((dish) => dish.id === id) ?? null;
}
