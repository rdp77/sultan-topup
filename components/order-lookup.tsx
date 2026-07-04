'use client'

import { useState } from 'react'
import { Loader2, Search, SearchX } from 'lucide-react'
import { OrderStatusBadge } from '@/components/order-status-badge'
import { formatRupiah, mockOrders, type Order } from '@/lib/data'

export function OrderLookup() {
  const [invoice, setInvoice] = useState('')
  const [contact, setContact] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<Order | null | 'not-found'>(null)

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    if (!invoice.trim() || !contact.trim() || loading) return
    setLoading(true)
    setResult(null)
    setTimeout(() => {
      const found = mockOrders.find(
        (o) => o.invoice.toLowerCase() === invoice.trim().toLowerCase(),
      )
      setResult(found ?? 'not-found')
      setLoading(false)
    }, 800)
  }

  return (
    <div className="flex flex-col gap-6">
      <form onSubmit={handleSearch} className="flex flex-col gap-4 rounded-xl bg-card p-5">
        <div>
          <label htmlFor="invoice" className="mb-1.5 block text-sm text-muted-foreground">
            Nomor Invoice
          </label>
          <input
            id="invoice"
            type="text"
            value={invoice}
            onChange={(e) => setInvoice(e.target.value)}
            placeholder="Contoh: INV-20260702-8F3K"
            className="w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm outline-none transition-colors duration-200 placeholder:text-muted-foreground/60 focus:border-primary focus:ring-2 focus:ring-primary/30"
          />
        </div>
        <div>
          <label htmlFor="contact" className="mb-1.5 block text-sm text-muted-foreground">
            Email / Nomor WhatsApp
          </label>
          <input
            id="contact"
            type="text"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            placeholder="nama@email.com atau 08xxxxxxxxxx"
            className="w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm outline-none transition-colors duration-200 placeholder:text-muted-foreground/60 focus:border-primary focus:ring-2 focus:ring-primary/30"
          />
        </div>
        <button
          type="submit"
          disabled={loading || !invoice.trim() || !contact.trim()}
          className="press flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors duration-200 enabled:hover:bg-primary/90 disabled:opacity-60"
        >
          {loading ? (
            <>
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
              Mencari...
            </>
          ) : (
            <>
              <Search className="size-4" aria-hidden="true" />
              Cari Pesanan
            </>
          )}
        </button>
        <p className="text-center text-xs text-muted-foreground">
          Coba dengan invoice contoh: INV-20260702-8F3K
        </p>
      </form>

      {result === 'not-found' && (
        <div className="flex flex-col items-center gap-2 rounded-xl bg-card p-8 text-center">
          <SearchX className="size-10 text-muted-foreground" aria-hidden="true" />
          <p className="text-sm font-medium">Pesanan tidak ditemukan</p>
          <p className="text-xs text-muted-foreground">
            Periksa kembali nomor invoice dan kontak yang kamu masukkan.
          </p>
        </div>
      )}

      {result && result !== 'not-found' && (
        <div className="rounded-xl bg-card p-5">
          <div className="flex items-center justify-between gap-4">
            <span className="font-mono text-xs text-muted-foreground">{result.invoice}</span>
            <OrderStatusBadge status={result.status} />
          </div>
          <dl className="mt-4 flex flex-col gap-2.5 border-t border-border pt-4 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">Game</dt>
              <dd>{result.game}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">Produk</dt>
              <dd>{result.product}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">User ID</dt>
              <dd>{result.userId}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">Metode</dt>
              <dd>{result.method}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">Tanggal</dt>
              <dd>{result.date}</dd>
            </div>
            <div className="flex justify-between gap-4 border-t border-border pt-2.5 font-semibold">
              <dt>Total</dt>
              <dd className="text-primary">{formatRupiah(result.total)}</dd>
            </div>
          </dl>
        </div>
      )}
    </div>
  )
}
