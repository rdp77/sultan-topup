'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { Loader2, Plus, PackageOpen } from 'lucide-react'
import { OrderStatusBadge } from '@/components/order-status-badge'
import { formatRupiah, mockOrders, type Order } from '@/lib/data'

const PAGE_SIZE = 6

// Simulated extended dataset so pagination has something to page through. In a
// real app this would be a fetch keyed on page/cursor.
function buildDataset(): Order[] {
  if (mockOrders.length === 0) return []
  const out: Order[] = []
  for (let i = 0; i < 5; i++) {
    out.push(...mockOrders.map((o, idx) => ({ ...o, invoice: `${o.invoice}-${i}${idx}` })))
  }
  return out
}

export function OrderList() {
  const all = useRef<Order[]>(buildDataset())
  const [visible, setVisible] = useState<Order[]>([])
  const [count, setCount] = useState(PAGE_SIZE)
  const [loading, setLoading] = useState(false)

  // Initial load with a tiny delay to show the skeleton state.
  useEffect(() => {
    const t = setTimeout(() => setVisible(all.current.slice(0, PAGE_SIZE)), 450)
    return () => clearTimeout(t)
  }, [])

  // Simulate fetching the next page when count grows.
  useEffect(() => {
    if (count === PAGE_SIZE) return // already covered by initial load
    setLoading(true)
    const t = setTimeout(() => {
      setVisible(all.current.slice(0, count))
      setLoading(false)
    }, 500)
    return () => clearTimeout(t)
  }, [count])

  const hasMore = count < all.current.length
  const isEmpty = all.current.length === 0

  if (isEmpty) {
    return (
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
    )
  }

  // Skeleton state while the initial slice is still loading.
  if (visible.length === 0) {
    return (
      <ul className="mt-8 flex flex-col gap-3" aria-busy="true" aria-label="Memuat transaksi">
        {Array.from({ length: 3 }).map((_, i) => (
          <li key={i} className="rounded-xl border border-border/50 bg-card p-4">
            <div className="flex items-center justify-between">
              <span className="h-3 w-28 animate-pulse rounded bg-muted" />
              <span className="h-5 w-16 animate-pulse rounded bg-muted" />
            </div>
            <div className="mt-3 flex items-end justify-between gap-2">
              <div className="flex flex-col gap-2">
                <span className="h-4 w-32 animate-pulse rounded bg-muted" />
                <span className="h-3 w-40 animate-pulse rounded bg-muted" />
                <span className="h-3 w-24 animate-pulse rounded bg-muted" />
              </div>
              <span className="h-4 w-20 animate-pulse rounded bg-muted" />
            </div>
          </li>
        ))}
      </ul>
    )
  }

  return (
    <>
      <ul className="reveal mt-8 flex flex-col gap-3">
        {visible.map((order) => (
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

      {hasMore && (
        <div className="mt-5 flex justify-center">
          <button
            type="button"
            disabled={loading}
            onClick={() => setCount((c) => c + PAGE_SIZE)}
            className="press inline-flex items-center gap-2 rounded-lg border border-border px-5 py-2.5 text-sm font-medium text-foreground transition-colors duration-200 hover:bg-card disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                Memuat...
              </>
            ) : (
              'Muat Lebih Banyak'
            )}
          </button>
        </div>
      )}
    </>
  )
}
