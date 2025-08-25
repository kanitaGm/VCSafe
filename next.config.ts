import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'export', // Static Export Mode
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true, // จำเป็นสำหรับ export เพราะ Next Image Optimization ใช้ไม่ได้
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
