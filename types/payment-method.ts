// Response from GET /payment-methods — { data: [...] }, already grouped by API
export type PaymentMethodListResponse = {
  data: ApiPaymentMethodGroup[];
};

export interface ApiPaymentMethodGroup {
  group_id: number;
  group_name: string;
  payment_methods: ApiPaymentMethodItem[];
}

export interface ApiPaymentMethodItem {
  id: number;
  payment_gateway: string;
  code: string;
  name: string;
  type: 'va' | 'ewallet' | 'qris' | 'retail';
  fee_type: 'flat' | 'percent' | 'combined';
  fee_flat: string; // "1000.00"
  fee_percentage: string;
  min_amount: string | null;
  max_amount: string | null;
  priority: number;
  created_at: string;
  updated_at: string;
}

export type PaymentGroup = {
  group: string;
  methods: PaymentMethod[];
};

export type PaymentMethod = {
  id: string;
  name: string;
  feeFlatAmount: number;
  feePercentage: number;
  feeType: 'flat' | 'percent' | 'combined';
};
