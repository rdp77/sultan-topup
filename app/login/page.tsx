import { AuthForm } from '@/components/auth-form'

export const metadata = {
  title: 'Masuk — Sultan Top Up',
  description:
    'Masuk ke akun Sultan Top Up untuk melihat riwayat pesanan, top up lebih cepat, dan dapatkan promo eksklusif.',
  alternates: { canonical: 'https://sultantopup.com/login' },
  openGraph: {
    title: 'Masuk — Sultan Top Up',
    description:
      'Masuk ke akun Sultan Top Up untuk melihat riwayat pesanan dan top up lebih cepat.',
    url: 'https://sultantopup.com/login',
    siteName: 'Sultan Top Up',
    images: [
      {
        url: 'https://sultantopup.com/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Masuk Sultan Top Up',
      },
    ],
    locale: 'id_ID',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Masuk — Sultan Top Up',
    description: 'Masuk ke akun Sultan Top Up.',
    images: ['https://sultantopup.com/og-image.png'],
  },
}

export default function LoginPage() {
  return (
    <main id="main" className="flex flex-1 items-center px-4 py-16 md:px-6">
      <AuthForm mode="login" />
    </main>
  )
}
