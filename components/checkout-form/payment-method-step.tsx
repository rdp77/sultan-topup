'use client';

import posthog from 'posthog-js';
import { Check, AlertCircle, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PaymentLogo } from '@/components/payment-logo';
import { calcFee, formatRupiah, type PaymentMethod, type PaymentGroup } from '@/lib/data';
import { SectionHeading } from './section-heading';
import type { DenominationView } from '@/lib/product-utils';

interface PaymentMethodStepProps {
  step: number;
  selected: PaymentMethod | null;
  onSelect: (method: PaymentMethod) => void;
  selectedDenom: DenominationView | null;
  /** Payment groups loaded from API – undefined while loading */
  paymentGroups: PaymentGroup[] | undefined;
  isLoading: boolean;
  error: string | null;
  onRetry: () => void;
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
    <section className="bg-card rounded-xl p-4 md:p-6">
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
              <span className="bg-muted mb-2 block h-3 w-28 animate-pulse rounded" />
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {Array.from({ length: gi === 0 ? 1 : 4 }).map((_, mi) => (
                  <div
                    key={mi}
                    className="border-border bg-background flex items-center gap-2.5 rounded-xl border px-3 py-3"
                  >
                    <span className="bg-muted size-8 shrink-0 animate-pulse rounded-md" />
                    <span className="bg-muted h-3.5 w-20 animate-pulse rounded" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Error state */}
      {!isLoading && error && (
        <div className="border-destructive/30 bg-destructive/5 mt-4 flex flex-col items-center gap-3 rounded-xl border px-4 py-6 text-center">
          <AlertCircle className="text-destructive size-6" aria-hidden="true" />
          <p className="text-destructive text-sm">{error}</p>
          <button
            type="button"
            onClick={onRetry}
            className="border-destructive/30 text-destructive hover:bg-destructive/10 inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors"
          >
            <RefreshCw className="size-3.5" aria-hidden="true" />
            Coba Lagi
          </button>
        </div>
      )}

      {/* Empty state */}
      {!isLoading && !error && paymentGroups && paymentGroups.length === 0 && (
        <div className="border-border mt-4 flex flex-col items-center gap-2 rounded-xl border border-dashed px-4 py-8 text-center">
          <p className="text-muted-foreground text-sm">
            Tidak ada metode pembayaran tersedia saat ini.
          </p>
        </div>
      )}

      {/* Payment method list */}
      {!isLoading && !error && paymentGroups && paymentGroups.length > 0 && (
        <div className="mt-4 flex flex-col gap-5">
          {paymentGroups.map((group) => (
            <div key={group.group}>
              <h3 className="text-muted-foreground mb-2 text-xs font-semibold tracking-wide uppercase">
                {group.group}
              </h3>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {group.methods.map((m) => {
                  const isSelected = selected?.id === m.id;
                  const mFee = selectedDenom ? calcFee(m, selectedDenom.price) : null;
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => {
                        onSelect(m);
                        posthog.capture('payment_method_selected', {
                          method_id: m.id,
                          method_name: m.name,
                          method_group: group.group,
                          fee: selectedDenom ? calcFee(m, selectedDenom.price) : null,
                        });
                      }}
                      className={cn(
                        'flex items-center justify-between gap-2 rounded-xl border px-3 py-3 text-left transition-colors duration-200',
                        isSelected
                          ? 'border-primary bg-primary/10'
                          : 'border-border bg-background hover:border-primary/50'
                      )}
                      aria-pressed={isSelected}
                    >
                      <span className="flex items-center gap-2.5">
                        <span
                          className={cn(
                            'flex size-8 shrink-0 items-center justify-center rounded-md border',
                            isSelected
                              ? 'border-primary/40 bg-primary/10 text-primary'
                              : 'border-border bg-background text-muted-foreground'
                          )}
                          aria-hidden="true"
                        >
                          <PaymentLogo id={m.id} />
                        </span>
                        <span className="text-sm">{m.name}</span>
                      </span>
                      <span className="flex items-center gap-2">
                        {mFee !== null && (
                          <span className="text-muted-foreground text-xs">
                            {mFee === 0 ? 'Gratis' : `+${formatRupiah(mFee)}`}
                          </span>
                        )}
                        {isSelected && (
                          <span className="bg-primary flex size-4 items-center justify-center rounded-full">
                            <Check className="text-primary-foreground size-3" aria-hidden="true" />
                          </span>
                        )}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
