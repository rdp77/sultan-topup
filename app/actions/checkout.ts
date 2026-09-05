'use server';

import { PlayerService, CheckoutService } from '@/services';
import { ApiError } from '@/lib/api-client';
import type { CheckoutRequest, CheckoutServiceResult } from '@/types/checkout';
import type { PlayerValidationRequest, PlayerValidationResponse } from '@/types/player-validation';

/**
 * Create a new checkout order (POST /checkout).
 * Server Action — mutations always run on the server.
 */
export async function createCheckoutAction(
  request: CheckoutRequest,
  idempotencyKey: string
): Promise<CheckoutServiceResult> {
  try {
    return await CheckoutService.create(request, idempotencyKey);
  } catch (error) {
    console.error('[createCheckoutAction]', error);
    return { success: false, error: 'Gagal menghubungi server. Coba lagi.' };
  }
}

export type ValidatePlayerResult =
  | { ok: true; data: PlayerValidationResponse }
  | { ok: false; status: number; message: string };

/**
 * Validate game account (POST /validate-account).
 * Serialized result so client never receives a raw thrown error.
 */
export async function validatePlayerAction(
  request: PlayerValidationRequest
): Promise<ValidatePlayerResult> {
  try {
    return { ok: true, data: await PlayerService.validate(request) };
  } catch (error) {
    const status = error instanceof ApiError ? error.status : 0;
    const message =
      error instanceof Error ? error.message : 'Gagal menghubungi server game';
    console.error('[validatePlayerAction]', message, `(status: ${status})`, error);
    return { ok: false, status, message };
  }
}

/**
 * Fetch order/payment status by invoice (GET /orders/{invoice}).
 * User-triggered read (payment polling) — routed through a Server Action
 * so the client never hits the upstream API directly.
 */
export async function getOrderStatusAction(invoice: string): Promise<CheckoutServiceResult> {
  try {
    return await CheckoutService.getStatus(invoice);
  } catch (error) {
    console.error('[getOrderStatusAction]', error);
    return { success: false, error: 'Gagal memuat status pesanan.' };
  }
}