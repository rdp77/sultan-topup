import { Gamepad2 } from 'lucide-react';

export function NoGamesAvailable() {
  return (
    <div className="mt-10 flex flex-col items-center gap-2 text-center">
      <Gamepad2 className="text-muted-foreground size-8" aria-hidden="true" />
      <p className="text-sm font-medium">Belum ada game tersedia</p>
      <p className="text-muted-foreground text-xs">Silakan cek kembali beberapa saat lagi.</p>
    </div>
  );
}
