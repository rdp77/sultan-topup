'use client'

import { useEffect, useState, useCallback } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Image from 'next/image'

type Slide = {
  srcDesktop: string
  srcMobile: string
  alt: string
  label?: string
  sub?: string
}

const slides: Slide[] = [
  {
    srcDesktop: '/banners/banner1.png',
    srcMobile: '/banners/banner1.png',
    alt: 'Top up diamond game favoritmu',
  },
  {
    srcDesktop: '/banners/banner2.png',
    srcMobile: '/banners/banner2.png',
    alt: 'Pembayaran QRIS dan E-Wallet',
  },
  {
    srcDesktop: '/banners/banner3.png',
    srcMobile: '/banners/banner3.png',
    alt: 'Event dan promo terbaru',
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
    <div
      className="relative mx-auto max-w-300 overflow-hidden rounded-xl md:rounded-2xl"
      aria-label="Promo banner"
    >
      <div
        className="flex transition-transform duration-500 ease-out"
        style={{ transform: `translateX(-${i * 100}%)` }}
      >
        {slides.map((s, idx) => (
          <div
            key={s.srcDesktop}
            className="relative aspect-4/3 w-full shrink-0 sm:aspect-2.5/1 md:aspect-3/1"
            aria-hidden={idx !== i}
          >
            {/* Mobile: gambar & crop terpisah, tampil < 640px */}
            <Image
              src={s.srcMobile}
              alt={idx === i ? s.alt : ''}
              fill
              sizes="100vw"
              className="object-cover sm:hidden"
              priority={idx === 0}
            />
            {/* Desktop/tablet: gambar wide, tampil >= 640px */}
            <Image
              src={s.srcDesktop}
              alt={idx === i ? s.alt : ''}
              fill
              sizes="100vw"
              className="hidden object-cover sm:block"
              priority={idx === 0}
            />
            <div className="absolute inset-0 bg-linear-to-t from-background via-background/30 to-transparent" />
            {(s.label || s.sub) && (
              <div className="absolute bottom-0 left-0 p-4 md:p-8">
                {s.label && (
                  <p className="text-lg font-bold text-foreground md:text-2xl">{s.label}</p>
                )}
                {s.sub && (
                  <p className="mt-1 text-sm text-muted-foreground md:text-base">{s.sub}</p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={prev}
        className="press absolute left-2 top-1/2 -translate-y-1/2 flex size-8 items-center justify-center rounded-full bg-background/60 text-foreground backdrop-blur transition hover:bg-background/90"
        aria-label="Slide sebelumnya"
      >
        <ChevronLeft className="size-5" aria-hidden="true" />
      </button>
      <button
        type="button"
        onClick={next}
        className="press absolute right-2 top-1/2 -translate-y-1/2 flex size-8 items-center justify-center rounded-full bg-background/60 text-foreground backdrop-blur transition hover:bg-background/90"
        aria-label="Slide berikutnya"
      >
        <ChevronRight className="size-5" aria-hidden="true" />
      </button>

      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5" role="tablist">
        {slides.map((s, idx) => (
          <button
            key={`${s.srcDesktop}-${idx}`}
            type="button"
            onClick={() => setI(idx)}
            role="tab"
            aria-selected={idx === i}
            className={`size-2 rounded-full transition-all duration-300 ${
              idx === i ? 'w-5 bg-primary' : 'bg-muted-foreground/40'
            }`}
            aria-label={`Slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
