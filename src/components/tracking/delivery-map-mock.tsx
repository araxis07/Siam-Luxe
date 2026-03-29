import type { AppLocale } from "@/i18n/routing";
import { getDeliveryMapStops } from "@/lib/guest-experience";

const mapText = {
  th: {
    title: "แผนที่เส้นทางจัดส่ง",
    subtitle: "แสดงจังหวะจากครัว จุดรับของ และปลายทางของคำสั่งซื้ออย่างต่อเนื่อง",
  },
  en: {
    title: "Delivery route map",
    subtitle: "Follow the route from kitchen pacing to rider handoff and final delivery.",
  },
  ja: {
    title: "配送ルートマップ",
    subtitle: "キッチンからライダー、配達先までの流れを視覚化します。",
  },
  zh: {
    title: "配送路线地图",
    subtitle: "以可视化方式呈现后厨、骑手与送达节奏。",
  },
  ko: {
    title: "딜리버리 경로 맵",
    subtitle: "주방, 라이더, 도착지까지의 흐름을 시각화합니다.",
  },
} as const;

export function DeliveryMapMock({
  locale,
  orderId,
}: {
  locale: AppLocale;
  orderId?: string;
}) {
  const text = mapText[locale];
  const stops = getDeliveryMapStops(locale, orderId);

  return (
    <div className="lux-panel-soft overflow-hidden rounded-[2rem] p-6 sm:p-8">
      <p className="text-[0.66rem] uppercase tracking-[0.18em] text-[#cdb37d]">{text.title}</p>
      <p className="mt-3 max-w-2xl text-sm leading-7 text-[#d1c4b2]">{text.subtitle}</p>
      <div className="relative mt-6 min-h-[18rem] overflow-hidden rounded-[1.8rem] border border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(214,178,106,0.12),transparent_24%),radial-gradient(circle_at_bottom_right,rgba(21,86,63,0.16),transparent_26%),linear-gradient(180deg,rgba(17,14,14,0.95),rgba(9,9,9,0.98))]">
        <div className="absolute inset-0 opacity-25 [background-image:linear-gradient(rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:36px_36px]" />
        <div className="absolute left-[22%] top-[18%] h-[52%] w-[58%] rounded-full border border-dashed border-[#d6b26a]/25" />
        <div className="absolute left-[24%] top-[24%] h-px w-[50%] rotate-[29deg] bg-gradient-to-r from-[#d6b26a] via-[#ecd8a0] to-[#1d624b]" />
        {stops.map((stop) => (
          <div
            key={stop.id}
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{ top: `${stop.top}%`, left: `${stop.left}%` }}
          >
            <span className={`block size-4 rounded-full border-2 ${stop.active ? "border-[#ecd8a0] bg-[#d6b26a]" : "border-white/20 bg-[#1b1717]"}`} />
            <div className="mt-3 min-w-32 rounded-[1.2rem] border border-white/10 bg-black/45 px-3 py-3 backdrop-blur">
              <p className="text-sm text-white">{stop.label}</p>
              <p className="mt-1 text-xs uppercase tracking-[0.16em] text-[#bcae9b]">{stop.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
