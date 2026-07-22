import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Sultan Top Up — Top Up Game Cepat & Aman',
    short_name: 'SultanTopUp',
    description:
      'Platform top up game tercepat di Indonesia. Proses otomatis 24 jam, pembayaran lengkap, harga bersahabat.',
    start_url: '/?source=pwa',
    display: 'standalone',
    background_color: '#040819',
    theme_color: '#6366F1',
    orientation: 'portrait-primary',
    scope: '/',
    lang: 'id',
    dir: 'ltr',
    categories: ['games', 'entertainment', 'utilities', 'shopping'],
    icons: [
      {
        src: '/icon.png',
        sizes: '512x512',
        type: 'image/png',
      },
      {
        src: '/apple-icon.png',
        sizes: '180x180',
        type: 'image/png',
      },
      {
        src: '/web-app-manifest-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/web-app-manifest-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
    screenshots: [
      {
        src: '/og-image.png',
        sizes: '1200x630',
        type: 'image/png',
        form_factor: 'wide',
        label: 'Sultan Top Up Homepage',
      },
    ],
    prefer_related_applications: false,
  }
}
