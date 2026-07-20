'use client'

import { AlertTriangle, Loader2, Search, UserCheck } from 'lucide-react'
import { SectionHeading } from './section-heading'
import { InfoTooltip } from './info-tooltip'
import type { usePlayerIdValidation } from '@/hooks/use-player-id-validation'
import type { GameFormConfig } from '@/lib/game-form-config'

interface AccountStepProps {
  step: number
  formConfig: GameFormConfig
  gameId: number
  productSku: string
  userId: string
  onUserIdChange: (value: string) => void
  zoneId: string
  onZoneIdChange: (value: string) => void
  touched: boolean
  playerId: ReturnType<typeof usePlayerIdValidation>
}

export function AccountStep({
  step,
  formConfig,
  gameId,
  productSku,
  userId,
  onUserIdChange,
  zoneId,
  onZoneIdChange,
  touched,
  playerId,
}: Readonly<AccountStepProps>) {
  return (
    <section className="rounded-xl bg-card p-4 md:p-6">
      <SectionHeading step={step} title="Masukkan Data Akun" />
      <div className="mt-4 flex flex-col gap-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="flex-1">
            <label htmlFor="uid" className="mb-1.5 flex items-center text-sm text-muted-foreground">
              {formConfig.idLabel}
              <InfoTooltip>
                Buka game lalu masuk ke halaman profil. {formConfig.idLabel} biasanya tertera di
                pojok kiri atas layar atau di menu Pengaturan.
              </InfoTooltip>
            </label>
            <input
              id="uid"
              type="text"
              inputMode="numeric"
              value={userId}
              onChange={(e) => onUserIdChange(e.target.value)}
              placeholder={formConfig.idPlaceholder}
              className="w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm outline-none transition-colors duration-200 placeholder:text-muted-foreground/60 focus:border-primary focus:ring-2 focus:ring-primary/30"
            />
            {touched && userId.trim().length < 3 && (
              <p className="mt-1.5 text-xs text-destructive">
                {formConfig.idLabel} minimal 3 karakter
              </p>
            )}
          </div>

          <div className="w-full sm:w-36">
            <label
              htmlFor="zone-id"
              className="mb-1.5 flex items-center text-sm text-muted-foreground"
            >
              Server / Zone ID
              <InfoTooltip>
                {formConfig.needsZone
                  ? 'Buka profil game lalu cari angka di samping nama karakter, biasanya dalam format (1234).'
                  : 'Beberapa game seperti Mobile Legends memerlukan Zone ID. Jika gamenya tidak butuh, biarkan kosong.'}
              </InfoTooltip>
            </label>
            <input
              id="zone-id"
              type="text"
              inputMode="numeric"
              value={zoneId}
              onChange={(e) => onZoneIdChange(e.target.value)}
              placeholder={formConfig.needsZone ? 'Contoh: 2001' : 'Opsional'}
              disabled={!formConfig.needsZone}
              className="w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm outline-none transition-colors duration-200 placeholder:text-muted-foreground/60 focus:border-primary focus:ring-2 focus:ring-primary/30 disabled:cursor-not-allowed disabled:opacity-40"
            />
            {formConfig.needsZone && touched && zoneId.trim().length < 1 && (
              <p className="mt-1.5 text-xs text-destructive">Zone ID wajib diisi</p>
            )}
          </div>

          <div className="shrink-0">
            <button
              type="button"
              onClick={() => playerId.validate({ userId, zoneId, gameId, sku: productSku })}
              disabled={playerId.state === 'loading' || userId.trim().length < 3}
              className="press inline-flex h-10.5 shrink-0 items-center gap-1.5 rounded-lg border border-border px-4 text-xs font-medium text-foreground transition-colors duration-200 hover:bg-card disabled:opacity-50"
            >
              {playerId.state === 'loading' ? (
                <Loader2 className="size-3.5 animate-spin" aria-hidden="true" />
              ) : (
                <Search className="size-3.5" aria-hidden="true" />
              )}
              Cek Akun
            </button>
          </div>
        </div>

        <div className="-mt-1">
          {playerId.state === 'found' && playerId.player && (
            <p className="flex items-center gap-1.5 text-xs text-success">
              <UserCheck className="size-3.5" aria-hidden="true" />
              Akun ditemukan: {playerId.player}
            </p>
          )}
          {playerId.state === 'not-found' && (
            <p className="flex items-center gap-1.5 text-xs text-destructive">
              <AlertTriangle className="size-3.5" aria-hidden="true" />
              Akun tidak ditemukan. Periksa kembali {formConfig.idLabel} kamu.
            </p>
          )}
          {playerId.state === 'error' && (
            <p className="flex items-center gap-1.5 text-xs text-destructive">
              <AlertTriangle className="size-3.5" aria-hidden="true" />
              Gagal menghubungi server game. Coba lagi nanti.
            </p>
          )}
        </div>
      </div>
    </section>
  )
}
