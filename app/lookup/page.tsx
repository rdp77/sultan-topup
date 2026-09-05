import { OrderLookup } from '@/components/order-lookup';
import { TransactionTable } from '@/components/transaction-table';
import { LookupResultSection } from '@/components/lookup-result';
import { OrderService } from '@/services';
import { toOrder } from '@/lib/order-utils';
import { validateOrderLookup } from '@/lib/order-lookup-schema';

export const metadata = {
  title: 'Lacak Pesanan — Sultan Top Up',
  description:
    'Lacak status pesanan top up game Anda. Masukkan nomor invoice dan kontak yang Anda gunakan saat checkout.',
  alternates: { canonical: 'https://sultantopup.com/lookup' },
  openGraph: {
    title: 'Lacak Pesanan — Sultan Top Up',
    description: 'Lacak status pesanan top up game Anda. Masukkan nomor invoice dan kontak.',
    url: 'https://sultantopup.com/lookup',
    siteName: 'Sultan Top Up',
    images: [
      {
        url: 'https://sultantopup.com/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Lacak Pesanan Sultan Top Up',
      },
    ],
    locale: 'id_ID',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Lacak Pesanan — Sultan Top Up',
    description: 'Lacak status pesanan top up game Anda.',
    images: ['https://sultantopup.com/og-image.png'],
  },
};

interface LookupPageProps {
  searchParams: Promise<{ invoice?: string; contact?: string }>;
}

export default async function LookupPage({ searchParams }: Readonly<LookupPageProps>) {
  // GET via Server Component — leverage the Next.js Data Cache (revalidate: 30s).
  const res = await OrderService.list().catch(() => ({ data: [] }));
  const orders = res.data.map(toOrder);

  const sp = await searchParams;
  const invoice = sp.invoice?.trim();
  const contact = sp.contact?.trim();
  const hasQuery = Boolean(invoice || contact);
  const errors = hasQuery ? validateOrderLookup({ invoice, contact }) : null;
  const queryValid = hasQuery && !errors;

  return (
    <main id="main" className="flex-1">
      <div className="mx-auto max-w-5xl px-4 py-12 md:px-6 md:py-16">
        <h1 className="text-center text-2xl font-bold tracking-tight text-balance md:text-3xl">
          Lacak Pesanan
        </h1>
        <p className="text-muted-foreground mt-2 text-center text-sm leading-relaxed">
          Masukkan nomor invoice dan kontak yang kamu gunakan saat checkout.
        </p>

        <div className="mt-8 flex justify-center">
          <div className="w-full max-w-lg">
            <OrderLookup defaultInvoice={invoice} defaultContact={contact} errors={errors} />
          </div>
        </div>

        {queryValid && invoice && contact && (
          <div className="mt-6 flex justify-center">
            <div className="w-full max-w-lg">
              <LookupResultSection invoice={invoice} contact={contact} />
            </div>
          </div>
        )}

        <div className="border-border mt-12 border-t pt-10">
          <h2 className="text-lg font-bold tracking-tight">Semua Transaksi</h2>
          <p className="text-muted-foreground mt-1 text-sm">Riwayat lengkap pesanan top up.</p>
          <TransactionTable orders={orders} />
        </div>
      </div>
    </main>
  );
}
