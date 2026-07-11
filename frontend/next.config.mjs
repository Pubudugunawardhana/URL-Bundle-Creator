/** @type {import('next').NextConfig} */
const backendUrl = (process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3002").replace(/\/+$/, '');

const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/auth/:path*',
        destination: '/api/auth/:path*',
      },
      {
        source: '/api/:path*',
        destination: `${backendUrl}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
