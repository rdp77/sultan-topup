'use client'

import { useRef, useState } from 'react'
import { Info } from 'lucide-react'

export function InfoTooltip({ children }: Readonly<{ children: React.ReactNode }>) {
  const ref = useRef<HTMLButtonElement>(null)
  const [show, setShow] = useState(false)
  return (
    <span className="relative inline-flex items-center">
      <button
        type="button"
        ref={ref}
        onClick={() => setShow(!show)}
        onBlur={() => setTimeout(() => setShow(false), 150)}
        className="ml-1 inline-flex size-4 cursor-pointer items-center justify-center rounded-full border border-border bg-background text-xs text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
        aria-label="Cara mendapatkan ID"
      >
        <Info className="size-3" aria-hidden="true" />
      </button>
      {show && (
        <span
          role="tooltip"
          className="absolute bottom-full left-1/2 z-50 mb-2 w-52 -translate-x-1/2 rounded-lg border border-border bg-card p-3 text-left text-xs leading-relaxed text-muted-foreground shadow-lg"
        >
          {children}
        </span>
      )}
    </span>
  )
}
