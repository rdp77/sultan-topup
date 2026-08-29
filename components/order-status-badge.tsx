import { cn } from '@/lib/utils';
import type { OrderStatus } from '@/types/order';

const config: Record<OrderStatus, { label: string; className: string }> = {
  completed: { label: 'Berhasil', className: 'bg-success/15 text-success' },
  pending: { label: 'Diproses', className: 'bg-warning/15 text-warning' },
  failed: { label: 'Gagal', className: 'bg-destructive/15 text-destructive' },
  cancelled: {
    label: 'Dibatalkan',
    className: 'bg-muted-foreground/15 text-muted-foreground border border-border/60',
  },
};

export function OrderStatusBadge({ status }: Readonly<{ status: OrderStatus }>) {
  const c = config[status];
  if (!c) return null;
  return (
    <span className={cn('rounded-md px-2 py-1 text-xs font-medium', c.className)}>{c.label}</span>
  );
}
