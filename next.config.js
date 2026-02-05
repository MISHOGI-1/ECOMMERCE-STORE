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
  // Avoid Watchpack errors on Windows (System Volume Information, etc.)
  webpack: (config, { dev }) => {
    if (dev) {
      config.watchOptions = {
        ignored: ['**/node_modules', '**/.git', 'C:\\System Volume Information', 'C:\\hiberfil.sys', 'C:\\swapfile.sys'],
      };
    }
    return config;
  },
};

module.exports = nextConfig;

