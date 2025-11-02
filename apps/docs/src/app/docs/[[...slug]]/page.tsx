import Link from 'fumadocs-core/link'
import { getPageTreePeers } from 'fumadocs-core/page-tree'
import { PathUtils } from 'fumadocs-core/source'
import * as Twoslash from 'fumadocs-twoslash/ui'
import { createGenerator } from 'fumadocs-typescript'
import { AutoTypeTable } from 'fumadocs-typescript/ui'
import { Card, Cards } from 'fumadocs-ui/components/card'
import { TypeTable } from 'fumadocs-ui/components/type-table'
import { DocsPage } from 'fumadocs-ui/page'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import type { ReactElement } from 'react'
import { LLMCopyButton, ViewOptions } from '@/components/fumadocs/page-actions'
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card'
import { owner, repo } from '@/lib/github'
import { createMetadata } from '@/lib/metadata'
import { source } from '@/lib/source'
import { getMDXComponents } from '@/mdx-components'

const generator = createGenerator()

export const revalidate = false

export default async function Page(
  props: PageProps<'/docs/[[...slug]]'>
): Promise<ReactElement> {
  const params = await props.params
  const page = source.getPage(params.slug)

  if (!page) return notFound()

  const { body: Mdx, toc, lastModified } = page.data

  return (
    <DocsPage
      toc={toc}
      lastUpdate={lastModified ? new Date(lastModified) : undefined}
      tableOfContent={{
        style: 'clerk',
      }}
    >
      <div className='relative flex flex-col items-start gap-2 sm:flex-row sm:items-center'>
        <h1 className='break-all font-semibold text-[1.75em]'>
          {page.data.title}
        </h1>

        <div className='ml-auto flex hidden shrink-0 flex-row items-center items-center justify-end gap-2 sm:flex'>
          <LLMCopyButton markdownUrl={`${page.url}.mdx`} />
          <ViewOptions
            markdownUrl={`${page.url}.mdx`}
            githubUrl={`https://github.com/${owner}/${repo}/blob/main/content/docs/${page.path}`}
          />
        </div>
      </div>
      <p className='mb-2 text-fd-muted-foreground text-lg'>
        {page.data.description}
      </p>
      <div className='flex items-center gap-2 pb-6 sm:hidden'>
        <LLMCopyButton markdownUrl={`${page.url}.mdx`} />
        <ViewOptions
          markdownUrl={`${page.url}.mdx`}
          githubUrl={`https://github.com/${owner}/${repo}/blob/main/content/docs/${page.path}`}
        />
      </div>
      <div className='prose flex-1 text-fd-foreground/90'>
        <Mdx
          components={getMDXComponents({
            ...Twoslash,
            a: ({ href, ...props }) => {
              const found = source.getPageByHref(href ?? '', {
                dir: PathUtils.dirname(page.path),
              })

              if (!found) return <Link href={href} {...props} />

              return (
                <HoverCard>
                  <HoverCardTrigger asChild>
                    <Link
                      href={
                        found.hash
                          ? `${found.page.url}#${found.hash}`
                          : found.page.url
                      }
                      {...props}
                    />
                  </HoverCardTrigger>
                  <HoverCardContent className='text-sm'>
                    <p className='font-medium'>{found.page.data.title}</p>
                    <p className='text-fd-muted-foreground'>
                      {found.page.data.description}
                    </p>
                  </HoverCardContent>
                </HoverCard>
              )
            },
            TypeTable,
            AutoTypeTable: (props) => (
              <AutoTypeTable generator={generator} {...props} />
            ),
            DocsCategory: ({ url }) => {
              return <DocsCategory url={url ?? page.url} />
            },
          })}
        />
        {page.data.index ? <DocsCategory url={page.url} /> : null}
      </div>
    </DocsPage>
  )
}

function DocsCategory({ url }: { url: string }) {
  return (
    <Cards>
      {getPageTreePeers(source.pageTree, url).map((peer) => (
        <Card key={peer.url} title={peer.name} href={peer.url}>
          {peer.description}
        </Card>
      ))}
    </Cards>
  )
}

export async function generateMetadata(
  props: PageProps<'/docs/[[...slug]]'>
): Promise<Metadata> {
  const { slug = [] } = await props.params
  const page = source.getPage(slug)
  if (!page)
    return createMetadata({
      title: 'Not Found',
    })

  const description =
    page.data.description ?? 'The library for building documentation sites'

  const image = {
    url: ['/og', ...slug, 'image.webp'].join('/'),
    width: 1200,
    height: 630,
  }

  return createMetadata({
    title: page.data.title,
    description,
    openGraph: {
      url: `/docs/${page.slugs.join('/')}`,
      images: [image],
    },
    twitter: {
      images: [image],
    },
  })
}

export function generateStaticParams() {
  return source.generateParams()
}
