import { formatRupiah } from '@/lib/utils';

interface OrderSummaryProps {
  gameName: string;
  productLabel: string;
  total: number;
}

export function OrderSummary({ gameName, productLabel, total }: Readonly<OrderSummaryProps>) {
  return (
    <dl className="border-border mt-5 flex flex-col gap-2 border-t pt-4 text-left text-sm">
      <div className="flex justify-between">
        <dt className="text-muted-foreground">Game</dt>
        <dd>{gameName}</dd>
      </div>
      <div className="flex justify-between">
        <dt className="text-muted-foreground">Produk</dt>
        <dd>{productLabel}</dd>
      </div>
      <div className="border-border flex justify-between border-t pt-2 font-semibold">
        <dt>Total</dt>
        <dd className="text-primary">{formatRupiah(total)}</dd>
      </div>
    </dl>
  );
}
