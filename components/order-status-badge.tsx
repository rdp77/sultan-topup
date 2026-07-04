import { cn } from '@/lib/utils'
import type { OrderStatus } from '@/lib/data'

const config: Record<OrderStatus, { label: string; className: string }> = {
  success: { label: 'Berhasil', className: 'bg-success/15 text-success' },
  processing: { label: 'Diproses', className: 'bg-warning/15 text-warning' },
  failed: { label: 'Gagal', className: 'bg-destructive/15 text-destructive' },
  expired: { label: 'Kedaluwarsa', className: 'bg-muted text-muted-foreground' },
}

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  const c = config[status]
  return (
    <span className={cn('rounded-md px-2 py-1 text-xs font-medium', c.className)}>{c.label}</span>
  )
}
