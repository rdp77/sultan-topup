// Response from GET /payment-methods — array of groups, already grouped by API
export type PaymentMethodListResponse = ApiPaymentMethodGroup[]

export interface ApiPaymentMethodGroup {
  group_id: number
  group_name: string
  payment_methods: ApiPaymentMethodItem[]
}

export interface ApiPaymentMethodItem {
  id: number
  payment_gateway: string
  code: string
  name: string
  type: 'va' | 'ewallet' | 'qris' | 'retail'
  fee_type: 'flat' | 'percent'
  fee_value: string // "1000.00"
  min_amount: string | null
  max_amount: string | null
  priority: number
  created_at: string
  updated_at: string
}
