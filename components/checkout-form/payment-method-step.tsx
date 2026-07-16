import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { PaymentLogo } from '@/components/payment-logo'
import { calcFee, formatRupiah, paymentGroups, type PaymentMethod } from '@/lib/data'
import { SectionHeading } from './section-heading'
import type { DenominationView } from '@/lib/product-utils'

interface PaymentMethodStepProps {
  step: number
  selected: PaymentMethod | null
  onSelect: (method: PaymentMethod) => void
  selectedDenom: DenominationView | null
}

export function PaymentMethodStep({
  step,
  selected,
  onSelect,
  selectedDenom,
}: Readonly<PaymentMethodStepProps>) {
  return (
    <section className="rounded-xl bg-card p-4 md:p-6">
      <SectionHeading step={step} title="Metode Pembayaran" />
      <div className="mt-4 flex flex-col gap-5">
        {paymentGroups.map((group) => (
          <div key={group.group}>
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {group.group}
            </h3>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {group.methods.map((m) => {
                const isSelected = selected?.id === m.id
                const mFee = selectedDenom ? calcFee(m, selectedDenom.price) : null
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => onSelect(m)}
                    className={cn(
                      'flex items-center justify-between gap-2 rounded-xl border px-3 py-3 text-left transition-colors duration-200',
                      isSelected
                        ? 'border-primary bg-primary/10'
                        : 'border-border bg-background hover:border-primary/50',
                    )}
                    aria-pressed={isSelected}
                  >
                    <span className="flex items-center gap-2.5">
                      <span
                        className={cn(
                          'flex size-8 shrink-0 items-center justify-center rounded-md border',
                          isSelected
                            ? 'border-primary/40 bg-primary/10 text-primary'
                            : 'border-border bg-background text-muted-foreground',
                        )}
                        aria-hidden="true"
                      >
                        <PaymentLogo id={m.id} />
                      </span>
                      <span className="text-sm">{m.name}</span>
                    </span>
                    <span className="flex items-center gap-2">
                      {mFee !== null && (
                        <span className="text-xs text-muted-foreground">
                          {mFee === 0 ? 'Gratis' : `+${formatRupiah(mFee)}`}
                        </span>
                      )}
                      {isSelected && (
                        <span className="flex size-4 items-center justify-center rounded-full bg-primary">
                          <Check className="size-3 text-primary-foreground" aria-hidden="true" />
                        </span>
                      )}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
