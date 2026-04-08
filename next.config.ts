import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/gizlilik-politikasi',
        destination: '/gizlilik',
        permanent: true,
      },
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