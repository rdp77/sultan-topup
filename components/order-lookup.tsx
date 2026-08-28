'use client';

import { useState } from 'react';
import { Loader2, Search, SearchX } from 'lucide-react';
import posthog from 'posthog-js';
import { z } from 'zod';
import { OrderStatusBadge } from '@/components/order-status-badge';
import { type Order, type OrderStatus, type OrderApiItem } from '@/types/order';
import { formatRupiah, formatDateTime } from '@/lib/utils';
import { OrderService } from '@/services';

const STATUS_MAP: Record<string, OrderStatus> = {
  completed: 'success',
  failed: 'failed',
  pending: 'processing',
};

const orderLookupSchema = z.object({
  invoice: z.string().min(1, 'Nomor invoice wajib diisi'),
  contact: z
    .string()
    .min(1, 'Email atau nomor WA wajib diisi')
    .refine(
      (v) => v.includes('@') || /^08\d{8,12}$/.test(v.replace(/\D/g, '')),
      'Masukkan email atau nomor WA yang valid'
    ),
});

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
    playerId: item.player_id,
    status: STATUS_MAP[item.status] ?? 'failed',
    date: item.created_at,
  };
}

export function OrderLookup() {
  const [invoice, setInvoice] = useState('');
  const [contact, setContact] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Order | null | 'not-found'>(null);
  const [zodErrors, setZodErrors] = useState<Record<string, string>>({});

  async function handleSearch(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();

    const parseResult = z.safeParse(orderLookupSchema, {
      invoice: invoice.trim(),
      contact: contact.trim(),
    });
    if (!parseResult.success) {
      const errors: Record<string, string> = {};
      for (const issue of parseResult.error.issues) {
        const field = issue.path[0] as string;
        if (!errors[field]) errors[field] = issue.message;
      }
      setZodErrors(errors);
      return;
    }
    setZodErrors({});
    if (loading) return;
    setLoading(true);
    setResult(null);

    try {
      const res = await OrderService.lookup(invoice.trim(), contact.trim());
      const found = res.data ?? null;
      posthog.capture('order_lookup_performed', {
        found: !!found,
        order_status: found?.status ?? null,
      });
      setResult(found ? toOrder(found) : 'not-found');
    } catch {
      setResult('not-found');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <form onSubmit={handleSearch} className="bg-card flex flex-col gap-4 rounded-xl p-5">
        <div>
          <label htmlFor="invoice" className="text-muted-foreground mb-1.5 block text-sm">
            Nomor Invoice
          </label>
          <input
            id="invoice"
            type="text"
            value={invoice}
            onChange={(e) => setInvoice(e.target.value)}
            placeholder="Contoh: INV-20260702-8F3K"
            className="border-input bg-background placeholder:text-muted-foreground/60 focus:border-primary focus:ring-primary/30 w-full rounded-md border px-3 py-2.5 text-sm transition-colors duration-200 outline-none focus:ring-2"
          />
          {zodErrors.invoice && (
            <p className="text-destructive mt-1 text-xs">{zodErrors.invoice}</p>
          )}
        </div>
        <div>
          <label htmlFor="contact" className="text-muted-foreground mb-1.5 block text-sm">
            Email / Nomor WhatsApp
          </label>
          <input
            id="contact"
            type="text"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            placeholder="nama@email.com atau 08xxxxxxxxxx"
            className="border-input bg-background placeholder:text-muted-foreground/60 focus:border-primary focus:ring-primary/30 w-full rounded-md border px-3 py-2.5 text-sm transition-colors duration-200 outline-none focus:ring-2"
          />
          {zodErrors.contact && (
            <p className="text-destructive mt-1 text-xs">{zodErrors.contact}</p>
          )}
        </div>
        <button
          type="submit"
          disabled={loading || !invoice.trim() || !contact.trim()}
          className="press bg-primary text-primary-foreground enabled:hover:bg-primary/90 flex w-full items-center justify-center gap-2 rounded-lg px-6 py-3 text-sm font-semibold transition-colors duration-200 disabled:opacity-60"
        >
          {loading ? (
            <>
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
              Mencari...
            </>
          ) : (
            <>
              <Search className="size-4" aria-hidden="true" />
              Cari Pesanan
            </>
          )}
        </button>
        <p className="text-muted-foreground text-center text-xs">
          Coba dengan invoice contoh: INV-20260702-8F3K
        </p>
      </form>

      {result === 'not-found' && (
        <div className="bg-card flex flex-col items-center gap-2 rounded-xl p-8 text-center">
          <SearchX className="text-muted-foreground size-10" aria-hidden="true" />
          <p className="text-sm font-medium">Pesanan tidak ditemukan</p>
          <p className="text-muted-foreground text-xs">
            Periksa kembali nomor invoice dan kontak yang kamu masukkan.
          </p>
        </div>
      )}

      {result && result !== 'not-found' && (
        <div className="bg-card rounded-xl p-5">
          <div className="flex items-center justify-between gap-4">
            <span className="text-muted-foreground font-mono text-xs">{result.invoice}</span>
            <OrderStatusBadge status={result.status} />
          </div>
          <dl className="border-border mt-4 flex flex-col gap-2.5 border-t pt-4 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">Game</dt>
              <dd>{result.game}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">Produk</dt>
              <dd>{result.product}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">Player ID</dt>
              <dd>{result.playerId}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">Metode</dt>
              <dd>{result.method}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">Tanggal</dt>
              <dd>{formatDateTime(result.date)}</dd>
            </div>
            <div className="border-border flex justify-between gap-4 border-t pt-2.5 font-semibold">
              <dt>Total</dt>
              <dd className="text-primary">{formatRupiah(result.total)}</dd>
            </div>
          </dl>
        </div>
      )}

      {/* Skeleton — same shape as the result card, shown while searching */}
      {loading && !result && (
        <div className="bg-card rounded-xl p-5" aria-busy="true" aria-label="Mencari pesanan">
          <div className="flex items-center justify-between gap-4">
            <span className="bg-muted h-3 w-32 animate-pulse rounded" />
            <span className="bg-muted h-5 w-20 animate-pulse rounded" />
          </div>
          <dl className="border-border mt-4 flex flex-col gap-2.5 border-t pt-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex justify-between gap-4">
                <span className="bg-muted h-3 w-16 animate-pulse rounded" />
                <span className="bg-muted h-3 w-28 animate-pulse rounded" />
              </div>
            ))}
            <div className="border-border mt-1 flex justify-between gap-4 border-t pt-2.5">
              <span className="bg-muted h-4 w-12 animate-pulse rounded" />
              <span className="bg-muted h-4 w-24 animate-pulse rounded" />
            </div>
          </dl>
        </div>
      )}
    </div>
  );
}
