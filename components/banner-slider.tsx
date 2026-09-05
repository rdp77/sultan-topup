'use client';

import { useEffect, useState, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';

type Slide = {
  srcDesktop: string;
  srcMobile: string;
  alt: string;
  label?: string;
  sub?: string;
};

const slides: Slide[] = [
  {
    srcDesktop: '/banners/desktop/banner1.png',
    srcMobile: '/banners/mobile/banner1.png',
    alt: 'Top up diamond game favoritmu',
  },
  {
    srcDesktop: '/banners/desktop/banner2.png',
    srcMobile: '/banners/mobile/banner2.png',
    alt: 'Pembayaran QRIS dan E-Wallet',
  },
  {
    srcDesktop: '/banners/desktop/banner3.png',
    srcMobile: '/banners/mobile/banner3.png',
    alt: 'Event dan promo terbaru',
  },
];

export function BannerSlider() {
  const [i, setI] = useState(0);
  const prev = () => setI((v) => (v - 1 + slides.length) % slides.length);
  const next = useCallback(() => setI((v) => (v + 1) % slides.length), []);

  useEffect(() => {
    const t = setInterval(next, 5000);
    return () => clearInterval(t);
  }, [next]);

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
            {(s.label || s.sub) && (
              <>
                <div className="from-background via-background/30 absolute inset-0 bg-linear-to-t to-transparent" />
                <div className="absolute bottom-0 left-0 p-4 md:p-8">
                  {s.label && (
                    <p className="text-foreground text-lg font-bold md:text-2xl">{s.label}</p>
                  )}
                  {s.sub && (
                    <p className="text-muted-foreground mt-1 text-sm md:text-base">{s.sub}</p>
                  )}
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={prev}
        className="press bg-background/60 text-foreground hover:bg-background/90 absolute top-1/2 left-2 flex size-8 -translate-y-1/2 items-center justify-center rounded-full backdrop-blur transition"
        aria-label="Slide sebelumnya"
      >
        <ChevronLeft className="size-5" aria-hidden="true" />
      </button>
      <button
        type="button"
        onClick={next}
        className="press bg-background/60 text-foreground hover:bg-background/90 absolute top-1/2 right-2 flex size-8 -translate-y-1/2 items-center justify-center rounded-full backdrop-blur transition"
        aria-label="Slide berikutnya"
      >
        <ChevronRight className="size-5" aria-hidden="true" />
      </button>

      <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5" role="tablist">
        {slides.map((s, idx) => (
          <button
            key={`${s.srcDesktop}-${idx}`}
            type="button"
            onClick={() => setI(idx)}
            role="tab"
            aria-selected={idx === i}
            className={`size-2 rounded-full transition-all duration-300 ${
              idx === i ? 'bg-primary w-5' : 'bg-muted-foreground/40'
            }`}
            aria-label={`Slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
