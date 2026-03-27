import Link from "next/link";

export default function NotFound() {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#0b0909] px-4 text-white">
        <main className="mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center text-center">
          <p className="text-[0.7rem] uppercase tracking-[0.22em] text-[#d6b26a]">404</p>
          <h1 className="mt-4 font-heading text-[3rem] leading-tight">This Siam Lux page does not exist</h1>
          <p className="mt-4 max-w-xl text-[#d1c4b2]">
            The route may have moved, the locale may be missing, or the link is no longer valid.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/th"
              className="button-shine inline-flex h-12 items-center justify-center rounded-full bg-[#d6b26a] px-6 text-sm font-semibold text-[#1b130f] transition-colors hover:bg-[#e4c987]"
            >
              Back to home
            </Link>
            <Link
              href="/th/menu"
              className="inline-flex h-12 items-center justify-center rounded-full border border-white/10 bg-white/5 px-6 text-sm font-semibold text-white transition-colors hover:bg-white/10"
            >
              Browse menu
            </Link>
          </div>
        </main>
      </body>
    </html>
  );
}
