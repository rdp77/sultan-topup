import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { AnnouncementBar } from '@/components/announcement-bar'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import './globals.css'

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] })
const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Sultan Top Up — Top Up Game Cepat & Aman',
  description:
    'Top up diamond, UC, dan voucher game favoritmu dalam hitungan detik. Proses otomatis 24 jam, pembayaran QRIS, E-Wallet, dan Virtual Account.',
}

export const viewport: Viewport = {
  colorScheme: 'dark',
  themeColor: '#040819',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="id" className={`${geistSans.variable} ${geistMono.variable} bg-background`}>
      <body className="font-sans antialiased">
        <div className="flex min-h-svh flex-col">
          <div className="sticky top-0 z-50">
            <AnnouncementBar />
            <Navbar />
          </div>
          <div className="flex-1">{children}</div>
          <Footer />
        </div>
      </body>
    </html>
  )
}
