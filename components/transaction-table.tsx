'use client';

import { useEffect, useState } from 'react';
import { PackageOpen } from 'lucide-react';
import { OrderStatusBadge } from '@/components/order-status-badge';
import { type Order, type OrderStatus } from '@/lib/data';
import { formatDate } from '@/lib/utils';
import { OrderService } from '@/services';
import type { OrderApiItem } from '@/types/order';

const MAX_ROWS = 15;

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
    playerId: item.player_id,
    phone: item.phone,
    status: STATUS_MAP[item.status] ?? 'failed',
    date: item.created_at,
  };
}

const HEADERS = [
  'Invoice',
  'Status',
  'Game',
  'Produk',
  'Player ID',
  'Email',
  'No. HP',
  'Metode',
  'Tanggal',
  'Total',
];

export function TransactionTable() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    OrderService.list()
      .then((res) => setOrders(res.data.slice(0, MAX_ROWS).map(toOrder)))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  if (error) return null;

  if (loading) {
    return (
      <div className="reveal border-border/50 bg-card mt-8 overflow-hidden rounded-xl border">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-border/50 border-b">
                {HEADERS.map((h) => (
                  <th
                    key={h}
                    className="text-muted-foreground px-5 py-3 text-left text-[11px] font-semibold tracking-wider whitespace-nowrap"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="border-border/30 border-b last:border-b-0">
                  {Array.from({ length: HEADERS.length }).map((_, j) => (
                    <td key={j} className="px-5 py-4">
                      <span className="bg-muted block h-3.5 w-20 animate-pulse rounded" />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="border-border bg-card/40 mt-8 flex flex-col items-center gap-3 rounded-xl border border-dashed px-6 py-12 text-center">
        <span className="bg-card text-muted-foreground flex size-12 items-center justify-center rounded-full">
          <PackageOpen className="size-6" aria-hidden="true" />
        </span>
        <p className="text-sm font-medium">Belum ada transaksi</p>
        <p className="text-muted-foreground max-w-xs text-xs">
          Riwayat transaksi top up kamu akan muncul di sini.
        </p>
      </div>
    );
  }

  return (
    <div className="reveal border-border/50 bg-card mt-8 overflow-hidden rounded-xl border">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-border/50 border-b">
              {HEADERS.map((h) => (
                <th
                  key={h}
                  className="text-muted-foreground px-5 py-3 text-left text-[11px] font-semibold tracking-wider whitespace-nowrap"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {orders.map((order, i) => (
              <tr
                key={order.invoice || i}
                className="border-border/30 hover:bg-accent/50 border-b transition-colors duration-150 last:border-b-0"
              >
                <td className="text-muted-foreground px-5 py-3.5 font-mono text-xs whitespace-nowrap">
                  {order.invoice}
                </td>
                <td className="px-5 py-3.5 whitespace-nowrap">
                  <OrderStatusBadge status={order.status} />
                </td>
                <td className="px-5 py-3.5 text-sm whitespace-nowrap">{order.game}</td>
                <td className="text-muted-foreground px-5 py-3.5 text-sm whitespace-nowrap">
                  {order.product}
                </td>
                <td className="text-muted-foreground px-5 py-3.5 font-mono text-xs whitespace-nowrap">
                  {order.playerId}
                </td>
                <td className="text-muted-foreground px-5 py-3.5 font-mono text-xs whitespace-nowrap">
                  {order.userId}
                </td>
                <td className="text-muted-foreground px-5 py-3.5 font-mono text-xs whitespace-nowrap">
                  {order.phone}
                </td>
                <td className="text-muted-foreground px-5 py-3.5 text-sm whitespace-nowrap">
                  {order.method}
                </td>
                <td className="text-muted-foreground px-5 py-3.5 text-xs whitespace-nowrap">
                  {formatDate(order.date)}
                </td>
                <td className="text-primary px-5 py-3.5 text-sm font-semibold whitespace-nowrap">
                  {order.total}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
