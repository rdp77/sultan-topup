# Checkout Flow Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Enable functional checkout form with real API submission to `/checkout` endpoint, idempotency key support, and `/bayar` page that works with both API data and URL params fallback.

**Architecture:** Client-side API calls with sessionStorage for transient checkout state. Idempotency handled via UUID in request header. Two-mode data loading for `/bayar` (API first, URL params fallback).

**Tech Stack:** Next.js App Router, TypeScript, sessionStorage, fetch API

---

## Global Constraints

- Payment methods from `/lib/data.ts`: `qris`, `bca`, `bni`, `bri`, `mandiri`, `gopay`, `ovo`, `dana`, `shopeepay`
- Payment types: `qris` (QRIS), `bca|bni|bri|mandiri` (VA), `gopay|ovo|dana|shopeepay` (ewallet)
- Turnstile token required before submit
- SessionStorage keys: `checkout:key:{uuid}`, `checkout:result:{orderId}`

---

## File Structure

| File                                         | Action                                      |
| -------------------------------------------- | ------------------------------------------- |
| `types/checkout.ts`                          | Create - type definitions                   |
| `services/checkout.service.ts`               | Create - API service                        |
| `hooks/use-checkout-form.ts`                 | Modify - real API call with idempotency     |
| `components/checkout-form/order-summary.tsx` | Modify - accept loading/error props         |
| `components/checkout-form/index.tsx`         | Modify - pass loading/error to OrderSummary |
| `components/bayar-card.tsx`                  | Modify - API mode + sessionStorage fallback |

---

## Tasks

### Task 1: Create Type Definitions

**Files:**

- Create: `types/checkout.ts`

**Interfaces:**

Consumes: nothing (root types)

Produces:

- `CheckoutRequest`
- `CheckoutResponse`
- `CheckoutResult`
- `PaymentData` (discriminated union)

---

- [ ] **Step 1: Create types/checkout.ts**

```typescript
// Request body for POST /checkout
export interface CheckoutRequest {
  userId: string
  zoneId: string
  gameId: number
  productId: number
  sku: string
  quantity: number
  email: string
  whatsapp: string
  paymentMethod: string
}

// API Response from /checkout
export interface CheckoutResponse {
  success: boolean
  data?: CheckoutResult
  error?: string
}

// Checkout result with payment details
export interface CheckoutResult {
  orderId: string
  invoice: string
  paymentType: 'qris' | 'va' | 'ewallet'
  paymentData: PaymentData
  amount: number
  fee: number
  total: number
  expiryTime: string
}

// Discriminated union for different payment types
export type PaymentData = QRISPaymentData | VAPaymentData | EWalletPaymentData

export interface QRISPaymentData {
  type: 'qris'
  qrCode: string
  qrString: string
}

export interface VAPaymentData {
  type: 'va'
  vaNumber: string
  bank: string
}

export interface EWalletPaymentData {
  type: 'ewallet'
  deepLink: string
  paymentUrl: string
}
```

- [ ] **Step 2: Run TypeScript check**

Run: `npx tsc --noEmit --pretty 2>&1 | head -20`
Expected: No errors in types/checkout.ts

- [ ] **Step 3: Commit**

```bash
git add types/checkout.ts
git commit -m "feat: add checkout type definitions"
```

---

### Task 2: Create Checkout Service

**Files:**

- Create: `services/checkout.service.ts`

**Interfaces:**

Consumes:

- `CheckoutRequest` from `types/checkout.ts`
- `apiFetch` from `@/lib/api-client`

Produces:

- `CheckoutService.create(request, idempotencyKey)`
- `CheckoutService.getStatus(orderId)`

---

- [ ] **Step 1: Create services/checkout.service.ts**

```typescript
import { apiFetch, ApiError } from '@/lib/api-client'
import type { CheckoutRequest, CheckoutResponse, CheckoutResult } from '@/types/checkout'

export const CheckoutService = {
  /**
   * Create a new checkout order.
   * Sends idempotency key in header to prevent duplicate orders.
   */
  async create(request: CheckoutRequest, idempotencyKey: string): Promise<CheckoutResponse> {
    try {
      const response = await apiFetch<CheckoutResponse>('/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Idempotency-Key': idempotencyKey,
        },
        body: JSON.stringify(request),
      })
      return response
    } catch (error) {
      if (error instanceof ApiError && error.status === 409) {
        // Idempotency conflict - return special response
        return { success: false, error: 'Duplicate request detected. Please try again.' }
      }
      throw error
    }
  },

  /**
   * Get checkout order status by orderId.
   * Used for refreshing payment data in /bayar page.
   */
  async getStatus(orderId: string): Promise<CheckoutResponse> {
    return apiFetch<CheckoutResponse>(`/checkout/${orderId}`)
  },
}
```

- [ ] **Step 2: Run TypeScript check**

Run: `npx tsc --noEmit --pretty 2>&1 | head -20`
Expected: No errors in services/checkout.service.ts

- [ ] **Step 3: Commit**

```bash
git add services/checkout.service.ts
git commit -m "feat: add checkout service with idempotency support"
```

---

### Task 3: Update use-checkout-form Hook

**Files:**

- Modify: `hooks/use-checkout-form.ts`

**Interfaces:**

Consumes:

- `CheckoutService` from `@/services/checkout.service.ts`
- `DenominationView` with `sku` field from `@/lib/product-utils`
- `formConfig` with `needsZone` from `getGameFormConfig`

Produces:

- `checkoutLoading: boolean`
- `checkoutError: string | null`
- Modified `handleSubmit()` that calls real API

---

- [ ] **Step 1: Read current hook implementation**

Already read from context. Full rewrite needed.

- [ ] **Step 2: Update hooks/use-checkout-form.ts**

Replace the `handleSubmit` function with real API call. Add new state variables.

```typescript
// Add to existing imports
import { CheckoutService } from '@/services/checkout.service'
import type { CheckoutResult } from '@/types/checkout'

// Add to state declarations (around line 28-30)
const [checkoutLoading, setCheckoutLoading] = useState(false)
const [checkoutError, setCheckoutError] = useState<string | null>(null)

// Update handleSubmit function (around line 75-104)
function handleSubmit() {
  setTouched(true)
  if (!canClick || submitting || !selectedDenom || !selectedMethod) return

  // Check for pending submission
  const pendingKey = sessionStorage.getItem('checkout:pending:key')
  if (pendingKey) {
    setCheckoutError('Pesanan masih diproses. Tunggu sebentar atau cek status pesanan.')
    return
  }

  setSubmitting(true)
  setCheckoutLoading(true)
  setCheckoutError(null)

  // Generate idempotency key
  const idempotencyKey = crypto.randomUUID()

  // Store pending key with timestamp
  sessionStorage.setItem('checkout:pending:key', idempotencyKey)
  sessionStorage.setItem(`checkout:pending:${idempotencyKey}`, Date.now().toString())

  // Build request
  const request = {
    userId: userId.trim(),
    zoneId: zoneId.trim(),
    gameId: game.id,
    productId: selectedDenom.id,
    sku: selectedDenom.sku,
    quantity,
    email: email.trim(),
    whatsapp: whatsapp.replace(/\D/g, ''),
    paymentMethod: selectedMethod.id,
  }

  CheckoutService.create(request, idempotencyKey)
    .then((response) => {
      if (response.success && response.data) {
        // Store result for /bayar page
        const result = response.data as CheckoutResult
        sessionStorage.setItem(`checkout:result:${result.orderId}`, JSON.stringify(result))

        // Track event
        posthog.capture('checkout_submitted', {
          game_name: gameName,
          game_slug: gameSlug,
          product_amount: selectedDenom.amount,
          product_price: selectedDenom.price,
          quantity,
          sub_price: subPrice,
          fee,
          total: subPrice + fee,
          payment_method_id: selectedMethod.id,
          payment_method_name: selectedMethod.name,
          invoice_id: result.invoice,
          order_id: result.orderId,
        })

        // Clear pending state
        sessionStorage.removeItem('checkout:pending:key')

        // Redirect to /bayar with order data
        const params = new URLSearchParams({
          orderId: result.orderId,
          invoice: result.invoice,
          game: gameName,
          product: `${selectedDenom.amount} × ${quantity}`,
          price: String(result.amount),
          fee: String(result.fee),
          method: selectedMethod.name,
          uid: formConfig.needsZone ? `${userId} (${zoneId})` : userId,
          payment: selectedMethod.id,
          paymentType: result.paymentType,
        })
        router.push(`/bayar?${params.toString()}`)
      } else {
        setCheckoutError(response.error ?? 'Terjadi kesalahan. Coba lagi.')
        setSubmitting(false)
        setCheckoutLoading(false)
        sessionStorage.removeItem('checkout:pending:key')
      }
    })
    .catch((error) => {
      console.error('Checkout error:', error)
      setCheckoutError('Gagal menghubungi server. Coba lagi.')
      setSubmitting(false)
      setCheckoutLoading(false)
      sessionStorage.removeItem('checkout:pending:key')
    })
}

// Add to return object
return {
  // ... existing returns
  checkoutLoading,
  checkoutError,
  setCheckoutError,
}
```

- [ ] **Step 3: Run TypeScript check**

Run: `npx tsc --noEmit --pretty 2>&1 | grep -E "(checkout|use-checkout)" | head -20`
Expected: No errors related to use-checkout-form.ts

- [ ] **Step 4: Commit**

```bash
git add hooks/use-checkout-form.ts
git commit -m "feat: integrate real checkout API with idempotency key"
```

---

### Task 4: Update OrderSummary Component

**Files:**

- Modify: `components/checkout-form/order-summary.tsx`

**Interfaces:**

Consumes:

- `checkoutLoading: boolean` (new prop)
- `checkoutError: string | null` (new prop)

Produces: Updated UI with error display and loading state

---

- [ ] **Step 1: Read current OrderSummary implementation**

Already read from context.

- [ ] **Step 2: Update OrderSummaryProps interface and component**

Add new props and update button/display logic:

```typescript
// Add to props interface (after onSubmit)
interface OrderSummaryProps {
  // ... existing props
  checkoutLoading?: boolean      // NEW
  checkoutError?: string | null  // NEW
}

// Add to component props (in function signature)
export function OrderSummary({
  // ... existing props
  checkoutLoading = false,
  checkoutError = null,
}: Readonly<OrderSummaryProps>) {

// Update button disabled and content (around line 84-97)
<button
  type="button"
  onClick={onSubmit}
  disabled={submitting || checkoutLoading || !canClick}
  className={cn(
    'mt-3 flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground transition-colors duration-200',
    canClick && !submitting && !checkoutLoading ? 'press hover:bg-primary/90' : 'opacity-60',
  )}
>
  {submitting || checkoutLoading ? (
    <>
      <Loader2 className="size-4 animate-spin" aria-hidden="true" />
      Memproses...
    </>
  ) : (
    'Lanjutkan Pembayaran'
  )}
</button>

// Update error display (after touched check, around line 99-103)
{touched && !allValid && !checkoutLoading && (
  <div className="mt-2 rounded-lg bg-destructive/10 p-3 text-center text-xs text-destructive">
    {submitError}
  </div>
)}
{checkoutError && (
  <div className="mt-2 rounded-lg bg-destructive/10 p-3 text-center text-xs text-destructive">
    {checkoutError}
  </div>
)}
```

- [ ] **Step 3: Run TypeScript check**

Run: `npx tsc --noEmit --pretty 2>&1 | grep -E "order-summary" | head -10`
Expected: No errors

- [ ] **Step 4: Commit**

```bash
git add components/checkout-form/order-summary.tsx
git commit -m "feat: add checkout loading and error display to OrderSummary"
```

---

### Task 5: Update CheckoutForm Index

**Files:**

- Modify: `components/checkout-form/index.tsx`

**Interfaces:**

Consumes:

- `checkoutLoading` from `useCheckoutForm`
- `checkoutError` from `useCheckoutForm`

Produces: Pass new props to OrderSummary

---

- [ ] **Step 1: Read current checkout-form/index.tsx**

```tsx
// Current OrderSummary usage (around line 64-78)
<OrderSummary
  selectedDenom={form.selectedDenom}
  selectedMethod={form.selectedMethod}
  subPrice={form.subPrice}
  fee={form.fee}
  submitting={form.submitting}
  canClick={form.canClick}
  touched={form.touched}
  allValid={form.allValid}
  submitError={form.getSubmitError()}
  onTurnstileVerify={form.setTurnstileToken}
  onTurnstileExpireOrError={() => form.setTurnstileToken(null)}
  turnstileToken={form.turnstileToken}
  onSubmit={form.handleSubmit}
/>
```

- [ ] **Step 2: Add new props to OrderSummary**

```tsx
<OrderSummary
  selectedDenom={form.selectedDenom}
  selectedMethod={form.selectedMethod}
  subPrice={form.subPrice}
  fee={form.fee}
  submitting={form.submitting}
  canClick={form.canClick}
  touched={form.touched}
  allValid={form.allValid}
  submitError={form.getSubmitError()}
  onTurnstileVerify={form.setTurnstileToken}
  onTurnstileExpireOrError={() => form.setTurnstileToken(null)}
  turnstileToken={form.turnstileToken}
  onSubmit={form.handleSubmit}
  checkoutLoading={form.checkoutLoading}
  checkoutError={form.checkoutError}
/>
```

- [ ] **Step 3: Run TypeScript check**

Run: `npx tsc --noEmit --pretty 2>&1 | grep -E "checkout-form/index" | head -10`
Expected: No errors

- [ ] **Step 4: Commit**

```bash
git add components/checkout-form/index.tsx
git commit -m "feat: pass checkout loading and error props to OrderSummary"
```

---

### Task 6: Update BayarCard Component

**Files:**

- Modify: `components/bayar-card.tsx`

**Interfaces:**

Consumes:

- `CheckoutService` from `@/services/checkout.service.ts`
- `CheckoutResult` from `types/checkout.ts`
- URL params: `orderId`, `invoice`, `paymentType`
- sessionStorage key: `checkout:result:{orderId}`

Produces: Real payment data display with sessionStorage/API fallback

---

- [ ] **Step 1: Read current bayar-card.tsx**

Already read from context. Major update needed.

- [ ] **Step 2: Update bayar-card.tsx with dual-mode data loading**

Add imports and update state/effect:

```typescript
// Add to imports
import { CheckoutService } from '@/services/checkout.service'
import type {
  CheckoutResult,
  QRISPaymentData,
  VAPaymentData,
  EWalletPaymentData,
} from '@/types/checkout'

// Add new state (after line 133)
const [paymentData, setPaymentData] = useState<CheckoutResult | null>(null)
const [loadingPaymentData, setLoadingPaymentData] = useState(false)

// Update useEffect for data fetching (around line 151)
useEffect(() => {
  const orderId = params.get('orderId')
  if (!orderId) return

  setLoadingPaymentData(true)

  // Try sessionStorage first (instant)
  const stored = sessionStorage.getItem(`checkout:result:${orderId}`)
  if (stored) {
    try {
      setPaymentData(JSON.parse(stored))
    } catch {
      // Invalid JSON, fetch from API
    }
  }

  // Always try to fetch fresh data from API
  CheckoutService.getStatus(orderId)
    .then((response) => {
      if (response.success && response.data) {
        setPaymentData(response.data)
        // Update sessionStorage for future use
        sessionStorage.setItem(`checkout:result:${orderId}`, JSON.stringify(response.data))
      }
    })
    .catch(() => {
      // Silently fail, use sessionStorage or URL params fallback
    })
    .finally(() => setLoadingPaymentData(false))
}, [])

// Update payment data display logic (around line 145-149)
// Replace hardcoded dummyVa with real data from paymentData

const paymentType = params.get('paymentType') ?? paymentData?.paymentType ?? 'qris'
const isQRIS = paymentType === 'qris' || paymentData?.paymentData.type === 'qris'
const isVA =
  ['bca', 'bni', 'bri', 'mandiri'].includes(paymentId) || paymentData?.paymentData.type === 'va'

// Update VA display (around line 147-149)
const dummyVa = isVA
  ? paymentData?.paymentData.type === 'va'
    ? (paymentData.paymentData as VAPaymentData).vaNumber
    : `${paymentId === 'bca' ? '7521' : paymentId === 'bni' ? '9882' : paymentId === 'bri' ? '1500' : '8866'}-${Date.now().toString().slice(-8)}`
  : ''

// Update QRIS display - use real qrCode if available
const qrAmount = paymentData?.total ?? total
```

Update QrPlaceholder to use real data if available:

```typescript
function QrPlaceholder({ amount, qrCode }: { amount: number; qrCode?: string }) {
  if (qrCode) {
    return (
      <div className="mx-auto flex size-48 items-center justify-center rounded-xl border-2 border-border bg-white p-4 overflow-hidden">
        <img src={qrCode} alt={`QRIS Rp ${amount.toLocaleString('id-ID')}`} className="size-full object-contain" />
      </div>
    )
  }
  // ... existing dummy QR code
}

// In render (around line 201):
{isQRIS && <QrPlaceholder amount={qrAmount} qrCode={paymentData?.paymentData.type === 'qris' ? (paymentData.paymentData as QRISPaymentData).qrCode : undefined} />}
```

Add loading state for payment data:

```typescript
// Add after timer section (around line 246)
{loadingPaymentData && (
  <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
    <Loader2 className="size-3.5 animate-spin" aria-hidden="true" />
    Memuat data pembayaran...
  </div>
)}
```

- [ ] **Step 3: Run TypeScript check**

Run: `npx tsc --noEmit --pretty 2>&1 | grep -E "bayar-card" | head -20`
Expected: No errors

- [ ] **Step 4: Commit**

```bash
git add components/bayar-card.tsx
git commit -m "feat: add API mode with sessionStorage fallback to BayarCard"
```

---

## Self-Review Checklist

- [ ] All spec requirements covered by tasks
- [ ] No placeholders (TBD, TODO, implement later)
- [ ] Type names consistent across tasks
- [ ] Each task ends with commit
- [ ] File paths exact and verified to exist
- [ ] API endpoints match spec (/checkout, /checkout/{orderId})

## Spec Coverage

| Spec Section               | Task   |
| -------------------------- | ------ |
| Type definitions           | Task 1 |
| API Service                | Task 2 |
| useCheckoutForm updates    | Task 3 |
| Idempotency client-side    | Task 3 |
| OrderSummary error display | Task 4 |
| Submit button loading      | Task 4 |
| CheckoutForm props         | Task 5 |
| BayarCard dual-mode        | Task 6 |
| sessionStorage fallback    | Task 6 |

---

## Execution Options

**Plan complete and saved to `docs/superpowers/plans/2026-07-20-checkout-flow.md`. Two execution options:**

**1. Subagent-Driven (recommended)** - I dispatch a fresh subagent per task, review between tasks, fast iteration

**2. Inline Execution** - Execute tasks in this session using executing-plans, batch execution with checkpoints

**Which approach?**
