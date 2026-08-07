import { Loader2 } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

export function QrImage({ amount, data }: Readonly<{ amount: number; data?: string }>) {
  if (data) {
    return (
      <div className="border-border mx-auto flex size-48 items-center justify-center overflow-hidden rounded-xl border-2 bg-white p-4">
        <QRCodeSVG
          value={data}
          size={192}
          level="H" // required when embedding a logo — lower levels risk unscannable codes
          imageSettings={{
            src: '/favicon-96x96.png', // small monochrome mark, NOT full logo with wordmark
            width: 36, // keep under ~20% of `size` to stay within level H tolerance
            height: 36,
            excavate: true, // clears QR modules behind the logo instead of overlapping them
          }}
        />
      </div>
    );
  }

  return (
    <div
      className="border-border mx-auto flex size-48 animate-pulse items-center justify-center rounded-xl border-2 bg-white p-4"
      aria-label={`QRIS Rp ${amount.toLocaleString('id-ID')}`}
    >
      <Loader2 className="text-muted-foreground size-8 animate-spin" aria-hidden="true" />
    </div>
  );
}
