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
    <header className="sticky top-10.5 z-50 border-b border-border bg-background/90 backdrop-blur">
      {/* Skip link — keyboard a11y */}
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-2 focus:top-2 focus:z-60 focus:rounded-md focus:bg-primary focus:px-3 focus:py-2 focus:text-sm focus:text-primary-foreground"
      >
        Lewati ke konten
      </a>

      <nav className="mx-auto flex h-16 max-w-300 items-center justify-between px-4 md:px-6">
        <Link
          href="/"
          className="flex items-center gap-2 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          <span className="flex size-8 items-center justify-center rounded-md bg-primary">
            <Zap className="size-4 text-primary-foreground" aria-hidden="true" />
          </span>
          <span className="text-lg font-bold tracking-tight">Sultan Top Up</span>
        </Link>

        <div className="hidden items-center gap-6 md:flex">
          {links.map((link) => {
            const active = pathname === link.href
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'relative rounded-md text-sm transition-colors duration-200 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background',
                  active ? 'text-foreground font-medium' : 'text-muted-foreground',
                )}
              >
                {link.label}
                {active && (
                  <span
                    aria-hidden="true"
                    className="absolute bottom-[-1.45rem] left-0 right-0 h-0.5 rounded-full bg-primary"
                  />
                )}
              </Link>
            )
          })}
          <Link
            href="/login"
            className="press rounded-lg border border-border px-4 py-2 text-sm text-foreground transition-colors duration-200 hover:bg-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            Masuk
          </Link>
        </div>

        <button
          type="button"
          className="flex size-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 md:hidden"
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          aria-label={open ? 'Tutup menu' : 'Buka menu'}
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </nav>

      {/* Mobile menu — CSS height transition instead of instant show/hide */}
      <div
        className="overflow-hidden border-border md:hidden"
        style={{
          maxHeight: open ? 320 : 0,
          borderTopWidth: open ? 1 : 0,
          transition: 'max-height 220ms ease, border-top-width 0ms ease',
        }}
        aria-hidden={!open}
      >
        <div className="flex flex-col gap-1 px-4 py-3">
          {links.map((link) => {
            const active = pathname === link.href
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'rounded-md px-3 py-2.5 text-sm transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60',
                  active
                    ? 'bg-card text-foreground font-medium'
                    : 'text-muted-foreground hover:bg-card hover:text-foreground',
                )}
              >
                {link.label}
              </Link>
            )
          })}
          <Link
            href="/login"
            onClick={() => setOpen(false)}
            className="mt-1 rounded-md border border-border px-3 py-2.5 text-center text-sm transition-colors duration-200 hover:bg-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
          >
            Masuk
          </Link>
        </div>
      </div>
    </header>
  )
}
