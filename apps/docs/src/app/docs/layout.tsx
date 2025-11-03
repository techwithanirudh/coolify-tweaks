import { LargeSearchToggle } from 'fumadocs-ui/components/layout/search-toggle'
import { DocsLayout } from 'fumadocs-ui/layouts/notebook'
import { AISearchTrigger } from '@/components/fumadocs/ai/search'
import { baseOptions, linkItems, logo } from '@/lib/layout.shared'
import { source } from '@/lib/source'
import 'katex/dist/katex.min.css'
import type { CSSProperties } from 'react'

export default function Layout({ children }: LayoutProps<'/docs'>) {
  const base = baseOptions()

  return (
    <DocsLayout
      {...base}
      links={linkItems.filter((item) => item.type === 'icon')}
      tree={source.pageTree}
      sidebar={{
        collapsible: false,
        tabs: {
          transform(option, node) {
            const meta = source.getNodeMeta(node)
            if (!meta || !node.icon) return option

            const segments = meta.path.split('/')
            const segment = serializeSegment(segments[0])

            const color = `var(--${segment}-color, var(--color-fd-foreground))`
            return {
              ...option,
              icon: (
                <div
                  className='size-full text-(--tab-color) max-md:border max-md:bg-(--tab-color)/10 max-md:p-1.5 [&_svg]:size-full'
                  style={{ '--tab-color': color } as CSSProperties}
                >
                  {node.icon}
                </div>
              ),
            }
          },
        },
      }}
      tabMode='navbar'
      searchToggle={{
        components: {
          lg: (
            <div className='flex gap-1.5 max-md:hidden'>
              <LargeSearchToggle className='flex-1 rounded-xl' />
            </div>
          ),
        },
      }}
      nav={{
        ...base.nav,
        mode: 'top',
        title: (
          <>
            {logo}
            <span className='font-medium max-md:hidden'>Coolify Tweaks</span>
          </>
        ),
      }}
    >
      {children}
      {/* <DocsBackground /> */}
      <AISearchTrigger />
    </DocsLayout>
  )
}

function serializeSegment(segment: string | undefined): string {
  const raw = (segment ?? '').trim()

  const kebab = raw
    .toLowerCase()
    .replace(/[_\s]+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/^-+/, '')
    .replace(/-+$/, '')
  return kebab || 'fd'
}
