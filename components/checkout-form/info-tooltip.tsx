'use client';

import { useRef, useState } from 'react';
import { Info } from 'lucide-react';

export function InfoTooltip({ children }: Readonly<{ children: React.ReactNode }>) {
  const ref = useRef<HTMLButtonElement>(null);
  const [show, setShow] = useState(false);
  return (
    <span className="relative inline-flex items-center">
      <button
        type="button"
        ref={ref}
        onClick={() => setShow(!show)}
        onBlur={() => setTimeout(() => setShow(false), 150)}
        className="border-border bg-background text-muted-foreground hover:text-foreground focus-visible:ring-primary/60 ml-1 inline-flex size-4 cursor-pointer items-center justify-center rounded-full border text-xs transition-colors focus-visible:ring-2 focus-visible:outline-none"
        aria-label="Cara mendapatkan ID"
      >
        <Info className="size-3" aria-hidden="true" />
      </button>
      {show && (
        <span
          role="tooltip"
          className="border-border bg-card text-muted-foreground absolute bottom-full left-1/2 z-50 mb-2 w-52 -translate-x-1/2 rounded-lg border p-3 text-left text-xs leading-relaxed shadow-lg"
        >
          {children}
        </span>
      )}
    </span>
  );
}
