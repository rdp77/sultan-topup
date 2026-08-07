'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { notFound, useRouter, useSearchParams } from 'next/navigation';
import { Copy, Check, Clock, Loader2 } from 'lucide-react';
import posthog from 'posthog-js';
import { PaymentLogo } from '@/components/payment-logo';
import { OrderSummary } from '@/components/order-summary';
import { PaymentCardSkeleton } from '@/components/payment-card-skeleton';
import { usePaymentPolling } from '@/hooks/use-payment-polling';
import { resolvePaymentType } from '@/lib/payment';
import { QRCodeSVG } from 'qrcode.react';

// --- Sub-components ---

function QrImage({ amount, data }: Readonly<{ amount: number; data?: string }>) {
  if (data) {
    return (
      <div className="border-border mx-auto flex size-48 items-center justify-center overflow-hidden rounded-xl border-2 bg-white p-4">
        <QRCodeSVG
          value={data}
          size={192}
          level="H" // required when embedding a logo — lower levels risk unscannable codes
          imageSettings={{
            src: '/favicon-96x96.png', // small monochrome mark, NOT full logo with wordmark
            width: 36, // keep under ~20% of `size` to stay within level H tolerance
            height: 36,
            excavate: true, // clears QR modules behind the logo instead of overlapping them
          }}
        />
      </div>
    );
  }

  // Placeholder while waiting for QR data from the server.
  return (
    <div
      className="border-border mx-auto flex size-48 animate-pulse items-center justify-center rounded-xl border-2 bg-white p-4"
      aria-label={`QRIS Rp ${amount.toLocaleString('id-ID')}`}
    >
      <Loader2 className="text-muted-foreground size-8 animate-spin" aria-hidden="true" />
    </div>
  );
}

function CopyButton({
  text,
  label = 'Salin',
  onCopy,
}: Readonly<{
  text: string;
  label?: string;
  onCopy?: () => void;
}>) {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    if (copied || !text) return;
    navigator.clipboard?.writeText(text);
    setCopied(true);
    onCopy?.();
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="press border-border text-foreground hover:bg-card inline-flex shrink-0 items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs font-medium transition-colors duration-200"
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
  );
}

function VaNumberDisplay({ number, bankCode }: Readonly<{ number: string; bankCode: string }>) {
  return (
    <div className="bg-background flex flex-col gap-2 rounded-lg p-4 text-left">
      <div className="flex items-center justify-between gap-2">
        <span className="text-muted-foreground text-xs">Nomor Virtual Account</span>
        <CopyButton
          text={number}
          label="Salin VA"
          onCopy={() => posthog.capture('va_number_copied', { bank: bankCode })}
        />
      </div>
      <span className="text-foreground font-mono text-lg font-semibold tracking-wide">
        {number || '—'}
      </span>
      <p className="text-muted-foreground text-xs">
        Penerima:{' '}
        <span className="text-foreground font-medium">
          Sultan Top Up ({bankCode.toUpperCase()})
        </span>
      </p>
    </div>
  );
}

function PaymentTimer({
  expiresAt,
  onExpire,
}: Readonly<{ expiresAt: string | null; onExpire?: () => void }>) {
  const [left, setLeft] = useState<number | null>(null);
  const [initial, setInitial] = useState<number | null>(null);

  useEffect(() => {
    if (!expiresAt) return;

    const target = new Date(expiresAt).getTime();

    function tick() {
      const remaining = Math.max(0, Math.floor((target - Date.now()) / 1000));
      setLeft(remaining);
      setInitial((prev) => prev ?? remaining);
      if (remaining <= 0) onExpire?.();
    }

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [expiresAt, onExpire]);

  if (left === null || initial === null) {
    return (
      <div className="flex items-center gap-3 text-xs">
        <Clock className="text-warning size-3.5" aria-hidden="true" />
        <span className="text-muted-foreground">Memuat batas waktu...</span>
      </div>
    );
  }

  const minutes = Math.floor(left / 60);
  const seconds = left % 60;
  const percentage = initial > 0 ? (left / initial) * 100 : 0;

  return (
    <div className="flex items-center gap-3 text-xs">
      <Clock className="text-warning size-3.5" aria-hidden="true" />
      <span className="tabular-nums">
        {minutes}:{String(seconds).padStart(2, '0')}
      </span>
      <div className="bg-muted h-1.5 flex-1 overflow-hidden rounded-full">
        <div
          className="bg-warning h-full rounded-full transition-all duration-1000 ease-linear"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

// --- Main component ---

export function BayarCard() {
  const router = useRouter();
  const params = useSearchParams();

  // The only param the checkout flow now sends. Everything else (game,
  // product, price, method, uid, ...) must come from the server.
  const invoice = params.get('invoice');

  const { data, isLoading, hasFetchError } = usePaymentPolling(invoice);

  const order = data?.order;
  const payment = data?.payment;

  const paymentType = useMemo(() => resolvePaymentType(payment), [payment]);
  const isQris = paymentType === 'qris';
  const isVa = paymentType === 'va';

  const bankCode = payment?.method.code ?? '';
  const vaNumber = payment?.payment_number ?? '';
  const qrData = payment?.payment_number;

  const redirectToResult = useCallback(
    (status: string) => {
      const redirect = new URLSearchParams();
      redirect.set('status', status);
      if (invoice) redirect.set('invoice', invoice);
      router.push(`/hasil?${redirect.toString()}`);
    },
    [invoice, router]
  );

  // Redirect once the server-reported payment status is no longer 'pending'.
  useEffect(() => {
    const status = payment?.status;
    if (!status || status === 'pending') return;
    redirectToResult(status);
  }, [payment?.status, redirectToResult]);

  // Track page view once data is available.
  useEffect(() => {
    if (!data || !order || !payment) return;
    posthog.capture('payment_page_viewed', {
      game: order.game.name,
      product: `${order.product.amount} × ${order.quantity}`,
      price: order.subtotal,
      fee: order.fee,
      total: order.total_price,
      payment_method_id: payment.method.id,
      payment_method_name: payment.method.name,
      invoice_id: order.invoice_number,
      payment_type: paymentType,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const handleExpire = useCallback(() => {
    redirectToResult('expired');
  }, [redirectToResult]);

  // No invoice in the URL at all — nothing to fetch, nothing to render.
  if (!invoice) {
    notFound();
  }

  // Still loading the first response and nothing to show yet.
  if (isLoading && !data) {
    return <PaymentCardSkeleton />;
  }

  // Fetch failed on the very first attempt and we still have nothing.
  if (!data) {
    notFound();
  }

  const gameName = order!.game.name;
  const productLabel = `${order!.product.amount} × ${order!.quantity}`;
  const total = order!.total_price;
  const paymentMethodName = payment!.method.type.toUpperCase();

  return (
    <div className="flex flex-col items-center text-center">
      {/* Payment method badge */}
      <div className="border-border bg-card flex items-center gap-2 rounded-full border px-4 py-1.5">
        <span className="bg-background text-muted-foreground flex size-6 items-center justify-center rounded">
          <PaymentLogo id={bankCode} />
        </span>
        <span className="text-sm font-medium">{paymentMethodName}</span>
      </div>

      <h1 className="mt-4 text-2xl font-bold tracking-tight">Selesaikan Pembayaran</h1>
      <p className="text-muted-foreground mt-2 max-w-sm text-sm leading-relaxed">
        {isQris
          ? 'Scan QR code di bawah menggunakan aplikasi e-wallet atau mobile banking kamu sebelum waktu habis.'
          : 'Transfer tepat ke nomor Virtual Account di bawah. Pembayaran akan terverifikasi otomatis.'}
      </p>

      {/* Payment display */}
      <div className="bg-card mt-6 w-full rounded-xl p-6">
        {isQris && <QrImage amount={total} data={qrData} />}

        {isVa && (
          <div className="space-y-4">
            <div className="bg-background/50 flex items-center gap-3 rounded-lg px-4 py-2.5">
              <PaymentLogo id={bankCode} className="size-6" />
              <span className="text-sm font-semibold">
                Virtual Account {bankCode.toUpperCase()}
              </span>
            </div>
            <VaNumberDisplay number={vaNumber} bankCode={bankCode} />
            <div className="bg-muted/30 text-muted-foreground flex flex-col gap-2 rounded-lg p-3 text-left text-xs">
              <p>
                <span className="text-foreground font-semibold">Cara bayar:</span> Buka aplikasi
                Mobile Banking atau ATM. Pilih menu Transfer &gt; Virtual Account. Masukkan nomor di
                atas, lalu konfirmasi jumlah.
              </p>
              <p>Biaya transfer ditanggung pembeli. Nomor VA hanya berlaku untuk 1 pesanan ini.</p>
            </div>
          </div>
        )}

        <OrderSummary gameName={gameName} productLabel={productLabel} total={total} />
      </div>

      {/* Timer */}
      <div className="mt-5 w-full max-w-xs">
        <PaymentTimer expiresAt={payment!.expired_at} onExpire={handleExpire} />
        <p className="text-muted-foreground mt-2 text-center text-xs">
          Batas waktu pembayaran. Jangan tutup halaman ini.
        </p>
      </div>

      {/* Background refetch indicator (data already loaded once, still polling) */}
      {isLoading && (
        <div className="text-muted-foreground mt-4 flex items-center gap-2 text-xs">
          <Loader2 className="size-3.5 animate-spin" aria-hidden="true" />
          Memperbarui status pembayaran...
        </div>
      )}
      {hasFetchError && !isLoading && (
        <p className="text-destructive mt-4 text-xs">
          Gagal memuat status pembayaran terbaru. Menampilkan data terakhir.
        </p>
      )}

      {/* Invoice */}
      <div className="text-muted-foreground mt-4 flex items-center justify-center gap-2 text-xs">
        <span>
          Invoice: <span className="font-mono">{order!.invoice_number}</span>
        </span>
        <CopyButton
          text={order!.invoice_number}
          label="Salin"
          onCopy={() =>
            posthog.capture('invoice_copied', {
              invoice_id: order!.invoice_number,
              source: 'payment_page',
            })
          }
        />
      </div>
    </div>
  );
}
