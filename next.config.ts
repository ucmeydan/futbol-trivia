import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
        ],
      },
    ]
  },
  async redirects() {
    return [
      {
        source: '/listeyi-tamamla/',
        destination: '/listeyi-tamamla',
        permanent: true,
      },
      {
        source: '/top10/',
        destination: '/top10',
        permanent: true,
      },
    ]
  },
}

export default nextConfig