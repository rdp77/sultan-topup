import Link from 'next/link'
import { Home } from 'lucide-react'

export default function NotFound() {
  return (
    
      <main id="main" className="flex flex-1 items-center justify-center px-4 py-16 md:px-6">
        <div className="text-center">
          <p className="text-6xl font-bold tracking-tighter text-primary md:text-8xl">404</p>
          <h1 className="mt-4 text-xl font-bold tracking-tight md:text-2xl">
            Halaman tidak ditemukan
          </h1>
          <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
            Mungkin halaman sudah dipindahkan atau kamu salah ketik URL. Yuk balik ke beranda.
          </p>
          <Link
            href="/"
            className="press mt-6 inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors duration-200 hover:bg-primary/90"
          >
            <Home className="size-4" aria-hidden="true" />
            Kembali ke Beranda
          </Link>
        </div>
      </main>
  )
}