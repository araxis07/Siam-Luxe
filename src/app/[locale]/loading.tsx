export default function LocaleLoading() {
  return (
    <div className="scene-section px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="h-10 w-48 animate-pulse rounded-full bg-white/6" />
        <div className="h-16 max-w-3xl animate-pulse rounded-[2rem] bg-white/6" />
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }, (_, index) => (
            <div key={index} className="h-[380px] animate-pulse rounded-[2rem] bg-white/6" />
          ))}
        </div>
      </div>
    </div>
  );
}
