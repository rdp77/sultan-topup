import { CopyButton } from './copy-button';
import posthog from 'posthog-js';

export function VaNumberDisplay({
  number,
  bankCode,
}: Readonly<{ number: string; bankCode: string }>) {
  return (
    <div className="bg-background flex flex-col gap-2 rounded-lg p-4 text-left">
      <div className="flex items-center justify-between gap-2">
        <span className="text-muted-foreground text-xs">Nomor Virtual Account</span>
        <CopyButton
          text={number}
          label="Salin VA"
          onCopy={() => posthog.capture('va_number_copied', { bank: bankCode })}
        />
      </div>
      <span className="text-foreground font-mono text-lg font-semibold tracking-wide">
        {number || '—'}
      </span>
      <p className="text-muted-foreground text-xs">
        Penerima:{' '}
        <span className="text-foreground font-medium">
          Sultan Top Up ({bankCode.toUpperCase()})
        </span>
      </p>
    </div>
  );
}
