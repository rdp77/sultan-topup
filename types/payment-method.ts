// Response wrapper from GET /payment-methods
export interface PaymentMethodListResponse {
  data: PaymentMethodData[]
}

// Individual payment method from API
export interface PaymentMethodData {
  id: string
  name: string
  fee_type: 'flat' | 'percent'
  fee: number
  group: string
  is_active: boolean
}

// Grouped payment methods for UI rendering
export interface PaymentMethodGroup {
  group: string
  methods: PaymentMethodData[]
}
