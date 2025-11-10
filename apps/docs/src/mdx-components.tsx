import { Accordion, Accordions } from 'fumadocs-ui/components/accordion'
import { Banner } from 'fumadocs-ui/components/banner'
import { Callout } from 'fumadocs-ui/components/callout'
import * as FilesComponents from 'fumadocs-ui/components/files'
import * as TabsComponents from 'fumadocs-ui/components/tabs'
import { TypeTable } from 'fumadocs-ui/components/type-table'
import defaultMdxComponents from 'fumadocs-ui/mdx'
import * as icons from 'lucide-react'
import type { MDXComponents } from 'mdx/types'
import type { ComponentProps, FC } from 'react'
import { APIPage } from '@/components/api-page'
import { Update, Updates } from '@/components/fumadocs/updates'
import { Mermaid } from '@/components/mdx/mermaid'

export function getMDXComponents(components?: MDXComponents) {
  return {
    ...(icons as unknown as MDXComponents),
    ...defaultMdxComponents,
    ...TabsComponents,
    ...FilesComponents,
    Accordion,
    Accordions,
    Updates,
    Update,
    Mermaid,
    TypeTable,
    Callout,
    blockquote: Callout as unknown as FC<ComponentProps<'blockquote'>>,
    APIPage,
    Banner,
    ...components,
  } satisfies MDXComponents
}

declare module 'mdx/types.js' {
  // Augment the MDX types to make it understand React.
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    type Element = React.JSX.Element
    type ElementClass = React.JSX.ElementClass
    type ElementType = React.JSX.ElementType
    type IntrinsicElements = React.JSX.IntrinsicElements
  }
}

declare global {
  type MDXProvidedComponents = ReturnType<typeof getMDXComponents>
}
