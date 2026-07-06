import Link from 'next/link'
import { Plus } from 'lucide-react'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { OrderList } from '@/components/order-list'

export const metadata = {
  title: 'Dashboard — Sultan Top Up',
}

export default function DashboardPage() {
  return (
    <div className="flex min-h-svh flex-col">
      <Navbar />
      <main id="main" className="flex-1">
        <div className="mx-auto max-w-3xl px-4 py-12 md:px-6 md:py-16">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Riwayat Pesanan</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Semua transaksi top up kamu ada di sini.
              </p>
            </div>
            <Link
              href="/"
              className="press flex shrink-0 items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors duration-200 hover:bg-primary/90"
            >
              <Plus className="size-4" aria-hidden="true" />
              <span className="hidden sm:inline">Top Up Baru</span>
              <span className="sm:hidden">Baru</span>
            </Link>
          </div>

          <OrderList />
        </div>
      </main>
      <Footer />
    </div>
  )
}