import { AuthForm } from '@/components/auth-form'

export const metadata = {
  title: 'Daftar — Sultan Top Up',
  description: 'Daftar akun Sultan Top Up dan nikmati top up game lebih cepat, riwayat transaksi lengkap, dan promo spesial.',
  alternates: { canonical: 'https://sultantopup.com/register' },
  openGraph: {
    title: 'Daftar — Sultan Top Up',
    description: 'Daftar akun Sultan Top Up dan nikmati top up game lebih cepat.',
    url: 'https://sultantopup.com/register',
    siteName: 'Sultan Top Up',
    images: [{ url: 'https://sultantopup.com/og-image.png', width: 1200, height: 630, alt: 'Daftar Sultan Top Up' }],
    locale: 'id_ID',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Daftar — Sultan Top Up',
    description: 'Daftar akun Sultan Top Up.',
    images: ['https://sultantopup.com/og-image.png'],
  },
}

export default function RegisterPage() {
  return (
    <main id="main" className="flex flex-1 items-center px-4 py-16 md:px-6">
      <AuthForm mode="register" />
    </main>
  )
}
