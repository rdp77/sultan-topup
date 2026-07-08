'use client'

import { useState, useEffect } from 'react'
import { X, Megaphone } from 'lucide-react'

type Announcement = {
  id: string
  text: string
  href?: string
}

// Centralized announcement list. Add/remove entries to publish new announcements.
// Each client remembers which IDs they've dismissed in localStorage so the same
// announcement only disappears after the user explicitly closes it.
const announcements: Announcement[] = [
  { id: 'promo-juli-2026', text: 'Promo Juli! Cashback 20% untuk semua transaksi QRIS.', href: '/lacak' },
]

export function AnnouncementBar() {
  const [dismissed, setDismissed] = useState<string[]>([])
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    try {
      setDismissed(JSON.parse(localStorage.getItem('announcement-dismissed') ?? '[]'))
    } catch {
      /* empty */
    }
    setHydrated(true)
  }, [])

  const visible = announcements.filter((a) => !dismissed.includes(a.id))

  if (!hydrated || visible.length === 0) return null

  function dismiss(id: string) {
    const next = [...dismissed, id]
    setDismissed(next)
    localStorage.setItem('announcement-dismissed', JSON.stringify(next))
  }

  return (
    <>
      {visible.map((a) => (
        <div
          key={a.id}
          className="relative flex items-center justify-center gap-3 bg-primary/10 px-4 py-2.5 text-center text-sm"
          role="alert"
        >
          <Megaphone className="size-4 shrink-0 text-primary" aria-hidden="true" />
          <span className="text-foreground">
            {a.text}
            {a.href && (
              <>
                {' '}
                <a href={a.href} className="underline underline-offset-2 transition-colors hover:text-primary">
                  Lihat detail
                </a>
              </>
            )}
          </span>
          <button
            type="button"
            onClick={() => dismiss(a.id)}
            className="press ml-2 flex size-6 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
            aria-label="Tutup pengumuman"
          >
            <X className="size-4" aria-hidden="true" />
          </button>
        </div>
      ))}
    </>
  )
}