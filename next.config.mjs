import { withSentryConfig } from '@sentry/nextjs'

const hasSentryToken = !!process.env.SENTRY_AUTH_TOKEN

/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  async rewrites() {
    return [
      {
        source: '/ingest/static/:path*',
        destination: 'https://us-assets.i.posthog.com/static/:path*',
      },
      {
        source: '/ingest/array/:path*',
        destination: 'https://us-assets.i.posthog.com/array/:path*',
      },
      {
        source: '/ingest/:path*',
        destination: 'https://us.i.posthog.com/:path*',
      },
    ]
  },
  skipTrailingSlashRedirect: true,
}

export default withSentryConfig(nextConfig, {
  org: 'wreative',
  project: 'sultantopup-nextjs',
  authToken: process.env.SENTRY_AUTH_TOKEN,

  silent: !process.env.CI,

  widenClientFileUpload: true,
  tunnelRoute: '/monitoring',

  // Only upload source maps when SENTRY_AUTH_TOKEN is set
  sourcemaps: {
    disable: !hasSentryToken,
  },

  webpack: {
    automaticVercelMonitors: true,
    treeshake: {
      removeDebugLogging: true,
    },
  },
})
