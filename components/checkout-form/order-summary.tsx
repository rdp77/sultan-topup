'use client'

import { Loader2, ShieldCheck } from 'lucide-react'
import Turnstile from 'react-turnstile'
import { cn } from '@/lib/utils'
import { formatRupiah, type PaymentMethod } from '@/lib/data'
import type { DenominationView } from '@/lib/product-utils'

interface OrderSummaryProps {
  selectedDenom: DenominationView | null
  selectedMethod: PaymentMethod | null
  subPrice: number
  fee: number
  submitting: boolean
  canClick: boolean
  touched: boolean
  allValid: boolean
  submitError: string
  onTurnstileVerify: (token: string) => void
  onTurnstileExpireOrError: () => void
  turnstileToken: string | null
  onSubmit: () => void
  checkoutLoading?: boolean
  checkoutError?: string | null
}

export function OrderSummary({
  selectedDenom,
  selectedMethod,
  subPrice,
  fee,
  submitting,
  canClick,
  touched,
  allValid,
  submitError,
  onTurnstileVerify,
  onTurnstileExpireOrError,
  turnstileToken,
  onSubmit,
  checkoutLoading = false,
  checkoutError = null,
}: Readonly<OrderSummaryProps>) {
  return (
    <section className="rounded-xl bg-card p-4 md:p-6">
      <h2 className="text-base font-semibold">Ringkasan Pesanan</h2>
      <dl className="mt-4 flex flex-col gap-2.5 text-sm">
        <div className="flex justify-between">
          <dt className="text-muted-foreground">Produk</dt>
          <dd>{selectedDenom ? selectedDenom.amount : '—'}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-muted-foreground">Harga</dt>
          <dd>{selectedDenom ? formatRupiah(subPrice) : '—'}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-muted-foreground">Biaya Admin</dt>
          <dd>{selectedMethod && selectedDenom ? formatRupiah(fee) : '—'}</dd>
        </div>
        <div className="flex justify-between border-t border-border pt-2.5 text-base font-semibold">
          <dt>Total</dt>
          <dd className="text-primary">{selectedDenom ? formatRupiah(subPrice + fee) : '—'}</dd>
        </div>
      </dl>

      <div className="mt-4 rounded-lg bg-background/50 p-4">
        <div className="mb-3 flex items-center gap-2 text-xs text-muted-foreground">
          <ShieldCheck className="size-4 text-success" aria-hidden="true" />
          Verifikasi keamanan
        </div>
        <Turnstile
          sitekey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? '1x00000000000000000000AA'}
          onVerify={onTurnstileVerify}
          onExpire={onTurnstileExpireOrError}
          onError={onTurnstileExpireOrError}
          theme="dark"
        />
        {!turnstileToken && (
          <p className="mt-3 text-center text-xs text-muted-foreground">
            Centang kotak di atas untuk melanjutkan.
          </p>
        )}
      </div>

      <button
        type="button"
        onClick={onSubmit}
        disabled={submitting || checkoutLoading || !canClick}
        className={cn(
          'mt-3 flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground transition-colors duration-200',
          canClick && !submitting && !checkoutLoading ? 'press hover:bg-primary/90' : 'opacity-60',
        )}
      >
        {submitting || checkoutLoading ? (
          <>
            <Loader2 className="size-4 animate-spin" aria-hidden="true" />
            Memproses...
          </>
        ) : (
          'Lanjutkan Pembayaran'
        )}
      </button>
      {touched && !allValid && !checkoutLoading && (
        <div className="mt-2 rounded-lg bg-destructive/10 p-3 text-center text-xs text-destructive">
          {submitError}
        </div>
      )}
      {checkoutError && (
        <div className="mt-2 rounded-lg bg-destructive/10 p-3 text-center text-xs text-destructive">
          {checkoutError}
        </div>
      )}
    </section>
  )
}
