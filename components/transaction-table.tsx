'use client'

import { useEffect, useState } from 'react'
import { PackageOpen } from 'lucide-react'
import { OrderStatusBadge } from '@/components/order-status-badge'
import { formatRupiah, type Order, type OrderStatus } from '@/lib/data'
import { OrderService } from '@/services/order.service'
import type { OrderApiItem } from '@/types/order'

const MAX_ROWS = 15

const STATUS_MAP: Record<string, OrderStatus> = {
  completed: 'success',
  failed: 'failed',
  pending: 'processing',
}

function toOrder(item: OrderApiItem): Order {
  return {
    invoice: item.invoice_number,
    game: item.game,
    product: item.product,
    price: item.total_price,
    fee: 0,
    total: item.total_price,
    method: item.payment_method,
    userId: item.email,
    phone: item.phone,
    status: STATUS_MAP[item.status] ?? 'failed',
    date: item.created_at,
  }
}

// --- Masking helpers ---
function maskEnd(value: string, show = 4): string {
  if (!value || value.length <= show) return value || '••••'
  return value.slice(0, -show) + '\u2022'.repeat(show)
}

function maskPhone(phone: string): string {
  if (!phone || phone.length < 8) return maskEnd(phone || '', 4)
  return phone.slice(0, 4) + '\u2022'.repeat(phone.length - 6) + phone.slice(-2)
}

function maskPrice(n: number): string {
  const raw = formatRupiah(n)
  // Replace last 3 digit chars before "dot" or end with bullets
  const digits = raw.replace(/\D/g, '')
  if (digits.length <= 3) return raw.replace(/\d{3}$/, (m) => '\u2022'.repeat(m.length))
  const masked = digits.slice(0, -3) + '\u2022\u2022\u2022'
  return `Rp ${Number(masked.slice(0, -9) || '0').toLocaleString('id-ID')}${masked.slice(-9)}`
}

const HEADERS = [
  'Invoice',
  'Status',
  'Game',
  'Produk',
  'User ID',
  'No. HP',
  'Metode',
  'Tanggal',
  'Total',
]

export function TransactionTable() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    OrderService.list()
      .then((res) => setOrders(res.data.slice(0, MAX_ROWS).map(toOrder)))
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [])

  if (error) return null

  if (loading) {
    return (
      <div className="reveal mt-8 overflow-hidden rounded-xl border border-border/50 bg-card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border/50">
                {HEADERS.map((h) => (
                  <th
                    key={h}
                    className="whitespace-nowrap px-5 py-3 text-left text-[11px] font-semibold tracking-wider text-muted-foreground"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="border-b border-border/30 last:border-b-0">
                  {Array.from({ length: HEADERS.length }).map((_, j) => (
                    <td key={j} className="px-5 py-4">
                      <span className="block h-3.5 w-20 animate-pulse rounded bg-muted" />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )
  }

  if (orders.length === 0) {
    return (
      <div className="mt-8 flex flex-col items-center gap-3 rounded-xl border border-dashed border-border bg-card/40 px-6 py-12 text-center">
        <span className="flex size-12 items-center justify-center rounded-full bg-card text-muted-foreground">
          <PackageOpen className="size-6" aria-hidden="true" />
        </span>
        <p className="text-sm font-medium">Belum ada transaksi</p>
        <p className="max-w-xs text-xs text-muted-foreground">
          Riwayat transaksi top up kamu akan muncul di sini.
        </p>
      </div>
    )
  }

  return (
    <div className="reveal mt-8 overflow-hidden rounded-xl border border-border/50 bg-card">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border/50">
              {HEADERS.map((h) => (
                <th
                  key={h}
                  className="whitespace-nowrap px-5 py-3 text-left text-[11px] font-semibold tracking-wider text-muted-foreground"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {orders.map((order, i) => (
              <tr
                key={order.invoice || i}
                className="border-b border-border/30 transition-colors duration-150 last:border-b-0 hover:bg-accent/50"
              >
                <td className="whitespace-nowrap px-5 py-3.5 font-mono text-xs text-muted-foreground">
                  {maskEnd(order.invoice, 4)}
                </td>
                <td className="whitespace-nowrap px-5 py-3.5">
                  <OrderStatusBadge status={order.status} />
                </td>
                <td className="whitespace-nowrap px-5 py-3.5 text-sm">{order.game}</td>
                <td className="whitespace-nowrap px-5 py-3.5 text-sm text-muted-foreground">
                  {order.product}
                </td>
                <td className="whitespace-nowrap px-5 py-3.5 font-mono text-xs text-muted-foreground">
                  {maskEnd(order.userId, 4)}
                </td>
                <td className="whitespace-nowrap px-5 py-3.5 font-mono text-xs text-muted-foreground">
                  {maskPhone(order.phone)}
                </td>
                <td className="whitespace-nowrap px-5 py-3.5 text-sm text-muted-foreground">
                  {order.method}
                </td>
                <td className="whitespace-nowrap px-5 py-3.5 text-xs text-muted-foreground">
                  {order.date}
                </td>
                <td className="whitespace-nowrap px-5 py-3.5 text-sm font-semibold text-primary">
                  {maskPrice(order.total)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
