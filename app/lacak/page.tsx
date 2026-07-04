import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { OrderLookup } from '@/components/order-lookup'

export const metadata = {
  title: 'Lacak Pesanan — TopUpin',
}

export default function LookupPage() {
  return (
    <div className="flex min-h-svh flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="mx-auto max-w-lg px-4 py-12 md:px-6 md:py-16">
          <h1 className="text-balance text-center text-2xl font-bold tracking-tight md:text-3xl">
            Lacak Pesanan
          </h1>
          <p className="mt-2 text-center text-sm leading-relaxed text-muted-foreground">
            Masukkan nomor invoice dan kontak yang kamu gunakan saat checkout.
          </p>
          <div className="mt-8">
            <OrderLookup />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
