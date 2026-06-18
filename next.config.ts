import type { NextConfig } from 'next';

const BACKEND_URL = process.env.BACKEND_URL ?? 'http://localhost:4005';

const nextConfig: NextConfig = {
  output: 'standalone',
  async rewrites() {
    return [
      {
        source: '/uploads/:path*',
        destination: `${BACKEND_URL}/uploads/:path*`,
      },
    ];
  },
  images: {
    // Allow SVG uploads to render through the optimizer. SVGs are admin-uploaded
    // (trusted), and these options sandbox the response to neutralize embedded scripts.
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      {
        protocol: 'http',
        hostname: process.env.BACKEND_HOST ?? 'localhost',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: process.env.BACKEND_HOST ?? 'localhost',
        pathname: '/uploads/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        pathname: '/uploads/**',
      },
    ],
  },
};

export default nextConfig;
