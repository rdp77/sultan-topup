'use client';

import { useState } from 'react';
import posthog from 'posthog-js';
import { Check, ChevronDown, ChevronUp } from 'lucide-react';
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

/** Max methods shown per payment group until the "Lihat Semua" toggle appears. */
const COLLAPSED_LIMIT = 4;

export function PaymentMethodStep({
  step,
  selected,
  onSelect,
  selectedDenom,
  paymentGroups,
}: Readonly<PaymentMethodStepProps>) {
  // Payment groups the user has explicitly expanded to reveal every method.
  const [expandedGroups, setExpandedGroups] = useState<ReadonlySet<string>>(() => new Set());

  const toggleGroup = (groupId: string, currentlyExpanded: boolean) => {
    const next = new Set(expandedGroups);
    if (currentlyExpanded) {
      next.delete(groupId);
    } else {
      next.add(groupId);
    }
    setExpandedGroups(next);
  };

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
          {paymentGroups.map((group) => {
            const hasMore = group.methods.length > COLLAPSED_LIMIT;
            // If the currently selected method would be hidden, keep the group open.
            const selectedIndex = selected
              ? group.methods.findIndex((m) => m.id === selected.id)
              : -1;
            const forceExpanded = hasMore && selectedIndex >= COLLAPSED_LIMIT;
            const expanded = forceExpanded || expandedGroups.has(group.group);
            const visibleMethods =
              hasMore && !expanded ? group.methods.slice(0, COLLAPSED_LIMIT) : group.methods;
            const hiddenCount = group.methods.length - visibleMethods.length;
            const gridId = `payment-method-grid-${
              group.group ? group.group.toLowerCase().replace(/[^a-z0-9]+/g, '-') : 'sin-group'
            }`;

            return (
              <div key={group.group}>
                <h3 className="text-muted-foreground mb-2 text-xs font-semibold tracking-wide uppercase">
                  {group.group}
                </h3>
                <div id={gridId} className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {visibleMethods.map((m) => {
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
                              <Check
                                className="text-primary-foreground size-3"
                                aria-hidden="true"
                              />
                            </span>
                          )}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {hasMore && (
                  <button
                    type="button"
                    onClick={() => toggleGroup(group.group, expanded)}
                    aria-expanded={expanded}
                    aria-controls={gridId}
                    className="text-primary hover:bg-primary/5 hover:text-foreground mt-2.5 inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors duration-200 active:translate-y-px"
                  >
                    {expanded ? 'Lihat Lebih Sedikit' : `Lihat Semua (+${hiddenCount})`}
                    {expanded ? (
                      <ChevronUp className="size-3.5" aria-hidden="true" />
                    ) : (
                      <ChevronDown className="size-3.5" aria-hidden="true" />
                    )}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
