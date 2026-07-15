'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Copy, Check, Clock, Loader2 } from 'lucide-react'
import { PaymentLogo } from '@/components/payment-logo'
import { formatRupiah } from '@/lib/data'

function QrPlaceholder({ amount }: { amount: number }) {
  // Dummy QR code: a centred branded square. In production replace with a real QR
  // image generated server-side or via QRIS API.
  return (
    <div
      className="mx-auto flex size-48 items-center justify-center rounded-xl border-2 border-border bg-white p-4"
      aria-label={`QRIS Rp ${amount.toLocaleString('id-ID')}`}
    >
      <svg viewBox="0 0 160 160" className="size-full" aria-hidden="true">
        {/* Dummy QR pattern — visual placeholder only */}
        <rect width="160" height="160" fill="white" />
        {Array.from({ length: 7 }).map((_, r) =>
          Array.from({ length: 7 }).map((_, c) => {
            const x = 12 + c * 22
            const y = 12 + r * 22
            // Simple deterministic pattern
            const fill = (r * 7 + c) % 3 === 0 ? '#6366f1' : (r + c) % 4 === 0 ? '#6366f1' : 'white'
            if (fill === 'white') return null
            return (
              <rect
                key={`${r}-${c}`}
                x={x}
                y={y}
                width={14 + ((r * c) % 8)}
                height={14 + ((r * c) % 8)}
                fill={fill}
                rx={3}
              />
            )
          }),
        )}
      </svg>
    </div>
  )
}

function CopyButton({ text, label = 'Salin' }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false)
  return (
    <button
      type="button"
      onClick={() => {
        if (copied) return
        navigator.clipboard?.writeText(text)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      }}
      className="press inline-flex shrink-0 items-center gap-1.5 rounded-md border border-border px-2.5 py-1 text-xs font-medium text-foreground transition-colors duration-200 hover:bg-card"
    >
      {copied ? (
        <>
          <Check className="size-3" aria-hidden="true" />
          Tersalin
        </>
      ) : (
        <>
          <Copy className="size-3" aria-hidden="true" />
          {label}
        </>
      )}
    </button>
  )
}

function VaNumber({ number, bank }: { number: string; bank: string }) {
  return (
    <div className="flex flex-col gap-2 rounded-lg bg-background p-4 text-left">
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs text-muted-foreground">Nomor Virtual Account</span>
        <CopyButton text={number} label="Salin VA" />
      </div>
      <span className="font-mono text-lg font-semibold tracking-wide text-foreground">
        {number}
      </span>
      <p className="text-xs text-muted-foreground">
        Penerima:{' '}
        <span className="font-medium text-foreground">Sultan Top Up ({bank.toUpperCase()})</span>
      </p>
    </div>
  )
}

function TimerBar() {
  const [left, setLeft] = useState(600) // 10 min countdown
  useEffect(() => {
    const i = setInterval(() => setLeft((s) => Math.max(0, s - 1)), 1000)
    return () => clearInterval(i)
  }, [])
  const m = Math.floor(left / 60)
  const s = left % 60
  const pct = (left / 600) * 100
  return (
    <div className="flex items-center gap-3 text-xs">
      <Clock className="size-3.5 text-warning" aria-hidden="true" />
      <span className="tabular-nums">
        {m}:{String(s).padStart(2, '0')}
      </span>
      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-warning transition-all duration-1000 ease-linear"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}

export function BayarCard() {
  const router = useRouter()
  const params = useSearchParams()
  const [simulating, setSimulating] = useState(false)

  const game = params.get('game') ?? 'Mobile Legends'
  const product = params.get('product') ?? '514 Diamonds'
  const price = Number(params.get('price') ?? 126500)
  const fee = Number(params.get('fee') ?? 886)
  const methodName = params.get('method') ?? 'QRIS'
  const paymentId = params.get('payment') ?? 'qris'
  const invoice = params.get('invoice') ?? 'INV-'
  const uid = params.get('uid') ?? '12345678'
  const total = price + fee

  const isQRIS = paymentId === 'qris'
  const isVA = ['bca', 'bni', 'bri', 'mandiri'].includes(paymentId)
  const dummyVa = isVA
    ? `${paymentId === 'bca' ? '7521' : paymentId === 'bni' ? '9882' : paymentId === 'bri' ? '1500' : '8866'}-${Date.now().toString().slice(-8)}`
    : ''

  // Simulate auto-redirect to result after 8s
  useEffect(() => {
    const t = setTimeout(() => {
      setSimulating(true)
      const redirect = new URLSearchParams(params.toString())
      redirect.set('status', 'processing')
      redirect.set('invoice', invoice)
      router.push(`/hasil?${redirect.toString()}`)
    }, 8000)
    return () => clearTimeout(t)
  }, [params, router, invoice])

  return (
    <div className="flex flex-col items-center text-center">
      {/* Payment method badge */}
      <div className="flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5">
        <span
          className="flex size-6 items-center justify-center rounded bg-background text-muted-foreground"
          aria-hidden="true"
        >
          <PaymentLogo id={paymentId} />
        </span>
        <span className="text-sm font-medium">{methodName}</span>
      </div>

      <h1 className="mt-4 text-2xl font-bold tracking-tight">Selesaikan Pembayaran</h1>
      <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
        {isQRIS
          ? 'Scan QR code di bawah menggunakan aplikasi e-wallet atau mobile banking kamu sebelum waktu habis.'
          : 'Transfer tepat ke nomor Virtual Account di bawah. Pembayaran akan terverifikasi otomatis.'}
      </p>

      <div className="mt-6 w-full rounded-xl bg-card p-6">
        {/* QR or VA display */}
        {isQRIS && <QrPlaceholder amount={total} />}

        {isVA && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 rounded-lg bg-background/50 px-4 py-2.5">
              <PaymentLogo id={paymentId} className="size-6" />
              <span className="text-sm font-semibold">
                Virtual Account {paymentId.toUpperCase()}
              </span>
            </div>
            <VaNumber number={dummyVa} bank={paymentId} />
            <div className="flex flex-col gap-2 rounded-lg bg-muted/30 p-3 text-left text-xs text-muted-foreground">
              <p>
                <span className="font-semibold text-foreground">Cara bayar:</span> Buka aplikasi
                Mobile Banking atau ATM. Pilih menu Transfer &gt; Virtual Account. Masukkan nomor di
                atas, lalu konfirmasi jumlah.
              </p>
              <p className="text-xs text-muted-foreground/70">
                Biaya transfer ditanggung pembeli. Nomor VA hanya berlaku untuk 1 pesanan ini.
              </p>
            </div>
          </div>
        )}

        {/* Order summary */}
        <dl className="mt-5 flex flex-col gap-2 border-t border-border pt-4 text-left text-sm">
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Game</dt>
            <dd>{game}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Produk</dt>
            <dd>{product}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted-foreground">ID Akun</dt>
            <dd>{uid}</dd>
          </div>
          <div className="flex justify-between border-t border-border pt-2 font-semibold">
            <dt>Total</dt>
            <dd className="text-primary">{formatRupiah(total)}</dd>
          </div>
        </dl>
      </div>

      {/* Timer */}
      <div className="mt-5 w-full max-w-xs">
        <TimerBar />
        <p className="mt-2 text-center text-xs text-muted-foreground">
          {simulating
            ? 'Pembayaran diterima! Mengalihkan...'
            : 'Batas waktu pembayaran. Jangan tutup halaman ini.'}
        </p>
        {simulating && (
          <Loader2 className="mx-auto mt-2 size-5 animate-spin text-primary" aria-hidden="true" />
        )}
      </div>

      <div className="mt-4 flex items-center justify-center gap-2 text-xs text-muted-foreground">
        <span>
          Invoice: <span className="font-mono">{invoice}</span>
        </span>
        <CopyButton text={invoice} label="Salin" />
      </div>
    </div>
  )
}
