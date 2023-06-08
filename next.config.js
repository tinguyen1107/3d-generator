/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  reactStrictMode: false,
  swcMinify: true,
  rewrites: async () => [
    {
      source: '/privacy/cookies-policy',
      destination: '/cookies-policy.html',
    },
    {
      source: '/privacy/privacy-policy',
      destination: '/privacy-policy.html',
    },
    {
      source: '/privacy/terms-of-service',
      destination: '/terms-of-service.html',
    },
  ],
};

module.exports = nextConfig;
