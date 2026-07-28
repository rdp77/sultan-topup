import { formatRupiah } from '@/lib/data';
import { SectionHeading } from './section-heading';
import type { DenominationView } from '@/lib/product-utils';

interface QuantityStepProps {
  step: number;
  selected: DenominationView | null;
  quantity: number;
  onChange: (quantity: number) => void;
  subPrice: number;
}

export function QuantityStep({
  step,
  selected,
  quantity,
  onChange,
  subPrice,
}: Readonly<QuantityStepProps>) {
  return (
    <section className="bg-card rounded-xl p-4 md:p-6">
      <SectionHeading step={step} title="Jumlah Pesanan" />
      <div className="mt-3 flex items-center gap-4">
        <button
          type="button"
          onClick={() => onChange(Math.max(1, quantity - 1))}
          disabled={!selected}
          className="press border-border hover:bg-card flex size-9 shrink-0 items-center justify-center rounded-lg border text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-30"
          aria-label="Kurangi jumlah"
        >
          -
        </button>
        <span className="w-12 text-center text-lg font-semibold tabular-nums">{quantity}</span>
        <button
          type="button"
          onClick={() => onChange(Math.min(99, quantity + 1))}
          disabled={!selected}
          className="press border-border hover:bg-card flex size-9 shrink-0 items-center justify-center rounded-lg border text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-30"
          aria-label="Tambah jumlah"
        >
          +
        </button>
        {selected ? (
          <span className="text-muted-foreground ml-auto text-sm">
            {selected.amount} × {quantity} · {formatRupiah(subPrice)}
          </span>
        ) : (
          <span className="text-muted-foreground ml-auto text-xs">
            Pilih nominal terlebih dahulu
          </span>
        )}
      </div>
    </section>
  );
}
