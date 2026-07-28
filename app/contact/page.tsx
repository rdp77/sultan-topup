import type { Metadata } from 'next';
import { Phone, Mail, Clock, MapPin } from 'lucide-react';
import { ContactForm } from '@/components/contact-form';
import { contactConfig } from '@/lib/contact';

export const metadata: Metadata = {
  title: 'Kontak - Sultan Top Up',
  description:
    'Hubungi tim Sultan Top Up untuk bantuan, pertanyaan, atau masukan. Kami siap membantu 24 jam melalui WhatsApp, email, atau form kontak.',
  alternates: { canonical: 'https://sultantopup.com/contact' },
  openGraph: {
    title: 'Kontak - Sultan Top Up',
    description:
      'Hubungi tim Sultan Top Up untuk bantuan, pertanyaan, atau masukan. Kami siap membantu 24 jam melalui WhatsApp, email, atau form kontak.',
    url: 'https://sultantopup.com/contact',
    siteName: 'Sultan Top Up',
    locale: 'id_ID',
    type: 'website',
  },
};

export default function ContactPage() {
  const { email, whatsapp, whatsappLink, address } = contactConfig;

  return (
    <main id="main" className="flex-1">
      <div className="mx-auto max-w-2xl px-4 py-12 md:px-6 md:py-16">
        <h1 className="text-foreground text-2xl font-bold tracking-tight md:text-3xl">
          Kirim Pesan ke Tim Kami
        </h1>
        <p className="text-muted-foreground mt-2 max-w-lg text-sm leading-relaxed">
          Punya pertanyaan, masukan, atau butuh bantuan? Hubungi kami langsung atau isi form di
          bawah. Tim support siap membantu 24 jam.
        </p>

        {/* Contact info - grouped block with hierarchy */}
        <div className="border-border bg-card/50 mt-6 rounded-xl border px-5 py-4">
          {/* Action row: primary contact channels */}
          <div className="flex flex-wrap items-center gap-x-6 gap-y-1.5 text-sm">
            {whatsapp && whatsappLink && (
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground hover:text-primary inline-flex items-center gap-2 font-medium transition-colors"
              >
                <Phone className="text-primary size-3.5 shrink-0" aria-hidden="true" />
                {whatsapp}
              </a>
            )}
            {email && (
              <a
                href={`mailto:${email}`}
                className="text-foreground hover:text-primary inline-flex items-center gap-2 font-medium transition-colors"
              >
                <Mail className="text-primary size-3.5 shrink-0" aria-hidden="true" />
                {email}
              </a>
            )}
          </div>

          {/* Info row: static details, muted */}
          <div className="border-border text-muted-foreground/70 mt-2.5 flex flex-wrap items-center gap-x-5 gap-y-1 border-t pt-2.5 text-xs">
            <span className="inline-flex items-center gap-1.5">
              <Clock className="size-3 shrink-0" aria-hidden="true" />
              24 Jam / 7 Hari
            </span>
            {address && (
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="size-3 shrink-0" aria-hidden="true" />
                {address}
              </span>
            )}
          </div>
        </div>

        {/* Form */}
        <div className="border-border bg-card mt-8 rounded-xl border p-6 md:p-8">
          <ContactForm />
        </div>
      </div>
    </main>
  );
}
