'use client'

import { cn } from '@/lib/utils'
import type { FaqConfig } from '@/lib/faq'

interface FaqSidebarProps {
  configs: FaqConfig[]
  activeSlug: string
  onSelect: (slug: string) => void
}

export function FaqSidebar({ configs, activeSlug, onSelect }: FaqSidebarProps) {
  return (
    <nav aria-label="Kategori FAQ">
      <ul className="flex flex-col gap-1">
        {configs.map((cfg) => {
          const isActive = cfg.slug === activeSlug
          return (
            <li key={cfg.slug}>
              <button
                type="button"
                onClick={() => onSelect(cfg.slug)}
                aria-current={isActive ? 'page' : undefined}
                className={cn(
                  'w-full rounded-lg px-3.5 py-2.5 text-left text-sm transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60',
                  isActive
                    ? 'bg-primary/10 text-primary font-medium'
                    : 'text-muted-foreground hover:bg-card hover:text-foreground',
                )}
              >
                {cfg.title}
              </button>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
