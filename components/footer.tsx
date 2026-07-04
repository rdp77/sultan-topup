import Link from 'next/link'
import { Zap } from 'lucide-react'

export function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-300 flex-col gap-8 px-4 py-12 md:flex-row md:items-start md:justify-between md:px-6">
        <div className="max-w-xs">
          <div className="flex items-center gap-2">
            <span className="flex size-8 items-center justify-center rounded-md bg-primary">
              <Zap className="size-4 text-primary-foreground" aria-hidden="true" />
            </span>
            <span className="text-lg font-bold tracking-tight">TopUpin</span>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Platform top up game tercepat di Indonesia. Proses otomatis 24 jam, pembayaran lengkap, harga bersahabat.
          </p>
        </div>

        <div className="flex gap-16">
          <div>
            <h3 className="text-sm font-semibold">Menu</h3>
            <ul className="mt-3 flex flex-col gap-2 text-sm text-muted-foreground">
              <li>
                <Link href="/" className="transition-colors duration-200 hover:text-foreground">
                  Beranda
                </Link>
              </li>
              <li>
                <Link href="/lacak" className="transition-colors duration-200 hover:text-foreground">
                  Lacak Pesanan
                </Link>
              </li>
              <li>
                <Link href="/leaderboard" className="transition-colors duration-200 hover:text-foreground">
                  Leaderboard
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold">Akun</h3>
            <ul className="mt-3 flex flex-col gap-2 text-sm text-muted-foreground">
              <li>
                <Link href="/login" className="transition-colors duration-200 hover:text-foreground">
                  Masuk
                </Link>
              </li>
              <li>
                <Link href="/register" className="transition-colors duration-200 hover:text-foreground">
                  Daftar
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="transition-colors duration-200 hover:text-foreground">
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="border-t border-border py-4">
        <p className="text-center text-xs text-muted-foreground">
          © 2026 TopUpin. Semua hak dilindungi.
        </p>
      </div>
    </footer>
  )
}
