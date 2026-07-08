import { Suspense } from 'react'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { BayarCard } from '@/components/bayar-card'

export const metadata = {
  title: 'Pembayaran — Sultan Top Up',
}

export default function BayarPage() {
  return (
    <div className="flex min-h-svh flex-col">
      <Navbar />
      <main id="main" className="flex-1">
        <div className="mx-auto max-w-lg px-4 py-12 md:px-6 md:py-16">
          <Suspense
            fallback={
              <div className="flex flex-col gap-4">
                <div className="mx-auto h-8 w-48 animate-pulse rounded bg-muted" />
                <div className="h-80 animate-pulse rounded-xl bg-card" />
              </div>
            }
          >
            <BayarCard />
          </Suspense>
        </div>
      </main>
      <Footer />
    </div>
  )
}