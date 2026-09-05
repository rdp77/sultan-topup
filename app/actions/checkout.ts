'use server';

import { PlayerService, CheckoutService } from '@/services';
import { ApiError } from '@/lib/api-client';
import { safeParseCheckoutRequest } from '@/lib/order-lookup-schema';
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
  const parsed = safeParseCheckoutRequest(request);
  if (!parsed.success) {
    return { success: false, error: parsed.error };
  }
  try {
    return await CheckoutService.create(parsed.data, idempotencyKey);
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
  const playerId = typeof request?.playerId === 'string' ? request.playerId.trim() : '';
  const zoneId = typeof request?.zoneId === 'string' ? request.zoneId.trim() : '';
  const gameSlug = typeof request?.gameSlug === 'string' ? request.gameSlug.trim() : '';

  if (playerId.length < 3 || playerId.length > 64 || gameSlug.length < 1 || gameSlug.length > 64) {
    return { ok: false, status: 400, message: 'Data validasi akun tidak valid.' };
  }
  if (zoneId.length > 32) {
    return { ok: false, status: 400, message: 'Zone ID tidak valid.' };
  }
  try {
    return { ok: true, data: await PlayerService.validate({ playerId, zoneId, gameSlug }) };
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
 * NOTE: the payment page now polls via the GET /api/orders/[invoice]
 * Route Handler instead (lighter weight, HTTP-cacheable). This action is
 * kept as a synchronous server-side entry point if needed elsewhere.
 */
export async function getOrderStatusAction(invoice: string): Promise<CheckoutServiceResult> {
  try {
    return await CheckoutService.getStatus(invoice);
  } catch (error) {
    console.error('[getOrderStatusAction]', error);
    return { success: false, error: 'Gagal memuat status pesanan.' };
  }
}