import Link from 'next/link'
import { Plus } from 'lucide-react'
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
      <main className="flex-1">
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

          <ul className="mt-8 flex flex-col gap-3">
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
        </div>
      </main>
      <Footer />
    </div>
  )
}
