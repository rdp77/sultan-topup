'use client'

import { useMemo, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Check, Loader2, Search, Info, AlertTriangle, UserCheck, ShieldCheck } from 'lucide-react'
import Turnstile from 'react-turnstile'
import { cn } from '@/lib/utils'
import { PaymentLogo } from '@/components/payment-logo'
import {
  calcFee,
  formatRupiah,
  getDenominations,
  paymentGroups,
  type Denomination,
  type Game,
  type PaymentMethod,
} from '@/lib/data'

function SectionHeading({ step, title }: { step: number; title: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
        {step}
      </span>
      <h2 className="text-base font-semibold">{title}</h2>
    </div>
  )
}

function InfoTooltip({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLButtonElement>(null)
  const [show, setShow] = useState(false)
  return (
    <span className="relative inline-flex items-center">
      <button
        type="button"
        ref={ref}
        onClick={() => setShow(!show)}
        onBlur={() => setTimeout(() => setShow(false), 150)}
        className="ml-1 inline-flex size-4 cursor-pointer items-center justify-center rounded-full border border-border bg-background text-xs text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
        aria-label="Cara mendapatkan ID"
      >
        <Info className="size-3" aria-hidden="true" />
      </button>
      {show && (
        <span
          role="tooltip"
          className="absolute bottom-full left-1/2 z-50 mb-2 w-52 -translate-x-1/2 rounded-lg border border-border bg-card p-3 text-left text-xs leading-relaxed text-muted-foreground shadow-lg"
        >
          {children}
        </span>
      )}
    </span>
  )
}

type ValidateState = 'idle' | 'loading' | 'found' | 'not-found' | 'error'

export function CheckoutForm({ game }: { game: Game }) {
  const router = useRouter()
  const denoms = getDenominations(game)

  const [selectedDenom, setSelectedDenom] = useState<Denomination | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [userId, setUserId] = useState('')
  const [zoneId, setZoneId] = useState('')
  const [email, setEmail] = useState('')
  const [whatsapp, setWhatsapp] = useState('')
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [touched, setTouched] = useState(false)
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null)
  const devBypass = process.env.NEXT_PUBLIC_TURNSTILE_DEV_BYPASS === 'true'

  // Player ID validation
  const [validateState, setValidateState] = useState<ValidateState>('idle')
  const [validatePlayer, setValidatePlayer] = useState<string | null>(null)

  const subPrice = useMemo(
    () => (selectedDenom ? selectedDenom.price * quantity : 0),
    [selectedDenom, quantity],
  )
  const fee = useMemo(
    () => (selectedDenom && selectedMethod ? calcFee(selectedMethod, selectedDenom.price) : 0),
    [selectedDenom, selectedMethod],
  )

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  const waValid = /^08\d{8,12}$/.test(whatsapp.replace(/[\s-]/g, ''))
  const idValid = userId.trim().length >= 3 && (!game.needsZone || zoneId.trim().length >= 1)
  const canSubmit = selectedDenom !== null && idValid && emailValid && waValid && selectedMethod !== null && (turnstileToken !== null || devBypass)
  const canSubmitNoTurnstile = selectedDenom !== null && idValid && emailValid && waValid && selectedMethod !== null

  // Simulate player ID lookup
  function handleValidate() {
    const val = userId.trim()
    if (!val || validateState === 'loading') return
    setValidateState('loading')
    setValidatePlayer(null)
    setTimeout(() => {
      const n = val.length
      // Dummy logic: length % 3 === 0 → found, length % 3 === 1 → not-found, else → error
      // User can test by typing: 3/6/9 chars = found | 4/7/10 chars = not-found | 5/8/11 chars = error
      if (n < 3) {
        setValidateState('error')
        setValidatePlayer(null)
      } else if (n % 3 === 0) {
        setValidateState('found')
        setValidatePlayer(`Player${val.slice(0, 3)}*** (Level ${27 + (n % 30)})`)
      } else if (n % 3 === 1) {
        setValidateState('not-found')
        setValidatePlayer(null)
      } else {
        setValidateState('error')
        setValidatePlayer(null)
      }
    }, 800)
  }

  function handleSubmit() {
    setTouched(true)
    if (!canSubmit || submitting) return
    setSubmitting(true)
    const params = new URLSearchParams({
      game: game.name,
      product: `${selectedDenom!.amount} × ${quantity}`,
      price: String(subPrice),
      fee: String(fee),
      method: selectedMethod!.name,
      uid: game.needsZone ? `${userId} (${zoneId})` : userId,
      payment: selectedMethod!.id,
      invoice: `INV-${Date.now().toString(36).toUpperCase()}`,
    })
    // Go to payment instruction page first, then result
    setTimeout(() => {
      router.push(`/bayar?${params.toString()}`)
    }, 600)
  }

  return (
    <div className="flex flex-col gap-6">
      {/* 1. Pilih Nominal */}
      <section className="rounded-xl bg-card p-4 md:p-6">
        <SectionHeading step={1} title="Pilih Nominal" />
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {denoms.map((d) => {
            const selected = selectedDenom?.id === d.id
            return (
              <button
                key={d.id}
                type="button"
                onClick={() => setSelectedDenom(d)}
                className={cn(
                  'relative flex flex-col items-start gap-1 rounded-xl border p-3 text-left transition-colors duration-200',
                  selected
                    ? 'border-primary bg-primary/10'
                    : 'border-border bg-background hover:border-primary/50',
                )}
                aria-pressed={selected}
              >
                {d.badge && (
                  <span
                    className={cn(
                      'absolute -top-2 right-2 rounded-md px-1.5 py-0.5 text-[10px] font-semibold',
                      d.badge === 'popular'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-warning text-background',
                    )}
                  >
                    {d.badge === 'popular' ? 'Populer' : 'Best Value'}
                  </span>
                )}
                {selected && (
                  <span className="absolute right-2 top-2 flex size-4 items-center justify-center rounded-full bg-primary">
                    <Check className="size-3 text-primary-foreground" aria-hidden="true" />
                  </span>
                )}
                <span className="text-sm font-medium leading-tight">{d.amount}</span>
                <span className="text-xs text-muted-foreground">{formatRupiah(d.price)}</span>
              </button>
            )
          })}
        </div>
      </section>

      {/* 2. Jumlah */}
      <section className="rounded-xl bg-card p-4 md:p-6">
        <SectionHeading step={2} title="Jumlah Pesanan" />
        <div className="mt-3 flex items-center gap-4">
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            disabled={!selectedDenom}
            className="press flex size-9 shrink-0 items-center justify-center rounded-lg border border-border text-sm font-medium transition-colors hover:bg-card disabled:cursor-not-allowed disabled:opacity-30"
            aria-label="Kurangi jumlah"
          >
            -
          </button>
          <span className="w-12 text-center text-lg font-semibold tabular-nums">{quantity}</span>
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.min(99, q + 1))}
            disabled={!selectedDenom}
            className="press flex size-9 shrink-0 items-center justify-center rounded-lg border border-border text-sm font-medium transition-colors hover:bg-card disabled:cursor-not-allowed disabled:opacity-30"
            aria-label="Tambah jumlah"
          >
            +
          </button>
          {selectedDenom ? (
            <span className="ml-auto text-sm text-muted-foreground">
              {selectedDenom.amount} × {quantity} · {formatRupiah(subPrice)}
            </span>
          ) : (
            <span className="ml-auto text-xs text-muted-foreground">
              Pilih nominal di Step 1 terlebih dahulu
            </span>
          )}
        </div>
      </section>

      {/* 3. Data Akun */}
      <section className="rounded-xl bg-card p-4 md:p-6">
        <SectionHeading step={3} title="Masukkan Data Akun" />
        <div className="mt-4 flex flex-col gap-3">
          {/* Player ID row */}
          <div className="flex flex-col gap-3">
          {/* Player ID + Zone ID row — all aligned to bottom */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
            <div className="flex-1">
              <label htmlFor="uid" className="mb-1.5 flex items-center text-sm text-muted-foreground">
                {game.idLabel}
                <InfoTooltip>
                  Buka game lalu masuk ke halaman profil. {game.idLabel} biasanya tertera di pojok kiri atas layar atau di menu Pengaturan.
                </InfoTooltip>
              </label>
              <input
                id="uid"
                type="text"
                inputMode="numeric"
                value={userId}
                onChange={(e) => {
                  setUserId(e.target.value)
                  setValidateState('idle')
                  setValidatePlayer(null)
                }}
                placeholder={game.idPlaceholder}
                className="w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm outline-none transition-colors duration-200 placeholder:text-muted-foreground/60 focus:border-primary focus:ring-2 focus:ring-primary/30"
              />
              {touched && userId.trim().length < 3 && (
                <p className="mt-1.5 text-xs text-destructive">{game.idLabel} minimal 3 karakter</p>
              )}
            </div>

            <div className="w-full sm:w-36">
              <label htmlFor="zone-id" className="mb-1.5 flex items-center text-sm text-muted-foreground">
                Server / Zone ID
                <InfoTooltip>
                  {game.needsZone
                    ? 'Buka profil game lalu cari angka di samping nama karakter, biasanya dalam format (1234).'
                    : 'Beberapa game seperti Mobile Legends memerlukan Zone ID. Jika gamenya tidak butuh, biarkan kosong.'}
                </InfoTooltip>
              </label>
              <input
                id="zone-id"
                type="text"
                inputMode="numeric"
                value={zoneId}
                onChange={(e) => setZoneId(e.target.value)}
                placeholder={game.needsZone ? 'Contoh: 2001' : 'Opsional'}
                disabled={!game.needsZone}
                className="w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm outline-none transition-colors duration-200 placeholder:text-muted-foreground/60 focus:border-primary focus:ring-2 focus:ring-primary/30 disabled:cursor-not-allowed disabled:opacity-40"
              />
              {game.needsZone && touched && zoneId.trim().length < 1 && (
                <p className="mt-1.5 text-xs text-destructive">Zone ID wajib diisi</p>
              )}
            </div>

            {/* Validate button — flex-end aligns bottom with inputs */}
            <div className="shrink-0">
              <button
                type="button"
                onClick={handleValidate}
                disabled={validateState === 'loading' || userId.trim().length < 3}
                className="press inline-flex h-10.5 shrink-0 items-center gap-1.5 rounded-lg border border-border px-4 text-xs font-medium text-foreground transition-colors duration-200 hover:bg-card disabled:opacity-50"
              >
                {validateState === 'loading' ? (
                  <Loader2 className="size-3.5 animate-spin" aria-hidden="true" />
                ) : (
                  <Search className="size-3.5" aria-hidden="true" />
                )}
                Cek Akun
              </button>
            </div>
          </div>

          {/* Validation result messages */}
          <div className="-mt-1">
            {validateState === 'found' && validatePlayer && (
              <p className="flex items-center gap-1.5 text-xs text-success">
                <UserCheck className="size-3.5" aria-hidden="true" />
                Akun ditemukan: {validatePlayer}
              </p>
            )}
            {validateState === 'not-found' && (
              <p className="flex items-center gap-1.5 text-xs text-destructive">
                <AlertTriangle className="size-3.5" aria-hidden="true" />
                Akun tidak ditemukan. Periksa kembali {game.idLabel} kamu.
              </p>
            )}
            {validateState === 'error' && (
              <p className="flex items-center gap-1.5 text-xs text-destructive">
                <AlertTriangle className="size-3.5" aria-hidden="true" />
                Gagal menghubungi server game. Coba lagi nanti.
              </p>
            )}
          </div>
        </div>
        </div>
      </section>

      {/* 3. Kontak */}
      <section className="rounded-xl bg-card p-4 md:p-6">
        <SectionHeading step={4} title="Info Kontak" />
        <p className="mt-2 text-xs text-muted-foreground">
          Bukti pembelian dan status pesanan akan dikirim ke kontak ini.
        </p>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <div className="flex-1">
            <label htmlFor="email" className="mb-1.5 block text-sm text-muted-foreground">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nama@email.com"
              className="w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm outline-none transition-colors duration-200 placeholder:text-muted-foreground/60 focus:border-primary focus:ring-2 focus:ring-primary/30"
            />
            {touched && !emailValid && (
              <p className="mt-1.5 text-xs text-destructive">Masukkan email yang valid</p>
            )}
          </div>
          <div className="flex-1">
            <label htmlFor="whatsapp" className="mb-1.5 block text-sm text-muted-foreground">
              Nomor WhatsApp
            </label>
            <input
              id="whatsapp"
              type="tel"
              inputMode="tel"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              placeholder="08xxxxxxxxxx"
              className="w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm outline-none transition-colors duration-200 placeholder:text-muted-foreground/60 focus:border-primary focus:ring-2 focus:ring-primary/30"
            />
            {touched && !waValid && (
              <p className="mt-1.5 text-xs text-destructive">Masukkan nomor WhatsApp yang valid (08xx)</p>
            )}
          </div>
        </div>
      </section>

      {/* 4. Metode Pembayaran */}
      <section className="rounded-xl bg-card p-4 md:p-6">
        <SectionHeading step={5} title="Metode Pembayaran" />
        <div className="mt-4 flex flex-col gap-5">
          {paymentGroups.map((group) => (
            <div key={group.group}>
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {group.group}
              </h3>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {group.methods.map((m) => {
                  const selected = selectedMethod?.id === m.id
                  const mFee = selectedDenom ? calcFee(m, selectedDenom.price) : null
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setSelectedMethod(m)}
                      className={cn(
                        'flex items-center justify-between gap-2 rounded-xl border px-3 py-3 text-left transition-colors duration-200',
                        selected
                          ? 'border-primary bg-primary/10'
                          : 'border-border bg-background hover:border-primary/50',
                      )}
                      aria-pressed={selected}
                    >
                      <span className="flex items-center gap-2.5">
                        <span
                          className={cn(
                            'flex size-8 shrink-0 items-center justify-center rounded-md border',
                            selected
                              ? 'border-primary/40 bg-primary/10 text-primary'
                              : 'border-border bg-background text-muted-foreground',
                          )}
                          aria-hidden="true"
                        >
                          <PaymentLogo id={m.id} />
                        </span>
                        <span className="text-sm">{m.name}</span>
                      </span>
                      <span className="flex items-center gap-2">
                        {mFee !== null && (
                          <span className="text-xs text-muted-foreground">
                            {mFee === 0 ? 'Gratis' : `+${formatRupiah(mFee)}`}
                          </span>
                        )}
                        {selected && (
                          <span className="flex size-4 items-center justify-center rounded-full bg-primary">
                            <Check className="size-3 text-primary-foreground" aria-hidden="true" />
                          </span>
                        )}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Ringkasan */}
      <section className="rounded-xl bg-card p-4 md:p-6">
        <h2 className="text-base font-semibold">Ringkasan Pesanan</h2>
        <dl className="mt-4 flex flex-col gap-2.5 text-sm">
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Produk</dt>
            <dd>{selectedDenom ? selectedDenom.amount : '—'}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Harga</dt>
            <dd>{selectedDenom ? formatRupiah(subPrice) : '—'}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Biaya Admin</dt>
            <dd>{selectedMethod && selectedDenom ? formatRupiah(fee) : '—'}</dd>
          </div>
          <div className="flex justify-between border-t border-border pt-2.5 text-base font-semibold">
            <dt>Total</dt>
            <dd className="text-primary">
              {selectedDenom ? formatRupiah(subPrice + fee) : '—'}
            </dd>
          </div>
        </dl>

        <div className="mt-4 rounded-lg bg-background/50 p-4">
          <div className="mb-3 flex items-center gap-2 text-xs text-muted-foreground">
            <ShieldCheck className="size-4 text-success" aria-hidden="true" />
            Verifikasi keamanan
          </div>
          <Turnstile
            sitekey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? '1x00000000000000000000AA'}
            onVerify={(token) => setTurnstileToken(token)}
            onExpire={() => setTurnstileToken(null)}
            onError={() => setTurnstileToken(null)}
            theme="dark"
          />
          {!devBypass && !turnstileToken && (
            <p className="mt-3 text-center text-xs text-muted-foreground">
              Centang kotak di atas untuk melanjutkan.
            </p>
          )}
          {devBypass && (
            <p className="mt-3 text-center text-xs text-success">Mode dev bypass aktif</p>
          )}
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={submitting || !canSubmit}
          className={cn(
            'mt-3 flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground transition-colors duration-200',
            canSubmit && !submitting ? 'press hover:bg-primary/90' : 'opacity-60',
          )}
        >
          {submitting ? (
            <>
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
              Memproses...
            </>
          ) : (
            'Lanjutkan Pembayaran'
          )}
        </button>
        {touched && !canSubmitNoTurnstile && (
          <p className="mt-2 text-center text-xs text-destructive">
            Lengkapi semua data di atas untuk melanjutkan pembayaran.
          </p>
        )}
        {touched && canSubmitNoTurnstile && !canSubmit && (
          <p className="mt-2 text-center text-xs text-muted-foreground">
            Selesaikan verifikasi keamanan di atas.
          </p>
        )}
      </section>
    </div>
  )
}