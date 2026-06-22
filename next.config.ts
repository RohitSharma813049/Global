import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'drive.google.com',
      },
    ],
  },
  allowedDevOrigins: ['https://global-2cz3.vercel.app', 'http://localhost:3000', 'http://[IP_ADDRESS]', 'http://[IP_ADDRESS]', 'http://[IP_ADDRESS]', 'http://[IP_ADDRESS]'],
  experimental: {
    serverActions: {
      bodySizeLimit: '50mb',
    },
  },
};

export default nextConfig;
