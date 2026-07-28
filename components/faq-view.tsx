'use client';

import { useState, useMemo } from 'react';
import { FaqSidebar } from '@/components/faq-sidebar';
import { FaqAccordion } from '@/components/faq-accordion';
import type { FaqConfig, FaqContextData } from '@/lib/faq';

interface FaqViewProps {
  configs: FaqConfig[];
  dataMap: Record<string, FaqContextData>;
}

export function FaqView({ configs, dataMap }: FaqViewProps) {
  const [activeSlug, setActiveSlug] = useState('umum');

  const data = useMemo(() => dataMap[activeSlug] ?? null, [activeSlug, dataMap]);

  return (
    <div className="grid gap-8 lg:grid-cols-4">
      {/* Sidebar */}
      <aside className="lg:col-span-1">
        <div className="border-border bg-card sticky top-24 rounded-xl border p-4">
          <FaqSidebar configs={configs} activeSlug={activeSlug} onSelect={setActiveSlug} />
        </div>
      </aside>

      {/* Content */}
      <div className="lg:col-span-3">
        {data ? (
          <>
            <h2 className="text-foreground mb-4 text-lg font-semibold tracking-tight">
              {data.config.title}
            </h2>
            <FaqAccordion items={data.items} />
          </>
        ) : (
          <div className="border-border bg-card rounded-xl border px-6 py-10 text-center">
            <p className="text-muted-foreground text-sm">
              Konten FAQ tidak tersedia untuk kategori ini.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
