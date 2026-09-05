import { NextResponse } from 'next/server';
import { CheckoutService } from '@/services';
import { ApiError } from '@/lib/api-client';
import type { CheckoutServiceResult } from '@/types/checkout';

/**
 * GET /api/orders/{invoice}
 * Lightweight polling endpoint for the payment page. Runs server-side so
 * the upstream API is never called directly from the browser (its
 * User-Agent allows whitelisting in Cloudflare).
 */
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ invoice: string }> }
) {
  const { invoice } = await params;

  if (!invoice) {
    return NextResponse.json(
      { success: false, error: 'Invoice is required' },
      { status: 400 }
    );
  }

  try {
    const result = await CheckoutService.getStatus(invoice);
    if (!result.success) {
      return NextResponse.json(result, { status: 502 });
    }
    return NextResponse.json(result);
  } catch (error) {
    const status = error instanceof ApiError ? error.status : 0;
    // Not found vs upstream failure — 404 lets the client stop early.
    if (status === 404) {
      return NextResponse.json(
        { success: false, error: 'Order not found' } satisfies CheckoutServiceResult,
        { status: 404 }
      );
    }
    console.error(`[GET /api/orders/${invoice}]`, error);
    return NextResponse.json(
      { success: false, error: 'Gagal memuat status pesanan.' } satisfies CheckoutServiceResult,
      { status: 502 }
    );
  }
}