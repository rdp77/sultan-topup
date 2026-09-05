import Image from 'next/image';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { after } from 'next/server';
import { ShieldCheck, Zap } from 'lucide-react';
import { GameService, PaymentMethodService } from '@/services';
import { CheckoutForm } from '@/components/checkout-form';
import { getPostHogClient } from '@/lib/posthog-server';
import { mapPaymentGroups } from '@/lib/payment-methods';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const { data: game } = await GameService.detail(slug).catch(() => ({ data: null }));

  if (!game) {
    return { title: 'Game Tidak Ditemukan — Sultan Top Up' };
  }

  const title = `Top Up ${game.name} — Cepat, Murah, Aman | Sultan Top Up`;
  const description = `Top up ${game.name} murah, cepat, dan aman. ${game.publisher}. Pembayaran QRIS, E-Wallet, Virtual Account. Proses otomatis 24 jam.`;

  return {
    title,
    description,
    keywords: [
      `top up ${game.name.toLowerCase()}`,
      `top up ${game.publisher.toLowerCase()}`,
      `beli diamond ${game.name.toLowerCase()}`,
      `top up game murah`,
      `top up ${game.slug}`,
    ],
    alternates: { canonical: `https://sultantopup.com/game/${slug}` },
    openGraph: {
      title,
      description,
      url: `https://sultantopup.com/game/${slug}`,
      siteName: 'Sultan Top Up',
      images: [
        { url: 'https://sultantopup.com/og-image.png', width: 1200, height: 630, alt: title },
      ],
      locale: 'id_ID',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['https://sultantopup.com/og-image.png'],
    },
  };
}

export default async function GamePage({ params }: PageProps) {
  const { slug } = await params;
  const { data: game } = await GameService.detail(slug).catch(() => ({ data: null }));
  if (!game) notFound();

  // Fetch payment methods on the server (GET → Server Component).
  const paymentGroups = mapPaymentGroups(
    (await PaymentMethodService.list(game.id).catch(() => [])) ?? []
  );

  const posthog = getPostHogClient();
  posthog.capture({
    distinctId: 'anonymous',
    event: 'game_page_viewed',
    properties: {
      game_slug: slug,
      game_name: game.name,
      game_publisher: game.publisher,
      product_count: game.products.length,
    },
  });
  // Flush analytics after the response is sent — don't block rendering on it.
  after(() => posthog.flush());

  // JSON-LD: BreadcrumbList + Product (real prices from the product list)
  const prices = game.products
    .map((p) => Number(p.sell_price))
    .filter((p) => Number.isFinite(p) && p > 0);
  const gameJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Beranda', item: 'https://sultantopup.com' },
          {
            '@type': 'ListItem',
            position: 2,
            name: `Top Up ${game.name}`,
            item: `https://sultantopup.com/game/${game.slug}`,
          },
        ],
      },
      {
        '@type': 'Product',
        name: `Top Up ${game.name}`,
        description: `Top up ${game.name} murah, cepat, dan aman. Publisher: ${game.publisher}. Proses otomatis 24 jam di Sultan Top Up.`,
        image: game.cover || undefined,
        brand: { '@type': 'Brand', name: game.publisher },
        offers: {
          '@type': 'AggregateOffer',
          priceCurrency: 'IDR',
          lowPrice: prices.length > 0 ? Math.min(...prices) : 0,
          highPrice: prices.length > 0 ? Math.max(...prices) : 0,
          offerCount: game.products.length,
          availability: 'https://schema.org/InStock',
          url: `https://sultantopup.com/game/${game.slug}`,
          seller: { '@id': 'https://sultantopup.com' },
        },
        url: `https://sultantopup.com/game/${game.slug}`,
      },
    ],
  };

  const placeholder = {
    id: 0,
    cover: process.env.NEXT_PUBLIC_PLACEHOLDER_IMAGE || '',
    name: 'Game not found',
    slug: 'not-found',
    publisher: 'Unknown',
    products: [],
    created_at: '',
    updated_at: '',
  };

  return (
    <main id="main" className="flex-1">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(gameJsonLd).replaceAll('<', String.raw`\u003c`),
        }}
      />
      {/* Banner */}
      <div className="relative h-40 w-full overflow-hidden md:h-56">
        <Image
          src={game.cover || placeholder.cover}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-top opacity-40 blur-sm"
        />
        <div className="from-background via-background/60 absolute inset-0 bg-linear-to-t to-transparent" />
      </div>

      <div className="mx-auto max-w-300 px-4 md:px-6">
        {/* Game info — solid panel pulled over the banner so name/publisher
              stay readable on desktop (where the overlap sits on a bright part
              of the banner) and on mobile alike. */}
        <div className="border-border bg-background/90 supports-backdrop-filter:bg-background/70 -mt-12 rounded-2xl border p-4 backdrop-blur md:-mt-16 md:flex md:items-end md:gap-5 md:p-5">
          <div className="border-border relative size-20 shrink-0 overflow-hidden rounded-xl border shadow-[0_8px_24px_-6px_rgba(99,102,241,0.25)] md:size-24">
            <Image
              src={game.cover || placeholder.cover}
              alt={game.name}
              fill
              sizes="96px"
              className="object-cover"
            />
          </div>
          <div className="mt-3 md:mt-0 md:pb-1">
            <h1 className="text-xl leading-tight font-bold tracking-tight md:text-2xl">
              {game.name}
            </h1>
            <p className="text-muted-foreground mt-1 text-sm">{game.publisher}</p>
            <div className="mt-2 flex flex-wrap gap-2">
              <span className="bg-card text-muted-foreground flex items-center gap-1 rounded-md px-2 py-1 text-xs">
                <Zap className="text-primary size-3" aria-hidden="true" />
                Proses Instan
              </span>
              <span className="bg-card text-muted-foreground flex items-center gap-1 rounded-md px-2 py-1 text-xs">
                <ShieldCheck className="text-primary size-3" aria-hidden="true" />
                Resmi &amp; Aman
              </span>
            </div>
          </div>
        </div>

        {/* Checkout */}
        <div className="mx-auto mt-6 max-w-3xl pb-16 md:mt-8 md:pb-24">
          <CheckoutForm game={game} paymentGroups={paymentGroups} />
        </div>
      </div>
    </main>
  );
}
