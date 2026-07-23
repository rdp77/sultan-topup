import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { AnnouncementBar } from '@/components/announcement-bar'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import './globals.css'
import { FloatingWhatsApp } from '@/components/floating-whatsapp'
import { GoogleAnalytics } from '@next/third-parties/google'
import { contactConfig } from '@/lib/contact'

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] })
const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Sultan Top Up — Top Up Game Cepat & Aman',
  description:
    'Top up diamond, UC, dan voucher game favoritmu dalam hitungan detik. Proses otomatis 24 jam, pembayaran QRIS, E-Wallet, dan Virtual Account.',
  keywords: [
    'top up game, top up diamond, top up uc, top up voucher, top up mobile legends, top up free fire, top up pubg mobile, top up valorant, top up codm, top up genshin impact, top up mlbb, top up ff, top up pubgm, top up valorant points, top up cod points, top up genshin impact primogems',
  ],
  authors: [{ name: 'Sultan Top Up', url: 'https://sultantopup.com' }],
  robots: {
    index: true,
    follow: true,
    nocache: true,
  },
  alternates: {
    canonical: 'https://sultantopup.com',
    languages: {
      'id-ID': 'https://sultantopup.com',
    },
  },
  creator: 'Sultan Top Up',
  publisher: 'Sultan Top Up',
  openGraph: {
    title: 'Sultan Top Up — Top Up Game Cepat & Aman',
    description:
      'Top up diamond, UC, dan voucher game favoritmu dalam hitungan detik. Proses otomatis 24 jam, pembayaran QRIS, E-Wallet, dan Virtual Account.',
    url: 'https://sultantopup.com',
    siteName: 'Sultan Top Up',
    images: [
      {
        url: 'https://sultantopup.com/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Sultan Top Up — Top Up Game Cepat & Aman',
      },
    ],
    locale: 'id_ID',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@sultantopupofficial',
    creator: '@sultantopupofficial',
    title: 'Sultan Top Up — Top Up Game Cepat & Aman',
    description:
      'Top up diamond, UC, dan voucher game favoritmu dalam hitungan detik. Proses otomatis 24 jam, pembayaran QRIS, E-Wallet, dan Virtual Account.',
    images: [
      {
        url: 'https://sultantopup.com/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Sultan Top Up — Top Up Game Cepat & Aman',
      },
    ],
  },
  verification: {
    google: 'LIovFvCv7ZsFCgRA_RCpxPfs5TqUAaipyj7jCt5P_so',
    me: 'https://sultantopup.com',
  },
}

export const viewport: Viewport = {
  colorScheme: 'dark',
  themeColor: '#040819',
}

const jsonLdOrganization = {
  '@type': 'Organization',
  '@id': 'https://sultantopup.com',
  name: 'Sultan Top Up',
  url: 'https://sultantopup.com',
  logo: 'https://sultantopup.com/logo.png',
  description: 'Jasa top up game cepat dan aman',
  sameAs: [
    'https://instagram.com/sultantopupofficial',
    'https://tiktok.com/@sultantopupofficial',
    'https://threads.net/@sultantopupofficial',
    'https://youtube.com/@sultantopupofficial',
    'https://facebook.com/sultantopupofficial',
  ],
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'customer service',
    url: 'https://sultantopup.com',
    email: contactConfig.email,
    telephone: contactConfig.whatsapp,
  },
}

const jsonLdWebSite = {
  '@type': 'WebSite',
  '@id': 'https://sultantopup.com/#website',
  name: 'Sultan Top Up',
  url: 'https://sultantopup.com',
  description: 'Jasa top up game cepat dan aman',
  publisher: { '@id': 'https://sultantopup.com' },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [jsonLdOrganization, jsonLdWebSite],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="id" className={`${geistSans.variable} ${geistMono.variable} bg-background`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd).replaceAll('<', String.raw`\u003c`),
          }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `if('serviceWorker' in navigator){navigator.serviceWorker.register('/sw.js')}`,
          }}
        />
      </head>
      <body className="font-sans antialiased">
        <FloatingWhatsApp href={contactConfig.whatsappLink} />
        <div className="flex min-h-svh flex-col">
          <div className="sticky top-0 z-50">
            <AnnouncementBar />
            <Navbar />
          </div>
          <div className="flex-1">{children}</div>
          <Footer />
        </div>
        <GoogleAnalytics gaId="G-EDHJ84L47B" />
      </body>
    </html>
  )
}
