import Image from 'next/image'
import { notFound } from 'next/navigation'
import { ShieldCheck, Zap } from 'lucide-react'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { CheckoutForm } from '@/components/checkout-form'
import { games, getGame } from '@/lib/data'

export function generateStaticParams() {
  return games.map((g) => ({ slug: g.slug }))
}

export default async function GamePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const game = getGame(slug)
  if (!game) notFound()

  return (
    <div className="flex min-h-svh flex-col">
      <Navbar />

      <main id="main" className="flex-1">
        {/* Banner */}
        <div className="relative h-40 w-full overflow-hidden md:h-56">
          <Image
            src={game.image || '/placeholder.svg'}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover object-top opacity-40 blur-sm"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        </div>

        <div className="mx-auto max-w-300 px-4 md:px-6">
          {/* Game info — pulls up over the banner. Name wraps to a second line
              instead of clipping; the text sits on the gradient backdrop so it
              stays readable regardless of banner content. */}
          <div className="-mt-14 flex flex-col gap-3 md:-mt-20 md:flex-row md:items-end md:gap-5">
            <div className="relative size-24 shrink-0 overflow-hidden rounded-xl border border-border shadow-[0_8px_24px_-6px_rgba(99,102,241,0.25)] md:size-28">
              <Image
                src={game.image || '/placeholder.svg'}
                alt={game.name}
                fill
                sizes="112px"
                className="object-cover"
              />
            </div>
            <div className="pb-1">
              <h1 className="max-w-[16rem] text-xl font-bold leading-tight tracking-tight md:max-w-none md:text-2xl">
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
          <div className="mx-auto max-w-3xl py-8 md:py-10">
            <CheckoutForm game={game} />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
