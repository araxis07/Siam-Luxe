import type { AppLocale } from "@/i18n/routing";

type LocalizedText = Record<AppLocale, string>;

type PortraitKind = "chef" | "assistant";

interface PortraitPalette {
  auraFrom: string;
  auraTo: string;
  robe: string;
  robeTrim: string;
  hair: string;
  skin: string;
  ornament: string;
}

interface StoryStatDefinition {
  value: string;
  label: LocalizedText;
  description: LocalizedText;
}

interface StoryChapterDefinition {
  id: string;
  era: LocalizedText;
  title: LocalizedText;
  body: LocalizedText;
}

interface HeritageValueDefinition {
  id: string;
  title: LocalizedText;
  body: LocalizedText;
}

interface TeamMemberDefinition {
  id: string;
  kind: PortraitKind;
  name: LocalizedText;
  role: LocalizedText;
  specialty: LocalizedText;
  duty: LocalizedText;
  palette: PortraitPalette;
}

interface SupportRoleDefinition {
  id: string;
  title: LocalizedText;
  duty: LocalizedText;
}

const pageCopy = {
  overviewEyebrow: {
    th: "มรดกของบ้าน Siam Lux",
    en: "The House Heritage of Siam Lux",
    ja: "Siam Lux の系譜",
    zh: "Siam Lux 的传承故事",
    ko: "Siam Lux 헤리티지",
  },
  overviewTitle: {
    th: "จากสำรับในรัชกาลที่ 5 สู่โต๊ะอาหารไทยร่วมสมัยที่ยังคงความละเมียดแบบในวัง",
    en: "From a Rama V court table to a modern Thai house that still serves with royal calm.",
    ja: "ラーマ5世期の宮廷卓から、静かな格調を守る現代のタイ料理店へ。",
    zh: "从拉玛五世时期的宫廷餐桌，走到今天依然保有王室气韵的现代泰餐馆。",
    ko: "라마 5세 시기의 궁중 식탁에서, 왕실의 품격을 지닌 현대 태국 다이닝으로.",
  },
  overviewBody: {
    th: "Siam Lux ถูกเล่าขานว่าเริ่มต้นจากสมุดบันทึกสำรับของหญิงเครื่องต้นประจำเรือนขุนนางปลายสมัยรัชกาลที่ 5 ผู้ทำหน้าที่จดจำรส เครื่องหอม ลำดับการเสิร์ฟ และมารยาทบนโต๊ะอาหารสำหรับงานรับรองแขกบ้านแขกเมือง ก่อนที่สูตรเหล่านั้นจะค่อย ๆ ถูกส่งต่อผ่านรุ่นหลานและเปิดรับภูมิปัญญาอาหารจากทุกภูมิภาคของไทย จนกลายเป็นร้านที่รวมความสง่างามแบบในวังเข้ากับรสชาติไทยทั้งประเทศไว้ในที่เดียว",
    en: "House lore says Siam Lux began with a handwritten notebook kept by a noble household steward in the late reign of King Chulalongkorn. She recorded sauce balance, floral aromas, plating order, and the etiquette of receiving visiting dignitaries. Across generations, those notes were folded together with northern broths, Isan fire, southern spice, and central sweets until they became a dining house that serves the elegance of the palace and the soul of the whole country on one table.",
    ja: "Siam Lux の家伝によれば、その始まりはラーマ5世末期、貴族の邸宅で客人をもてなしていた女官が書き残した手帳にあります。彼女は味の均衡、香り、盛り付けの順序、客を迎える作法までを記録しました。その覚え書きは世代を越えて受け継がれ、北部の麺料理、イサーンの火力、南部の香辛料、中部の甘味と結びつき、宮廷の気品とタイ各地の味を一卓に集める店へと育ちました。",
    zh: "按照店内传说，Siam Lux 的起点是一位在拉玛五世晚期为贵族府邸掌理宴席的女管事手中的食谱手札。她记录了酱汁平衡、花香、摆盘次序，以及接待贵宾时的餐桌礼法。这些笔记在后代手中不断吸收泰北汤面、依善火味、南部香料与中部甜品，最终形成了今天这家把宫廷气质与全国风味放在同一张餐桌上的 Siam Lux。",
    ko: "Siam Lux 의 전승에 따르면 시작은 라마 5세 말기, 귀족 저택의 연회를 맡던 궁중 시종장의 손에 남은 조리 수첩이었습니다. 그녀는 소스의 균형, 꽃 향, 플레이팅 순서, 외빈을 맞이하는 식탁 예법까지 기록했습니다. 그 노트는 세대를 거치며 북부 국수, 이산의 불맛, 남부 향신료, 중부 디저트를 흡수했고, 오늘날 왕실의 품격과 태국 전역의 맛을 한 식탁에 올리는 Siam Lux 로 이어졌습니다.",
  },
  overviewPrimaryCta: {
    th: "ดูเมนูทั้งร้าน",
    en: "Browse the Full Menu",
    ja: "全メニューを見る",
    zh: "查看完整菜单",
    ko: "전체 메뉴 보기",
  },
  overviewSecondaryCta: {
    th: "พบกับทีมของร้าน",
    en: "Meet the House Team",
    ja: "チームを見る",
    zh: "认识店内团队",
    ko: "하우스 팀 보기",
  },
  storyEyebrow: {
    th: "ลำดับเรื่องราว",
    en: "Chronicle",
    ja: "年譜",
    zh: "传承时间线",
    ko: "연대기",
  },
  storyTitle: {
    th: "เรื่องเล่าของร้านที่ถูกวางขึ้นให้เหมือนพิธีการรับรองแบบช้า สงบ และน่าจดจำ",
    en: "A restaurant story shaped like a ceremonial welcome: slow, composed, and memorable.",
    ja: "静かで、ゆっくりと、記憶に残るもてなしの作法として編まれた店の物語。",
    zh: "这是一段像典礼式待客流程般被慢慢铺开的品牌故事，安静、讲究、令人记住。",
    ko: "천천히, 단정하게, 오래 기억되도록 설계한 환대의 의식 같은 레스토랑 이야기.",
  },
  valuesEyebrow: {
    th: "มาตรฐานของร้าน",
    en: "House Standards",
    ja: "店の基準",
    zh: "店内准则",
    ko: "하우스 스탠더드",
  },
  valuesTitle: {
    th: "ทุกจานยังคงยึดหลักเดียวกับสำรับโบราณ: งามพอประมาณ รสชัด และบริการมีจังหวะ",
    en: "Every plate still follows the same old rule: measured beauty, clear flavor, and service with rhythm.",
    ja: "すべての皿は、節度ある美しさ、明快な味、そして間を大切にしたサービスという古い原則に従います。",
    zh: "每一道菜都遵循同一条老规矩: 美感有分寸、味道有层次、服务有节奏。",
    ko: "모든 접시는 절제된 아름다움, 또렷한 맛, 리듬 있는 서비스라는 오래된 원칙을 따릅니다.",
  },
  teamEyebrow: {
    th: "เรือนครัว",
    en: "Culinary House",
    ja: "厨房チーム",
    zh: "厨房核心团队",
    ko: "컬리너리 하우스",
  },
  teamTitle: {
    th: "10 คนเบื้องหลังโต๊ะ Siam Lux",
    en: "The 10 people behind the Siam Lux table",
    ja: "Siam Lux の食卓を支える 10 人",
    zh: "支撑 Siam Lux 餐桌的 10 位核心成员",
    ko: "Siam Lux 식탁 뒤의 10인",
  },
  teamBody: {
    th: "เราแบ่งทีมเป็นเชฟ 7 คนและลูกมือ 3 คน เพื่อดูแลตั้งแต่การต้ม stock การผัดไฟแรง การทำขนม ไปจนถึงการส่งจานผ่าน pass อย่างนิ่งและแม่นยำ",
    en: "The kitchen brigade is structured around seven chefs and three assistants, each responsible for a precise part of the experience: stocks, live fire, curries, sweets, garnish, and the final pass.",
    ja: "厨房は 7 名のシェフと 3 名のアシスタントで構成され、出汁、火入れ、カレー、甘味、ガーニッシュ、最終パスまでを丁寧に分担しています。",
    zh: "我们的厨房班底由 7 位主厨与 3 位助手组成，分别负责高汤、火候、咖喱、甜品、装饰与出餐节奏。",
    ko: "주방 브리게이드는 7명의 셰프와 3명의 어시스턴트로 구성되며 육수, 화력, 커리, 디저트, 가니시, 최종 패스까지 세밀하게 나눠 맡습니다.",
  },
  supportEyebrow: {
    th: "หน้าร้านและหลังร้าน",
    en: "Front & Back of House",
    ja: "店舗運営チーム",
    zh: "前场与后场运营",
    ko: "프론트 & 백오브하우스",
  },
  supportTitle: {
    th: "ตำแหน่งอื่นที่ทำให้ร้านเดินได้อย่างสมบูรณ์",
    en: "The other roles that keep the house running properly",
    ja: "店を正しく回すために欠かせない役割",
    zh: "让整家餐厅顺畅运作的其他岗位",
    ko: "레스토랑을 제대로 움직이게 하는 다른 역할들",
  },
  supportBody: {
    th: "นอกจากครัวหลัก ร้านอาหารระดับนี้ยังต้องมี front-of-house และงานหลังบ้านที่เชื่อมต่อกันแน่น ทั้งการต้อนรับ คิดเงิน เครื่องดื่ม จัดซื้อ คุณภาพ และการจัดคิวออเดอร์",
    en: "Beyond the kitchen, a serious restaurant needs a disciplined front-of-house and back-office operation: hosting, cashiering, beverage service, purchasing, hygiene, and order coordination.",
    ja: "本格的なレストランには厨房だけでなく、案内、会計、ドリンク、仕入れ、衛生、オーダー調整を担う前後方の運営体制が必要です。",
    zh: "一家真正成熟的餐厅，不只需要厨房，还需要前场接待、收银、饮品、采购、卫生与订单协调等完整支持系统。",
    ko: "제대로 된 레스토랑은 주방뿐 아니라 안내, 계산, 음료, 구매, 위생, 주문 조율을 맡는 프런트와 백오피스 운영이 함께 갖춰져야 합니다.",
  },
} satisfies Record<string, LocalizedText>;

const storyStats: StoryStatDefinition[] = [
  {
    value: "1894",
    label: {
      th: "ปีที่ตำนานของร้านเริ่มถูกเล่า",
      en: "House legend begins",
      ja: "物語の起点",
      zh: "传说开始的年份",
      ko: "전승의 시작",
    },
    description: {
      th: "ยึดโยงกับปลายยุครัชกาลที่ 5 และวัฒนธรรมสำรับในเรือนขุนนาง",
      en: "Tied to the late Rama V era and the noble-household table culture of Bangkok.",
      ja: "ラーマ5世末期とバンコク貴族邸の食卓文化に結びつく起点です。",
      zh: "与拉玛五世晚期、曼谷贵族府邸的餐桌文化相连。",
      ko: "라마 5세 말기와 방콕 귀족 가문의 식탁 문화에 연결된 출발점입니다.",
    },
  },
  {
    value: "5",
    label: {
      th: "แนวรสชาติจากทั่วไทย",
      en: "Thai regional schools",
      ja: "地域料理の系譜",
      zh: "全国风味分支",
      ko: "태국 지역 계보",
    },
    description: {
      th: "วัง ภาคกลาง เหนือ อีสาน และใต้ ถูกร้อยเข้าด้วยกันในเมนูเดียว",
      en: "Court, central, northern, Isan, and southern traditions woven into one menu.",
      ja: "宮廷、中部、北部、イサーン、南部の流れを一つのメニューに編み込みました。",
      zh: "宫廷、中部、北部、东北与南部风味被编织进同一份菜单里。",
      ko: "궁중, 중부, 북부, 이산, 남부의 전통을 하나의 메뉴 안에 엮어냈습니다.",
    },
  },
  {
    value: "10",
    label: {
      th: "สมาชิกทีมครัวหลัก",
      en: "Core kitchen members",
      ja: "厨房の主要人数",
      zh: "核心厨房成员",
      ko: "핵심 주방 인원",
    },
    description: {
      th: "เชฟ 7 คนและลูกมือ 3 คน ดูแลตั้งแต่วัตถุดิบจนถึงจังหวะเสิร์ฟ",
      en: "Seven chefs and three assistants covering ingredients, saucework, sweets, and the final pass.",
      ja: "7 名のシェフと 3 名のアシスタントが仕込みから最終提供までを支えます。",
      zh: "7 位主厨和 3 位助手共同负责原料、酱汁、甜品与最终出餐。",
      ko: "7명의 셰프와 3명의 어시스턴트가 재료부터 최종 패스까지 책임집니다.",
    },
  },
];

const storyChapters: StoryChapterDefinition[] = [
  {
    id: "rattanakosin-ledger",
    era: {
      th: "ปลายรัชกาลที่ 5",
      en: "Late Rama V era",
      ja: "ラーマ5世末期",
      zh: "拉玛五世晚期",
      ko: "라마 5세 말기",
    },
    title: {
      th: "สมุดบันทึกสำรับจากเรือนรับรองขุนนางริมน้ำ",
      en: "A table ledger kept in a riverside noble residence",
      ja: "川辺の貴族邸で書き継がれた食卓手帳",
      zh: "河畔贵族府邸中的宴席手札",
      ko: "강가 귀족 저택에서 쓰인 식탁 장부",
    },
    body: {
      th: "เรื่องเล่าของบ้านกล่าวถึง ‘คุณพุ่ม วรางกูร’ หญิงผู้ดูแลสำรับรับรองในเรือนเจ้านายใกล้แม่น้ำเจ้าพระยา เธอไม่ได้จดแค่สูตร แต่จดว่าจานใดควรออกก่อน กลิ่นดอกไม้ชนิดใดควรใช้ในคืนฝนพรำ และรสชาติแบบใดเหมาะกับแขกจากหัวเมืองต่างกัน",
      en: "Family lore centers on Khun Phum Warangkul, a table steward who organized diplomatic dinners near the Chao Phraya River. Her notebook did not only record recipes. It noted which dish should arrive first, which floral scent suited rainy evenings, and how the palate should be adjusted for guests from different provinces.",
      ja: "家伝では、チャオプラヤー川近くの邸宅で賓客の食卓を整えていたクン・プム・ワランクンが中心人物です。彼女の手帳にはレシピだけでなく、どの皿を最初に出すべきか、雨夜にはどの花香がふさわしいか、地方ごとの客にどのような味の調整が必要かまで記されていました。",
      zh: "家中传说的核心人物，是在昭披耶河畔宅邸中负责款待贵客的 Khun Phum Warangkul。她的笔记不只记食谱，还记下哪一道菜该先上、雨夜该配什么花香、不同来宾该如何调整味型。",
      ko: "가문의 전승은 차오프라야 강가 저택에서 외빈 연회를 맡았던 쿤 품 와랑꾼에게서 시작됩니다. 그녀의 수첩에는 조리법만이 아니라 어떤 요리를 먼저 내야 하는지, 비 오는 밤에는 어떤 꽃향이 어울리는지, 지역마다 손님의 입맛을 어떻게 조율해야 하는지까지 담겨 있었습니다.",
    },
  },
  {
    id: "house-of-revision",
    era: {
      th: "พ.ศ. 2463 - 2498",
      en: "1920 - 1955",
      ja: "1920 - 1955",
      zh: "1920 - 1955",
      ko: "1920 - 1955",
    },
    title: {
      th: "สูตรในวังเริ่มเดินทางออกสู่โต๊ะครอบครัว",
      en: "Court recipes began to travel into the family house",
      ja: "宮廷の味が家の食卓へ移り始める",
      zh: "宫廷配方开始走向家族餐桌",
      ko: "궁중의 맛이 가정의 식탁으로 옮겨가기 시작하다",
    },
    body: {
      th: "รุ่นถัดมาของบ้านนำสูตรเดิมไปปรับให้เข้ากับชีวิตจริงมากขึ้น ลดพิธีการบางอย่าง แต่รักษาความประณีตของน้ำแกง น้ำจิ้ม และการจัดสำรับไว้ครบ พร้อมเปิดรับวัตถุดิบจากเชียงใหม่ นครศรีธรรมราช และอุบลราชธานีเข้ามาอยู่ร่วมกันบนโต๊ะเดียว",
      en: "The next generation softened some of the old ceremony but kept the precision of broths, relishes, and table sequencing intact. This was also when ingredients and methods from Chiang Mai, Nakhon Si Thammarat, and Ubon Ratchathani were invited into the same household meal.",
      ja: "次の世代は古い儀礼を少し和らげながらも、スープ、ディップ、膳立ての精密さは守りました。この頃からチェンマイ、ナコーンシータンマラート、ウボンラーチャターニーの食材と技法が同じ食卓に招き入れられます。",
      zh: "下一代把部分繁复礼序放缓，却保留了汤底、蘸料与上菜秩序的讲究。也正是在这一时期，清迈、那空是贪玛叻与乌汶的食材和技法，被带进了同一张家宴餐桌。",
      ko: "다음 세대는 오래된 의식의 일부를 덜어냈지만 국물, 양념, 상차림 순서의 정교함은 지켰습니다. 이 시기부터 치앙마이, 나콘시탐마랏, 우본랏차타니의 재료와 조리법이 같은 식탁 안으로 들어오기 시작했습니다.",
    },
  },
  {
    id: "private-dining-house",
    era: {
      th: "พ.ศ. 2530",
      en: "1987",
      ja: "1987",
      zh: "1987",
      ko: "1987",
    },
    title: {
      th: "Siam Lux เปิดเป็นบ้านรับรองส่วนตัวสำหรับสำรับพิเศษ",
      en: "Siam Lux opened as a private house for ceremonial dinners",
      ja: "Siam Lux が特別な会食のための私邸として開かれる",
      zh: "Siam Lux 作为私宴餐屋正式出现",
      ko: "Siam Lux 가 특별한 만찬을 위한 프라이빗 하우스로 열리다",
    },
    body: {
      th: "ทายาทรุ่นที่สามนำสมุดบันทึกเดิมกลับมาอ่านใหม่และตั้งชื่อบ้านรับรองว่า Siam Lux เพื่อให้คนร่วมสมัยได้สัมผัสรสชาติไทยที่มีระเบียบแบบในวัง แต่ไม่ห่างเหิน พวกเขาจัดทีมครัวเป็น station ชัดเจน แยกผู้ดูแลของหวาน น้ำแกง เส้น และไฟย่างอย่างเป็นระบบ",
      en: "The third generation revisited the original notebook and opened a private dining address called Siam Lux. The aim was to make palace discipline feel warm rather than distant. The kitchen was rebuilt into clear stations: sweets, broths, noodles, grill, and final pass.",
      ja: "三代目は手帳を読み直し、Siam Lux という名の私的な会食の場を開きました。宮廷の規律を冷たさではなく温かさとして感じられるようにするため、厨房は甘味、スープ、麺、炭火、最終パスという明確な持ち場に再構成されました。",
      zh: "第三代重新阅读那本手札，并以 Siam Lux 之名开设私宴食府，希望让宫廷式秩序显得温暖而不疏离。厨房也因此被重新编成甜点、汤底、面点、火烤与出餐等清晰分工。",
      ko: "3대째는 원래의 수첩을 다시 읽고 Siam Lux 라는 이름의 프라이빗 다이닝 하우스를 열었습니다. 궁중의 규율을 차갑지 않고 따뜻하게 느끼도록 하기 위해 주방을 디저트, 육수, 면, 그릴, 최종 패스로 명확히 나누었습니다.",
    },
  },
  {
    id: "digital-atelier",
    era: {
      th: "ปัจจุบัน",
      en: "Today",
      ja: "現在",
      zh: "如今",
      ko: "현재",
    },
    title: {
      th: "จากสำรับรับรองสู่ Thai ordering atelier ที่พร้อมรับคนทุกภูมิภาค",
      en: "From ceremonial table to digital Thai ordering atelier",
      ja: "儀礼の食卓から、地域をつなぐデジタル注文アトリエへ",
      zh: "从礼序餐桌走向数字化泰式点餐工坊",
      ko: "의전의 식탁에서 디지털 태국 오더링 아틀리에로",
    },
    body: {
      th: "วันนี้ Siam Lux แปลงระเบียบของบ้านโบราณให้กลายเป็นประสบการณ์สั่งอาหารที่ลื่นไหลบนหน้าจอ แต่ยังคงหัวใจเดิมไว้ครบ: จานต้องสวย รสต้องตรง บุคลากรทุกคนต้องรู้หน้าที่ และแขกต้องรู้สึกว่าทุกเมนูถูกจัดขึ้นมาอย่างตั้งใจเพื่อเขาโดยเฉพาะ",
      en: "Today, Siam Lux translates the order of the old house into a modern screen-first dining flow. The old rules remain: the plate must look composed, the flavor must land precisely, every staff member must know their duty, and each guest should feel the meal was arranged with deliberate care.",
      ja: "現在の Siam Lux は、古い家の秩序を現代の画面上の注文体験へと置き換えています。それでも原則は変わりません。皿は美しく、味は正確に、スタッフは自分の役割を理解し、客は自分のために整えられた食卓だと感じられることです。",
      zh: "如今的 Siam Lux 把旧式宅邸中的秩序感转译成现代的点餐体验，但核心并未改变: 盘中要有气度，味道要精准，团队要各司其职，而客人要感受到这顿饭是被认真安排给他的。",
      ko: "오늘의 Siam Lux 는 오래된 집안의 질서를 현대적인 화면 중심 주문 경험으로 옮겨 놓았습니다. 하지만 원칙은 그대로입니다. 접시는 단정해야 하고, 맛은 정확해야 하며, 모든 직원은 자신의 역할을 알아야 하고, 손님은 자신을 위해 정성껏 준비된 식사라고 느껴야 합니다.",
    },
  },
];

const heritageValues: HeritageValueDefinition[] = [
  {
    id: "measured-beauty",
    title: {
      th: "งามอย่างมีวินัย",
      en: "Measured beauty",
      ja: "節度ある美しさ",
      zh: "有分寸的美感",
      ko: "절제된 아름다움",
    },
    body: {
      th: "จานต้องหรูแต่ไม่ฟุ่มเฟือย สีทองใช้เพื่อย้ำจังหวะ ไม่ใช่กลบอาหาร",
      en: "Luxury is used to frame the food, not to overpower it.",
      ja: "華やかさは料理を包むためにあり、主役を奪うためではありません。",
      zh: "奢华只是用来衬托食物，而不是盖过食物本身。",
      ko: "럭셔리는 음식을 돋보이게 하기 위한 것이지, 음식을 압도하기 위한 것이 아닙니다.",
    },
  },
  {
    id: "regional-reverence",
    title: {
      th: "เคารพรสประจำถิ่น",
      en: "Regional reverence",
      ja: "土地の味への敬意",
      zh: "尊重地方味型",
      ko: "지역 풍미에 대한 존중",
    },
    body: {
      th: "แม้ร้านจะมีภาพลักษณ์ในวัง แต่รสชาติของเหนือ อีสาน ใต้ และภาคกลางต้องยังชัดจริง",
      en: "The palace tone never erases the honesty of north, Isan, south, or central Thai flavor.",
      ja: "宮廷の空気感はあっても、北部、イサーン、南部、中部それぞれの味の輪郭は消しません。",
      zh: "即使整体气质偏宫廷，北部、依善、南部与中部的味型也必须保有真实轮廓。",
      ko: "왕실의 분위기를 갖추더라도 북부, 이산, 남부, 중부 각 지역의 맛은 분명하게 살아 있어야 합니다.",
    },
  },
  {
    id: "service-rhythm",
    title: {
      th: "บริการต้องมีจังหวะ",
      en: "Service with rhythm",
      ja: "間を持つサービス",
      zh: "服务要有节奏",
      ko: "리듬 있는 서비스",
    },
    body: {
      th: "ครัวและหน้าบ้านทำงานเหมือนวงดนตรี จานใดควรออกก่อนหลังต้องถูกกำหนดอย่างตั้งใจ",
      en: "Kitchen and service move like an ensemble, with deliberate pacing from the first plate to the last sweet.",
      ja: "厨房とサービスは合奏のように動き、最初の皿から甘味まで順序と間を設計します。",
      zh: "厨房与前场像乐团一样协作，从第一道到最后一道甜品都要有明确节奏。",
      ko: "주방과 서비스 팀은 앙상블처럼 움직이며 첫 접시부터 마지막 디저트까지 호흡을 설계합니다.",
    },
  },
  {
    id: "quiet-precision",
    title: {
      th: "ความแม่นยำที่ไม่ต้องอวดเสียงดัง",
      en: "Quiet precision",
      ja: "静かな精度",
      zh: "安静但精准",
      ko: "조용한 정밀함",
    },
    body: {
      th: "แขกไม่จำเป็นต้องเห็นทุกขั้นตอน แต่ต้องสัมผัสได้ว่าทุกขั้นตอนถูกคิดมาแล้ว",
      en: "Guests do not need to see every movement, but they should feel that every movement was considered.",
      ja: "客はすべての工程を見る必要はありません。ただ、すべてが考え抜かれていることは感じられるべきです。",
      zh: "客人不必看见每一个动作，但必须感受到每一个动作都经过思考。",
      ko: "손님은 모든 과정을 볼 필요는 없지만, 모든 과정이 숙고되었다는 감각은 받아야 합니다.",
    },
  },
];

const teamMembers: TeamMemberDefinition[] = [
  {
    id: "chef-prang",
    kind: "chef",
    name: {
      th: "เชฟปราง รัตนโกสินทร์",
      en: "Chef Prang Rattanakosin",
      ja: "シェフ・プラーン ラッタナコーシン",
      zh: "Prang Rattanakosin 主厨",
      ko: "셰프 프랑 랏따나꼬신",
    },
    role: {
      th: "หัวหน้าเชฟผู้คุมทิศทางสำรับ",
      en: "Executive heritage chef",
      ja: "エグゼクティブ・ヘリテージシェフ",
      zh: "行政传承主厨",
      ko: "총괄 헤리티지 셰프",
    },
    specialty: {
      th: "ควบคุมลำดับเสิร์ฟและ final seasoning",
      en: "Final seasoning and service sequence",
      ja: "最終調味と提供順序",
      zh: "最终调味与上菜顺序",
      ko: "최종 간과 서빙 순서",
    },
    duty: {
      th: "เป็นคนชิมรสสุดท้ายทุก station และตัดสินว่าจังหวะการออกจานของทั้งโต๊ะควรเดินอย่างไร",
      en: "She tastes every station before service and decides how the entire table should move from opening plate to dessert.",
      ja: "提供前にすべての持ち場を確認し、前菜から甘味まで卓全体の流れを決めます。",
      zh: "她会在出餐前逐一确认各站口味，并决定整桌从前菜到甜品的节奏。",
      ko: "서비스 전 모든 스테이션의 맛을 확인하고 전채부터 디저트까지 한 테이블의 흐름을 최종 조율합니다.",
    },
    palette: {
      auraFrom: "#7f1d2d",
      auraTo: "#d6b26a",
      robe: "#401517",
      robeTrim: "#d9bd7f",
      hair: "#151111",
      skin: "#d9aa86",
      ornament: "#f1dfac",
    },
  },
  {
    id: "chef-anan",
    kind: "chef",
    name: {
      th: "เชฟอนันต์ จิรากุล",
      en: "Chef Anan Jirakul",
      ja: "シェフ・アナン ジーラクン",
      zh: "Anan Jirakul 主厨",
      ko: "셰프 아난 지라꾼",
    },
    role: {
      th: "เชฟไฟแรงและกระทะ",
      en: "Wok and live-fire chef",
      ja: "中華鍋と火入れのシェフ",
      zh: "旺火与炒锅主厨",
      ko: "웍 & 라이브파이어 셰프",
    },
    specialty: {
      th: "กะเพรา ผัดไทย และจานควันหอม",
      en: "Basil, noodles, and smoke-led plates",
      ja: "バジル炒め、麺、香ばしい火の料理",
      zh: "打抛、炒面与锅气料理",
      ko: "바질 볶음, 누들, 불향 요리",
    },
    duty: {
      th: "รับผิดชอบทุกจานที่ต้องอาศัยไฟแรงและกลิ่นกระทะ ให้ได้ความหอมควันแต่ไม่เสียความนุ่มของวัตถุดิบ",
      en: "He owns every plate that needs heat, speed, and smoke without sacrificing tenderness.",
      ja: "強火とスピードが必要な皿を担当し、香ばしさとやわらかさを同時に成立させます。",
      zh: "所有需要火力、速度和锅气的菜都由他负责，同时确保食材仍保有柔软口感。",
      ko: "강한 화력과 속도가 필요한 접시를 맡아 불향은 살리되 재료의 부드러움은 잃지 않게 합니다.",
    },
    palette: {
      auraFrom: "#7b341e",
      auraTo: "#efc073",
      robe: "#311613",
      robeTrim: "#f0c377",
      hair: "#171211",
      skin: "#c8926d",
      ornament: "#f6df9d",
    },
  },
  {
    id: "chef-kanda",
    kind: "chef",
    name: {
      th: "เชฟกันดา วรสิทธิ์",
      en: "Chef Kanda Vorasit",
      ja: "シェフ・カンダ ウォラシット",
      zh: "Kanda Vorasit 主厨",
      ko: "셰프 깐다 워라싯",
    },
    role: {
      th: "เชฟน้ำแกงและซอสกลางครัว",
      en: "Curry and sauce chef",
      ja: "カレーとソースのシェフ",
      zh: "咖喱与酱汁主厨",
      ko: "커리 & 소스 셰프",
    },
    specialty: {
      th: "แกงเขียวหวาน มัสมั่น และ base stock",
      en: "Green curry, massaman, and mother stocks",
      ja: "グリーンカレー、マッサマン、母体スープ",
      zh: "青咖喱、玛莎曼与基础高汤",
      ko: "그린 커리, 마사만, 기본 스톡",
    },
    duty: {
      th: "ดูแลความต่อเนื่องของรสชาติในหม้อน้ำแกงและซอสทุกชนิด เพื่อให้รสประจำร้านคงที่ไม่ว่าลูกค้าจะสั่งวันไหน",
      en: "She protects the continuity of the house taste across every curry pot, relish, and base sauce.",
      ja: "店の味の軸がぶれないよう、すべてのカレー、ディップ、ベースソースの一貫性を守ります。",
      zh: "她负责维持全店所有咖喱、蘸料与基础酱汁的味道一致性。",
      ko: "모든 커리와 딥, 베이스 소스의 맛이 언제나 같은 결을 유지하도록 관리합니다.",
    },
    palette: {
      auraFrom: "#0f5132",
      auraTo: "#d9bd7f",
      robe: "#173228",
      robeTrim: "#e8cb8b",
      hair: "#161212",
      skin: "#d4a07f",
      ornament: "#efe0b2",
    },
  },
  {
    id: "chef-phumin",
    kind: "chef",
    name: {
      th: "เชฟภูมินทร์ เศรษฐา",
      en: "Chef Phumin Srettha",
      ja: "シェフ・プーミン スレッタ",
      zh: "Phumin Srettha 主厨",
      ko: "셰프 푸민 스렛타",
    },
    role: {
      th: "เชฟปลาแม่น้ำและครัวภาคกลาง",
      en: "River and central table chef",
      ja: "川魚と中部料理のシェフ",
      zh: "河鲜与中部菜主厨",
      ko: "민물해산물 & 중부 요리 셰프",
    },
    specialty: {
      th: "ต้มยำ ไข่เจียวปู และข้าวผัดกุ้งแม่น้ำ",
      en: "Tom yum, crab omelette, and river prawn rice",
      ja: "トムヤム、蟹オムレツ、川海老炒飯",
      zh: "冬阴功、蟹肉蛋饼与河虾炒饭",
      ko: "똠얌, 게 오믈렛, 민물새우 볶음밥",
    },
    duty: {
      th: "รับหน้าที่เชื่อมกลิ่นอายโต๊ะรับรองกรุงเทพฯ กับวัตถุดิบแม่น้ำ ให้จานกลางร้านดูสง่าแต่กินง่าย",
      en: "He bridges the Bangkok receiving-table tradition with river ingredients and central Thai refinement.",
      ja: "バンコクのもてなしの食卓と川の食材をつなぎ、中部らしい上品さを整えます。",
      zh: "他把曼谷待客餐桌的细致，与河鲜食材的鲜味连接起来。",
      ko: "방콕식 접대 상차림과 민물 식재료를 연결해 중부 특유의 단정한 풍미를 만듭니다.",
    },
    palette: {
      auraFrom: "#5e3a1f",
      auraTo: "#f0cb7d",
      robe: "#2a1710",
      robeTrim: "#eccb84",
      hair: "#191411",
      skin: "#cb946f",
      ornament: "#efd7a0",
    },
  },
  {
    id: "chef-nalin",
    kind: "chef",
    name: {
      th: "เชฟนลิน ธรรมรัตน์",
      en: "Chef Nalin Thammarat",
      ja: "シェフ・ナリン タンマラット",
      zh: "Nalin Thammarat 主厨",
      ko: "셰프 날린 탐마랏",
    },
    role: {
      th: "เชฟเส้นและน้ำซุปล้านนา",
      en: "Northern noodle and broth chef",
      ja: "北部麺とスープのシェフ",
      zh: "泰北汤面主厨",
      ko: "북부 누들 & 브로스 셰프",
    },
    specialty: {
      th: "ข้าวซอย น้ำเงี้ยว และงานซุปเหนือ",
      en: "Khao soi, nam ngiao, and northern broths",
      ja: "カオソーイ、ナムギアオ、北部スープ",
      zh: "咖喱面、南诰与北部汤底",
      ko: "카오소이, 남응이아오, 북부 국물",
    },
    duty: {
      th: "เธอดูแลซุปและเส้นที่ต้องลึกแต่ไม่หนักเกินไป ให้กลิ่นเครื่องเทศเหนืออยู่บนปลายลิ้นอย่างนุ่มนวล",
      en: "She balances northern spice so broths feel deep, warm, and comforting rather than heavy.",
      ja: "北部の香りを深く保ちながらも重くしすぎず、やさしい余韻に整えます。",
      zh: "她让泰北香料在汤里有深度却不过重，留下温暖而轻柔的尾韵。",
      ko: "북부 향신료의 깊이는 살리되 지나치게 무겁지 않도록 조절해 편안한 여운을 남깁니다.",
    },
    palette: {
      auraFrom: "#6a4817",
      auraTo: "#f2cf80",
      robe: "#392012",
      robeTrim: "#edc67a",
      hair: "#1a1513",
      skin: "#d2a17f",
      ornament: "#f4dfab",
    },
  },
  {
    id: "chef-surin",
    kind: "chef",
    name: {
      th: "เชฟสุรินทร์ คำสาย",
      en: "Chef Surin Khamsai",
      ja: "シェフ・スリン カムサイ",
      zh: "Surin Khamsai 主厨",
      ko: "셰프 수린 캄사이",
    },
    role: {
      th: "เชฟอีสานครกและเตาย่าง",
      en: "Isan mortar and grill chef",
      ja: "イサーンの臼とグリルのシェフ",
      zh: "依善臼拌与烤架主厨",
      ko: "이산 절구 & 그릴 셰프",
    },
    specialty: {
      th: "ส้มตำ ลาบ น้ำตก และแจ่ว",
      en: "Som tum, larb, nam tok, and jaew",
      ja: "ソムタム、ラープ、ナムトック、แจ่ว",
      zh: "青木瓜沙拉、拉拌、牛肉拌与แจ่ว酱",
      ko: "쏨땀, 라브, 남똑, 재우",
    },
    duty: {
      th: "เขาคุมรสแซ่บของร้าน ไม่ให้ความหรูทำให้ความจริงของอีสานอ่อนลงแม้แต่นิดเดียว",
      en: "He makes sure luxury never softens the truth of Isan heat, acidity, and roasted-rice aroma.",
      ja: "上品さがあっても、イサーンらしい辛さ、酸味、煎り米の香りが弱まらないよう守ります。",
      zh: "他确保高级感不会削弱依善菜该有的辣、酸与烤米香。",
      ko: "고급스러운 연출이 있더라도 이산 음식의 매운맛, 산미, 볶은 쌀 향이 흐려지지 않게 지킵니다.",
    },
    palette: {
      auraFrom: "#7d1d1d",
      auraTo: "#e8b86a",
      robe: "#331514",
      robeTrim: "#ebbe74",
      hair: "#120f0f",
      skin: "#bb835f",
      ornament: "#f3d597",
    },
  },
  {
    id: "chef-pimlada",
    kind: "chef",
    name: {
      th: "เชฟพิมลดา จันทร์แก้ว",
      en: "Chef Pimlada Chankaew",
      ja: "シェフ・ピムラダー チャンケオ",
      zh: "Pimlada Chankaew 主厨",
      ko: "셰프 핌라다 찬깨우",
    },
    role: {
      th: "เชฟเครื่องเทศใต้และซีฟู้ด",
      en: "Southern spice and seafood chef",
      ja: "南部スパイスとシーフードのシェフ",
      zh: "南部香料与海鲜主厨",
      ko: "남부 향신료 & 해산물 셰프",
    },
    specialty: {
      th: "คั่วกลิ้ง แกงส้ม และสะตอ",
      en: "Kua kling, gaeng som, and sataw",
      ja: "クアクリン、ゲーンソム、サトー料理",
      zh: "干炒咖喱、酸辣咖喱与臭豆料理",
      ko: "쿠아클링, 갱쏨, 사또 요리",
    },
    duty: {
      th: "เธอดูแลมิติรสของภาคใต้ให้แรงพอจะปลุกความทรงจำของคนใต้ แต่ยังคุม balance ให้คนต่างถิ่นเข้าถึงได้",
      en: "She keeps southern dishes vivid enough for people from the south to trust, while balancing them so new guests still lean in for the next bite.",
      ja: "南部の客が納得する力強さを保ちながら、初めての客にも届く均衡を整えます。",
      zh: "她让南部菜保有足够鲜明的本味，让熟悉这类味道的人信服，也让初次尝试的人愿意继续吃下去。",
      ko: "남부 출신 손님이 인정할 만큼 선명한 풍미를 유지하면서도 처음 먹는 손님도 접근할 수 있게 균형을 잡습니다.",
    },
    palette: {
      auraFrom: "#0d5a43",
      auraTo: "#e1c178",
      robe: "#18352a",
      robeTrim: "#e7ca84",
      hair: "#171312",
      skin: "#d0a07f",
      ornament: "#f2deae",
    },
  },
  {
    id: "chef-busaba",
    kind: "chef",
    name: {
      th: "เชฟบุษบา มนเทียร",
      en: "Chef Busaba Monthian",
      ja: "シェフ・ブサバー モンティアン",
      zh: "Busaba Monthian 主厨",
      ko: "셰프 부사바 먼티안",
    },
    role: {
      th: "เชฟขนมไทยและของหวานในวัง",
      en: "Royal sweets and pastry chef",
      ja: "タイ宮廷菓子のシェフ",
      zh: "宫廷甜点主厨",
      ko: "타이 궁중 디저트 셰프",
    },
    specialty: {
      th: "มะม่วงข้าวเหนียว ขนมเบื้อง ฝอยทอง และจานหวานร่วมสมัย",
      en: "Mango sticky rice, kanom buang, foi thong, and plated sweets",
      ja: "マンゴーもち米、カノムブアン、フォイトーン、現代的甘味",
      zh: "芒果糯米、薄饼、金丝蛋与现代甜盘",
      ko: "망고 찹쌀, 카놈 부앙, 포이통, 플레이트 디저트",
    },
    duty: {
      th: "รับผิดชอบตอนจบของมื้อให้ยังคงนุ่มนวล มีความหอมของมะพร้าว ใบเตย และความงามแบบขนมชาววัง",
      en: "She closes the meal with pandan, coconut, and the controlled elegance of old Thai sweets.",
      ja: "パンダン、ココナッツ、古典菓子の気品を使って、食事の終わりを柔らかく整えます。",
      zh: "她负责让整顿饭在班兰、椰香与宫廷甜点的精致感中柔和收尾。",
      ko: "판단, 코코넛, 전통 궁중 디저트의 품격으로 식사의 마지막을 부드럽게 마무리합니다.",
    },
    palette: {
      auraFrom: "#6f4722",
      auraTo: "#f4d48b",
      robe: "#3a2216",
      robeTrim: "#f0cf87",
      hair: "#181412",
      skin: "#d8ab88",
      ornament: "#f4e1b6",
    },
  },
  {
    id: "assistant-mali",
    kind: "assistant",
    name: {
      th: "มะลิ ดวงใจ",
      en: "Mali Duangjai",
      ja: "マリ ドゥアンジャイ",
      zh: "Mali Duangjai",
      ko: "말리 두앙자이",
    },
    role: {
      th: "ลูกมือ stock และเครื่องแกง",
      en: "Stock and curry assistant",
      ja: "スープとカレーベースのアシスタント",
      zh: "高汤与咖喱底助手",
      ko: "스톡 & 커리 어시스턴트",
    },
    specialty: {
      th: "เตรียมเครื่อง หั่นสมุนไพร และดูแลหม้อ base",
      en: "Herb prep and base pots",
      ja: "香草の下ごしらえとベース鍋",
      zh: "香草备料与基础锅底",
      ko: "허브 손질과 베이스 포트",
    },
    duty: {
      th: "อยู่เบื้องหลังหม้อหลักของร้าน คอยเฝ้าความนิ่งของน้ำ stock และความสดของสมุนไพรทุกวัน",
      en: "She watches the base pots and fresh herbs so the kitchen starts each day on the same note.",
      ja: "店のベースとなる鍋とハーブの鮮度を守り、厨房の一日を安定した状態で始めます。",
      zh: "她守着店里的基础锅底与香草新鲜度，确保每天的厨房从同一标准起步。",
      ko: "주방의 기본이 되는 스톡 냄비와 허브의 신선도를 관리해 하루의 출발점을 일정하게 맞춥니다.",
    },
    palette: {
      auraFrom: "#184c38",
      auraTo: "#d8ba78",
      robe: "#1a3028",
      robeTrim: "#dfc381",
      hair: "#171312",
      skin: "#c99370",
      ornament: "#f0deb0",
    },
  },
  {
    id: "assistant-preecha",
    kind: "assistant",
    name: {
      th: "ปรีชา องอาจ",
      en: "Preecha Ongart",
      ja: "プリーチャー オンアート",
      zh: "Preecha Ongart",
      ko: "프리차 옹앗",
    },
    role: {
      th: "ลูกมือ garnish และ pass",
      en: "Garnish and pass assistant",
      ja: "ガーニッシュとパスのアシスタント",
      zh: "装饰与出餐口助手",
      ko: "가니시 & 패스 어시스턴트",
    },
    specialty: {
      th: "จัดสมุนไพร จบจาน และตรวจความเรียบร้อยก่อนเสิร์ฟ",
      en: "Finishing herbs and final checks",
      ja: "仕上げのハーブと最終確認",
      zh: "收尾香草与最终检查",
      ko: "마무리 허브와 최종 점검",
    },
    duty: {
      th: "เป็นคนสุดท้ายที่แตะจานก่อนออกจากครัว จึงรับผิดชอบความสะอาด ความสมดุล และความตรงของรายละเอียดทั้งหมด",
      en: "He is the last hand to touch the plate before it leaves the kitchen, so detail, cleanliness, and balance live with him.",
      ja: "厨房を出る前に最後に皿へ触れる役割として、細部、清潔感、均衡を引き受けます。",
      zh: "他是菜品离开厨房前最后一个接手的人，因此细节、整洁与平衡都要在他这里确认。",
      ko: "접시가 주방을 나가기 전 마지막으로 손을 대는 사람으로서 디테일, 청결, 균형을 최종 확인합니다.",
    },
    palette: {
      auraFrom: "#6a241d",
      auraTo: "#dfb76b",
      robe: "#311816",
      robeTrim: "#dfbb73",
      hair: "#131010",
      skin: "#ba845f",
      ornament: "#efd8a3",
    },
  },
  {
    id: "assistant-nisa",
    kind: "assistant",
    name: {
      th: "นิสา วัฒนกุล",
      en: "Nisa Wattanakul",
      ja: "ニサ ワッタナクン",
      zh: "Nisa Wattanakul",
      ko: "니사 왓타나꾼",
    },
    role: {
      th: "ลูกมือของหวานและชาดอกไม้",
      en: "Dessert and tea assistant",
      ja: "甘味と花茶のアシスタント",
      zh: "甜点与花茶助手",
      ko: "디저트 & 플로럴 티 어시스턴트",
    },
    specialty: {
      th: "เตรียมของหวานเย็น ชา และ garnish จานหวาน",
      en: "Cold sweets, tea service, and dessert garnish",
      ja: "冷菓、茶、甘味の仕上げ",
      zh: "冷甜品、花茶与甜点装饰",
      ko: "콜드 디저트, 티 서비스, 디저트 장식",
    },
    duty: {
      th: "ดูแลให้ตอนท้ายของมื้อยังคงความนิ่งของร้าน ทั้งกลิ่นหอม สี และอุณหภูมิของของหวานกับเครื่องดื่ม",
      en: "She keeps the final course calm, fragrant, and temperature-perfect from plated sweets to floral tea.",
      ja: "最後のひと皿と茶の香り、色、温度を整え、食後の印象を静かに完成させます。",
      zh: "她负责让最后一道甜点与花茶在香气、颜色与温度上都维持最好的状态。",
      ko: "플레이트 디저트부터 꽃차까지 향, 색, 온도를 정돈해 식사의 마지막 인상을 완성합니다.",
    },
    palette: {
      auraFrom: "#6b4320",
      auraTo: "#ebca88",
      robe: "#352116",
      robeTrim: "#eccb89",
      hair: "#171211",
      skin: "#d2a17d",
      ornament: "#f5e4b8",
    },
  },
];

const supportRoles: SupportRoleDefinition[] = [
  {
    id: "house-steward",
    title: {
      th: "ผู้จัดการร้าน / House Steward",
      en: "General manager / House steward",
      ja: "店舗支配人 / ハウススチュワード",
      zh: "店经理 / 管家式总负责",
      ko: "총지배인 / 하우스 스튜어드",
    },
    duty: {
      th: "คุมมาตรฐานบริการ ภาพรวมรอบร้าน การจัดที่นั่ง และการแก้ปัญหาหน้างานทั้งหมด",
      en: "Owns floor standards, seating flow, guest recovery, and the overall rhythm of the house.",
      ja: "客席全体の基準、案内の流れ、席配置、現場対応を統括します。",
      zh: "统筹楼面标准、客席流转、座位安排与现场应变。",
      ko: "플로어 기준, 좌석 운영, 고객 응대, 현장 문제 해결까지 전체 흐름을 책임집니다.",
    },
  },
  {
    id: "reservation-concierge",
    title: {
      th: "ผู้ดูแลการจองและคำขอพิเศษ",
      en: "Reservation concierge",
      ja: "予約コンシェルジュ",
      zh: "预订礼宾",
      ko: "예약 컨시어지",
    },
    duty: {
      th: "ดูแลจองโต๊ะ special request วันเกิด อาหารแพ้ และการจับคู่โต๊ะกับประสบการณ์ที่เหมาะ",
      en: "Handles bookings, guest notes, allergies, celebrations, and special table preparation.",
      ja: "予約、アレルギー、記念日、特別席の準備など来店前の調整を担います。",
      zh: "负责订位、过敏备注、庆生需求与特殊席位准备。",
      ko: "예약, 알레르기 메모, 기념일 요청, 특별 좌석 준비 등 방문 전 조율을 담당합니다.",
    },
  },
  {
    id: "service-captain",
    title: {
      th: "หัวหน้าพนักงานเสิร์ฟ / Service Captain",
      en: "Service captain",
      ja: "サービスキャプテン",
      zh: "楼面领班",
      ko: "서비스 캡틴",
    },
    duty: {
      th: "เป็นตัวเชื่อมระหว่างครัวกับพนักงานเสิร์ฟ กำหนดลำดับจานและดูแลโต๊ะสำคัญ",
      en: "Bridges kitchen and floor, controls pacing, and leads the highest-priority tables.",
      ja: "厨房と客席をつなぎ、料理の順番と重要席の進行を管理します。",
      zh: "连接厨房与前场，控制出餐节奏并负责重点桌次。",
      ko: "주방과 플로어를 연결하며 서빙 속도와 주요 테이블 운영을 조정합니다.",
    },
  },
  {
    id: "servers",
    title: {
      th: "พนักงานเสิร์ฟ / Floor Servers",
      en: "Floor servers",
      ja: "フロアサーバー",
      zh: "服务员",
      ko: "플로어 서버",
    },
    duty: {
      th: "เล่าที่มาของจาน แนะนำรสชาติ แก้ไขคำขอหน้างาน และดูแลประสบการณ์ของแขกตลอดมื้อ",
      en: "Explain dishes, guide flavor expectations, and care for guests throughout the meal.",
      ja: "料理の背景や味の特徴を説明し、食事中の細かな要望に対応します。",
      zh: "介绍菜品来源与风味，处理现场需求，并持续照顾客人用餐体验。",
      ko: "요리의 배경과 맛을 설명하고 식사 중 발생하는 요청을 세심하게 응대합니다.",
    },
  },
  {
    id: "cashier",
    title: {
      th: "พนักงานแคชเชียร์ / Guest Billing",
      en: "Cashier and guest billing",
      ja: "会計担当",
      zh: "收银与账单管理",
      ko: "캐셔 & 빌링",
    },
    duty: {
      th: "รับชำระเงิน ออกใบเสร็จ ดูแลโปรโมชัน และตรวจความถูกต้องของยอดกับรายการ",
      en: "Manages payment, receipt accuracy, promotional codes, and the final billing handshake.",
      ja: "会計、レシート、割引適用、最終精算の正確性を担保します。",
      zh: "负责结账、票据、优惠码适用与最终账单准确性。",
      ko: "결제, 영수증, 프로모션 적용, 최종 금액의 정확성을 책임집니다.",
    },
  },
  {
    id: "tea-beverage",
    title: {
      th: "ผู้ดูแลชาและเครื่องดื่ม",
      en: "Tea and beverage steward",
      ja: "茶と飲料のスチュワード",
      zh: "茶饮与饮品管家",
      ko: "티 & 베버리지 스튜어드",
    },
    duty: {
      th: "ดูแลชาดอกไม้ เครื่องดื่มสมุนไพร pairing และอุณหภูมิของเครื่องดื่มแต่ละช่วงคอร์ส",
      en: "Curates floral tea, herbal drinks, and pairings that support the food without competing with it.",
      ja: "花茶やハーブドリンクのペアリングを整え、料理を邪魔しない飲み物体験を作ります。",
      zh: "负责花茶、草本饮品与搭配建议，让饮品辅助菜品而不抢味。",
      ko: "플로럴 티와 허브 음료, 페어링을 구성해 음식의 풍미를 받쳐 줍니다.",
    },
  },
  {
    id: "procurement",
    title: {
      th: "ผู้จัดซื้อและคัดวัตถุดิบ",
      en: "Purchasing and ingredient curator",
      ja: "仕入れと食材キュレーター",
      zh: "采购与食材策划",
      ko: "구매 & 식재료 큐레이터",
    },
    duty: {
      th: "ออกตลาด คัดสมุนไพร เนื้อ ซีฟู้ด และประสานแหล่งวัตถุดิบจากแต่ละภูมิภาค",
      en: "Sources herbs, proteins, seafood, and coordinates the producers behind the regional menu.",
      ja: "ハーブ、肉、魚介の調達と、各地域の生産者との連携を担います。",
      zh: "负责香草、肉类、海鲜采购，并协调各地供应者。",
      ko: "허브, 육류, 해산물을 조달하고 지역별 생산자와 연결되는 공급망을 관리합니다.",
    },
  },
  {
    id: "quality-hygiene",
    title: {
      th: "ควบคุมคุณภาพ สุขอนามัย และสต็อก",
      en: "Quality, hygiene, and inventory control",
      ja: "品質・衛生・在庫管理",
      zh: "质量、卫生与库存管理",
      ko: "품질·위생·재고 관리",
    },
    duty: {
      th: "ตรวจ FIFO อุณหภูมิห้องเย็น เอกสารสุขอนามัย และความพร้อมของวัตถุดิบทุก station",
      en: "Owns cold-room temperature, FIFO, hygiene records, and station readiness before service.",
      ja: "冷蔵温度、FIFO、衛生記録、営業前の各持ち場の準備状況を管理します。",
      zh: "负责冷藏温度、先进先出、卫生记录与各站开餐前准备。",
      ko: "냉장 온도, FIFO, 위생 기록, 서비스 전 각 스테이션 준비 상태를 관리합니다.",
    },
  },
];

function resolve(text: LocalizedText, locale: AppLocale) {
  return text[locale];
}

export function getLocalizedHeritageData(locale: AppLocale) {
  return {
    overview: {
      eyebrow: resolve(pageCopy.overviewEyebrow, locale),
      title: resolve(pageCopy.overviewTitle, locale),
      body: resolve(pageCopy.overviewBody, locale),
      primaryCta: resolve(pageCopy.overviewPrimaryCta, locale),
      secondaryCta: resolve(pageCopy.overviewSecondaryCta, locale),
    },
    sections: {
      storyEyebrow: resolve(pageCopy.storyEyebrow, locale),
      storyTitle: resolve(pageCopy.storyTitle, locale),
      valuesEyebrow: resolve(pageCopy.valuesEyebrow, locale),
      valuesTitle: resolve(pageCopy.valuesTitle, locale),
      teamEyebrow: resolve(pageCopy.teamEyebrow, locale),
      teamTitle: resolve(pageCopy.teamTitle, locale),
      teamBody: resolve(pageCopy.teamBody, locale),
      supportEyebrow: resolve(pageCopy.supportEyebrow, locale),
      supportTitle: resolve(pageCopy.supportTitle, locale),
      supportBody: resolve(pageCopy.supportBody, locale),
    },
    stats: storyStats.map((item) => ({
      value: item.value,
      label: resolve(item.label, locale),
      description: resolve(item.description, locale),
    })),
    chapters: storyChapters.map((item) => ({
      id: item.id,
      era: resolve(item.era, locale),
      title: resolve(item.title, locale),
      body: resolve(item.body, locale),
    })),
    values: heritageValues.map((item) => ({
      id: item.id,
      title: resolve(item.title, locale),
      body: resolve(item.body, locale),
    })),
    team: teamMembers.map((item) => ({
      id: item.id,
      kind: item.kind,
      name: resolve(item.name, locale),
      role: resolve(item.role, locale),
      specialty: resolve(item.specialty, locale),
      duty: resolve(item.duty, locale),
      palette: item.palette,
    })),
    supportRoles: supportRoles.map((item) => ({
      id: item.id,
      title: resolve(item.title, locale),
      duty: resolve(item.duty, locale),
    })),
  };
}
