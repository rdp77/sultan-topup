import type { CheckoutResult } from '@/types/checkout';

export type PaymentType = 'qris' | 'va' | 'other';

/**
 * Derives the payment type from server data. Returns null until payment
 * data is available — callers should treat that as "not ready yet"
 * rather than guessing a default.
 */
export function resolvePaymentType(
  payment: CheckoutResult['payment'] | undefined
): PaymentType | null {
  if (!payment) return null;
  if (payment.method.type === 'qris') return 'qris';
  if (payment.method.type === 'va') return 'va';
  return 'other';
}
