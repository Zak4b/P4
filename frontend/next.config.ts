import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:3000/P4/api/:path*',
      },
      {
        source: '/P4/:path*',
        destination: 'http://localhost:3000/P4/:path*',
      },
    ];
  },
};

export default nextConfig;
