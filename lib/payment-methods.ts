import type { PaymentGroup, PaymentMethodListResponse } from '@/types/payment-method';

type ApiGroup = PaymentMethodListResponse[number];
type ApiMethod = ApiGroup['payment_methods'][number];

function mapMethod(m: ApiMethod): PaymentGroup['methods'][number] {
  return {
    id: m.code,
    name: m.name,
    feeType: m.fee_type,
    feeFlatAmount: Math.round(Number.parseFloat(m.fee_flat)),
    feePercentage: m.fee_percentage ? Number.parseFloat(m.fee_percentage) : 0,
  };
}

/**
 * Maps the API payment-method groups (fetched on the server) to the local
 * `PaymentGroup` view model passed down to client components.
 */
export function mapPaymentGroups(response: PaymentMethodListResponse): PaymentGroup[] {
  if (!response || response.length === 0) return [];
  return response.map((g) => ({
    group: g.group_name,
    methods: g.payment_methods.map(mapMethod),
  }));
}