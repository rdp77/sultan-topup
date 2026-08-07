import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

export function CopyButton({
  text,
  label = 'Salin',
  onCopy,
}: Readonly<{ text: string; label?: string; onCopy?: () => void }>) {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    if (copied || !text) return;
    navigator.clipboard?.writeText(text);
    setCopied(true);
    onCopy?.();
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="press border-border text-foreground hover:bg-card inline-flex shrink-0 items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs font-medium transition-colors duration-200"
    >
      {copied ? (
        <>
          <Check className="size-3" aria-hidden="true" />
          Tersalin
        </>
      ) : (
        <>
          <Copy className="size-3" aria-hidden="true" />
          {label}
        </>
      )}
    </button>
  );
}
