'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Loader2, Plus, PackageOpen } from 'lucide-react';
import { OrderStatusBadge } from '@/components/order-status-badge';
import { formatRupiah, type Order, type OrderStatus } from '@/lib/data';
import { OrderService } from '@/services';
import type { OrderApiItem } from '@/types/order';

const PAGE_SIZE = 6;

const STATUS_MAP: Record<string, OrderStatus> = {
  completed: 'success',
  failed: 'failed',
  pending: 'processing',
};

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
    status: STATUS_MAP[item.status] ?? 'failed',
    date: item.created_at,
  };
}

export function OrderList() {
  const [allOrders, setAllOrders] = useState<Order[]>([]);
  const [visible, setVisible] = useState<Order[]>([]);
  const [count, setCount] = useState(PAGE_SIZE);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    OrderService.list()
      .then((res) => {
        const mapped = res.data.map(toOrder);
        setAllOrders(mapped);
        setVisible(mapped.slice(0, PAGE_SIZE));
      })
      .finally(() => setLoading(false));
  }, []);

  function handleLoadMore() {
    setLoadingMore(true);
    const next = count + PAGE_SIZE;
    // simulate network delay for smooth UX
    setTimeout(() => {
      setVisible(allOrders.slice(0, next));
      setCount(next);
      setLoadingMore(false);
    }, 400);
  }

  // Skeleton state while loading first page
  if (loading) {
    return (
      <ul className="mt-8 flex flex-col gap-3" aria-busy="true" aria-label="Memuat transaksi">
        {Array.from({ length: 3 }).map((_, i) => (
          <li key={i} className="border-border/50 bg-card rounded-xl border p-4">
            <div className="flex items-center justify-between">
              <span className="bg-muted h-3 w-28 animate-pulse rounded" />
              <span className="bg-muted h-5 w-16 animate-pulse rounded" />
            </div>
            <div className="mt-3 flex items-end justify-between gap-2">
              <div className="flex flex-col gap-2">
                <span className="bg-muted h-4 w-32 animate-pulse rounded" />
                <span className="bg-muted h-3 w-40 animate-pulse rounded" />
                <span className="bg-muted h-3 w-24 animate-pulse rounded" />
              </div>
              <span className="bg-muted h-4 w-20 animate-pulse rounded" />
            </div>
          </li>
        ))}
      </ul>
    );
  }

  if (visible.length === 0) {
    return (
      <div className="border-border bg-card/40 mt-8 flex flex-col items-center gap-3 rounded-xl border border-dashed px-6 py-12 text-center">
        <span className="bg-card text-muted-foreground flex size-12 items-center justify-center rounded-full">
          <PackageOpen className="size-6" aria-hidden="true" />
        </span>
        <p className="text-sm font-medium">Belum ada transaksi</p>
        <p className="text-muted-foreground max-w-xs text-xs">
          Pesanan top up kamu akan muncul di sini setelah checkout selesai.
        </p>
        <Link
          href="/"
          className="press bg-primary text-primary-foreground hover:bg-primary/90 mt-1 inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold transition-colors duration-200"
        >
          <Plus className="size-4" aria-hidden="true" />
          Top Up Sekarang
        </Link>
      </div>
    );
  }

  return (
    <>
      <ul className="reveal mt-8 flex flex-col gap-3">
        {visible.map((order, i) => (
          <li
            key={order.invoice || i}
            className="bg-card hover:bg-accent rounded-xl p-4 transition-colors duration-200"
          >
            <div className="flex items-center justify-between gap-4">
              <span className="text-muted-foreground font-mono text-xs">{order.invoice}</span>
              <OrderStatusBadge status={order.status} />
            </div>
            <div className="mt-3 flex flex-wrap items-end justify-between gap-2">
              <div>
                <p className="text-sm font-semibold">{order.game}</p>
                <p className="text-muted-foreground mt-0.5 text-xs">
                  {order.product} • {order.method}
                </p>
                <p className="text-muted-foreground mt-0.5 text-xs">{order.date}</p>
              </div>
              <span className="text-primary text-sm font-semibold">
                {formatRupiah(order.total)}
              </span>
            </div>
          </li>
        ))}
      </ul>

      {count < allOrders.length && (
        <div className="mt-5 flex justify-center">
          <button
            type="button"
            disabled={loadingMore}
            onClick={handleLoadMore}
            className="press border-border text-foreground hover:bg-card inline-flex items-center gap-2 rounded-lg border px-5 py-2.5 text-sm font-medium transition-colors duration-200 disabled:opacity-60"
          >
            {loadingMore ? (
              <>
                <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                Memuat...
              </>
            ) : (
              'Muat Lebih Banyak'
            )}
          </button>
        </div>
      )}
    </>
  );
}
