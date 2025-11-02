import { readFileSync } from 'node:fs'
import type { ImageResponseOptions } from '@takumi-rs/image-response'
import type { ReactNode } from 'react'
import { title as siteName } from '@/lib/layout.shared'

export interface GenerateProps {
  title: ReactNode
  description?: ReactNode
  tag?: string
}

const font = readFileSync('./src/app/og/[...slug]/fonts/Inter-Regular.ttf')
const fontSemiBold = readFileSync(
  './src/app/og/[...slug]/fonts/Inter-SemiBold.ttf'
)
const fontBold = readFileSync('./src/app/og/[...slug]/fonts/Inter-Bold.ttf')

export async function getImageResponseOptions(): Promise<ImageResponseOptions> {
  return {
    format: 'webp',
    width: 1200,
    height: 630,
    persistentImages: [
      {
        src: 'logo.svg',
        data: readFileSync('./public/logo.svg'),
      },
    ],
    fonts: [
      {
        name: 'Inter',
        data: font,
        weight: 400,
      },
      {
        name: 'Inter',
        data: fontSemiBold,
        weight: 500,
      },
      {
        name: 'Inter',
        data: fontBold,
        weight: 700,
      },
    ],
  }
}

export function generate({ title, description, tag }: GenerateProps) {
  const primaryTextColor = 'rgb(240,240,240)'
  const primaryColor = 'rgb(123, 111, 111)'

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '100%',
        color: 'white',
        backgroundColor: '#0c0c0c',
        backgroundImage: `linear-gradient(to top right, ${primaryColor}, transparent), noise-v1(opacity(0.3) frequency(1.0) octaves(4))`,
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          height: '100%',
          padding: '4rem',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            gap: '24px',
            marginBottom: 'auto',
            color: primaryTextColor,
          }}
        >
          <img
            src='logo.svg'
            alt={siteName}
            style={{ width: 60, height: 60 }}
          />
          <span
            style={{
              fontSize: '46px',
              fontWeight: 600,
            }}
          >
            {siteName}
          </span>
        </div>
        <p
          style={{
            fontWeight: 600,
            fontSize: '26px',
            textTransform: 'uppercase',
          }}
        >
          {tag?.replace(/-/g, ' ')}
        </p>
        <span
          style={{
            fontWeight: 600,
            fontSize: '76px',
          }}
        >
          {title}
        </span>
        <p
          style={{
            fontSize: '48px',
            color: 'rgba(240,240,240,0.7)',
          }}
        >
          {description}
        </p>
      </div>
    </div>
  )
}
