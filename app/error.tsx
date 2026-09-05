'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { RotateCcw, AlertTriangle } from 'lucide-react';

export default function Error({
  error,
  reset,
}: Readonly<{
  error: Error & { digest?: string };
  reset: () => void;
}>) {
  useEffect(() => {
    // Surface the error to APM/analytics if needed
    console.error('[app/error.tsx]', error);
  }, [error]);

  return (
    <main id="main" className="flex-1">
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center">
        <span className="bg-destructive/10 text-destructive flex size-14 items-center justify-center rounded-full">
          <AlertTriangle className="size-7" aria-hidden="true" />
        </span>
        <h1 className="text-xl font-bold tracking-tight md:text-2xl">Terjadi kesalahan</h1>
        <p className="text-muted-foreground max-w-md text-sm leading-relaxed">
          Maaf, terjadi masalah saat memuat halaman ini. Coba muat ulang, atau kembali ke beranda.
        </p>
        <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={reset}
            className="press bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold transition-colors duration-200"
          >
            <RotateCcw className="size-4" aria-hidden="true" />
            Muat Ulang
          </button>
          <Link
            href="/"
            className="border-border text-foreground hover:bg-card inline-flex items-center gap-2 rounded-lg border px-5 py-2.5 text-sm font-medium transition-colors duration-200"
          >
            Ke Beranda
          </Link>
        </div>
        {error.digest && (
          <p className="text-muted-foreground/60 mt-4 font-mono text-xs">
            Error ID: {error.digest}
          </p>
        )}
      </div>
    </main>
  );
}
