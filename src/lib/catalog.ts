import type { AppLocale } from "@/i18n/routing";

type LocalizedText = Record<AppLocale, string>;

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
      ja: "タイ定番料理",
      zh: "泰国经典菜",
      ko: "태국 클래식",
    },
    description: {
      th: "จานประจำชาติที่คนทั่วโลกรู้จักและสั่งซ้ำได้ทุกโอกาส",
      en: "National favorites that define the most recognizable Thai table.",
      ja: "世界的に知られるタイの定番料理を集めた、最も親しみやすいカテゴリです。",
      zh: "汇集最具代表性的泰国国民菜与经典热门菜，最容易上手的一组风味。",
      ko: "전 세계적으로 알려진 태국 대표 메뉴를 모아 둔 가장 익숙한 클래식 카테고리입니다.",
    },
  },
  {
    id: "central",
    label: {
      th: "ภาคกลาง",
      en: "Central Thailand",
      ja: "タイ中部",
      zh: "泰国中部",
      ko: "태국 중부",
    },
    description: {
      th: "รสกลมกล่อมแบบราชสำนัก กรุงเทพฯ และลุ่มเจ้าพระยา",
      en: "Balanced royal-style flavors from Bangkok and the Chao Phraya heartland.",
      ja: "バンコクとチャオプラヤー流域を思わせる、王宮料理由来の上品で均整の取れた味わい。",
      zh: "带有曼谷与昭披耶河流域气质的中部菜系，口味均衡细腻，带一点皇室料理风格。",
      ko: "방콕과 차오프라야 강 유역을 닮은, 왕실 요리풍의 균형 잡힌 중부 풍미입니다.",
    },
  },
  {
    id: "north",
    label: {
      th: "ภาคเหนือ",
      en: "Northern Thailand",
      ja: "タイ北部",
      zh: "泰国北部",
      ko: "태국 북부",
    },
    description: {
      th: "กลิ่นเครื่องเทศลานนา ซุปเส้นเข้มข้น และของหวานละมุนจากวัตถุดิบพื้นถิ่น",
      en: "Lanna spice, comforting broths, and softer sweets shaped by mountain ingredients.",
      ja: "ラーンナー由来の香り高いスパイス、滋味深い麺料理、山の食材を活かしたやさしい甘味が特徴です。",
      zh: "以兰纳香料、浓郁汤面与带有山地食材气息的柔和甜品为特色的北部风味。",
      ko: "란나 향신료, 진한 국물 면요리, 산지 재료로 만든 부드러운 디저트가 돋보이는 북부 스타일입니다.",
    },
  },
  {
    id: "northeast",
    label: {
      th: "อีสาน",
      en: "Northeastern Thailand",
      ja: "イサーン",
      zh: "泰国东北",
      ko: "이산",
    },
    description: {
      th: "รสจัด เปรี้ยว เค็ม หอมข้าวคั่ว เหมาะกับสายอาหารแซ่บแบบจริงจัง",
      en: "Bold Isan flavors with roasted rice, lime, herbs, and unapologetic heat.",
      ja: "煎り米の香ばしさ、ライムの酸味、ハーブ、はっきりした辛さが魅力の力強いイサーン料理です。",
      zh: "以烤米香、青柠酸香、香草与直接有力的辣味著称，是风格鲜明的依善料理。",
      ko: "볶은 쌀의 고소함, 라임 산미, 허브, 직선적인 매운맛이 살아 있는 강렬한 이산 풍미입니다.",
    },
  },
  {
    id: "south",
    label: {
      th: "ภาคใต้",
      en: "Southern Thailand",
      ja: "タイ南部",
      zh: "泰国南部",
      ko: "태국 남부",
    },
    description: {
      th: "รสเครื่องเทศหนักแน่น ซีฟู้ดจัดจ้าน และขนมจากมะพร้าวกับโรตี",
      en: "Spice-driven southern cooking with bright seafood and coconut-rich sweets.",
      ja: "濃厚なスパイス使い、鮮烈なシーフード、ココナッツやロティを使った甘味が印象的な南部料理です。",
      zh: "以浓烈香料、鲜明海鲜风味，以及椰子和罗蒂甜品构成的南部菜单。",
      ko: "강한 향신료, 또렷한 해산물 풍미, 코코넛과 로티 디저트가 어우러진 남부 요리입니다.",
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
      ja: "ラーンナー カオソーイ",
      zh: "兰纳咖喱面",
      ko: "란나 카오소이",
    },
    description: {
      th: "เส้นไข่ในน้ำแกงกะทิเครื่องเทศเหนือ เสิร์ฟกับเส้นกรอบ ผักดอง และหอมเจียว",
      en: "Northern egg noodles in a rich coconut curry, finished with crispy noodles, pickled mustard greens, and shallots.",
      ja: "北部らしい香辛料とココナッツが香るスープに、卵麺、揚げ麺、漬物、エシャロットを合わせた一杯です。",
      zh: "北部风味椰香咖喱汤配蛋面、脆面、酸菜与红葱头，层次浓郁。",
      ko: "북부 향신료와 코코넛이 어우러진 국물에 계란면, 바삭한 면, 절임채소, 샬롯을 더한 메뉴입니다.",
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
      ja: "南部クアクリン ビーフ",
      zh: "南部干炒咖喱牛肉",
      ko: "남부 쿠아클링 비프",
    },
    description: {
      th: "เนื้อผัดพริกแกงใต้แห้ง ๆ หอมตะไคร้ ใบมะกรูด และความเผ็ดจัดแบบภาคใต้",
      en: "Dry southern curry beef with lemongrass, kaffir lime leaf, and the signature deep heat of the south.",
      ja: "レモングラスとこぶみかんの葉を効かせた南部式のドライカレー炒めで、力強い辛さが際立ちます。",
      zh: "以香茅、卡菲尔酸橙叶与南部咖喱酱大火干炒牛肉，辣味深沉鲜明。",
      ko: "레몬그라스와 카피르 라임 잎 향을 살린 남부식 드라이 커리 볶음으로, 깊고 강한 매운맛이 특징입니다.",
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
      ja: "ルビー ウォーターチェスナッツ",
      zh: "红宝石马蹄甜品",
      ko: "루비 워터체스트넛",
    },
    description: {
      th: "แห้วกรุบในเสื้อทับทิม เสิร์ฟกับน้ำกะทิเย็นและน้ำแข็งใสแบบหวานสดชื่น",
      en: "Classic ruby water chestnuts over chilled coconut milk for a crisp, cooling Thai dessert.",
      ja: "ルビー色の衣をまとったくわいを冷たいココナッツミルクに合わせた、清涼感のあるタイ定番甘味です。",
      zh: "裹上红宝石外衣的马蹄配冰凉椰奶，清脆又解暑，是经典泰式甜品。",
      ko: "루비색 옷을 입힌 워터체스트넛을 차가운 코코넛 밀크와 함께 즐기는 시원한 태국식 디저트입니다.",
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
      ja: "ゴールデン クラブオムレツ",
      zh: "黄金蟹肉蛋饼",
      ko: "골든 게살 오믈렛",
    },
    description: {
      th: "ไข่เจียวฟูกรอบนอกนุ่มใน อัดแน่นเนื้อปูก้อน เสิร์ฟสไตล์ครัวภาคกลางร่วมสมัย",
      en: "A plush golden omelette packed with crab, inspired by the polished seafood kitchens of central Thailand.",
      ja: "外は香ばしく中はふんわり。蟹身をたっぷり包み込んだ、中部スタイルの上品な卵料理です。",
      zh: "外层微脆、内部松软，包入大量蟹肉，呈现中部海鲜料理的精致感。",
      ko: "겉은 고소하고 속은 폭신한 달걀에 게살을 가득 채운, 중부풍의 세련된 해산물 요리입니다.",
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
      ja: "濃厚ボートヌードル",
      zh: "浓汤船面",
      ko: "진한 보트 누들",
    },
    description: {
      th: "ก๋วยเตี๋ยวเรือน้ำซุปเข้ม หอมเครื่องเทศและเลือดหมู ปรับลุคให้นิ่งแต่ยังได้รสจัดจ้าน",
      en: "Concentrated boat noodles with spice, depth, and a cleaner luxury finish for central Thai comfort.",
      ja: "香辛料と深い旨みを凝縮したスープで仕上げる、余韻の強い中部の定番麺料理です。",
      zh: "以香料与浓厚肉汤为核心，保留船面灵魂同时让整体更精致干净。",
      ko: "향신료와 진한 육수의 깊이를 살리면서도 보다 정제된 마무리로 풀어낸 중부 대표 면요리입니다.",
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
      ja: "マッサマン ショートリブ",
      zh: "玛莎曼炖牛小排",
      ko: "마사만 쇼트립",
    },
    description: {
      th: "แกงมัสมั่นหอมเครื่องเทศ ถั่ว มันฝรั่ง และซี่โครงเนื้อตุ๋นนุ่มในโทนภาคกลางแบบร่วมสมัย",
      en: "Slow-braised short rib in an aromatic massaman with potato and warm spice from the central table.",
      ja: "じゃがいもとスパイスを効かせた芳醇なマッサマンで、やわらかく煮込んだショートリブを味わえます。",
      zh: "在香气温润的玛莎曼咖喱中慢炖牛小排，配土豆与香料，厚实而圆润。",
      ko: "감자와 따뜻한 향신료가 어우러진 마사만 커리에 부드럽게 조린 쇼트립을 담아낸 메뉴입니다.",
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
      ja: "ロイヤル カノムブアン",
      zh: "皇家脆皮泰式薄饼",
      ko: "로열 카놈 부앙",
    },
    description: {
      th: "แป้งกรอบบาง ไส้ครีมมะพร้าวและฝอยทอง ตีความของหวานภาคกลางให้ดูเบาและหรูขึ้น",
      en: "Crisp Thai crepes with coconut cream and golden threads, refined from a beloved central dessert.",
      ja: "薄く香ばしい生地にココナッツクリームと卵黄の糸をのせた、中部の人気菓子を上品に仕立てた一品です。",
      zh: "酥脆薄皮包裹椰香奶油与金丝蛋黄，把中部人气甜点做得更轻盈精致。",
      ko: "얇고 바삭한 크레이프에 코코넛 크림과 황금빛 달걀 실을 올려 중부 디저트를 우아하게 재해석했습니다.",
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
      ja: "フォイトーン ココナッツカスタード",
      zh: "金丝蛋黄椰香布丁",
      ko: "포이통 코코넛 커스터드",
    },
    description: {
      th: "ฝอยทองเส้นละเอียดบนคัสตาร์ดมะพร้าวเนื้อเนียน กลิ่นหอมแบบขนมไทยภาคกลาง",
      en: "Delicate egg yolk threads over silk-smooth coconut custard for a polished central Thai sweet.",
      ja: "なめらかなココナッツカスタードに繊細なフォイトーンを重ねた、華やかな中部の甘味です。",
      zh: "细致金丝蛋黄铺在丝滑椰香布丁上，呈现带有中部宫廷气质的泰式甜品。",
      ko: "실크처럼 부드러운 코코넛 커스터드 위에 섬세한 포이통을 올린 화사한 중부 스타일 디저트입니다.",
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
      ja: "炭火サイウア",
      zh: "炭烤泰北香肠",
      ko: "숯불 사이우아",
    },
    description: {
      th: "ไส้อั่วสมุนไพรเหนือย่างหอม เสิร์ฟกับผักสดและข้าวเหนียวแบบกินง่ายแต่ยังคงกลิ่นอายล้านนา",
      en: "Herb-packed northern sausage grilled over charcoal with fresh vegetables and sticky rice.",
      ja: "北部らしいハーブを練り込んだソーセージを炭火で香ばしく焼き、野菜ともち米を添えました。",
      zh: "泰北香草香肠经炭火烤出香气，搭配新鲜蔬菜与糯米，保留兰纳风味。",
      ko: "북부 허브를 듬뿍 넣은 소시지를 숯불에 구워 신선한 채소와 찹쌀과 함께 내는 메뉴입니다.",
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
      ja: "北部ゲーンハンレー",
      zh: "泰北姜香炖肉咖喱",
      ko: "북부 갱항레",
    },
    description: {
      th: "หมูตุ๋นในแกงฮังเลรสเปรี้ยวหวานหอมขิง กระเทียม และเครื่องเทศเหนือ",
      en: "Slow-cooked pork in a sweet-sour northern curry scented with ginger, garlic, and warm spice.",
      ja: "生姜、にんにく、北部スパイスを効かせた甘酸っぱいカレーで豚肉をやわらかく煮込んでいます。",
      zh: "以姜、蒜与北部香料慢炖猪肉，酸甜平衡，是泰北代表性咖喱之一。",
      ko: "생강, 마늘, 북부 향신료를 더한 달콤새콤한 커리에 돼지고기를 부드럽게 조린 요리입니다.",
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
      ja: "カノムジーン ナムギアオ",
      zh: "卡侬金南诰",
      ko: "카놈진 남응이아오",
    },
    description: {
      th: "ซุปรสเข้มแบบเหนือจากมะเขือเทศและหมูสับ เสิร์ฟกับขนมจีนและผักสด",
      en: "Northern fermented rice noodles in a savory tomato pork broth finished with fresh herbs.",
      ja: "トマトと豚の旨みを重ねた北部の濃厚スープに、発酵米麺とハーブを合わせた一皿です。",
      zh: "以番茄与猪肉熬出浓郁汤底，搭配发酵米线和新鲜香草，是北部特色面食。",
      ko: "토마토와 돼지고기의 감칠맛을 더한 북부식 진한 국물에 발효 쌀국수와 허브를 곁들였습니다.",
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
      ja: "ナムプリックヌム セット",
      zh: "青椒蘸酱拼盘",
      ko: "남프릭눔 세트",
    },
    description: {
      th: "น้ำพริกหนุ่มย่างหอม เสิร์ฟคู่แคบหมู ผักลวก และข้าวเหนียวในสไตล์โต๊ะเหนือ",
      en: "Roasted green chili dip with pork crackling, vegetables, and sticky rice for a classic northern set.",
      ja: "香ばしく焼いた青唐辛子のディップに、豚皮揚げ、温野菜、もち米を添えた北部らしいセットです。",
      zh: "炭烤青椒蘸酱配猪皮脆、蔬菜与糯米，是典型的北部分享式组合。",
      ko: "구운 풋고추 딥에 돼지껍질 튀김, 데친 채소, 찹쌀을 곁들인 전형적인 북부식 세트입니다.",
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
      ja: "カオテン ロンガンキャラメル",
      zh: "龙眼焦糖锅巴米饼",
      ko: "카오땐 롱안 캐러멜",
    },
    description: {
      th: "ข้าวแต๋นกรอบเคลือบคาราเมลลำไย ให้กลิ่นผลไม้ภาคเหนือในรูปแบบของหวานเบา ๆ",
      en: "Crisp northern rice cakes glazed with longan caramel for a light Lanna-style finish.",
      ja: "さくっと軽い米菓にロンガンキャラメルをまとわせた、北部らしいやさしい甘味です。",
      zh: "酥脆米饼裹上龙眼焦糖，呈现带有北部水果气息的轻盈收尾。",
      ko: "가볍고 바삭한 쌀 과자에 롱안 캐러멜을 입혀 북부의 부드러운 과일 향을 살린 디저트입니다.",
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
      ja: "イサーン ソムタム",
      zh: "依善青木瓜沙拉",
      ko: "이산 쏨땀",
    },
    description: {
      th: "ส้มตำรสจัด เปรี้ยว เค็ม เผ็ด หอมปลาร้าและมะนาวสดในแบบอีสานแท้",
      en: "A bold northeastern papaya salad with lime, chilies, and the savory edge that makes Isan cuisine distinct.",
      ja: "ライム、唐辛子、独特の旨みが立つ、イサーンらしい力強い青パパイヤサラダです。",
      zh: "酸、辣、咸与发酵鲜味都很直接，是最具代表性的依善风味青木瓜沙拉。",
      ko: "라임, 고추, 진한 감칠맛이 또렷한 이산식 청파파야 샐러드입니다.",
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
      ja: "ラープムー クア",
      zh: "烤米香猪肉拉拌",
      ko: "라브 무 쿠아",
    },
    description: {
      th: "หมูสับคลุกข้าวคั่ว หอมแดง สะระแหน่ และพริกป่น กลิ่นอีสานชัดเจนทุกคำ",
      en: "Minced pork larb with toasted rice, shallots, mint, and that unmistakable Isan perfume.",
      ja: "煎り米、赤玉ねぎ、ミント、唐辛子をまとわせた、香りの立つイサーン風豚ラープです。",
      zh: "猪肉末拌入烤米粉、红葱头、薄荷与辣椒粉，每一口都有鲜明依善香气。",
      ko: "볶은 쌀가루, 샬롯, 민트, 고춧가루를 더해 향이 선명하게 살아나는 이산식 돼지고기 라브입니다.",
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
      ja: "イサーン風焼き鶏セット",
      zh: "依善烤鸡糯米套餐",
      ko: "이산식 닭구이 세트",
    },
    description: {
      th: "ไก่ย่างหนังหอม เสิร์ฟคู่ข้าวเหนียวและน้ำจิ้มแจ่ว เหมาะกับคนชอบรสแซ่บแบบอีสาน",
      en: "Charcoal grilled chicken with sticky rice and jaew dipping sauce, built for a proper Isan meal.",
      ja: "香ばしく焼いた鶏にもち米とแจ่วソースを添えた、イサーンらしい満足感の高いセットです。",
      zh: "炭烤鸡搭配糯米和แจ่ว蘸酱，是非常完整的依善式一餐。",
      ko: "숯불에 구운 닭과 찹쌀, 재우 소스를 곁들인 든든한 이산식 한 상입니다.",
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
      ja: "ナムトック ビーフ",
      zh: "炭烤牛肉香草拌",
      ko: "남똑 비프",
    },
    description: {
      th: "เนื้อย่างคลุกน้ำปลา มะนาว พริกป่น และข้าวคั่ว ให้รสเปรี้ยวเผ็ดหอมแบบอีสาน",
      en: "Grilled beef tossed with lime, fish sauce, chili, and toasted rice in a vibrant northeastern salad style.",
      ja: "炙った牛肉をライム、ナンプラー、唐辛子、煎り米で和えた、鮮烈なイサーン風サラダです。",
      zh: "炙烤牛肉拌入青柠、鱼露、辣椒与烤米粉，酸辣鲜香都很有存在感。",
      ko: "구운 소고기에 라임, 피시소스, 고추, 볶은 쌀가루를 더해 산뜻하고 강렬하게 마무리한 이산식 샐러드입니다.",
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
      ja: "トムセープ ポークリブ",
      zh: "酸辣猪肋汤",
      ko: "똠쌥 폭립",
    },
    description: {
      th: "ซุปต้มแซ่บซี่โครงน้ำใส เปรี้ยวร้อนหอมสมุนไพร เหมาะกับคนชอบอาหารอีสานแบบซดคล่องคอ",
      en: "Clear hot-and-sour rib soup with herbs and full Isan intensity in every sip.",
      ja: "ハーブを効かせた澄んだ酸辣スープに豚スペアリブを合わせた、後味の鋭いイサーンスープです。",
      zh: "清透酸辣汤底配软嫩猪肋排，草本香气和依善式刺激感都很到位。",
      ko: "허브 향이 살아 있는 맑은 새콤매운 국물에 돼지갈비를 더한, 이산 특유의 강한 매력이 담긴 수프입니다.",
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
      ja: "黒もち米とタロイモ",
      zh: "黑糯米芋头椰香甜品",
      ko: "흑찹쌀 타로 디저트",
    },
    description: {
      th: "ข้าวเหนียวดำเนื้อหนึบกับเผือกและกะทิหวานเค็มแบบขนมพื้นบ้านที่กินง่าย",
      en: "Chewy black sticky rice with taro and coconut, inspired by homestyle northeastern sweets.",
      ja: "もちっとした黒もち米にタロイモとココナッツを合わせた、素朴で食べやすい甘味です。",
      zh: "黑糯米的嚼感、芋头的绵密和椰奶的柔和甜咸组合成家常感十足的东北甜品。",
      ko: "쫀득한 흑찹쌀에 토란과 코코넛을 더해 담백하고 편안하게 즐길 수 있는 디저트입니다.",
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
      ja: "南部ゲーンソム シーバス",
      zh: "南部酸辣鲈鱼咖喱",
      ko: "남부 갱쏨 농어",
    },
    description: {
      th: "แกงส้มใต้รสจัดกับปลากะพงและผักพื้นบ้าน ให้ความเปรี้ยวเผ็ดคมชัดแบบภาคใต้",
      en: "Bright southern sour curry with seabass and vegetables, built on sharp turmeric heat and acidity.",
      ja: "ターメリックの辛味と鋭い酸味が立つ南部式サワーカレーに、シーバスと野菜を合わせました。",
      zh: "以姜黄辛香与明亮酸味为核心的南部酸辣咖喱，搭配鲈鱼与蔬菜。",
      ko: "강한 강황 향과 또렷한 산미가 특징인 남부식 사워 커리에 농어와 채소를 더했습니다.",
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
      ja: "サトーと海老の炒め",
      zh: "臭豆辣炒虾",
      ko: "사또 새우 볶음",
    },
    description: {
      th: "กุ้งผัดพริกแกงใต้กับสะตอ หอมฉุนแบบเสน่ห์อาหารใต้แท้ ๆ",
      en: "Prawns stir-fried with southern curry paste and stink beans for an unmistakably southern bite.",
      ja: "南部カレーペーストで海老とサトーを炒めた、個性の強い香りが魅力の一皿です。",
      zh: "大火快炒虾与臭豆，裹上南部咖喱酱，香气鲜明且极具辨识度。",
      ko: "남부 커리 페이스트로 새우와 사또를 볶아낸, 뚜렷한 향이 매력적인 남부 스타일 요리입니다.",
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
      ja: "ダック ロティマタバ",
      zh: "鸭肉马塔巴煎饼",
      ko: "덕 로티 마타바",
    },
    description: {
      th: "โรตีสอดไส้เครื่องเทศและเนื้อเป็ดฉีก เสิร์ฟกับอาจาดแตงกวาในแบบครัวมุสลิมภาคใต้",
      en: "A southern Muslim-style roti stuffed with spiced duck and paired with bright cucumber relish.",
      ja: "香辛料を効かせた鴨肉を包んだロティに、きゅうりのレリッシュを添えた南部ムスリム風の一品です。",
      zh: "将香料鸭肉包进煎饼中，配清爽黄瓜小菜，体现南部穆斯林厨房风格。",
      ko: "향신료로 맛을 낸 오리고기를 로티에 감싸 오이 렐리시와 함께 내는 남부 무슬림풍 메뉴입니다.",
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
      ja: "南部カノムジーン ナムヤー",
      zh: "南部鱼咖喱米线",
      ko: "남부 카놈진 남야",
    },
    description: {
      th: "ขนมจีนน้ำยาปลารสเข้มข้น หอมขมิ้นและเครื่องแกงใต้ เสิร์ฟกับผักสดหลากชนิด",
      en: "Fermented rice noodles with bold southern fish curry, turmeric, and a full herb-and-vegetable side set.",
      ja: "魚の旨みを効かせた濃厚な南部カレーを発酵米麺にかけ、たっぷりの生野菜とともに楽しむ一皿です。",
      zh: "发酵米线淋上浓厚南部鱼咖喱，姜黄与香料鲜明，并搭配丰富蔬菜。",
      ko: "생선의 깊은 맛을 살린 진한 남부 커리를 발효 쌀국수에 붓고 다양한 생채소와 함께 즐기는 메뉴입니다.",
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
      ja: "ロティとカヤゴールド",
      zh: "金色咖椰酱罗蒂",
      ko: "카야 골드 로티",
    },
    description: {
      th: "โรตีกรอบนุ่มเสิร์ฟกับสังขยาใบเตยและกะทิ ตีความของหวานใต้ให้ดูสะอาดและพรีเมียม",
      en: "Warm roti with pandan kaya and coconut, a polished take on a beloved southern sweet pairing.",
      ja: "温かなロティをパンダン香るカヤとココナッツで仕上げた、南部らしい洗練デザートです。",
      zh: "温热罗蒂搭配班兰咖椰与椰香元素，把南部经典甜口组合做得更精致。",
      ko: "따뜻한 로티에 판단 카야와 코코넛을 곁들여 남부의 익숙한 달콤함을 세련되게 풀어냈습니다.",
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
      ja: "パームシュガー ココナッツアイス",
      zh: "棕榈糖椰子冰淇淋",
      ko: "팜슈거 코코넛 아이스",
    },
    description: {
      th: "ไอศกรีมมะพร้าวหอมมันกับซอสน้ำตาลโตนด ให้กลิ่นอายชายฝั่งใต้แบบหวานนุ่ม",
      en: "Coconut ice cream with palm sugar syrup for a cool southern finish inspired by coastal desserts.",
      ja: "ココナッツアイスにパームシュガーソースを重ねた、南部の海辺を思わせる穏やかな甘味です。",
      zh: "椰子冰淇淋淋上棕榈糖酱，带来柔和清凉、带海岸感的南部式收尾。",
      ko: "코코넛 아이스크림 위에 팜슈거 시럽을 더해 남부 해안가 디저트 같은 부드러운 마무리를 전합니다.",
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
