import Link from "next/link";

export default function NotFound() {
  return (
    <main className="scene-section px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[70vh] max-w-3xl flex-col items-center justify-center text-center">
        <div className="lux-panel rounded-[2.4rem] px-6 py-16 sm:px-10">
          <p className="text-[0.7rem] uppercase tracking-[0.22em] text-[#d6b26a]">404</p>
          <h1 className="mt-4 font-heading text-[3rem] leading-tight text-white">
            ไม่พบหน้าที่คุณกำลังมองหา
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-[#d1c4b2]">
            เส้นทางนี้อาจถูกย้ายไปแล้ว หน้านี้อาจถูกลบออก หรือ locale ของลิงก์ไม่ถูกต้อง
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/th"
              className="button-shine inline-flex h-12 items-center justify-center rounded-full bg-[#d6b26a] px-6 text-sm font-semibold text-[#1b130f] transition-colors hover:bg-[#e4c987]"
            >
              กลับหน้าแรก
            </Link>
            <Link
              href="/th/menu"
              className="inline-flex h-12 items-center justify-center rounded-full border border-white/10 bg-white/5 px-6 text-sm font-semibold text-white transition-colors hover:bg-white/10"
            >
              ดูเมนู
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
