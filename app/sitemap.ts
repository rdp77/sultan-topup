import type { MetadataRoute } from 'next'
import { GameService } from '@/services'
import { legalPages } from '@/components/legal-content'

const BASE_URL = 'https://sultantopup.com'

// Fixed dates for static pages — avoids sending "today" to crawlers every build
const STATIC_UPDATED = '2026-07-27'
const LEGAL_UPDATED = '2026-07-22'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = []

  // --- Static pages ---

  entries.push({
    url: BASE_URL,
    lastModified: STATIC_UPDATED,
    changeFrequency: 'daily',
    priority: 1,
  })

  entries.push({
    url: `${BASE_URL}/lacak`,
    lastModified: STATIC_UPDATED,
    changeFrequency: 'weekly',
    priority: 0.9,
  })

  entries.push({
    url: `${BASE_URL}/leaderboard`,
    lastModified: STATIC_UPDATED,
    changeFrequency: 'daily',
    priority: 0.8,
  })

  entries.push({
    url: `${BASE_URL}/faq`,
    lastModified: STATIC_UPDATED,
    changeFrequency: 'weekly',
    priority: 0.7,
  })

  entries.push({
    url: `${BASE_URL}/contact`,
    lastModified: STATIC_UPDATED,
    changeFrequency: 'monthly',
    priority: 0.6,
  })

  entries.push({
    url: `${BASE_URL}/login`,
    lastModified: STATIC_UPDATED,
    changeFrequency: 'monthly',
    priority: 0.6,
  })

  entries.push({
    url: `${BASE_URL}/register`,
    lastModified: STATIC_UPDATED,
    changeFrequency: 'monthly',
    priority: 0.6,
  })

  entries.push({
    url: `${BASE_URL}/dashboard`,
    lastModified: STATIC_UPDATED,
    changeFrequency: 'monthly',
    priority: 0.5,
  })

  // Legal pages
  for (const slug of Object.keys(legalPages)) {
    entries.push({
      url: `${BASE_URL}/legal/${slug}`,
      lastModified: new Date(legalPages[slug].lastUpdated),
      changeFrequency: 'monthly',
      priority: 0.4,
    })
  }

  // --- Dynamic: Game detail pages ---
  let page = 1
  let hasMore = true

  while (hasMore) {
    try {
      const { data, meta } = await GameService.list(page)

      for (const game of data) {
        if (!game.slug) continue
        entries.push({
          url: `${BASE_URL}/game/${game.slug}`,
          lastModified: new Date(game.updated_at ?? game.created_at),
          changeFrequency: 'weekly',
          priority: 0.9,
        })
      }

      hasMore = page < meta.last_page
      page++
    } catch {
      // API unreachable — stop trying further pages
      hasMore = false
    }
  }

  return entries
}
