'use client';

import { useCallback, useEffect, useMemo, useRef } from 'react';
import { notFound, useRouter, useSearchParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import posthog from 'posthog-js';
import { PaymentLogo } from '@/components/payment-logo';
import { OrderSummary } from '@/components/order-summary';
import { PaymentCardSkeleton } from '@/components/payment-card-skeleton';
import { usePaymentPolling } from '@/hooks/use-payment-polling';
import { resolvePaymentType } from '@/lib/payment';
import { QrImage } from '@/components/qr-image';
import { CopyButton } from '@/components/copy-button';
import { VaNumberDisplay } from '@/components/va-number-display';
import { PaymentTimer } from '@/components/payment-timer';

export function PayCard() {
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

  const hasRedirectedRef = useRef(false);
  const hasTrackedViewRef = useRef(false);

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
  // Guarded so a stray extra poll tick can't trigger a second navigation.
  useEffect(() => {
    const status = payment?.status;
    if (!status || status === 'pending' || hasRedirectedRef.current) return;
    hasRedirectedRef.current = true;
    redirectToResult(status);
  }, [payment?.status, redirectToResult]);

  // Track page view exactly once, regardless of how many times `data`
  // is replaced by subsequent polling responses.
  useEffect(() => {
    if (!order || !payment || hasTrackedViewRef.current) return;
    hasTrackedViewRef.current = true;
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
  }, [order, payment, paymentType]);

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

  const gameName = data.order.game.name;
  const productLabel = `${data.order.product.amount} × ${data.order.quantity}`;
  const total = data.order.total_price;
  const paymentMethodName = data.payment.method.type.toUpperCase();

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
        <PaymentTimer expiresAt={data.payment.expired_at} onExpire={handleExpire} />
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
          Invoice: <span className="font-mono">{data.order.invoice_number}</span>
        </span>
        <CopyButton
          text={data.order.invoice_number}
          label="Salin"
          onCopy={() =>
            posthog.capture('invoice_copied', {
              invoice_id: data.order.invoice_number,
              source: 'payment_page',
            })
          }
        />
      </div>
    </div>
  );
}
