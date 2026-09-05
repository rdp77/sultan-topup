import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        // Private/transaction pages — not meant to be indexed
        disallow: ['/dashboard', '/pay', '/result', '/login', '/register', '/offline', '/api/'],
      },
      // AI crawlers — allowed so content can surface in AI answers (ChatGPT, Perplexity, etc.)
      {
        userAgent: ['GPTBot', 'OAI-SearchBot', 'ChatGPT-User', 'ClaudeBot', 'PerplexityBot'],
        allow: '/',
        disallow: ['/dashboard', '/pay', '/result', '/api/'],
      },
    ],
    sitemap: 'https://sultantopup.com/sitemap.xml',
  };
}
