import { apiFetch, ApiError } from '@/lib/api-client';
import type {
  CheckoutRequest,
  CheckoutResponse,
  CheckoutServiceResult,
  CheckoutResult,
} from '@/types/checkout';

function toApiPayload(request: CheckoutRequest) {
  console.log('toApiPayload', request);
  return {
    player_id: request.playerId,
    zone_id: request.zoneId,
    game_id: request.gameId,
    product_id: request.productId,
    sku: request.sku,
    quantity: request.quantity,
    email: request.email,
    whatsapp: request.whatsapp,
    payment_method: request.paymentMethod,
  };
}

export const CheckoutService = {
  /**
   * Create a new checkout order.
   * Sends idempotency key in header to prevent duplicate orders.
   */
  async create(request: CheckoutRequest, idempotencyKey: string): Promise<CheckoutServiceResult> {
    try {
      const data = await apiFetch<CheckoutResult>('/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Idempotency-Key': idempotencyKey,
        },
        body: JSON.stringify(toApiPayload(request)),
      });
      return { success: true, data };
    } catch (error) {
      if (error instanceof ApiError && error.status === 409) {
        return { success: false, error: 'Duplicate request detected. Please try again.' };
      }
      throw error;
    }
  },

  /**
   * Get checkout order status by orderId.
   * Used for refreshing payment data in /bayar page.
   */
  async getStatus(orderId: string): Promise<CheckoutResponse> {
    return apiFetch<CheckoutResponse>(`/checkout/${orderId}`);
  },
};
