import Link from 'next/link';
import type { Metadata } from 'next';
import { Home } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Halaman Tidak Ditemukan — Sultan Top Up',
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <main id="main" className="flex flex-1 items-center justify-center px-4 py-16 md:px-6">
      <div className="text-center">
        <p className="text-primary text-6xl font-bold tracking-tighter md:text-8xl">404</p>
        <h1 className="mt-4 text-xl font-bold tracking-tight md:text-2xl">
          Halaman tidak ditemukan
        </h1>
        <p className="text-muted-foreground mx-auto mt-2 max-w-sm text-sm">
          Mungkin halaman sudah dipindahkan atau kamu salah ketik URL. Yuk balik ke beranda.
        </p>
        <Link
          href="/"
          className="press bg-primary text-primary-foreground hover:bg-primary/90 mt-6 inline-flex items-center gap-2 rounded-lg px-6 py-3 text-sm font-semibold transition-colors duration-200"
        >
          <Home className="size-4" aria-hidden="true" />
          Kembali ke Beranda
        </Link>
      </div>
    </main>
  );
}
