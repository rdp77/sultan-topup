import type { MetadataRoute } from 'next'
import { GameService } from '@/services/game.service'
import { legalPages } from '@/components/legal-content'

const BASE_URL = 'https://sultantopup.com'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = []

  // --- Static pages ---

  entries.push({
    url: BASE_URL,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 1,
  })

  entries.push({
    url: `${BASE_URL}/lacak`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.9,
  })

  entries.push({
    url: `${BASE_URL}/leaderboard`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 0.8,
  })

  entries.push({
    url: `${BASE_URL}/login`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.6,
  })

  entries.push({
    url: `${BASE_URL}/register`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.6,
  })

  entries.push({
    url: `${BASE_URL}/dashboard`,
    lastModified: new Date(),
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
