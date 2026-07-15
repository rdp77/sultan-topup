import { Suspense } from 'react'
import { ResultCard } from '@/components/result-card'

export const metadata = {
  title: 'Status Pesanan — Sultan Top Up',
}

export default function ResultPage() {
  return (
    
      <main id="main" className="flex-1">
        <div className="mx-auto max-w-lg px-4 py-12 md:px-6 md:py-16">
          <Suspense
            fallback={
              <div className="flex flex-col gap-4">
                <div className="mx-auto size-20 animate-pulse rounded-full bg-card" />
                <div className="mx-auto h-6 w-48 animate-pulse rounded-md bg-card" />
                <div className="h-64 animate-pulse rounded-xl bg-card" />
              </div>
            }
          >
            <ResultCard />
          </Suspense>
        </div>
      </main>
    </div>
  )
}
