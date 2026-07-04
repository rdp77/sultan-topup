'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Check, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
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

export function CheckoutForm({ game }: { game: Game }) {
  const router = useRouter()
  const denoms = getDenominations(game)

  const [selectedDenom, setSelectedDenom] = useState<Denomination | null>(null)
  const [userId, setUserId] = useState('')
  const [zoneId, setZoneId] = useState('')
  const [email, setEmail] = useState('')
  const [whatsapp, setWhatsapp] = useState('')
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [touched, setTouched] = useState(false)

  const fee = useMemo(
    () => (selectedDenom && selectedMethod ? calcFee(selectedMethod, selectedDenom.price) : 0),
    [selectedDenom, selectedMethod],
  )

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  const waValid = /^08\d{8,12}$/.test(whatsapp.replace(/[\s-]/g, ''))
  const idValid = userId.trim().length >= 3 && (!game.needsZone || zoneId.trim().length >= 1)
  const canSubmit = selectedDenom !== null && idValid && emailValid && waValid && selectedMethod !== null

  function handleSubmit() {
    setTouched(true)
    if (!canSubmit || submitting) return
    setSubmitting(true)
    const params = new URLSearchParams({
      game: game.name,
      product: selectedDenom!.amount,
      price: String(selectedDenom!.price),
      fee: String(fee),
      method: selectedMethod!.name,
      uid: game.needsZone ? `${userId} (${zoneId})` : userId,
    })
    setTimeout(() => {
      router.push(`/hasil?${params.toString()}`)
    }, 900)
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

      {/* 2. Data Akun */}
      <section className="rounded-xl bg-card p-4 md:p-6">
        <SectionHeading step={2} title="Masukkan Data Akun" />
        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <div className="flex-1">
            <label htmlFor="user-id" className="mb-1.5 block text-sm text-muted-foreground">
              {game.idLabel}
            </label>
            <input
              id="user-id"
              type="text"
              inputMode="numeric"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              placeholder={game.idPlaceholder}
              className="w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm outline-none transition-colors duration-200 placeholder:text-muted-foreground/60 focus:border-primary focus:ring-2 focus:ring-primary/30"
            />
            {touched && userId.trim().length < 3 && (
              <p className="mt-1.5 text-xs text-destructive">{game.idLabel} minimal 3 karakter</p>
            )}
          </div>
          {game.needsZone && (
            <div className="sm:w-36">
              <label htmlFor="zone-id" className="mb-1.5 block text-sm text-muted-foreground">
                Zone ID
              </label>
              <input
                id="zone-id"
                type="text"
                inputMode="numeric"
                value={zoneId}
                onChange={(e) => setZoneId(e.target.value)}
                placeholder="Contoh: 2001"
                className="w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm outline-none transition-colors duration-200 placeholder:text-muted-foreground/60 focus:border-primary focus:ring-2 focus:ring-primary/30"
              />
              {touched && zoneId.trim().length < 1 && (
                <p className="mt-1.5 text-xs text-destructive">Zone ID wajib diisi</p>
              )}
            </div>
          )}
        </div>
      </section>

      {/* 3. Kontak */}
      <section className="rounded-xl bg-card p-4 md:p-6">
        <SectionHeading step={3} title="Info Kontak" />
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
        <SectionHeading step={4} title="Metode Pembayaran" />
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
                        'flex items-center justify-between gap-2 rounded-xl border px-3 py-3 text-left transition-all duration-200',
                        selected
                          ? 'border-primary bg-primary/10'
                          : 'border-border bg-background hover:border-primary/50',
                      )}
                      aria-pressed={selected}
                    >
                      <span className="text-sm">{m.name}</span>
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
            <dd>{selectedDenom ? formatRupiah(selectedDenom.price) : '—'}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Biaya Admin</dt>
            <dd>{selectedMethod && selectedDenom ? formatRupiah(fee) : '—'}</dd>
          </div>
          <div className="flex justify-between border-t border-border pt-2.5 text-base font-semibold">
            <dt>Total</dt>
            <dd className="text-primary">
              {selectedDenom ? formatRupiah(selectedDenom.price + fee) : '—'}
            </dd>
          </div>
        </dl>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={submitting}
          className={cn(
            'mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground transition-colors duration-200',
            canSubmit && !submitting
              ? 'press hover:bg-primary/90'
              : 'opacity-60',
          )}
        >
          {submitting ? (
            <>
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
              Memproses...
            </>
          ) : (
            'Bayar Sekarang'
          )}
        </button>
        {touched && !canSubmit && (
          <p className="mt-2 text-center text-xs text-destructive">
            Lengkapi semua data di atas untuk melanjutkan pembayaran.
          </p>
        )}
      </section>
    </div>
  )
}
