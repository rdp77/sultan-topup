/** Route-level loading skeleton for /game/[slug] (matches the page layout). */
export default function GameLoading() {
  return (
    <main id="main" className="flex-1">
      {/* Banner */}
      <div className="relative h-40 w-full overflow-hidden md:h-56">
        <div className="bg-muted animate-pulse" />
        <div className="from-background via-background/60 absolute inset-0 bg-linear-to-t to-transparent" />
      </div>

      <div className="mx-auto max-w-300 px-4 md:px-6">
        {/* Game info panel */}
        <div className="border-border bg-background/90 -mt-12 flex items-center gap-5 rounded-2xl border p-4 backdrop-blur md:-mt-16 md:p-5">
          <div className="border-border bg-muted size-20 shrink-0 animate-pulse rounded-xl border md:size-24" />
          <div className="flex-1">
            <span className="bg-muted block h-5 w-44 animate-pulse rounded" />
            <span className="bg-muted mt-2 block h-3 w-24 animate-pulse rounded" />
          </div>
        </div>

        {/* Checkout steps */}
        <div className="mx-auto mt-6 flex max-w-3xl flex-col gap-6 pb-16 md:mt-8 md:pb-24">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-card rounded-xl p-4 md:p-6">
              <div className="flex items-center gap-3">
                <span className="bg-muted size-6 animate-pulse rounded-full" />
                <span className="bg-muted h-4 w-32 animate-pulse rounded" />
              </div>
              <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
                {Array.from({ length: 4 }).map((_, j) => (
                  <div
                    key={j}
                    className="border-border bg-background h-12 animate-pulse rounded-xl border"
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}