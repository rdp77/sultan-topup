'use client';

import posthog from 'posthog-js';
import { Check } from 'lucide-react';
import { cn, formatRupiah, calcFee } from '@/lib/utils';
import { PaymentLogo } from '@/components/payment-logo';
import { type PaymentMethod, type PaymentGroup } from '@/types/payment-method';
import { SectionHeading } from './section-heading';
import type { DenominationView } from '@/lib/product-utils';

interface PaymentMethodStepProps {
  step: number;
  selected: PaymentMethod | null;
  onSelect: (method: PaymentMethod) => void;
  selectedDenom: DenominationView | null;
  /** Payment groups fetched on the server and passed down as props. */
  paymentGroups: PaymentGroup[];
}

export function PaymentMethodStep({
  step,
  selected,
  onSelect,
  selectedDenom,
  paymentGroups,
}: Readonly<PaymentMethodStepProps>) {
  return (
    <section className="bg-card rounded-xl p-4 md:p-6">
      <SectionHeading step={step} title="Metode Pembayaran" />

      {/* Empty state */}
      {paymentGroups.length === 0 && (
        <div className="border-border mt-4 flex flex-col items-center gap-2 rounded-xl border border-dashed px-4 py-8 text-center">
          <p className="text-muted-foreground text-sm">
            Tidak ada metode pembayaran tersedia saat ini.
          </p>
        </div>
      )}

      {/* Payment method list */}
      {paymentGroups.length > 0 && (
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
