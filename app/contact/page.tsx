import type { Metadata } from 'next'
import { Phone, Mail, Clock } from 'lucide-react'
import { ContactForm } from '@/components/contact-form'
import { contactConfig } from '@/lib/contact'

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
}

export default function ContactPage() {
  const { email, whatsapp, whatsappLink } = contactConfig

  return (
    <main id="main" className="flex-1">
      <div className="mx-auto max-w-2xl px-4 py-12 md:px-6 md:py-16">
        <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
          Kirim Pesan ke Tim Kami
        </h1>
        <p className="mt-2 max-w-lg text-sm leading-relaxed text-muted-foreground">
          Punya pertanyaan, masukan, atau butuh bantuan? Hubungi kami langsung atau isi form di
          bawah. Tim support siap membantu 24 jam.
        </p>

        {/* Contact info - inline strip, not 3 equal cards */}
        <ul className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
          {/* WhatsApp */}
          {whatsapp && whatsappLink && (
            <li className="flex items-center gap-2">
              <Phone className="size-3.5 shrink-0 text-primary" aria-hidden="true" />
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-foreground"
              >
                {whatsapp}
              </a>
            </li>
          )}
          <li aria-hidden="true" className="h-3.5 w-px bg-border" />
          {/* Email */}
          {email && (
            <li className="flex items-center gap-2">
              <Mail className="size-3.5 shrink-0 text-primary" aria-hidden="true" />
              <a
                href={`mailto:${email}`}
                className="transition-colors hover:text-foreground"
              >
                {email}
              </a>
            </li>
          )}
          <li aria-hidden="true" className="h-3.5 w-px bg-border" />
          <li className="flex items-center gap-2">
            <Clock className="size-3.5 shrink-0 text-primary" aria-hidden="true" />
            24 Jam / 7 Hari
          </li>
        </ul>

        {/* Form */}
        <div className="mt-8 rounded-xl border border-border bg-card p-6 md:p-8">
          <ContactForm />
        </div>
      </div>
    </main>
  )
}
