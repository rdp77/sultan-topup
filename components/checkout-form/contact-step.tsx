'use client';

import { AlertTriangle, Check, Loader2 } from 'lucide-react';
import { SectionHeading } from './section-heading';
import type { useEmailValidation } from '@/hooks/use-email-validation';

interface ContactStepProps {
  step: number;
  email: string;
  onEmailChange: (value: string) => void;
  emailValidation: ReturnType<typeof useEmailValidation>;
  whatsapp: string;
  onWhatsappChange: (value: string) => void;
  waValid: boolean;
  touched: boolean;
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
    <section className="bg-card rounded-xl p-4 md:p-6">
      <SectionHeading step={step} title="Info Kontak" />
      <p className="text-muted-foreground mt-2 text-xs">
        Bukti pembelian dan status pesanan akan dikirim ke kontak ini.
      </p>
      <div className="mt-4 flex flex-col gap-3 sm:flex-row">
        <div className="flex-1">
          <label htmlFor="email" className="text-muted-foreground mb-1.5 block text-sm">
            Email
          </label>
          <div className="relative">
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => onEmailChange(e.target.value)}
              placeholder="nama@email.com"
              className="border-input bg-background placeholder:text-muted-foreground/60 focus:border-primary focus:ring-primary/30 w-full rounded-md border px-3 py-2.5 pr-10 text-sm transition-colors duration-200 outline-none focus:ring-2"
            />
            {emailValidation.formatOk && emailValidation.checking && (
              <Loader2
                className="text-muted-foreground absolute top-1/2 right-3 size-4 -translate-y-1/2 animate-spin"
                aria-hidden="true"
              />
            )}
            {emailValidation.formatOk && emailValidation.serverValid === true && (
              <Check
                className="text-success absolute top-1/2 right-3 size-4 -translate-y-1/2"
                aria-hidden="true"
              />
            )}
            {emailValidation.formatOk && emailValidation.serverValid === false && (
              <AlertTriangle
                className="text-destructive absolute top-1/2 right-3 size-4 -translate-y-1/2"
                aria-hidden="true"
              />
            )}
          </div>
          {touched && email !== '' && !emailValidation.formatOk && (
            <p className="text-destructive mt-1.5 text-xs">Format email tidak valid</p>
          )}
          {touched && emailValidation.formatOk && emailValidation.serverValid === false && (
            <p className="text-destructive mt-1.5 text-xs">
              Domain email tidak ditemukan. Pastikan alamat email benar.
            </p>
          )}
        </div>
        <div className="flex-1">
          <label htmlFor="whatsapp" className="text-muted-foreground mb-1.5 block text-sm">
            Nomor WhatsApp
          </label>
          <input
            id="whatsapp"
            type="tel"
            inputMode="tel"
            value={whatsapp}
            onChange={(e) => onWhatsappChange(e.target.value.replace(/\D/g, ''))}
            placeholder="08xxxxxxxxxx"
            className="border-input bg-background placeholder:text-muted-foreground/60 focus:border-primary focus:ring-primary/30 w-full rounded-md border px-3 py-2.5 text-sm transition-colors duration-200 outline-none focus:ring-2"
          />
          {touched && !waValid && (
            <p className="text-destructive mt-1.5 text-xs">
              Masukkan nomor WhatsApp yang valid (08xx)
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
