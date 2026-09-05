import { Suspense } from 'react';
import { SearchX } from 'lucide-react';
import { OrderStatusBadge } from '@/components/order-status-badge';
import { OrderService } from '@/services';
import { toOrder } from '@/lib/order-utils';
import { formatRupiah, formatDateTime } from '@/lib/utils';
import { getPostHogClient } from '@/lib/posthog-server';

/** Skeleton — same shape as the result card, used as the Suspense fallback. */
export function LookupResultSkeleton() {
  return (
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
  );
}

function NotFound() {
  return (
    <div className="bg-card flex flex-col items-center gap-2 rounded-xl p-8 text-center">
      <SearchX className="text-muted-foreground size-10" aria-hidden="true" />
      <p className="text-sm font-medium">Pesanan tidak ditemukan</p>
      <p className="text-muted-foreground text-xs">
        Periksa kembali nomor invoice dan kontak yang kamu masukkan.
      </p>
    </div>
  );
}

interface LookupResultProps {
  invoice: string;
  contact: string;
}

/**
 * Server Component — performs the order lookup on the server so the result
 * URL (/lookup?invoice=...&contact=...) is shareable and refreshable.
 */
export async function LookupResult({ invoice, contact }: Readonly<LookupResultProps>) {
  const res = await OrderService.lookup(invoice, contact).catch(() => null);
  const found = res?.data ?? null;

  const posthog = getPostHogClient();
  posthog.capture({
    distinctId: 'anonymous',
    event: 'order_lookup_performed',
    properties: {
      found: !!found,
      order_status: found?.status ?? null,
    },
  });
  await posthog.flush();

  if (!found) return <NotFound />;
  const result = toOrder(found);

  return (
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
  );
}

/** Wrapper so the page can stream the result inside Suspense. */
export function LookupResultSection(props: Readonly<LookupResultProps>) {
  return (
    <Suspense fallback={<LookupResultSkeleton />}>
      <LookupResult {...props} />
    </Suspense>
  );
}