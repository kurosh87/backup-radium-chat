import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Enable experimental features
  experimental: {},
  // Enable server actions
  serverActions: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'avatar.vercel.sh',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: '*.clerk.dev',
      },
    ],
  },
  // Configure output for Vercel
  output: 'standalone',
  // Handle redirects and rewrites
  async redirects() {
    return [
      {
        source: '/sign-in',
        destination: '/',
        has: [
          {
            type: 'query',
            key: 'redirect_url',
          },
        ],
        permanent: false,
      },
    ];
  },
  // Handle rewrites if needed
  async rewrites() {
    return [
      {
        source: '/',
        destination: '/',
      },
    ];
  },
};

export default nextConfig;
