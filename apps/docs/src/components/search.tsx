'use client'

import type { Item, Node } from 'fumadocs-core/page-tree'
import { useDocsSearch } from 'fumadocs-core/search/client'
import {
  SearchDialog,
  SearchDialogClose,
  SearchDialogContent,
  SearchDialogFooter,
  SearchDialogHeader,
  SearchDialogIcon,
  SearchDialogInput,
  SearchDialogList,
  SearchDialogOverlay,
  type SearchItemType,
  type SharedProps,
} from 'fumadocs-ui/components/dialog/search'
import { buttonVariants } from 'fumadocs-ui/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from 'fumadocs-ui/components/ui/popover'
import { useTreeContext } from 'fumadocs-ui/contexts/tree'
import { ArrowRight, ChevronDown } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useMemo, useState } from 'react'
import { cn } from '@/lib/cn'
import { tags } from '@/lib/constants'

export default function CustomSearchDialog(props: SharedProps) {
  const [open, setOpen] = useState(false)
  const [tag, setTag] = useState<string | undefined>()
  const { search, setSearch, query } = useDocsSearch({
    type: 'fetch',
    tag,
  })
  const { full } = useTreeContext()
  const router = useRouter()
  const searchMap = useMemo(() => {
    const map = new Map<string, Item>()

    function onNode(node: Node) {
      if (node.type === 'page' && typeof node.name === 'string') {
        map.set(node.name.toLowerCase(), node)
      } else if (node.type === 'folder') {
        if (node.index) onNode(node.index)
        for (const item of node.children) onNode(item)
      }
    }

    for (const item of full.children) onNode(item)
    return map
  }, [full])
  const pageTreeAction = useMemo<SearchItemType | undefined>(() => {
    if (search.length === 0) return

    const normalized = search.toLowerCase()
    for (const [k, page] of searchMap) {
      if (!k.startsWith(normalized)) continue

      return {
        id: 'quick-action',
        type: 'action',
        node: (
          <div className='inline-flex items-center gap-2 text-fd-muted-foreground'>
            <ArrowRight className='size-4' />
            <p>
              Jump to{' '}
              <span className='font-medium text-fd-foreground'>
                {page.name}
              </span>
            </p>
          </div>
        ),
        onSelect: () => router.push(page.url),
      }
    }
  }, [router, search, searchMap])

  return (
    <SearchDialog
      search={search}
      onSearchChange={setSearch}
      isLoading={query.isLoading}
      {...props}
    >
      <SearchDialogOverlay />
      <SearchDialogContent>
        <SearchDialogHeader>
          <SearchDialogIcon />
          <SearchDialogInput />
          <SearchDialogClose />
        </SearchDialogHeader>
        <SearchDialogList
          items={
            query.data !== 'empty' || pageTreeAction
              ? [
                  ...(pageTreeAction ? [pageTreeAction] : []),
                  ...(Array.isArray(query.data) ? query.data : []),
                ]
              : null
          }
        />
        <SearchDialogFooter className='flex flex-row flex-wrap items-center gap-2'>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger
              className={buttonVariants({
                size: 'sm',
                color: 'ghost',
                className: '-m-1.5 me-auto',
              })}
            >
              <span className='me-2 text-fd-muted-foreground/80'>Filter</span>
              {tags.find((item) => item.value === tag)?.name}
              <ChevronDown className='size-3.5 text-fd-muted-foreground' />
            </PopoverTrigger>
            <PopoverContent className='flex flex-col gap-1 p-1' align='start'>
              {tags.map((item, i) => {
                const isSelected = item.value === tag

                return (
                  <button
                    key={i}
                    type='button'
                    onClick={() => {
                      setTag(item.value)
                      setOpen(false)
                    }}
                    className={cn(
                      'rounded-lg px-2 py-1.5 text-start',
                      isSelected
                        ? 'bg-fd-primary/10 text-fd-primary'
                        : 'hover:bg-fd-accent hover:text-fd-accent-foreground'
                    )}
                  >
                    <p className='mb-0.5 font-medium'>{item.name}</p>
                    <p className='text-xs opacity-70'>{item.description}</p>
                  </button>
                )
              })}
            </PopoverContent>
          </Popover>
        </SearchDialogFooter>
      </SearchDialogContent>
    </SearchDialog>
  )
}
