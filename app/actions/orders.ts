'use server';

import { OrderService } from '@/services';
import type { OrderLookupResponse } from '@/types/order';

/**
 * Look up an order by invoice + contact (GET /orders/lookup).
 * User-triggered read via form submit — routed through a Server Action.
 * Returns null when the order is not found or the API fails.
 */
export async function lookupOrderAction(
  invoice: string,
  contact: string
): Promise<OrderLookupResponse | null> {
  try {
    return await OrderService.lookup(invoice, contact);
  } catch (error) {
    console.error('[lookupOrderAction]', error);
    return null;
  }
}