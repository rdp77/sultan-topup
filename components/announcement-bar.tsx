'use client';

import { useState, useEffect } from 'react';
import { X, Megaphone } from 'lucide-react';
import Link from 'next/link';

type Announcement = {
  id: string;
  text: string;
  href?: string;
};

// Centralized announcement list. Add/remove entries to publish new announcements.
// Each client remembers which IDs they've dismissed in localStorage so the same
// announcement only disappears after the user explicitly closes it.
const announcements: Announcement[] = [
  {
    id: 'promo-juli-2026',
    text: 'Promo Juli! Cashback 20% untuk semua transaksi QRIS.',
    href: '/lacak',
  },
];

export function AnnouncementBar() {
  const [dismissed, setDismissed] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      setDismissed(JSON.parse(localStorage.getItem('announcement-dismissed') ?? '[]'));
    } catch (err) {
      console.warn('Gagal membaca announcement-dismissed dari localStorage:', err);
    }
    setHydrated(true);
  }, []);

  const visible = announcements.filter((a) => !dismissed.includes(a.id));

  if (!hydrated || visible.length === 0) return null;

  function dismiss(id: string) {
    const next = [...dismissed, id];
    setDismissed(next);
    try {
      localStorage.setItem('announcement-dismissed', JSON.stringify(next));
    } catch (err) {
      console.warn('Gagal menyimpan announcement-dismissed ke localStorage:', err);
    }
  }

  return (
    <div className="bg-background border-border flex flex-col border-b">
      {visible.map((a) => (
        <div key={a.id} className="bg-background relative">
          <div className="bg-primary/10 absolute inset-0" aria-hidden="true" />
          <div
            className="relative flex items-center justify-center gap-3 px-4 py-2.5 text-center text-sm"
            role="alert"
          >
            <Megaphone className="text-primary size-4 shrink-0" aria-hidden="true" />
            <span className="text-foreground">
              {a.text}
              {a.href && (
                <>
                  {' '}
                  <Link
                    href={a.href}
                    className="hover:text-primary underline underline-offset-2 transition-colors"
                  >
                    Lihat detail
                  </Link>
                </>
              )}
            </span>
            <button
              type="button"
              onClick={() => dismiss(a.id)}
              className="press text-muted-foreground hover:text-foreground focus-visible:ring-primary/60 ml-2 flex size-6 shrink-0 items-center justify-center rounded-md transition-colors focus-visible:ring-2 focus-visible:outline-none"
              aria-label="Tutup pengumuman"
            >
              <X className="size-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
