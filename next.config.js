/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost', 'images.unsplash.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.myshopify.com',
      },
      {
        protocol: 'https',
        hostname: 'cdn.shopify.com',
      },
    ],
  },
  // Enable static exports for better SEO
  output: 'standalone',
  // Optimize for production
  compress: true,
  poweredByHeader: false,
  // SEO optimizations
  reactStrictMode: true,
};

module.exports = nextConfig;

