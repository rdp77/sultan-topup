'use client'

import { AlertTriangle, Check, Loader2 } from 'lucide-react'
import { SectionHeading } from './section-heading'
import type { useEmailValidation } from '@/hooks/use-email-validation'

interface ContactStepProps {
  step: number
  email: string
  onEmailChange: (value: string) => void
  emailValidation: ReturnType<typeof useEmailValidation>
  whatsapp: string
  onWhatsappChange: (value: string) => void
  waValid: boolean
  touched: boolean
}

export function ContactStep({
  step,
  email,
  onEmailChange,
  emailValidation,
  whatsapp,
  onWhatsappChange,
  waValid,
  touched,
}: Readonly<ContactStepProps>) {
  return (
    <section className="rounded-xl bg-card p-4 md:p-6">
      <SectionHeading step={step} title="Info Kontak" />
      <p className="mt-2 text-xs text-muted-foreground">
        Bukti pembelian dan status pesanan akan dikirim ke kontak ini.
      </p>
      <div className="mt-4 flex flex-col gap-3 sm:flex-row">
        <div className="flex-1">
          <label htmlFor="email" className="mb-1.5 block text-sm text-muted-foreground">
            Email
          </label>
          <div className="relative">
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => onEmailChange(e.target.value)}
              placeholder="nama@email.com"
              className="w-full rounded-md border border-input bg-background px-3 py-2.5 pr-10 text-sm outline-none transition-colors duration-200 placeholder:text-muted-foreground/60 focus:border-primary focus:ring-2 focus:ring-primary/30"
            />
            {emailValidation.formatOk && emailValidation.checking && (
              <Loader2
                className="absolute right-3 top-1/2 size-4 -translate-y-1/2 animate-spin text-muted-foreground"
                aria-hidden="true"
              />
            )}
            {emailValidation.formatOk && emailValidation.serverValid === true && (
              <Check
                className="absolute right-3 top-1/2 size-4 -translate-y-1/2 text-success"
                aria-hidden="true"
              />
            )}
            {emailValidation.formatOk && emailValidation.serverValid === false && (
              <AlertTriangle
                className="absolute right-3 top-1/2 size-4 -translate-y-1/2 text-destructive"
                aria-hidden="true"
              />
            )}
          </div>
          {touched && email !== '' && !emailValidation.formatOk && (
            <p className="mt-1.5 text-xs text-destructive">Format email tidak valid</p>
          )}
          {touched && emailValidation.formatOk && emailValidation.serverValid === false && (
            <p className="mt-1.5 text-xs text-destructive">
              Domain email tidak ditemukan. Pastikan alamat email benar.
            </p>
          )}
        </div>
        <div className="flex-1">
          <label htmlFor="whatsapp" className="mb-1.5 block text-sm text-muted-foreground">
            Nomor WhatsApp
          </label>
          <input
            id="whatsapp"
            type="tel"
            inputMode="tel"
            value={whatsapp}
            onChange={(e) => onWhatsappChange(e.target.value.replace(/\D/g, ''))}
            placeholder="08xxxxxxxxxx"
            className="w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm outline-none transition-colors duration-200 placeholder:text-muted-foreground/60 focus:border-primary focus:ring-2 focus:ring-primary/30"
          />
          {touched && !waValid && (
            <p className="mt-1.5 text-xs text-destructive">
              Masukkan nomor WhatsApp yang valid (08xx)
            </p>
          )}
        </div>
      </div>
    </section>
  )
}
