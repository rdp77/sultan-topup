'use client'

import Image from 'next/image'
import { useEffect, useState, useMemo } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Copy, Check, Clock, Loader2 } from 'lucide-react'
import posthog from 'posthog-js'
import { PaymentLogo } from '@/components/payment-logo'
import { formatRupiah } from '@/lib/data'
import { CheckoutService } from '@/services/checkout.service'
import type { CheckoutResult, QRISPaymentData, VAPaymentData } from '@/types/checkout'

// --- Helper constants ---
const VA_BANK_CODES: Record<string, string> = {
  bca: '7521',
  bni: '9882',
  bri: '1500',
  mandiri: '8866',
}

const VA_BANKS = ['bca', 'bni', 'bri', 'mandiri'] as const
const PAYMENT_TIMEOUT_SECONDS = 600

// --- Sub-components ---

function QrPlaceholder({ amount, qrCode }: Readonly<{ amount: number; qrCode?: string }>) {
  if (qrCode) {
    return (
      <div className="mx-auto flex size-48 items-center justify-center overflow-hidden rounded-xl border-2 border-border bg-white p-4">
        <Image
          src={qrCode}
          alt={`QRIS Rp ${amount.toLocaleString('id-ID')}`}
          width={192}
          height={192}
          className="size-full object-contain"
          unoptimized
        />
      </div>
    )
  }

  // Dummy QR pattern for development
  return (
    <div
      className="mx-auto flex size-48 items-center justify-center rounded-xl border-2 border-border bg-white p-4"
      aria-label={`QRIS Rp ${amount.toLocaleString('id-ID')}`}
    >
      <svg viewBox="0 0 160 160" className="size-full" aria-hidden="true">
        <rect width="160" height="160" fill="white" />
        {Array.from({ length: 7 }, (_, r) =>
          Array.from({ length: 7 }, (_, c) => {
            const x = 12 + c * 22
            const y = 12 + r * 22
            const fill = (r * 7 + c) % 3 === 0 || (r + c) % 4 === 0 ? '#6366f1' : 'white'
            return fill === 'white' ? null : (
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

function CopyButton({
  text,
  label = 'Salin',
  onCopy,
}: Readonly<{
  text: string
  label?: string
  onCopy?: () => void
}>) {
  const [copied, setCopied] = useState(false)

  function handleCopy() {
    if (copied) return
    navigator.clipboard?.writeText(text)
    setCopied(true)
    onCopy?.()
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
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

function VaNumberDisplay({ number, bank }: Readonly<{ number: string; bank: string }>) {
  return (
    <div className="flex flex-col gap-2 rounded-lg bg-background p-4 text-left">
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs text-muted-foreground">Nomor Virtual Account</span>
        <CopyButton
          text={number}
          label="Salin VA"
          onCopy={() => posthog.capture('va_number_copied', { bank })}
        />
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

function PaymentTimer({ initialSeconds = PAYMENT_TIMEOUT_SECONDS }) {
  const [left, setLeft] = useState(initialSeconds)

  useEffect(() => {
    const interval = setInterval(() => {
      setLeft((prev) => Math.max(0, prev - 1))
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  const minutes = Math.floor(left / 60)
  const seconds = left % 60
  const percentage = (left / initialSeconds) * 100

  return (
    <div className="flex items-center gap-3 text-xs">
      <Clock className="size-3.5 text-warning" aria-hidden="true" />
      <span className="tabular-nums">{minutes}:{String(seconds).padStart(2, '0')}</span>
      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-warning transition-all duration-1000 ease-linear"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}

// --- Payment type helpers ---

function getVaBankPrefix(bankId: string): string {
  return VA_BANK_CODES[bankId] ?? '0000'
}

function generateFallbackVaNumber(bankId: string): string {
  const prefix = getVaBankPrefix(bankId)
  const suffix = Date.now().toString().slice(-8)
  return `${prefix}-${suffix}`
}

function getVaNumberFromPaymentData(
  paymentData: CheckoutResult | null,
  paymentId: string,
): string {
  if (!paymentData) {
    return generateFallbackVaNumber(paymentId)
  }

  if (paymentData.paymentData.type === 'va') {
    return (paymentData.paymentData as VAPaymentData).vaNumber
  }

  return generateFallbackVaNumber(paymentId)
}

function isPaymentVa(paymentData: CheckoutResult | null, paymentId: string): boolean {
  if (!paymentData) {
    return VA_BANKS.includes(paymentId as (typeof VA_BANKS)[number])
  }
  return paymentData.paymentData.type === 'va'
}

function isPaymentQris(paymentData: CheckoutResult | null, paymentType: string): boolean {
  if (!paymentData) {
    return paymentType === 'qris'
  }
  return paymentData.paymentData.type === 'qris'
}

// --- Main component ---

export function BayarCard() {
  const router = useRouter()
  const params = useSearchParams()
  const [paymentData, setPaymentData] = useState<CheckoutResult | null>(null)
  const [isLoadingPayment, setIsLoadingPayment] = useState(false)
  const [isSimulating, setIsSimulating] = useState(false)

  // URL params
  const orderId = params.get('orderId')
  const game = params.get('game') ?? 'Mobile Legends'
  const product = params.get('product') ?? '514 Diamonds'
  const price = Number(params.get('price') ?? 126500)
  const fee = Number(params.get('fee') ?? 886)
  const methodName = params.get('method') ?? 'QRIS'
  const paymentId = params.get('payment') ?? 'qris'
  const invoice = params.get('invoice') ?? 'INV-'
  const uid = params.get('uid') ?? '12345678'
  const paymentType = params.get('paymentType') ?? 'qris'

  // Computed values
  const total = price + fee

  const qrAmount = paymentData?.total ?? total

  const isQris = useMemo(
    () => isPaymentQris(paymentData, paymentType),
    [paymentData, paymentType],
  )

  const isVa = useMemo(
    () => isPaymentVa(paymentData, paymentId),
    [paymentData, paymentId],
  )

  const vaNumber = useMemo(
    () => getVaNumberFromPaymentData(paymentData, paymentId),
    [paymentData, paymentId],
  )

  // Fetch payment data from sessionStorage or API
  useEffect(() => {
    if (!orderId) return

    setIsLoadingPayment(true)

    // Try sessionStorage first (instant load)
    const stored = sessionStorage.getItem(`checkout:result:${orderId}`)
    if (stored) {
      try {
        setPaymentData(JSON.parse(stored))
      } catch {
        // Invalid JSON, will fetch from API below
      }
    }

    // Fetch fresh data from API
    CheckoutService.getStatus(orderId)
      .then((response) => {
        if (response.success && response.data) {
          setPaymentData(response.data)
          sessionStorage.setItem(`checkout:result:${orderId}`, JSON.stringify(response.data))
        }
      })
      .catch(() => {
        // Silently fail, use sessionStorage or URL params fallback
      })
      .finally(() => setIsLoadingPayment(false))
  }, [orderId])

  // Track page view
  useEffect(() => {
    posthog.capture('payment_page_viewed', {
      game,
      product,
      price,
      fee,
      total,
      payment_method_id: paymentId,
      payment_method_name: methodName,
      invoice_id: invoice,
      payment_type: isQris ? 'qris' : isVa ? 'va' : 'other',
    })
  }, [game, product, price, fee, total, paymentId, methodName, invoice, isQris, isVa])

  // Simulate redirect to result after timeout
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsSimulating(true)
      const redirect = new URLSearchParams(params.toString())
      redirect.set('status', 'processing')
      redirect.set('invoice', invoice)
      router.push(`/hasil?${redirect.toString()}`)
    }, 8000)
    return () => clearTimeout(timer)
  }, [params, invoice, router])

  return (
    <div className="flex flex-col items-center text-center">
      {/* Payment method badge */}
      <div className="flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5">
        <span className="flex size-6 items-center justify-center rounded bg-background text-muted-foreground">
          <PaymentLogo id={paymentId} />
        </span>
        <span className="text-sm font-medium">{methodName}</span>
      </div>

      <h1 className="mt-4 text-2xl font-bold tracking-tight">Selesaikan Pembayaran</h1>
      <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
        {isQris
          ? 'Scan QR code di bawah menggunakan aplikasi e-wallet atau mobile banking kamu sebelum waktu habis.'
          : 'Transfer tepat ke nomor Virtual Account di bawah. Pembayaran akan terverifikasi otomatis.'}
      </p>

      {/* Payment display */}
      <div className="mt-6 w-full rounded-xl bg-card p-6">
        {isQris && <QrPlaceholder amount={qrAmount} qrCode={paymentData?.paymentData.type === 'qris' ? (paymentData.paymentData as QRISPaymentData).qrCode : undefined} />}

        {isVa && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 rounded-lg bg-background/50 px-4 py-2.5">
              <PaymentLogo id={paymentId} className="size-6" />
              <span className="text-sm font-semibold">Virtual Account {paymentId.toUpperCase()}</span>
            </div>
            <VaNumberDisplay number={vaNumber} bank={paymentId} />
            <div className="flex flex-col gap-2 rounded-lg bg-muted/30 p-3 text-left text-xs text-muted-foreground">
              <p>
                <span className="font-semibold text-foreground">Cara bayar:</span> Buka aplikasi Mobile Banking atau ATM. Pilih menu Transfer &gt; Virtual Account. Masukkan nomor di atas, lalu konfirmasi jumlah.
              </p>
              <p>Biaya transfer ditanggung pembeli. Nomor VA hanya berlaku untuk 1 pesanan ini.</p>
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
        <PaymentTimer />
        <p className="mt-2 text-center text-xs text-muted-foreground">
          {isSimulating
            ? 'Pembayaran diterima! Mengalihkan...'
            : 'Batas waktu pembayaran. Jangan tutup halaman ini.'}
        </p>
        {isSimulating && (
          <Loader2 className="mx-auto mt-2 size-5 animate-spin text-primary" aria-hidden="true" />
        )}
      </div>

      {/* Loading indicator */}
      {isLoadingPayment && (
        <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
          <Loader2 className="size-3.5 animate-spin" aria-hidden="true" />
          Memuat data pembayaran...
        </div>
      )}

      {/* Invoice */}
      <div className="mt-4 flex items-center justify-center gap-2 text-xs text-muted-foreground">
        <span>Invoice: <span className="font-mono">{invoice}</span></span>
        <CopyButton
          text={invoice}
          label="Salin"
          onCopy={() => posthog.capture('invoice_copied', { invoice_id: invoice, source: 'payment_page' })}
        />
      </div>
    </div>
  )
}