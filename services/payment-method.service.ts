import { apiFetch } from '@/lib/api-client'
import type { PaymentMethodListResponse } from '@/types/payment-method'

export const PaymentMethodService = {
  /**
   * Fetch all active payment methods, optionally filtered by game_id.
   * Revalidates every 300s (5 min) — payment method configs rarely change.
   */
  list(gameId?: number): Promise<PaymentMethodListResponse> {
    const params = gameId ? `?game_id=${gameId}` : ''
    return apiFetch<PaymentMethodListResponse>(`/payment-methods${params}`, {
      next: { revalidate: 300 },
    })
  },
}
