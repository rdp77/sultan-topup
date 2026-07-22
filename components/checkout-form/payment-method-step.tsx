'use client'

import posthog from 'posthog-js'
import { Check, AlertCircle, RefreshCw } from 'lucide-react'
import { cn } from '@/lib/utils'
import { PaymentLogo } from '@/components/payment-logo'
import { calcFee, formatRupiah, type PaymentMethod, type PaymentGroup } from '@/lib/data'
import { SectionHeading } from './section-heading'
import type { DenominationView } from '@/lib/product-utils'

interface PaymentMethodStepProps {
  step: number
  selected: PaymentMethod | null
  onSelect: (method: PaymentMethod) => void
  selectedDenom: DenominationView | null
  /** Payment groups loaded from API – undefined while loading */
  paymentGroups: PaymentGroup[] | undefined
  isLoading: boolean
  error: string | null
  onRetry: () => void
}

export function PaymentMethodStep({
  step,
  selected,
  onSelect,
  selectedDenom,
  paymentGroups,
  isLoading,
  error,
  onRetry,
}: Readonly<PaymentMethodStepProps>) {
  return (
    <section className="rounded-xl bg-card p-4 md:p-6">
      <SectionHeading step={step} title="Metode Pembayaran" />

      {/* Loading skeleton */}
      {isLoading && (
        <div
          className="mt-4 flex flex-col gap-5"
          aria-busy="true"
          aria-label="Memuat metode pembayaran"
        >
          {Array.from({ length: 3 }).map((_, gi) => (
            <div key={gi}>
              <span className="mb-2 block h-3 w-28 animate-pulse rounded bg-muted" />
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {Array.from({ length: gi === 0 ? 1 : 4 }).map((_, mi) => (
                  <div
                    key={mi}
                    className="flex items-center gap-2.5 rounded-xl border border-border bg-background px-3 py-3"
                  >
                    <span className="size-8 shrink-0 animate-pulse rounded-md bg-muted" />
                    <span className="h-3.5 w-20 animate-pulse rounded bg-muted" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Error state */}
      {!isLoading && error && (
        <div className="mt-4 flex flex-col items-center gap-3 rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-6 text-center">
          <AlertCircle className="size-6 text-destructive" aria-hidden="true" />
          <p className="text-sm text-destructive">{error}</p>
          <button
            type="button"
            onClick={onRetry}
            className="inline-flex items-center gap-1.5 rounded-lg border border-destructive/30 px-3 py-1.5 text-xs font-medium text-destructive transition-colors hover:bg-destructive/10"
          >
            <RefreshCw className="size-3.5" aria-hidden="true" />
            Coba Lagi
          </button>
        </div>
      )}

      {/* Empty state */}
      {!isLoading && !error && paymentGroups && paymentGroups.length === 0 && (
        <div className="mt-4 flex flex-col items-center gap-2 rounded-xl border border-dashed border-border px-4 py-8 text-center">
          <p className="text-sm text-muted-foreground">
            Tidak ada metode pembayaran tersedia saat ini.
          </p>
        </div>
      )}

      {/* Payment method list */}
      {!isLoading && !error && paymentGroups && paymentGroups.length > 0 && (
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
                      onClick={() => {
                        onSelect(m)
                        posthog.capture('payment_method_selected', {
                          method_id: m.id,
                          method_name: m.name,
                          method_group: group.group,
                          fee: selectedDenom ? calcFee(m, selectedDenom.price) : null,
                        })
                      }}
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
      )}
    </section>
  )
}
