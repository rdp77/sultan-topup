'use client';

import { useEffect } from 'react';
import { Loader2, ShieldCheck } from 'lucide-react';
import Turnstile from 'react-turnstile';
import { cn, formatRupiah } from '@/lib/utils';
import { type PaymentMethod } from '@/types/payment-method';
import type { DenominationView } from '@/lib/product-utils';

interface OrderSummaryProps {
  selectedDenom: DenominationView | null;
  selectedMethod: PaymentMethod | null;
  subPrice: number;
  fee: number;
  submitting: boolean;
  canClick: boolean;
  touched: boolean;
  allValid: boolean;
  submitError: string;
  onTurnstileVerify: (token: string) => void;
  onTurnstileExpireOrError: () => void;
  turnstileToken: string | null;
  onSubmit: () => void;
  checkoutLoading?: boolean;
  checkoutError?: string | null;
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
  // Mark the checkout sticky bar as active so FloatingWhatsApp (global) can
  // lift itself above this bar on mobile (see globals.css).
  useEffect(() => {
    document.body.dataset.checkoutBar = 'true';
    return () => {
      delete document.body.dataset.checkoutBar;
    };
  }, []);

  return (
    <>
      {/* Inline section — full-width on desktop; on mobile, buttons and error messages are moved to the sticky bar */}
      <section className="bg-card rounded-xl p-4 pb-24 md:pb-6">
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
          <div className="border-border flex justify-between border-t pt-2.5 text-base font-semibold">
            <dt>Total</dt>
            <dd className="text-primary">{selectedDenom ? formatRupiah(subPrice + fee) : '—'}</dd>
          </div>
        </dl>

        <div className="bg-background/50 mt-4 rounded-lg p-4">
          <div className="text-muted-foreground mb-3 flex items-center gap-2 text-xs">
            <ShieldCheck className="text-success size-4" aria-hidden="true" />
            Verifikasi keamanan
          </div>
          <Turnstile
            sitekey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? '1x00000000000000000000AA'}
            onVerify={onTurnstileVerify}
            onExpire={onTurnstileExpireOrError}
            onError={onTurnstileExpireOrError}
            theme="dark"
            size="flexible"
          />
          {!turnstileToken && (
            <p className="text-muted-foreground mt-3 text-center text-xs">
              Centang kotak di atas untuk melanjutkan.
            </p>
          )}
        </div>

        <button
          type="button"
          onClick={onSubmit}
          disabled={submitting || checkoutLoading || !canClick}
          className={cn(
            'bg-primary text-primary-foreground mt-3 hidden w-full items-center justify-center gap-2 rounded-lg px-6 py-3.5 text-sm font-semibold transition-colors duration-200 md:flex',
            canClick && !submitting && !checkoutLoading ? 'press hover:bg-primary/90' : 'opacity-60'
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
          <div className="bg-destructive/10 text-destructive mt-2 hidden rounded-lg p-3 text-center text-xs md:block">
            {submitError}
          </div>
        )}
        {checkoutError && (
          <div className="bg-destructive/10 text-destructive mt-2 hidden rounded-lg p-3 text-center text-xs md:block">
            {checkoutError}
          </div>
        )}
      </section>

      {/* Sticky bottom bar — only mobile: total + CTA always visible while scrolling */}
      <div className="border-border bg-card/95 fixed inset-x-0 bottom-0 z-50 border-t p-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] backdrop-blur md:hidden">
        {touched && !allValid && !checkoutLoading && submitError && (
          <div className="bg-destructive/10 text-destructive mb-2 rounded-lg p-2.5 text-center text-xs">
            {submitError}
          </div>
        )}
        {checkoutError && (
          <div className="bg-destructive/10 text-destructive mb-2 rounded-lg p-2.5 text-center text-xs">
            {checkoutError}
          </div>
        )}
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-muted-foreground truncate text-xs">
              {selectedDenom ? selectedDenom.amount : 'Belum ada produk dipilih'}
            </p>
            <p className="text-base leading-tight font-bold">
              <span className="text-muted-foreground mr-1 text-xs font-medium">Total:</span>
              <span className="text-primary">
                {selectedDenom ? formatRupiah(subPrice + fee) : '—'}
              </span>
            </p>
          </div>
          <button
            type="button"
            onClick={onSubmit}
            disabled={submitting || checkoutLoading || !canClick}
            className={cn(
              'bg-primary text-primary-foreground flex shrink-0 items-center justify-center gap-2 rounded-lg px-5 py-3 text-sm font-semibold transition-colors duration-200',
              canClick && !submitting && !checkoutLoading
                ? 'press hover:bg-primary/90'
                : 'opacity-60'
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
        </div>
      </div>
    </>
  );
}
