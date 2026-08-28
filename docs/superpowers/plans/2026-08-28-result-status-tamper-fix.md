# Result Page Status Tamper Fix Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Stop `/result` from trusting the client-supplied `?status=` URL param — the displayed order status must come from the server, not from a value the user can edit in the address bar.

**Architecture:** `ResultCard` (`components/result-card.tsx`) currently reads `status` straight off `useSearchParams()` and casts it to `OrderStatus` with no validation, then also falls back to a 2.5s `setTimeout(() => setStatus('success'))` demo simulation when no `status` param is present. `PayCard` (`components/pay-card.tsx`) already solved the equivalent problem for every other field by fetching authoritative order data from the backend via `usePaymentPolling(invoice)` (which wraps `CheckoutService.getStatus`) instead of trusting the URL. `ResultCard` will adopt the same hook: it keeps reading `invoice` from the URL (not sensitive — it's an opaque lookup key, and this matches `PayCard`'s existing trust boundary), fetches the order/payment by invoice, and derives `status` only from `data.payment.status` returned by the server. The `status` URL param is no longer read at all. Game/product/price/fee/method/uid fields are explicitly out of scope for this fix (per requester) and are left reading from the URL as before.

**Tech Stack:** Next.js App Router, React (client component), existing `usePaymentPolling` hook, existing `CheckoutService`.

**Spec:** None — ad hoc bug report in `plan.md` (repo root, will be deleted once this plan supersedes it).

## Global Constraints

- Do not touch game/product/price/fee/method/uid handling in `ResultCard` — out of scope per requester.
- Do not introduce a test framework — none exists in this repo (no vitest/jest config, no `*.test.*` files); verify via `npm run lint`, `tsc`, and manual `npm run dev` check instead.
- Reuse `usePaymentPolling` / `CheckoutService.getStatus` — do not write a second fetch-by-invoice code path.
- Match the existing `STATUS_MAP ?? 'failed'` fallback convention (`components/order-list.tsx`, `components/order-lookup.tsx`, `components/transaction-table.tsx`) for unrecognized/unexpected status strings from the backend.

---

### Task 1: Derive `ResultCard` status from the server instead of the URL

**Files:**
- Modify: `components/result-card.tsx`

**Interfaces:**
- Consumes: `usePaymentPolling(invoice: string | null): { data: CheckoutResult | null; isLoading: boolean; hasFetchError: boolean }` from `@/hooks/use-payment-polling` (existing, unchanged). `CheckoutResult.payment.status: string` from `@/types/checkout` (existing, unchanged).
- Produces: no new exports — `ResultCard` keeps its current signature (`export function ResultCard()`), used by `app/result/page.tsx` (unchanged).

- [ ] **Step 1: Add the `usePaymentPolling` import**

In `components/result-card.tsx`, add alongside the existing imports:

```typescript
import { usePaymentPolling } from '@/hooks/use-payment-polling';
```

- [ ] **Step 2: Remove the client-trusted status param and the demo simulation**

Delete this block:

```typescript
  const statusParam = params.get('status') as OrderStatus | null;
```

and this block:

```typescript
  // Simulate payment confirmation: processing -> success after a short delay
  useEffect(() => {
    if (statusParam) {
      queueMicrotask(() => setStatus(statusParam));
      return;
    }
    const t = setTimeout(() => setStatus('success'), 2500);
    return () => clearTimeout(t);
  }, [statusParam]);
```

The URL's `status` value must never reach `setStatus` again.

- [ ] **Step 3: Fetch the authoritative status by invoice and replace the removed effect**

Right after the `invoice` line (`const invoice = params.get('invoice') ?? 'INV-20260702-8F3K';`), add:

```typescript
  const { data } = usePaymentPolling(invoice);
```

Then, where the deleted effect used to be, add the replacement effect that derives status only from the server response:

```typescript
  // Status comes only from the server-reported payment status — the `status`
  // URL param is intentionally never read, so it can't be spoofed by editing
  // the address bar.
  useEffect(() => {
    const serverStatus = data?.payment.status;
    if (!serverStatus || serverStatus === 'pending') return;
    const isKnownStatus = (Object.keys(statusConfig) as OrderStatus[]).includes(
      serverStatus as OrderStatus
    );
    setStatus(isKnownStatus ? (serverStatus as OrderStatus) : 'failed');
  }, [data]);
```

This mirrors the `STATUS_MAP[item.status] ?? 'failed'` fallback convention already used in `components/order-list.tsx`, `components/order-lookup.tsx`, and `components/transaction-table.tsx` — an unrecognized backend value degrades to `'failed'` instead of crashing `statusConfig[status]` lookups.

- [ ] **Step 4: Type-check and lint**

Run: `npm run lint`
Expected: no new errors in `components/result-card.tsx`.

Run: `npx tsc --noEmit`
Expected: no new type errors (confirms `usePaymentPolling`'s return type and `CheckoutResult.payment.status` line up with the code above).

- [ ] **Step 5: Manual verification**

Run: `npm run dev`, then:
1. Visit `/result?invoice=<a real pending invoice>&status=success` — confirm the page shows the *actual* server status (e.g. still "Sedang Diproses"), not `success`, proving the URL param is ignored.
2. Visit `/result?invoice=<a real completed invoice>` (no `status` param) — confirm the correct terminal status renders once the fetch resolves.
3. Confirm `posthog.capture('order_result_viewed', ...)` still fires exactly once, after a terminal status is reached (existing effect at line ~76, unchanged).

- [ ] **Step 6: Delete the superseded `plan.md`**

Run: `rm plan.md` (repo root) — its contents are now captured by this plan document.

- [ ] **Step 7: Commit**

```
git add components/result-card.tsx docs/superpowers/plans/2026-08-28-result-status-tamper-fix.md
git rm plan.md
git commit -m "fix(result): derive order status from server, not URL param"
```
