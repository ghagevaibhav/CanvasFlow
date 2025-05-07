import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        port: '',
        pathname: '/my-bucket/**',
        search: '',
      },
    ],
    domains: ['lh3.googleusercontent.com'],
  },
};

export default nextConfig;
