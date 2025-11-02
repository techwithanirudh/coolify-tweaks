import Link from 'fumadocs-core/link'
import type { ComponentProps } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/cn'

type SearchDocsInput = {
  query: string
  tag?: string
  locale?: string
  limit?: number
}

export type SearchDocsOutput = {
  success: boolean
  data?: Array<{
    id: string
    url: string
    title?: string
    description?: string
    content?: string
    contentWithHighlights?: Array<{
      type: string
      content: string
      styles?: { highlight?: boolean }
    }>
  }>
  total?: number
}

type ToolState =
  | 'input-streaming'
  | 'input-available'
  | 'output-available'
  | 'output-error'

export function SearchDocsVisualizer({
  state,
  input,
  output,
  ...props
}: {
  state?: ToolState
  input?: Partial<SearchDocsInput>
  output?: SearchDocsOutput
} & ComponentProps<'div'>) {
  const isSkeleton = state === 'input-streaming' || state === 'input-available'

  if (isSkeleton) {
    return (
      <div
        {...props}
        className={cn('rounded-xl bg-fd-card p-3', props.className)}
      >
        <div className='space-y-2'>
          <Skeleton className='h-4 w-24' />
          <div className='space-y-2'>
            {[1, 2, 3].map((i) => (
              <div key={i} className='rounded-lg border p-2'>
                <Skeleton className='mb-1 h-4 w-3/4' />
                <Skeleton className='h-3 w-full' />
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!input) return null

  return (
    <div
      {...props}
      className={cn('rounded-xl bg-fd-card p-3', props.className)}
    >
      <div className='mb-3 space-y-1'>
        {input.query && (
          <div className='text-fd-muted-foreground text-xs'>
            <span className='font-medium'>Query:</span> {input.query}
          </div>
        )}
        {input.tag && (
          <div className='text-fd-muted-foreground text-xs'>
            <span className='font-medium'>Tag:</span> {input.tag}
          </div>
        )}
        {input.locale && (
          <div className='text-fd-muted-foreground text-xs'>
            <span className='font-medium'>Locale:</span> {input.locale}
          </div>
        )}
      </div>
      {output?.success && output.data && output.data.length > 0 && (
        <div className='space-y-2'>
          <div className='font-medium text-fd-muted-foreground text-xs'>
            Found {output.data.length} result
            {output.data.length !== 1 ? 's' : ''}
            {output.total !== undefined &&
              output.total > output.data.length && (
                <span> of {output.total} total</span>
              )}
          </div>
          <div className='max-h-48 space-y-2 overflow-y-auto'>
            {output.data.slice(0, 5).map((result, i) => (
              <Link
                key={i}
                href={result.url}
                className='block rounded-lg border p-2 text-xs transition-colors hover:bg-fd-accent'
              >
                <div className='font-medium text-fd-card-foreground'>
                  {result.title || result.url}
                </div>
                {result.content && (
                  <div className='mt-1 line-clamp-2 text-fd-muted-foreground'>
                    {result.content}
                  </div>
                )}
              </Link>
            ))}
          </div>
        </div>
      )}
      {output?.success === false && (
        <div className='text-fd-destructive text-xs'>Search failed</div>
      )}
    </div>
  )
}
