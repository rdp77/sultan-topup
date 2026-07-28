'use client';

import { useState, useCallback } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { FaqItem } from '@/lib/faq';

export function FaqAccordion({ items }: { items: FaqItem[] }) {
  const [openItems, setOpenItems] = useState<Set<number>>(new Set());

  const toggle = useCallback((idx: number) => {
    setOpenItems((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) {
        next.delete(idx);
      } else {
        next.add(idx);
      }
      return next;
    });
  }, []);

  if (items.length === 0) {
    return (
      <div className="border-border bg-card rounded-xl border px-6 py-10 text-center">
        <p className="text-muted-foreground text-sm">Belum ada pertanyaan untuk kategori ini.</p>
      </div>
    );
  }

  return (
    <div className="divide-border border-border bg-card divide-y rounded-xl border">
      {items.map((item, idx) => {
        const isOpen = openItems.has(idx);

        return (
          <div key={idx} id={`faq-${idx}`}>
            <button
              type="button"
              onClick={() => toggle(idx)}
              aria-expanded={isOpen}
              className="text-foreground hover:bg-card/60 focus-visible:ring-primary/60 flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none focus-visible:ring-inset"
            >
              <span className="pr-2">{item.question}</span>
              <ChevronDown
                className={cn(
                  'text-muted-foreground size-4 shrink-0 transition-transform duration-200',
                  isOpen && 'rotate-180'
                )}
                aria-hidden="true"
              />
            </button>
            <div
              className={cn(
                'grid transition-all duration-200 ease-out',
                isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
              )}
            >
              <div className="overflow-hidden">
                <p className="text-muted-foreground px-5 pb-4 text-sm leading-relaxed">
                  {item.answer}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
