import Link from 'next/link';
import type { Metadata } from 'next';
import { Home, WifiOff } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Offline — Sultan Top Up',
  description: 'Anda sedang offline. Silakan periksa koneksi internet Anda dan coba lagi.',
  robots: { index: false, follow: false },
};

export default function OfflinePage() {
  return (
    <main id="main" className="flex flex-1 items-center justify-center px-4 py-16 md:px-6">
      <div className="text-center">
        <WifiOff className="text-muted-foreground mx-auto size-16" aria-hidden="true" />
        <h1 className="mt-6 text-xl font-bold tracking-tight md:text-2xl">Anda Sedang Offline</h1>
        <p className="text-muted-foreground mx-auto mt-2 max-w-sm text-sm">
          Tidak ada koneksi internet. Silakan periksa jaringan Anda dan coba lagi.
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
