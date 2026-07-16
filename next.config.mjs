/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: ['api.sultan-topup.com', 'placehold.co'],
  },
}

export default nextConfig
