# Checkout Flow dengan Idempotency

**Tanggal:** 2026-07-20
**Status:** Approved

## Ringkasan

Mengubah checkout form dari dummy submit menjadi functional API call ke backend `/checkout`, dengan dukungan idempotency key di header, error handling, dan `/bayar` page yang bisa bekerja dengan data dari API maupun URL params fallback.

---

## 1. Tipe Data Baru (`/types/checkout.ts`)

```typescript
// Request
interface CheckoutRequest {
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

// Response
interface CheckoutResponse {
  success: boolean
  data?: CheckoutResult
  error?: string
}

interface CheckoutResult {
  orderId: string
  invoice: string
  paymentType: 'qris' | 'va' | 'ewallet'
  paymentData: PaymentData
  amount: number
  fee: number
  total: number
  expiryTime: string
}

type PaymentData =
  | { type: 'qris'; qrCode: string; qrString: string }
  | { type: 'va'; vaNumber: string; bank: string }
  | { type: 'ewallet'; deepLink: string; paymentUrl: string }
```

---

## 2. API Service (`/services/checkout.service.ts`)

- Method `create(request: CheckoutRequest, idempotencyKey: string)` → POST ke `/checkout` dengan header `Idempotency-Key`
- Method `getStatus(orderId: string)` → GET `/checkout/{orderId}` untuk fetch status

Struktur mengikuti `services/game.service.ts` dan `services/player.service.ts`:

- Import `apiFetch` dari `@/lib/api-client`
- Typed generics
- No unstable_cache (client-side call)

---

## 3. Hook `useCheckoutForm` Updates

**State baru:**

- `checkoutLoading: boolean` — loading state saat submit API
- `checkoutError: string | null` — error dari API

**Fungsi `handleSubmit`:**

1. Generate `crypto.randomUUID()` sebagai idempotency key
2. Simpan key di sessionStorage dengan format `checkout:key:{key}` dan timestamp
3. Call `CheckoutService.create(request, idempotencyKey)`
4. On success: simpan `CheckoutResult` ke sessionStorage (`checkout:result:{orderId}`), redirect ke `/bayar?orderId=...&invoice=...`
5. On error (non-409): set `checkoutError`
6. On 409 (duplicate idempotency): generate key baru dan retry (maks 1x)

---

## 4. Idempotency

**Client-side flow:**

1. Sebelum submit, check sessionStorage untuk pending key (timestamp < 2 menit sejak generate)
2. Jika ada pending: prompt user "Pesanan masih diproses, cek status?" → link ke `/bayar`
3. Jika tidak: generate key baru, simpan, proceed

**SessionStorage keys:**

- `checkout:key:{uuid}` → timestamp of submission
- `checkout:result:{orderId}` → `CheckoutResult` for `/bayar` fetch

**Server expectation:**

- Accept header `Idempotency-Key: <uuid>`
- Return 409 jika key sudah digunakan dalam 15 menit terakhir
- Return cached result untuk duplicate request

---

## 5. `/bayar` Page Enhancement

**Dua mode data:**

1. **API mode** (prioritas): jika URL params punya `orderId`, fetch `CheckoutService.getStatus(orderId)` atau baca dari sessionStorage
2. **URL params mode** (fallback): parse dari URL params seperti yang dilakukan saat ini

**Logic:**

```typescript
const orderId = params.get('orderId')
const [paymentData, setPaymentData] = useState<CheckoutResult | null>(null)
const [loading, setLoading] = useState(!!orderId)

useEffect(() => {
  if (!orderId) return

  // Try sessionStorage first (instant)
  const stored = sessionStorage.getItem(`checkout:result:${orderId}`)
  if (stored) {
    setPaymentData(JSON.parse(stored))
    setLoading(false)
    return
  }

  // Fallback: fetch from API
  CheckoutService.getStatus(orderId)
    .then((res) => {
      if (res.success) setPaymentData(res.data!)
    })
    .catch(() => {})
    .finally(() => setLoading(false))
}, [orderId])
```

**Render:**

- Jika `paymentData` tersedia: render QR / VA / deepLink dari data asli
- Jika URL params tanpa paymentData: render existing dummy UI (fallback)
- Loading state: skeleton yang sudah ada

---

## 6. Error Handling

| Kondisi              | Tindakan                                                       |
| -------------------- | -------------------------------------------------------------- |
| Network error        | Tampilkan "Gagal menghubungi server. Coba lagi." di bawah form |
| API 400              | Tampilkan pesan error spesifik dari `response.error`           |
| API 409 (duplicate)  | Retry dengan key baru, maks 1x                                 |
| API 500              | Tampilkan "Server sedang sibuk. Silakan coba lagi nanti."      |
| SessionStorage penuh | Lanjut tanpa cache (graceful degradation)                      |

---

## 7. UI Enhancements

- **Order Summary**: tambah error display di atas tombol submit
- **Submit button**: show spinner "Memproses…" saat `checkoutLoading`
- **Account Step**: gameId selalu 0 saat belum ada game (validated by form)

---

## 8. Files yang Terlibat

### Files Baru

- `/types/checkout.ts` — type definitions
- `/services/checkout.service.ts` — API service

### Files Dimodifikasi

- `/hooks/use-checkout-form.ts` — real API call + idempotency
- `/components/checkout-form/order-summary.tsx` — error display + loading state
- `/components/bayar-card.tsx` — API mode + sessionStorage fallback
- `/components/checkout-form/index.tsx` — pass checkout loading/error to OrderSummary

### Tidak Dimodifikasi

- `/app/bayar/page.tsx` — structure sudah benar
- `/components/checkout-form/account-step.tsx` — tidak perlu diubah
- `/components/checkout-form/product-step.tsx`, `quantity-step.tsx`, `contact-step.tsx`, `payment-method-step.tsx` — tidak perlu diubah

---

## 9. Next.js Best Practices

- **Client-side fetch**: idempotency key harus unik per request, jadi pakai client fetch (tidak bisa diserver-side kan)
- **SessionStorage**: for transient checkout state, bukan cookies yang dikirim ke server
- **Error boundary**: graceful degradation, UI tetap responsive
- **Suspense**: `/bayar` sudah pakai Suspense wrapper, data loading tidak memblokir render
- **Fallback URL params**: memungkinkan share link checkout tetap berfungsi tanpa API call
