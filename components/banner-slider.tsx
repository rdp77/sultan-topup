'use client'

import { useEffect, useState, useCallback } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const slides = [
  {
    src: 'https://picsum.photos/seed/gaming-banner-1/1200/480',
    alt: 'Top up diamond game favoritmu',
    label: 'Top Up Diamond',
    sub: 'Harga termurah, proses instan',
  },
  {
    src: 'https://picsum.photos/seed/gaming-banner-2/1200/480',
    alt: 'Pembayaran QRIS dan E-Wallet',
    label: 'Bayar Pakai QRIS',
    sub: 'GoPay, OVO, DANA, ShopeePay, dan VA',
  },
  {
    src: 'https://picsum.photos/seed/gaming-banner-3/1200/480',
    alt: 'Event dan promo terbaru',
    label: 'Promo Spesial Juli',
    sub: 'Cashback sampai 20% setiap transaksi',
  },
]

export function BannerSlider() {
  const [i, setI] = useState(0)
  const prev = () => setI((v) => (v - 1 + slides.length) % slides.length)
  const next = useCallback(() => setI((v) => (v + 1) % slides.length), [])

  useEffect(() => {
    const t = setInterval(next, 5000)
    return () => clearInterval(t)
  }, [next])

  return (
    <div className="relative mx-auto max-w-300 overflow-hidden rounded-xl md:rounded-2xl" aria-label="Promo banner">
      <div
        className="flex transition-transform duration-500 ease-out"
        style={{ transform: `translateX(-${i * 100}%)` }}
      >
        {slides.map((s, idx) => (
          <div key={idx} className="relative aspect-2.5/1 w-full shrink-0 md:aspect-3/1" aria-hidden={idx !== i}>
            <img
              src={s.src}
              alt={idx === i ? s.alt : ''}
              className="absolute inset-0 h-full w-full object-cover"
              loading={idx === 0 ? 'eager' : 'lazy'}
            />
            <div className="absolute inset-0 bg-linear-to-t from-background via-background/30 to-transparent" />
            <div className="absolute bottom-0 left-0 p-4 md:p-8">
              <p className="text-lg font-bold text-foreground md:text-2xl">{s.label}</p>
              <p className="mt-1 text-sm text-muted-foreground md:text-base">{s.sub}</p>
            </div>
          </div>
        ))}
      </div>

      <button type="button" onClick={prev} className="press absolute left-2 top-1/2 -translate-y-1/2 flex size-8 items-center justify-center rounded-full bg-background/60 text-foreground backdrop-blur transition hover:bg-background/90" aria-label="Slide sebelumnya">
        <ChevronLeft className="size-5" aria-hidden="true" />
      </button>
      <button type="button" onClick={next} className="press absolute right-2 top-1/2 -translate-y-1/2 flex size-8 items-center justify-center rounded-full bg-background/60 text-foreground backdrop-blur transition hover:bg-background/90" aria-label="Slide berikutnya">
        <ChevronRight className="size-5" aria-hidden="true" />
      </button>

      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5" role="tablist">
        {slides.map((_, idx) => (
          <button key={idx} type="button" onClick={() => setI(idx)} role="tab" aria-selected={idx === i} className={`size-2 rounded-full transition-all duration-300 ${idx === i ? 'w-5 bg-primary' : 'bg-muted-foreground/40'}`} aria-label={`Slide ${idx + 1}`} />
        ))}
      </div>
    </div>
  )
}