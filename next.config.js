/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'brcmoboyqsgmvukvfoss.supabase.co' }
    ]
  },
  async headers() {
    return [
      {
        source: '/img/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }
        ]
      }
    ];
  }
};

module.exports = nextConfig;
