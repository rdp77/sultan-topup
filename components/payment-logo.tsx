// Example payment method logos as compact SVG marks.
// These are illustrative example marks, not official brand assets. Replace with
// licensed logos before production. Each is a surface-safe monochrome shape so it
// renders on both light and dark themes.

import { cn } from '@/lib/utils'

type LogoProps = { className?: string }

export function PaymentLogo({ id, className }: { id: string; className?: string }) {
  // API sends full code like "bca-virtual-account_midtrans" — extract prefix for logo lookup
  const logoKey = id.includes('-') || id.includes('_') ? extractLogoKey(id) : id

  const map: Record<string, (p: LogoProps) => React.ReactElement | null> = {
    qris: QrisLogo,
    gopay: GoPayLogo,
    ovo: OvoLogo,
    dana: DanaLogo,
    shopeepay: ShopeePayLogo,
    bca: BcaLogo,
    bni: BniLogo,
    bri: BriLogo,
    mandiri: MandiriLogo,
    alfamart: AlfamartLogo,
  }
  const C = map[logoKey]
  if (!C) return null
  return <C className={className} />
}

/** "bca-virtual-account_midtrans" -> "bca" */
function extractLogoKey(code: string): string {
  return code.split(/[-_]/)[0]
}

function QrisLogo({ className }: LogoProps) {
  // Stylized "QR" corner-square glyph
  return (
    <svg
      viewBox="0 0 24 24"
      className={cn('size-5', className)}
      aria-hidden="true"
      fill="currentColor"
    >
      <path d="M2 2h8v8H2V2zm2 2v4h4V4H4zm8-2h8v8h-8V2zm2 2v4h4V4h-4zM2 14h8v8H2v-8zm2 2v4h4v-4H4zm10-2h2v2h-2v-2zm4 0h2v6h-2v-6zm-4 4h2v4h-2v-4zm0 4h6v2h-6v-2z" />
    </svg>
  )
}

function GoPayLogo({ className }: LogoProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={cn('size-5', className)}
      aria-hidden="true"
      fill="currentColor"
    >
      <path d="M12 4a7 7 0 1 0 6.6 9.3.8.8 0 0 0-.8-1.1h-3.3a2.6 2.6 0 1 1 0-5.2h4A7 7 0 0 0 12 4zm0 2.5a4.5 4.5 0 1 1 0 9 4.5 4.5 0 0 1 0-9z" />
    </svg>
  )
}

function OvoLogo({ className }: LogoProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={cn('size-5', className)}
      aria-hidden="true"
      fill="currentColor"
    >
      <path d="M3 5h18v14H3zM6 8v2h6v4H8v-2H6v4h8V8H6z" />
    </svg>
  )
}

function DanaLogo({ className }: LogoProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={cn('size-5', className)}
      aria-hidden="true"
      fill="currentColor"
    >
      <path d="M4 5h12a5 5 0 0 1 0 10H8v4H4V5zm4 4h7v2H8V9z" />
    </svg>
  )
}

function ShopeePayLogo({ className }: LogoProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={cn('size-5', className)}
      aria-hidden="true"
      fill="currentColor"
    >
      <path d="M5 4h14l1 5H4l1-5zm2 2-1 3h10l-.6-3H7zm-2 6h14l-1 8H6l-1-8z" />
    </svg>
  )
}

function BcaLogo({ className }: LogoProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={cn('size-5', className)}
      aria-hidden="true"
      fill="currentColor"
    >
      <path d="M3 6h18v12H3zm2 2v8h2V8H5zm4 0v8h2V8H9zm4 0v8h2V8h-2zm4 0v8h2V8h-2z" />
    </svg>
  )
}

function BniLogo({ className }: LogoProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={cn('size-5', className)}
      aria-hidden="true"
      fill="currentColor"
    >
      <path d="M4 5h3l8 14h-3L4 5zm9 0h3l4 7-2 3-5-10z" />
    </svg>
  )
}

function BriLogo({ className }: LogoProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={cn('size-5', className)}
      aria-hidden="true"
      fill="currentColor"
    >
      <path d="M3 5h18v14H3zm3 3h4v8H6V8zm6 0h5a3 3 0 0 1 .5 6L14 17v-2l2.5-3a1 1 0 0 0-.5-1.8H12V8z" />
    </svg>
  )
}

function MandiriLogo({ className }: LogoProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={cn('size-5', className)}
      aria-hidden="true"
      fill="currentColor"
    >
      <path d="M3 6h4l2 6 2-6h4l2 6 2-6h2v12h-2v-7l-2 5h-2l-2-5v7H3V6zm12 2-2 5h4l-2-5z" />
    </svg>
  )
}

function AlfamartLogo({ className }: LogoProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={cn('size-5', className)}
      aria-hidden="true"
      fill="currentColor"
    >
      <rect x="4" y="6" width="16" height="12" rx="2" />
      <path d="M8 10h3v4H8zM13 10h3v4h-3z" fill="var(--color-background, #040819)" />
    </svg>
  )
}
