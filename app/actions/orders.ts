'use server';

import { OrderService } from '@/services';
import type { OrderLookupResponse } from '@/types/order';

/**
 * Look up an order by invoice + contact (GET /orders/lookup).
 * NOTE: /lookup now renders results server-side via SearchParams, so this
 * Server Action is unused by the UI but kept as a programmatic entry point.
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