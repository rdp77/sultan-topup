'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { Zap, Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'

const links = [
  { href: '/', label: 'Beranda' },
  { href: '/lacak', label: 'Lacak Pesanan' },
  { href: '/leaderboard', label: 'Leaderboard' },
]

export function Navbar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur">
      <nav className="mx-auto flex h-16 max-w-[1200px] items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex size-8 items-center justify-center rounded-md bg-primary">
            <Zap className="size-4 text-primary-foreground" aria-hidden="true" />
          </span>
          <span className="text-lg font-bold tracking-tight">TopUpin</span>
        </Link>

        <div className="hidden items-center gap-6 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'text-sm transition-colors duration-200 hover:text-foreground',
                pathname === link.href ? 'text-foreground font-medium' : 'text-muted-foreground',
              )}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/login"
            className="rounded-md border border-border px-4 py-2 text-sm text-foreground transition-colors duration-200 hover:bg-card"
          >
            Masuk
          </Link>
        </div>

        <button
          type="button"
          className="flex size-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:text-foreground md:hidden"
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          aria-label={open ? 'Tutup menu' : 'Buka menu'}
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-border px-4 py-3 md:hidden">
          <div className="flex flex-col gap-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={cn(
                  'rounded-md px-3 py-2.5 text-sm transition-colors duration-200',
                  pathname === link.href
                    ? 'bg-card text-foreground font-medium'
                    : 'text-muted-foreground hover:bg-card hover:text-foreground',
                )}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/login"
              onClick={() => setOpen(false)}
              className="mt-1 rounded-md border border-border px-3 py-2.5 text-center text-sm transition-colors duration-200 hover:bg-card"
            >
              Masuk
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
