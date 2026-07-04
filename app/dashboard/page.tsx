import Link from 'next/link'
import { Plus, PackageOpen } from 'lucide-react'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { OrderStatusBadge } from '@/components/order-status-badge'
import { formatRupiah, mockOrders } from '@/lib/data'

export const metadata = {
  title: 'Dashboard — TopUpin',
}

export default function DashboardPage() {
  return (
    <div className="flex min-h-svh flex-col">
      <Navbar />
      <main id="main" className="flex-1">
        <div className="mx-auto max-w-3xl px-4 py-12 md:px-6 md:py-16">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Riwayat Pesanan</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Semua transaksi top up kamu ada di sini.
              </p>
            </div>
            <Link
              href="/"
              className="press flex shrink-0 items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors duration-200 hover:bg-primary/90"
            >
              <Plus className="size-4" aria-hidden="true" />
              <span className="hidden sm:inline">Top Up Baru</span>
              <span className="sm:hidden">Baru</span>
            </Link>
          </div>

          <ul className="reveal mt-8 flex flex-col gap-3">
            {mockOrders.map((order) => (
              <li
                key={order.invoice}
                className="rounded-xl bg-card p-4 transition-colors duration-200 hover:bg-accent"
              >
                <div className="flex items-center justify-between gap-4">
                  <span className="font-mono text-xs text-muted-foreground">{order.invoice}</span>
                  <OrderStatusBadge status={order.status} />
                </div>
                <div className="mt-3 flex flex-wrap items-end justify-between gap-2">
                  <div>
                    <p className="text-sm font-semibold">{order.game}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {order.product} • {order.method}
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground">{order.date}</p>
                  </div>
                  <span className="text-sm font-semibold text-primary">
                    {formatRupiah(order.total)}
                  </span>
                </div>
              </li>
            ))}
          </ul>

          {/* Empty state — shown only when there are no orders */}
          {mockOrders.length === 0 && (
            <div className="mt-8 flex flex-col items-center gap-3 rounded-xl border border-dashed border-border bg-card/40 px-6 py-12 text-center">
              <span className="flex size-12 items-center justify-center rounded-full bg-card text-muted-foreground">
                <PackageOpen className="size-6" aria-hidden="true" />
              </span>
              <p className="text-sm font-medium">Belum ada transaksi</p>
              <p className="max-w-xs text-xs text-muted-foreground">
                Pesanan top up kamu akan muncul di sini setelah checkout selesai.
              </p>
              <Link
                href="/"
                className="press mt-1 inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-colors duration-200 hover:bg-primary/90"
              >
                <Plus className="size-4" aria-hidden="true" />
                Top Up Sekarang
              </Link>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
