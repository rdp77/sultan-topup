import { PackageX } from 'lucide-react'

export function NoProductsAvailable() {
  return (
    <div className="flex flex-col items-center gap-2 rounded-xl bg-card p-8 text-center">
      <PackageX className="size-8 text-muted-foreground" aria-hidden="true" />
      <p className="text-sm font-medium">Produk belum tersedia</p>
      <p className="text-xs text-muted-foreground">
        Nominal top up untuk game ini sedang tidak tersedia. Silakan cek kembali nanti.
      </p>
    </div>
  )
}
