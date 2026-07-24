// @ts-nocheck
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
      {
        protocol: 'https',
        hostname: '467da7a00f58c2ce68bb83496d869825.r2.cloudflarestorage.com',
      },
      {
        protocol: 'https',
        hostname: 'pub-*.r2.dev', // Add generic public R2 URL pattern just in case
      }
    ],
  },
  allowedDevOrigins: ['https://global-2cz3.vercel.app', 'http://localhost:3000','192.168.1.57', '[IP_ADDRESS]', '[IP_ADDRESS]'],
  experimental: {
    serverActions: {
      bodySizeLimit: '150mb',
    },
  },
};

export default nextConfig;
