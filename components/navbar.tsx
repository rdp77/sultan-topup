'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import Image from 'next/image';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';

const links = [
  { href: '/', label: 'Beranda' },
  { href: '/lacak', label: 'Lacak Pesanan' },
  { href: '/leaderboard', label: 'Leaderboard' },
];

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="border-border bg-background/90 border-b backdrop-blur">
      {/* Skip link — keyboard a11y */}
      <a
        href="#main"
        className="focus:bg-primary focus:text-primary-foreground sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-60 focus:rounded-md focus:px-3 focus:py-2 focus:text-sm"
      >
        Lewati ke konten
      </a>

      <nav className="mx-auto flex h-16 max-w-300 items-center justify-between px-4 md:px-6">
        <Link
          href="/"
          className="focus-visible:ring-primary/60 focus-visible:ring-offset-background flex items-center gap-2 rounded-md focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
        >
          <Image
            src="/logo.png"
            alt="Sultan Top Up Logo"
            width={32}
            height={32}
            className="h-8 w-auto"
            priority
          />
        </Link>

        <div className="hidden items-center gap-6 md:flex">
          {links.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'hover:text-foreground focus-visible:ring-primary/60 focus-visible:ring-offset-background relative rounded-md text-sm transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
                  active ? 'text-foreground font-medium' : 'text-muted-foreground'
                )}
              >
                {link.label}
                {active && (
                  <span
                    aria-hidden="true"
                    className="bg-primary absolute right-0 bottom-[-1.45rem] left-0 h-0.5 rounded-full"
                  />
                )}
              </Link>
            );
          })}
          <Link
            href="/login"
            className="press border-border text-foreground hover:bg-card focus-visible:ring-primary/60 focus-visible:ring-offset-background rounded-lg border px-4 py-2 text-sm transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
          >
            Masuk
          </Link>
        </div>

        <button
          type="button"
          className="text-muted-foreground hover:text-foreground focus-visible:ring-primary/60 flex size-9 items-center justify-center rounded-md transition-colors focus-visible:ring-2 focus-visible:outline-none md:hidden"
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          aria-label={open ? 'Tutup menu' : 'Buka menu'}
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </nav>

      {/* Mobile menu — CSS height transition instead of instant show/hide */}
      <div
        className="border-border overflow-hidden md:hidden"
        style={{
          maxHeight: open ? 320 : 0,
          borderTopWidth: open ? 1 : 0,
          transition: 'max-height 220ms ease, border-top-width 0ms ease',
        }}
        aria-hidden={!open}
      >
        <div className="flex flex-col gap-1 px-4 py-3">
          {links.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'focus-visible:ring-primary/60 rounded-md px-3 py-2.5 text-sm transition-colors duration-200 focus-visible:ring-2 focus-visible:outline-none',
                  active
                    ? 'bg-card text-foreground font-medium'
                    : 'text-muted-foreground hover:bg-card hover:text-foreground'
                )}
              >
                {link.label}
              </Link>
            );
          })}
          <Link
            href="/login"
            onClick={() => setOpen(false)}
            className="border-border hover:bg-card focus-visible:ring-primary/60 mt-1 rounded-md border px-3 py-2.5 text-center text-sm transition-colors duration-200 focus-visible:ring-2 focus-visible:outline-none"
          >
            Masuk
          </Link>
        </div>
      </div>
    </header>
  );
}
