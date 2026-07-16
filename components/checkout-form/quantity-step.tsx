import { formatRupiah } from '@/lib/data'
import { SectionHeading } from './section-heading'
import type { DenominationView } from '@/lib/product-utils'

interface QuantityStepProps {
  step: number
  selected: DenominationView | null
  quantity: number
  onChange: (quantity: number) => void
  subPrice: number
}

export function QuantityStep({
  step,
  selected,
  quantity,
  onChange,
  subPrice,
}: Readonly<QuantityStepProps>) {
  return (
    <section className="rounded-xl bg-card p-4 md:p-6">
      <SectionHeading step={step} title="Jumlah Pesanan" />
      <div className="mt-3 flex items-center gap-4">
        <button
          type="button"
          onClick={() => onChange(Math.max(1, quantity - 1))}
          disabled={!selected}
          className="press flex size-9 shrink-0 items-center justify-center rounded-lg border border-border text-sm font-medium transition-colors hover:bg-card disabled:cursor-not-allowed disabled:opacity-30"
          aria-label="Kurangi jumlah"
        >
          -
        </button>
        <span className="w-12 text-center text-lg font-semibold tabular-nums">{quantity}</span>
        <button
          type="button"
          onClick={() => onChange(Math.min(99, quantity + 1))}
          disabled={!selected}
          className="press flex size-9 shrink-0 items-center justify-center rounded-lg border border-border text-sm font-medium transition-colors hover:bg-card disabled:cursor-not-allowed disabled:opacity-30"
          aria-label="Tambah jumlah"
        >
          +
        </button>
        {selected ? (
          <span className="ml-auto text-sm text-muted-foreground">
            {selected.amount} × {quantity} · {formatRupiah(subPrice)}
          </span>
        ) : (
          <span className="ml-auto text-xs text-muted-foreground">
            Pilih nominal terlebih dahulu
          </span>
        )}
      </div>
    </section>
  )
}
