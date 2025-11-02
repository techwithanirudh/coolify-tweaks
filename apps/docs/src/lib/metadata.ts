import type { Metadata } from 'next'
import { env } from '@/env'
import { title } from '@/lib/layout.shared'

export function createMetadata(override: Metadata): Metadata {
  return {
    ...override,
    openGraph: {
      title: override.title ?? undefined,
      description: override.description ?? undefined,
      url: 'https://fumadocsstarter.vercel.app',
      images: '/banner.png',
      siteName: title,
      ...override.openGraph,
    },
    twitter: {
      card: 'summary_large_image',
      creator: '@AnirudhWith',
      title: override.title ?? undefined,
      description: override.description ?? undefined,
      images: '/banner.png',
      ...override.twitter,
    },
  }
}

export const baseUrl =
  env.NODE_ENV === 'development' || !env.NEXT_PUBLIC_BASE_URL
    ? new URL('http://localhost:3000')
    : new URL(`https://${env.NEXT_PUBLIC_BASE_URL}`)
