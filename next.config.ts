import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin(
  './i18n/request.ts'
);

const isDev = process.env.NODE_ENV === 'development';

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
      },
    ],
  },
  rewrites: async () => {
    if (!isDev) return [];
    return [
      {
        source: '/it/graphql/:path*',
        destination: process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT + '/graphql/:path*',
      },
      {
        source: '/it/auth/:path*',
        destination: process.env.NEXT_PUBLIC_LOGIN_ENDPOINT + '/auth/:path*',
      },
    ];
  },
  logging: {
    fetches: {
      fullUrl: isDev,
      hmrRefreshes: isDev,
    },
    incomingRequests: isDev,
  },
};

export default withNextIntl(nextConfig);
