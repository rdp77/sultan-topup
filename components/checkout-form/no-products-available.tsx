import { PackageX } from 'lucide-react';

export function NoProductsAvailable() {
  return (
    <div className="bg-card flex flex-col items-center gap-2 rounded-xl p-8 text-center">
      <PackageX className="text-muted-foreground size-8" aria-hidden="true" />
      <p className="text-sm font-medium">Produk belum tersedia</p>
      <p className="text-muted-foreground text-xs">
        Nominal top up untuk game ini sedang tidak tersedia. Silakan cek kembali nanti.
      </p>
    </div>
  );
}
