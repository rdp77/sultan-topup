/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    // remotePatterns: ['api.sultan-topup.com', 'placehold.co'],
  },
}

export default nextConfig
