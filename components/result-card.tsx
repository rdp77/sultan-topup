'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import {
  CheckCircle2,
  XCircle,
  Clock3,
  TimerOff,
  RotateCcw,
  Search,
  Copy,
  Check,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatRupiah, type OrderStatus } from '@/lib/data'

const statusConfig: Record<
  OrderStatus,
  { icon: typeof CheckCircle2; title: string; desc: string; color: string }
> = {
  success: {
    icon: CheckCircle2,
    title: 'Pembayaran Berhasil',
    desc: 'Top up kamu sudah masuk ke akun game. Selamat bermain!',
    color: 'text-success',
  },
  processing: {
    icon: Clock3,
    title: 'Sedang Diproses',
    desc: 'Pembayaran diterima. Top up sedang dikirim ke akun kamu, biasanya kurang dari 1 menit.',
    color: 'text-warning',
  },
  failed: {
    icon: XCircle,
    title: 'Pembayaran Gagal',
    desc: 'Terjadi kendala saat memproses pembayaran. Dana yang terpotong akan dikembalikan otomatis.',
    color: 'text-destructive',
  },
  expired: {
    icon: TimerOff,
    title: 'Pesanan Kedaluwarsa',
    desc: 'Batas waktu pembayaran telah habis. Silakan buat pesanan baru.',
    color: 'text-muted-foreground',
  },
}

export function ResultCard() {
  const params = useSearchParams()
  const [status, setStatus] = useState<OrderStatus>('processing')

  const statusParam = params.get('status') as OrderStatus | null
  const game = params.get('game') ?? 'Mobile Legends'
  const product = params.get('product') ?? '514 Diamonds'
  const price = Number(params.get('price') ?? 126500)
  const fee = Number(params.get('fee') ?? 886)
  const method = params.get('method') ?? 'QRIS'
  const uid = params.get('uid') ?? '12345678 (2001)'
  const [copied, setCopied] = useState(false)
  const invoice = params.get('invoice') ?? 'INV-20260702-8F3K'

  // Simulate payment confirmation: processing -> success after a short delay
  useEffect(() => {
    if (statusParam) {
      setStatus(statusParam)
      return
    }
    const t = setTimeout(() => setStatus('success'), 2500)
    return () => clearTimeout(t)
  }, [statusParam])

  const config = statusConfig[status]
  const Icon = config.icon

  return (
    <div className="flex flex-col items-center text-center">
      <Icon
        className={cn(
          'size-20 transition-colors duration-300',
          config.color,
          status === 'processing' && 'animate-pulse',
        )}
        aria-hidden="true"
      />
      <h1 className="mt-4 text-balance text-2xl font-bold tracking-tight">{config.title}</h1>
      <p className="mt-2 max-w-sm text-pretty text-sm leading-relaxed text-muted-foreground">
        {config.desc}
      </p>

      <div className="mt-8 w-full rounded-xl bg-card p-5 text-left">
        <dl className="flex flex-col gap-3 text-sm">
          <div className="flex justify-between gap-4">
            <dt className="text-muted-foreground">Invoice</dt>
            <dd className="flex items-center gap-2 font-mono text-xs">
              {invoice}
              <button
                type="button"
                onClick={() => {
                  if (copied) return
                  navigator.clipboard?.writeText(invoice)
                  setCopied(true)
                  setTimeout(() => setCopied(false), 2000)
                }}
                className="press inline-flex items-center gap-1 rounded-md border border-border px-1.5 py-0.5 text-[10px] text-muted-foreground transition-colors hover:text-foreground hover:bg-card"
                aria-label="Salin invoice"
              >
                {copied ? (
                  <Check className="size-3" aria-hidden="true" />
                ) : (
                  <Copy className="size-3" aria-hidden="true" />
                )}
                {copied ? 'Tersalin' : 'Salin'}
              </button>
            </dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-muted-foreground">Game</dt>
            <dd>{game}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-muted-foreground">Produk</dt>
            <dd>{product}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-muted-foreground">User ID</dt>
            <dd>{uid}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-muted-foreground">Metode</dt>
            <dd>{method}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-muted-foreground">Harga</dt>
            <dd>{formatRupiah(price)}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-muted-foreground">Biaya Admin</dt>
            <dd>{formatRupiah(fee)}</dd>
          </div>
          <div className="flex justify-between gap-4 border-t border-border pt-3 text-base font-semibold">
            <dt>Total</dt>
            <dd className="text-primary">{formatRupiah(price + fee)}</dd>
          </div>
        </dl>
      </div>

      <div className="mt-6 flex w-full flex-col gap-3 sm:flex-row">
        <Link
          href="/"
          className="press flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors duration-200 hover:bg-primary/90"
        >
          <RotateCcw className="size-4" aria-hidden="true" />
          Top Up Lagi
        </Link>
        <Link
          href="/lacak"
          className="press flex flex-1 items-center justify-center gap-2 rounded-lg border border-border px-6 py-3 text-sm font-medium transition-colors duration-200 hover:bg-card"
        >
          <Search className="size-4" aria-hidden="true" />
          Cek Status
        </Link>
      </div>
    </div>
  )
}
