import Link from 'next/link';
import { Plus } from 'lucide-react';
import { OrderList } from '@/components/order-list';
import { OrderService } from '@/services';
import { toOrder } from '@/lib/order-utils';

export const metadata = {
  title: 'Dashboard — Sultan Top Up',
  description:
    'Dashboard akun Sultan Top Up. Lihat riwayat transaksi, status pesanan, dan kelola akun Anda.',
  alternates: { canonical: 'https://sultantopup.com/dashboard' },
  robots: { index: false, follow: false },
  openGraph: {
    title: 'Dashboard — Sultan Top Up',
    description: 'Dashboard akun Sultan Top Up.',
    url: 'https://sultantopup.com/dashboard',
    siteName: 'Sultan Top Up',
    images: [
      {
        url: 'https://sultantopup.com/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Dashboard Sultan Top Up',
      },
    ],
    locale: 'id_ID',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Dashboard — Sultan Top Up',
    description: 'Dashboard akun Sultan Top Up.',
    images: ['https://sultantopup.com/og-image.png'],
  },
};

export default async function DashboardPage() {
  // GET via Server Component — leverage the Next.js Data Cache (revalidate: 30s).
  const res = await OrderService.list().catch(() => ({ data: [] }));
  const orders = res.data.map(toOrder);

  return (
    <main id="main" className="flex-1">
      <div className="mx-auto max-w-3xl px-4 py-12 md:px-6 md:py-16">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Riwayat Pesanan</h1>
            <p className="text-muted-foreground mt-1 text-sm">
              Semua transaksi top up kamu ada di sini.
            </p>
          </div>
          <Link
            href="/"
            className="press bg-primary text-primary-foreground hover:bg-primary/90 flex shrink-0 items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors duration-200"
          >
            <Plus className="size-4" aria-hidden="true" />
            <span className="hidden sm:inline">Top Up Baru</span>
            <span className="sm:hidden">Baru</span>
          </Link>
        </div>

        <OrderList orders={orders} />
      </div>
    </main>
  );
}
