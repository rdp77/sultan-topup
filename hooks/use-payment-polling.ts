import { useEffect, useState } from 'react';
import { CheckoutService } from '@/services';
import type { CheckoutResult } from '@/types/checkout';

const POLL_INTERVAL_MS = 5000;

interface UsePaymentPollingResult {
  data: CheckoutResult | null;
  isLoading: boolean;
  hasFetchError: boolean;
}

/**
 * Polls order/payment status by invoice number every POLL_INTERVAL_MS.
 * Stops polling automatically once payment.status leaves 'pending'.
 * Does NOT trigger navigation — callers should react to the returned
 * `data.payment.status` themselves (see BayarCard's redirect effect).
 */
export function usePaymentPolling(invoice: string | null): UsePaymentPollingResult {
  const [data, setData] = useState<CheckoutResult | null>(null);
  // Lazy initial state avoids a synchronous setState in the "no invoice" branch below.
  const [isLoading, setIsLoading] = useState(() => Boolean(invoice));
  const [hasFetchError, setHasFetchError] = useState(false);

  useEffect(() => {
    if (!invoice) return;

    let cancelled = false;
    let timeoutId: ReturnType<typeof setTimeout>;

    async function poll() {
      try {
        const response = await CheckoutService.getStatus(invoice as string);
        if (cancelled) return;

        // `success` is a plain boolean (not a discriminated union literal),
        // so `data` is still `CheckoutResult | undefined` here even after
        // checking `success` alone — we must also guard on `data` itself.
        if (!response.success || !response.data) {
          setHasFetchError(true);
          return;
        }

        const result = response.data;
        setData(result);
        setHasFetchError(false);

        if (result.payment.status !== 'pending') {
          return; // Terminal state reached — stop polling, let the caller react to `data`.
        }
      } catch {
        if (!cancelled) setHasFetchError(true);
      } finally {
        if (!cancelled) setIsLoading(false);
      }

      if (!cancelled) {
        timeoutId = setTimeout(poll, POLL_INTERVAL_MS);
      }
    }

    poll();

    return () => {
      cancelled = true;
      clearTimeout(timeoutId);
    };
  }, [invoice]);

  return { data, isLoading, hasFetchError };
}
