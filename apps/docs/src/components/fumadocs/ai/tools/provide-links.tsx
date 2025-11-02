import Link from 'fumadocs-core/link'
import type { ComponentProps } from 'react'
import type { z } from 'zod'
import type { ProvideLinksToolSchema } from '@/lib/ai/qa-schema'
import { cn } from '@/lib/cn'

type ProvideLinksInput = z.infer<typeof ProvideLinksToolSchema>

type ProvideLinksOutput = {
  links?: ProvideLinksInput['links']
}

type ToolState =
  | 'input-streaming'
  | 'input-available'
  | 'output-available'
  | 'output-error'

export function ProvideLinksVisualizer({
  state,
  input,
  output,
  ...props
}: {
  state?: ToolState
  input?: Partial<ProvideLinksInput>
  output?: ProvideLinksOutput
} & ComponentProps<'div'>) {
  const links = output?.links ?? input?.links

  if (!links || links.length === 0) return null

  return (
    <div
      {...props}
      className={cn(
        'flex flex-row flex-wrap items-center gap-1',
        props.className
      )}
    >
      {links.map((item, i) => {
        if (!item?.url) return null
        const href = item.url.startsWith('http')
          ? item.url
          : `/docs/${item.url}`
        return (
          <Link
            key={i}
            href={href}
            className='block rounded-lg border p-3 text-xs transition-colors hover:bg-fd-accent hover:text-fd-accent-foreground'
          >
            <p className='font-medium'>{item.title || item.url}</p>
            {item.label && (
              <p className='text-fd-muted-foreground'>Reference {item.label}</p>
            )}
            {!item.label && (
              <p className='text-fd-muted-foreground'>
                {item.type === 'documentation' ? 'Documentation' : 'External'}
              </p>
            )}
          </Link>
        )
      })}
    </div>
  )
}
