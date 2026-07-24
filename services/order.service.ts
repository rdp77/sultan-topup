import { apiFetch } from '@/lib/api-client'
import type { OrderListApiResponse, OrderLookupResponse } from '@/types/order'

export const OrderService = {
  /**
   * Lookup order by invoice + contact (email or phone).
   * GET /orders/lookup?invoice=...&email=... (or &phone=...)
   */
  lookup(invoice: string, contact: string): Promise<OrderLookupResponse> {
    const isEmail = contact.includes('@')
    const params = new URLSearchParams({ invoice })
    if (isEmail) params.set('email', contact)
    else params.set('phone', contact)
    return apiFetch<OrderLookupResponse>(`/orders/lookup?${params}`)
  },

  /**
   * List all transactions. API returns { data: [...] } — no server pagination.
   * Revalidate every 30s.
   */
  list(): Promise<OrderListApiResponse> {
    return apiFetch<OrderListApiResponse>('/orders', {
      next: { revalidate: 30 },
    })
  },
}
