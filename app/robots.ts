import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/dashboard', '/bayar', '/hasil', '/login', '/register', '/offline', '/api/'],
      },
    ],
    sitemap: 'https://sultantopup.com/sitemap.xml',
  }
}
