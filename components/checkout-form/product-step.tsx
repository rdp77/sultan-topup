'use client'

import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatRupiah } from '@/lib/data'
import { SectionHeading } from './section-heading'
import type { DenominationView } from '@/lib/product-utils'

interface ProductStepProps {
  step: number
  denominations: DenominationView[]
  selected: DenominationView | null
  onSelect: (denom: DenominationView) => void
}

export function ProductStep({
  step,
  denominations,
  selected,
  onSelect,
}: Readonly<ProductStepProps>) {
  return (
    <section className="rounded-xl bg-card p-4 md:p-6">
      <SectionHeading step={step} title="Pilih Nominal" />
      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {denominations.map((d) => {
          const isSelected = selected?.id === d.id
          return (
            <button
              key={d.id}
              type="button"
              onClick={() => onSelect(d)}
              className={cn(
                'relative flex flex-col items-start gap-1 rounded-xl border p-3 text-left transition-colors duration-200',
                isSelected
                  ? 'border-primary bg-primary/10'
                  : 'border-border bg-background hover:border-primary/50',
              )}
              aria-pressed={isSelected}
            >
              {d.badge && (
                <span
                  className={cn(
                    'absolute -top-2 right-2 rounded-md px-1.5 py-0.5 text-[10px] font-semibold',
                    d.badge === 'popular'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-warning text-background',
                  )}
                >
                  {d.badge === 'popular' ? 'Populer' : 'Best Value'}
                </span>
              )}
              {isSelected && (
                <span className="absolute right-2 top-2 flex size-4 items-center justify-center rounded-full bg-primary">
                  <Check className="size-3 text-primary-foreground" aria-hidden="true" />
                </span>
              )}
              <span className="text-sm font-medium leading-tight">{d.amount}</span>
              <span className="text-xs text-muted-foreground">{formatRupiah(d.price)}</span>
            </button>
          )
        })}
      </div>
    </section>
  )
}
