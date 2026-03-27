import Link from "next/link";

export default function MaintenancePage() {
  return (
    <main className="min-h-screen bg-[#0b0909] px-4 text-white">
      <div className="mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center text-center">
        <p className="text-[0.7rem] uppercase tracking-[0.22em] text-[#d6b26a]">อยู่ระหว่างปรับปรุง</p>
        <h1 className="mt-4 font-heading text-[3rem] leading-tight">Siam Lux กำลังเตรียมรอบบริการถัดไป</h1>
        <p className="mt-4 max-w-xl text-[#d1c4b2]">
          หน้านี้เป็น maintenance screen ฝั่ง frontend สำหรับช่วงอัปเดตระบบ การส่งต่องาน หรือประกาศของสาขาในอนาคต
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/th"
            className="button-shine inline-flex h-12 items-center justify-center rounded-full bg-[#d6b26a] px-6 text-sm font-semibold text-[#1b130f] transition-colors hover:bg-[#e4c987]"
          >
            กลับหน้าแรก
          </Link>
          <Link
            href="/th/contact"
            className="inline-flex h-12 items-center justify-center rounded-full border border-white/10 bg-white/5 px-6 text-sm font-semibold text-white transition-colors hover:bg-white/10"
          >
            ติดต่อทีมของร้าน
          </Link>
        </div>
      </div>
    </main>
  );
}
