/** Route-level loading skeleton for /dashboard (matches OrderList layout). */
export default function DashboardLoading() {
  return (
    <main id="main" className="flex-1">
      <div className="mx-auto max-w-3xl px-4 py-12 md:px-6 md:py-16">
        <div className="flex items-center justify-between gap-4">
          <div>
            <span className="bg-muted block h-7 w-44 animate-pulse rounded" />
            <span className="bg-muted mt-2 block h-3 w-56 animate-pulse rounded" />
          </div>
          <span className="bg-muted h-10 w-28 animate-pulse rounded-lg" />
        </div>

        <ul className="mt-8 flex flex-col gap-3" aria-busy="true" aria-label="Memuat transaksi">
          {Array.from({ length: 4 }).map((_, i) => (
            <li key={i} className="border-border/50 bg-card rounded-xl border p-4">
              <div className="flex items-center justify-between">
                <span className="bg-muted h-3 w-28 animate-pulse rounded" />
                <span className="bg-muted h-5 w-16 animate-pulse rounded" />
              </div>
              <div className="mt-3 flex items-end justify-between gap-2">
                <div className="flex flex-col gap-2">
                  <span className="bg-muted h-4 w-32 animate-pulse rounded" />
                  <span className="bg-muted h-3 w-40 animate-pulse rounded" />
                  <span className="bg-muted h-3 w-24 animate-pulse rounded" />
                </div>
                <span className="bg-muted h-4 w-20 animate-pulse rounded" />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}