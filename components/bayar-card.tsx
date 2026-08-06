'use client';

import Image from 'next/image';
import { useCallback, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Copy, Check, Clock, Loader2 } from 'lucide-react';
import posthog from 'posthog-js';
import { PaymentLogo } from '@/components/payment-logo';
import { formatRupiah } from '@/lib/data';
import { CheckoutService } from '@/services';
import type { CheckoutResult } from '@/types/checkout';

const POLL_INTERVAL_MS = 5000;

// --- Sub-components ---

function QrImage({ amount, data }: Readonly<{ amount: number; data?: string }>) {
  if (data) {
    // payment_number dari gateway adalah string QRIS (EMVCo) → generate gambar QR di client
    const qrSrc = `https://api.qrserver.com/v1/create-qr-code/?size=384x384&data=${encodeURIComponent(data)}`;
    return (
      <div className="border-border mx-auto flex size-48 items-center justify-center overflow-hidden rounded-xl border-2 bg-white p-4">
        <Image
          src={qrSrc}
          alt={`QRIS Rp ${amount.toLocaleString('id-ID')}`}
          width={192}
          height={192}
          className="size-full object-contain"
          unoptimized
        />
      </div>
    );
  }

  // Placeholder while waiting for QR data
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
      if (remaining <= 0) {
        onExpire?.();
      }
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
  const [data, setData] = useState<CheckoutResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasFetchError, setHasFetchError] = useState(false);

  // URL params (dipakai untuk render awal sebelum data API datang, dan untuk field yang gak ada di API seperti uid)
  const orderId = params.get('orderId');
  const fallbackGame = params.get('game') ?? 'Mobile Legends';
  const fallbackProduct = params.get('product') ?? '';
  const fallbackPrice = Number(params.get('price') ?? 0);
  const fallbackFee = Number(params.get('fee') ?? 0);
  const methodName = params.get('method') ?? 'Pembayaran';
  const paymentId = params.get('payment') ?? 'qris';
  const fallbackInvoice = params.get('invoice') ?? '';
  const uid = params.get('uid') ?? '-';

  const order = data?.order;
  const payment = data?.payment;

  const isQris = payment ? payment.method.type === 'qris' : paymentId === 'qris';
  const isVa = payment ? payment.method.type === 'va' : paymentId !== 'qris';

  const gameName = order?.game.name ?? fallbackGame;
  const productLabel = order ? `${order.product.amount} × ${order.quantity}` : fallbackProduct;
  const price = order?.subtotal ?? fallbackPrice;
  const fee = order?.fee ?? fallbackFee;
  const total = order?.total_price ?? price + fee;
  const invoice = order?.invoice_number ?? fallbackInvoice;

  const bankCode = payment?.method.code ?? paymentId;
  const vaNumber = payment?.payment_number ?? '';
  const qrData = payment?.payment_number;

  const redirectToResult = useCallback(
    (status: string) => {
      const redirect = new URLSearchParams(params.toString());
      redirect.set('status', status);
      if (invoice) redirect.set('invoice', invoice);
      router.push(`/hasil?${redirect.toString()}`);
    },
    [params, invoice, router]
  );

  // Fetch + polling status pembayaran
  useEffect(() => {
    if (!orderId) {
      setIsLoading(false);
      return;
    }

    let cancelled = false;
    let timeoutId: ReturnType<typeof setTimeout>;

    async function poll() {
      try {
        const response = await CheckoutService.getStatus(orderId as string);
        if (cancelled) return;

        if (response.success && response.data) {
          setData(response.data);
          setHasFetchError(false);

          const status = response.data.payment.status;
          if (status !== 'pending') {
            redirectToResult(status);
            return; // stop polling
          }
        } else {
          setHasFetchError(true);
        }
      } catch {
        setHasFetchError(true);
      } finally {
        if (!cancelled) setIsLoading(false);
      }

      if (!cancelled) {
        timeoutId = setTimeout(poll, POLL_INTERVAL_MS);
      }
    }

    poll();

    return () => {
      cancelled = true;
      clearTimeout(timeoutId);
    };
  }, [orderId, redirectToResult]);

  // Track page view
  useEffect(() => {
    if (!data) return;
    posthog.capture('payment_page_viewed', {
      game: gameName,
      product: productLabel,
      price,
      fee,
      total,
      payment_method_id: payment?.method.id ?? paymentId,
      payment_method_name: methodName,
      invoice_id: invoice,
      payment_type: isQris ? 'qris' : isVa ? 'va' : 'other',
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const handleExpire = useCallback(() => {
    redirectToResult('expired');
  }, [redirectToResult]);

  return (
    <div className="flex flex-col items-center text-center">
      {/* Payment method badge */}
      <div className="border-border bg-card flex items-center gap-2 rounded-full border px-4 py-1.5">
        <span className="bg-background text-muted-foreground flex size-6 items-center justify-center rounded">
          <PaymentLogo id={bankCode} />
        </span>
        <span className="text-sm font-medium">{payment?.method.name ?? methodName}</span>
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

        {/* Order summary */}
        <dl className="border-border mt-5 flex flex-col gap-2 border-t pt-4 text-left text-sm">
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Game</dt>
            <dd>{gameName}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Produk</dt>
            <dd>{productLabel}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted-foreground">ID Akun</dt>
            <dd>{uid}</dd>
          </div>
          <div className="border-border flex justify-between border-t pt-2 font-semibold">
            <dt>Total</dt>
            <dd className="text-primary">{formatRupiah(total)}</dd>
          </div>
        </dl>
      </div>

      {/* Timer */}
      <div className="mt-5 w-full max-w-xs">
        <PaymentTimer expiresAt={payment?.expired_at ?? null} onExpire={handleExpire} />
        <p className="text-muted-foreground mt-2 text-center text-xs">
          Batas waktu pembayaran. Jangan tutup halaman ini.
        </p>
      </div>

      {/* Loading / error indicator */}
      {isLoading && (
        <div className="text-muted-foreground mt-4 flex items-center gap-2 text-xs">
          <Loader2 className="size-3.5 animate-spin" aria-hidden="true" />
          Memuat data pembayaran...
        </div>
      )}
      {hasFetchError && !isLoading && (
        <p className="text-destructive mt-4 text-xs">
          Gagal memuat status pembayaran terbaru. Menampilkan data terakhir.
        </p>
      )}

      {/* Invoice */}
      {invoice && (
        <div className="text-muted-foreground mt-4 flex items-center justify-center gap-2 text-xs">
          <span>
            Invoice: <span className="font-mono">{invoice}</span>
          </span>
          <CopyButton
            text={invoice}
            label="Salin"
            onCopy={() =>
              posthog.capture('invoice_copied', { invoice_id: invoice, source: 'payment_page' })
            }
          />
        </div>
      )}
    </div>
  );
}
