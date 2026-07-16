import Image from 'next/image'
import { notFound } from 'next/navigation'
import { ShieldCheck, Zap } from 'lucide-react'
import { CheckoutForm } from '@/components/checkout-form'
import { games, getGame } from '@/lib/data'
import { GameService } from '@/services/game.service'

export function generateStaticParams() {
  return games.map((g) => ({ slug: g.slug }))
}

export default async function GamePage({
  params,
}: Readonly<{
  params: Promise<{ slug: string }>
}>) {
  const { slug } = await params
  const { data: game } = await GameService.detail(slug).catch(() => ({ data: null }))
  if (!game) notFound()

  const placeholder = {
    id: 0,
    cover: '/games/mobile-legends.png',
    name: 'Game not found',
    slug: 'not-found',
    publisher: 'Unknown',
    products: [],
    created_at: '',
    updated_at: '',
  }

  return (
    <main id="main" className="flex-1">
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
        <div className="absolute inset-0 bg-linear-to-t from-background via-background/60 to-transparent" />
      </div>

      <div className="mx-auto max-w-300 px-4 md:px-6">
        {/* Game info — solid panel pulled over the banner so name/publisher
              stay readable on desktop (where the overlap sits on a bright part
              of the banner) and on mobile alike. */}
        <div className="-mt-12 rounded-2xl border border-border bg-background/90 p-4 backdrop-blur supports-backdrop-filter:bg-background/70 md:-mt-16 md:flex md:items-end md:gap-5 md:p-5">
          <div className="relative size-20 shrink-0 overflow-hidden rounded-xl border border-border shadow-[0_8px_24px_-6px_rgba(99,102,241,0.25)] md:size-24">
            <Image
              src={game.cover || placeholder.cover}
              alt={game.name}
              fill
              sizes="96px"
              className="object-cover"
            />
          </div>
          <div className="mt-3 md:mt-0 md:pb-1">
            <h1 className="text-xl font-bold leading-tight tracking-tight md:text-2xl">
              {game.name}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">{game.publisher}</p>
            <div className="mt-2 flex flex-wrap gap-2">
              <span className="flex items-center gap-1 rounded-md bg-card px-2 py-1 text-xs text-muted-foreground">
                <Zap className="size-3 text-primary" aria-hidden="true" />
                Proses Instan
              </span>
              <span className="flex items-center gap-1 rounded-md bg-card px-2 py-1 text-xs text-muted-foreground">
                <ShieldCheck className="size-3 text-primary" aria-hidden="true" />
                Resmi &amp; Aman
              </span>
            </div>
          </div>
        </div>

        {/* Checkout */}
        <div className="mx-auto mt-6 max-w-3xl pb-16 md:mt-8 md:pb-24">
          <CheckoutForm game={game} />
        </div>
      </div>
    </main>
  )
}
