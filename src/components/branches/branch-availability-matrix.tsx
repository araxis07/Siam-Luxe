import type { AppLocale } from "@/i18n/routing";
import type { BranchId } from "@/lib/experience";
import { getBranchAvailabilityMatrix } from "@/lib/guest-experience";

const matrixText = {
  th: {
    title: "ตารางความพร้อมให้บริการ",
    window: "ช่วงเวลา",
    dineIn: "ทานที่ร้าน",
    pickup: "รับเอง",
    delivery: "เดลิเวอรี",
    privateDining: "ห้องส่วนตัว",
    open: "พร้อม",
    limited: "จำกัด",
    waitlist: "รอคิว",
  },
  en: {
    title: "Availability matrix",
    window: "Window",
    dineIn: "Dine-in",
    pickup: "Pickup",
    delivery: "Delivery",
    privateDining: "Private dining",
    open: "Open",
    limited: "Limited",
    waitlist: "Waitlist",
  },
  ja: {
    title: "提供状況マトリクス",
    window: "時間帯",
    dineIn: "店内利用",
    pickup: "受取",
    delivery: "配送",
    privateDining: "個室",
    open: "案内可",
    limited: "残り少",
    waitlist: "待機",
  },
  zh: {
    title: "可用性矩阵",
    window: "时段",
    dineIn: "堂食",
    pickup: "自取",
    delivery: "配送",
    privateDining: "包厢",
    open: "可用",
    limited: "有限",
    waitlist: "候补",
  },
  ko: {
    title: "가용성 매트릭스",
    window: "시간대",
    dineIn: "매장 식사",
    pickup: "픽업",
    delivery: "배달",
    privateDining: "프라이빗 다이닝",
    open: "가능",
    limited: "제한적",
    waitlist: "웨이트리스트",
  },
} as const;

function statusClass(state: "open" | "limited" | "waitlist") {
  if (state === "open") return "bg-[#1d624b]/18 text-[#c7efd9] border-[#1d624b]/24";
  if (state === "limited") return "bg-[#d6b26a]/14 text-[#ecd8a0] border-[#d6b26a]/24";
  return "bg-[#9b1d27]/14 text-[#f1b2b2] border-[#9b1d27]/24";
}

export function BranchAvailabilityMatrix({
  locale,
  branchId,
}: {
  locale: AppLocale;
  branchId?: BranchId;
}) {
  const text = matrixText[locale];
  const matrix = getBranchAvailabilityMatrix(locale, branchId);

  return (
    <div className="space-y-4">
      {matrix.map((entry) => (
        <div key={entry.branch.id} className="lux-panel-soft rounded-[2rem] p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-[0.66rem] uppercase tracking-[0.18em] text-[#cdb37d]">{text.title}</p>
              <h3 className="mt-3 font-heading text-[1.9rem] text-white">{entry.branch.name}</h3>
            </div>
            <p className="text-sm text-[#bcae9b]">{entry.branch.neighborhood}</p>
          </div>
          <div className="mt-5 overflow-x-auto">
            <table className="min-w-full border-separate border-spacing-y-3">
              <thead>
                <tr className="text-left text-[0.66rem] uppercase tracking-[0.18em] text-[#cdb37d]">
                  <th className="pr-4">{text.window}</th>
                  <th className="pr-4">{text.dineIn}</th>
                  <th className="pr-4">{text.pickup}</th>
                  <th className="pr-4">{text.delivery}</th>
                  <th>{text.privateDining}</th>
                </tr>
              </thead>
              <tbody>
                {entry.rows.map((row) => (
                  <tr key={row.id} className="align-top">
                    <td className="pr-4 text-white">{row.label}</td>
                    {(["dineIn", "pickup", "delivery", "privateDining"] as const).map((key) => (
                      <td key={key} className="pr-4">
                        <span className={`inline-flex rounded-full border px-3 py-1 text-xs uppercase tracking-[0.16em] ${statusClass(row[key])}`}>
                          {text[row[key]]}
                        </span>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
}
