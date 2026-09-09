import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // @tenantflow/types ships raw .ts source (no build step), so Next needs
  // to compile it as part of the app instead of expecting prebuilt JS.
  transpilePackages: ['@tenantflow/types'],
  // Replaces the security headers the old Express server got for free from
  // `helmet()`.
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        ],
      },
    ];
  },
};

export default nextConfig;
