import { Search } from 'lucide-react';

interface OrderLookupProps {
  /** Pre-fill from URL search params so the form reflects the current query. */
  defaultInvoice?: string;
  defaultContact?: string;
  /** Per-field validation errors (server-rendered). */
  errors?: Record<string, string> | null;
}

/**
 * Plain HTML GET form → navigates to /lookup?invoice=...&contact=...
 * The result is rendered on the server (see LookupResult), so the URL of a
 * lookup can be shared, bookmarked, and refreshed without any client JS.
 */
export function OrderLookup({
  defaultInvoice,
  defaultContact,
  errors,
}: Readonly<OrderLookupProps>) {
  return (
    <form action="/lookup" method="GET" className="bg-card flex flex-col gap-4 rounded-xl p-5">
      <div>
        <label htmlFor="invoice" className="text-muted-foreground mb-1.5 block text-sm">
          Nomor Invoice
        </label>
        <input
          id="invoice"
          name="invoice"
          type="text"
          defaultValue={defaultInvoice}
          placeholder="Contoh: INV-20260702-8F3K"
          className="border-input bg-background placeholder:text-muted-foreground/60 focus:border-primary focus:ring-primary/30 w-full rounded-md border px-3 py-2.5 text-sm transition-colors duration-200 outline-none focus:ring-2"
        />
        {errors?.invoice && <p className="text-destructive mt-1 text-xs">{errors.invoice}</p>}
      </div>
      <div>
        <label htmlFor="contact" className="text-muted-foreground mb-1.5 block text-sm">
          Email atau No. WA
        </label>
        <input
          id="contact"
          name="contact"
          type="text"
          defaultValue={defaultContact}
          placeholder="Contoh: nama@email.com atau 0812xxxx"
          className="border-input bg-background placeholder:text-muted-foreground/60 focus:border-primary focus:ring-primary/30 w-full rounded-md border px-3 py-2.5 text-sm transition-colors duration-200 outline-none focus:ring-2"
        />
        {errors?.contact && <p className="text-destructive mt-1 text-xs">{errors.contact}</p>}
      </div>
      <button
        type="submit"
        className="press bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center justify-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold transition-colors duration-200"
      >
        <Search className="size-4" aria-hidden="true" />
        Cari Pesanan
      </button>
      <p className="text-muted-foreground text-center text-xs">
        Coba dengan invoice contoh: INV-20260702-8F3K
      </p>
    </form>
  );
}
