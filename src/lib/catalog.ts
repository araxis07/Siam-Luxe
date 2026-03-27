import type { AppLocale } from "@/i18n/routing";

type LocalizedText = Record<AppLocale, string>;

export type CategoryId =
  | "signature"
  | "curries"
  | "wokGrill"
  | "riceNoodles"
  | "sweetFinish";

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
      th: "น้ำต้มยำเข้มข้นกับกุ้งแม่น้ำ สมุนไพรสด และความหอมควันอ่อนแบบจานพรีเมียม",
      en: "A layered tom yum broth with river prawn, fresh herbs, and a quietly luxurious finish.",
      ja: "川エビとフレッシュハーブを重ねた、上質で奥行きあるトムヤム。",
      zh: "以河虾与新鲜香草熬制的层次感冬阴功，收尾精致高级。",
      ko: "민물새우와 신선한 허브를 겹겹이 담아낸 깊은 풍미의 똠얌.",
    },
  },
  {
    id: "charcoal-pad-thai",
    category: "riceNoodles",
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
    id: "emerald-green-curry",
    category: "curries",
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
    id: "fire-basil-wagyu",
    category: "wokGrill",
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
    id: "river-prawn-rice",
    category: "riceNoodles",
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
    id: "pandan-satay",
    category: "wokGrill",
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
    id: "mango-sticky-cloud",
    category: "sweetFinish",
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
];

function resolveLocalizedText(text: LocalizedText, locale: AppLocale) {
  return text[locale];
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

  return dishes.map((dish) => ({
    id: dish.id,
    category: dish.category,
    categoryLabel: localizedCategories.get(dish.category) ?? dish.category,
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
