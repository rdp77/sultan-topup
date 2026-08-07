import { useEffect, useState } from 'react';
import { Clock } from 'lucide-react';

export function PaymentTimer({
  expiresAt,
  onExpire,
}: Readonly<{ expiresAt: string | null; onExpire?: () => void }>) {
  const [left, setLeft] = useState<number | null>(null);
  const [initial, setInitial] = useState<number | null>(null);

  useEffect(() => {
    if (!expiresAt) return;

    const target = new Date(expiresAt).getTime();

    function tick() {
      const remaining = Math.max(0, Math.floor((target - Date.now()) / 1000));
      setLeft(remaining);
      setInitial((prev) => prev ?? remaining);
      if (remaining <= 0) onExpire?.();
    }

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [expiresAt, onExpire]);

  if (left === null || initial === null) {
    return (
      <div className="flex items-center gap-3 text-xs">
        <Clock className="text-warning size-3.5" aria-hidden="true" />
        <span className="text-muted-foreground">Memuat batas waktu...</span>
      </div>
    );
  }

  const hours = Math.floor(left / 3600);
  const minutes = Math.floor((left % 3600) / 60);
  const seconds = left % 60;
  const percentage = initial > 0 ? (left / initial) * 100 : 0;

  const display =
    hours > 0
      ? `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
      : `${minutes}:${String(seconds).padStart(2, '0')}`;

  return (
    <div className="flex items-center gap-3 text-xs">
      <Clock className="text-warning size-3.5" aria-hidden="true" />
      <span className="tabular-nums">{display}</span>
      <div className="bg-muted h-1.5 flex-1 overflow-hidden rounded-full">
        <div
          className="bg-warning h-full rounded-full transition-all duration-1000 ease-linear"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
