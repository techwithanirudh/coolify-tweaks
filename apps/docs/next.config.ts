import { fileURLToPath } from 'node:url'
import bundleAnalyzer from '@next/bundle-analyzer'
import { createMDX } from 'fumadocs-mdx/next'
import createJiti from 'jiti'
import type { NextConfig } from 'next'

const jiti = createJiti(fileURLToPath(import.meta.url))
jiti('./src/env')

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  productionBrowserSourceMaps: process.env.SOURCE_MAPS === 'true',
  devIndicators: false,
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  serverExternalPackages: [
    'ts-morph',
    'typescript',
    'oxc-transform',
    'twoslash',
    'twoslash-protocol',
    'shiki',
    '@takumi-rs/core',
  ],
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
        port: '',
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/docs/:path*.mdx',
        destination: '/llms.mdx/:path*',
      },
    ]
  },
}

const bundleAnalyzerPlugin = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
})

const mdxPlugin = createMDX()

const NextApp = () => {
  const plugins = [bundleAnalyzerPlugin, mdxPlugin]
  return plugins.reduce((config, plugin) => plugin(config), nextConfig)
}

export default NextApp
