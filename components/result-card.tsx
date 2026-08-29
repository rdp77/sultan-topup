'use client';

import Link from 'next/link';
import { useSearchParams, notFound } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import {
  CheckCircle2,
  XCircle,
  Clock3,
  TimerOff,
  RotateCcw,
  Search,
  Copy,
  Check,
} from 'lucide-react';
import posthog from 'posthog-js';
import { cn, formatRupiah } from '@/lib/utils';
import { type PaymentStatus } from '@/types/order';
import { usePaymentPolling } from '@/hooks/use-payment-polling';
import { ResultCardSkeleton } from '@/components/result-card-skeleton';

const statusConfig: Record<
  PaymentStatus,
  { icon: typeof CheckCircle2; title: string; desc: string; color: string }
> = {
  paid: {
    icon: CheckCircle2,
    title: 'Pembayaran Berhasil',
    desc: 'Top up kamu sudah masuk ke akun game. Selamat bermain!',
    color: 'text-success',
  },
  pending: {
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
};

export function ResultCard() {
  const params = useSearchParams();
  // null = status not confirmed yet (still loading, or data just arrived and
  // hasn't been read by the effect below) — never defaulted to 'pending'.
  const [status, setStatus] = useState<PaymentStatus | null>(null);
  const capturedRef = useRef(false);
  const [copied, setCopied] = useState(false);

  // `invoice` is the ONLY value read from the URL. Every other displayed field
  // comes from the polled API response (`data`) below — never from params —
  // so a reload / deep-link / shared URL always shows real, current data.
  const invoice = params.get('invoice');
  const { data, isLoading } = usePaymentPolling(invoice);

  // Status comes only from the server-reported PAYMENT status (data.payment.status).
  // The `status` URL param is intentionally never read, so it can't be spoofed by
  // editing the address bar.
  useEffect(() => {
    const paymentStatus = data?.payment.status as PaymentStatus | undefined;
    if (!paymentStatus) return;
    queueMicrotask(() => setStatus(paymentStatus));
  }, [data]);

  // Capture order result viewed once the final status is known
  useEffect(() => {
    if (capturedRef.current || !status || status === 'pending' || !data) return;
    capturedRef.current = true;
    posthog.capture('order_result_viewed', {
      order_status: status,
      game: data.order.game.name,
      product: data.order.product.name,
      price: data.order.subtotal,
      fee: data.order.fee,
      total: data.order.total_price,
      payment_method: data.payment.method.name,
      invoice_id: data.order.invoice_number,
    });
  }, [status, data]);

  // No invoice in the URL at all (missing or empty) — nothing to fetch, nothing to render.
  if (!invoice) {
    notFound();
  }

  // Still loading the first response and nothing to show yet.
  if (isLoading && !data) {
    return <ResultCardSkeleton />;
  }

  // Fetch failed (including 404 from the backend) on the first attempt — nothing to show.
  if (!data) {
    notFound();
  }

  // Data just arrived but the mapping effect above hasn't run yet — keep
  // showing the skeleton instead of a stale/default status.
  if (!status) {
    return <ResultCardSkeleton />;
  }

  const config = statusConfig[status];
  const Icon = config.icon;
  const { order, payment } = data;

  return (
    <div className="flex flex-col items-center text-center">
      <Icon
        className={cn(
          'size-20 transition-colors duration-300',
          config.color,
          status === 'pending' && 'animate-pulse'
        )}
        aria-hidden="true"
      />
      <h1 className="mt-4 text-2xl font-bold tracking-tight text-balance">{config.title}</h1>
      <p className="text-muted-foreground mt-2 max-w-sm text-sm leading-relaxed text-pretty">
        {config.desc}
      </p>

      <div className="bg-card mt-8 w-full rounded-xl p-5 text-left">
        <dl className="flex flex-col gap-3 text-sm">
          <div className="flex justify-between gap-4">
            <dt className="text-muted-foreground">Invoice</dt>
            <dd className="flex items-center gap-2 font-mono text-xs">
              {order.invoice_number}
              <button
                type="button"
                onClick={() => {
                  if (copied) return;
                  navigator.clipboard?.writeText(order.invoice_number);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }}
                className="press border-border text-muted-foreground hover:text-foreground hover:bg-card inline-flex items-center gap-1 rounded-md border px-1.5 py-0.5 text-[10px] transition-colors"
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
            <dd>{order.game.name}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-muted-foreground">Produk</dt>
            <dd>{order.product.name}</dd>
          </div>
          {/* CheckoutOrder/CheckoutPayment don't return playerId/zoneId even though
              CheckoutRequest sent them — there is currently no real value to show
              here. Labeled explicitly instead of silently hiding the row or
              showing a fabricated placeholder. Remove this branch once the
              backend echoes the player/zone ID back in the order response. */}
          {/* <div className="flex justify-between gap-4">
            <dt className="text-muted-foreground">User ID</dt>
            <dd className="text-muted-foreground italic">Tidak tersedia</dd>
          </div> */}
          <div className="flex justify-between gap-4">
            <dt className="text-muted-foreground">Metode</dt>
            <dd>{payment.method.name}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-muted-foreground">Harga</dt>
            <dd>{formatRupiah(order.subtotal)}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-muted-foreground">Biaya Admin</dt>
            <dd>{formatRupiah(order.fee)}</dd>
          </div>
          <div className="border-border flex justify-between gap-4 border-t pt-3 text-base font-semibold">
            <dt>Total</dt>
            {/* Server-computed total, not price + fee re-derived on the client —
                avoids drifting from the actual charged amount (rounding, discounts). */}
            <dd className="text-primary">{formatRupiah(order.total_price)}</dd>
          </div>
        </dl>
      </div>

      <div className="mt-6 flex w-full flex-col gap-3 sm:flex-row">
        <Link
          href="/"
          className="press bg-primary text-primary-foreground hover:bg-primary/90 flex flex-1 items-center justify-center gap-2 rounded-lg px-6 py-3 text-sm font-semibold transition-colors duration-200"
        >
          <RotateCcw className="size-4" aria-hidden="true" />
          Top Up Lagi
        </Link>
        <Link
          href="/lookup"
          className="press border-border hover:bg-card flex flex-1 items-center justify-center gap-2 rounded-lg border px-6 py-3 text-sm font-medium transition-colors duration-200"
        >
          <Search className="size-4" aria-hidden="true" />
          Cek Status
        </Link>
      </div>
    </div>
  );
}
