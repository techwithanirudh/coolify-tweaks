'use client'
import { type UIMessage, type UseChatHelpers, useChat } from '@ai-sdk/react'
import { Presence } from '@radix-ui/react-presence'
import { DefaultChatTransport } from 'ai'
import { buttonVariants } from 'fumadocs-ui/components/ui/button'
import {
  Download,
  FileText,
  Globe,
  Globe2,
  Loader2,
  MessageCircleIcon,
  RefreshCw,
  Search,
  Send,
  X,
} from 'lucide-react'
import {
  type ComponentProps,
  createContext,
  type SyntheticEvent,
  use,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from 'react'
import type { z } from 'zod'
import {
  Tool,
  ToolContent,
  ToolHeader,
  ToolOutput,
} from '@/components/fumadocs/ai/tool'
import type { ProvideLinksToolSchema } from '@/lib/ai/qa-schema'
import { cn } from '@/lib/cn'
import { Markdown } from './markdown'
import type { GetPageContentOutput } from './tools/get-page-content'
import { GetPageContentVisualizer } from './tools/get-page-content'
import { ProvideLinksVisualizer } from './tools/provide-links'
import type { SearchDocsOutput } from './tools/search-docs'
import { SearchDocsVisualizer } from './tools/search-docs'

const Context = createContext<{
  open: boolean
  setOpen: (open: boolean) => void
  chat: UseChatHelpers<UIMessage>
} | null>(null)

function useChatContext() {
  return use(Context)!.chat
}

function Header() {
  const { setOpen } = use(Context)!

  return (
    <div className='sticky top-0 flex items-start gap-2'>
      <div className='flex-1 rounded-xl bg-fd-card p-3 text-fd-card-foreground'>
        <p className='font-medium text-sm'>Ask AI</p>
      </div>
      <button
        type='button'
        aria-label='Close'
        tabIndex={-1}
        className={cn(
          buttonVariants({
            size: 'icon-sm',
            color: 'secondary',
            className: 'rounded-full',
          })
        )}
        onClick={() => setOpen(false)}
      >
        <X />
      </button>
    </div>
  )
}

function SearchAIActions() {
  const { messages, status, setMessages, regenerate } = useChatContext()
  const isLoading = status === 'streaming'

  if (messages.length === 0) return null

  return (
    <>
      {!isLoading && messages.at(-1)?.role === 'assistant' && (
        <button
          type='button'
          className={cn(
            buttonVariants({
              color: 'secondary',
              size: 'sm',
              className: 'gap-1.5 rounded-full',
            })
          )}
          onClick={() => regenerate()}
        >
          <RefreshCw className='size-4' />
          Retry
        </button>
      )}
      <button
        type='button'
        className={cn(
          buttonVariants({
            color: 'secondary',
            size: 'sm',
            className: 'rounded-full',
          })
        )}
        onClick={() => setMessages([])}
      >
        Clear Chat
      </button>
    </>
  )
}

const StorageKeyInput = '__ai_search_input'
function SearchAIInput(props: ComponentProps<'form'>) {
  const { status, sendMessage, stop } = useChatContext()
  const [input, setInput] = useState(
    () => localStorage.getItem(StorageKeyInput) ?? ''
  )
  const isLoading = status === 'streaming' || status === 'submitted'
  const onStart = (e?: SyntheticEvent) => {
    e?.preventDefault()
    void sendMessage({ text: input })
    setInput('')
  }

  localStorage.setItem(StorageKeyInput, input)

  useEffect(() => {
    if (isLoading) document.getElementById('nd-ai-input')?.focus()
  }, [isLoading])

  return (
    <form
      {...props}
      className={cn('flex items-start pe-2', props.className)}
      onSubmit={onStart}
    >
      <Input
        value={input}
        placeholder={isLoading ? 'AI is answering...' : 'Ask a question'}
        autoFocus
        className='p-3'
        disabled={status === 'streaming' || status === 'submitted'}
        onChange={(e) => {
          setInput(e.target.value)
        }}
        onKeyDown={(event) => {
          if (!event.shiftKey && event.key === 'Enter') {
            onStart(event)
          }
        }}
      />
      {isLoading ? (
        <button
          key='bn'
          type='button'
          className={cn(
            buttonVariants({
              color: 'secondary',
              className: 'mt-2 gap-2 rounded-full transition-all',
            })
          )}
          onClick={stop}
        >
          <Loader2 className='size-4 animate-spin text-fd-muted-foreground' />
          Abort Answer
        </button>
      ) : (
        <button
          key='bn'
          type='submit'
          className={cn(
            buttonVariants({
              color: 'secondary',
              className: 'mt-2 rounded-full transition-all',
            })
          )}
          disabled={input.length === 0}
        >
          <Send className='size-4' />
        </button>
      )}
    </form>
  )
}

function List(props: Omit<ComponentProps<'div'>, 'dir'>) {
  const containerRef = useRef<HTMLDivElement>(null)
  const stateRef = useRef({ lastHeight: 0, isUserScrolled: false })

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    function handleResize() {
      if (!container) return
      const currentHeight = container.scrollHeight
      const scrollTop = container.scrollTop
      const clientHeight = container.clientHeight
      const isNearBottom = scrollTop + clientHeight >= currentHeight - 100
      const heightIncreased = currentHeight > stateRef.current.lastHeight

      if (
        heightIncreased &&
        (isNearBottom || !stateRef.current.isUserScrolled)
      ) {
        container.scrollTo({ top: container.scrollHeight, behavior: 'instant' })
      }

      stateRef.current.lastHeight = currentHeight
    }

    function handleScroll() {
      if (!container) return
      const scrollTop = container.scrollTop
      const clientHeight = container.clientHeight
      const scrollHeight = container.scrollHeight
      stateRef.current.isUserScrolled =
        scrollTop + clientHeight < scrollHeight - 100
    }

    const observer = new ResizeObserver(handleResize)
    observer.observe(container.firstElementChild ?? container)
    handleResize()

    container.addEventListener('scroll', handleScroll)

    return () => {
      observer.disconnect()
      container.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <div
      ref={containerRef}
      {...props}
      className={cn(
        'fd-scroll-container flex min-w-0 flex-col overflow-y-auto',
        props.className
      )}
    >
      {props.children}
    </div>
  )
}

function Input(props: ComponentProps<'textarea'>) {
  const ref = useRef<HTMLDivElement>(null)
  const id = useId()
  const shared = cn('col-start-1 row-start-1', props.className)

  return (
    <div className='grid flex-1'>
      <textarea
        id={id}
        {...props}
        className={cn(
          'resize-none bg-transparent placeholder:text-fd-muted-foreground focus-visible:outline-none',
          shared
        )}
      />
      <div ref={ref} className={cn(shared, 'invisible break-all')}>
        {`${props.value?.toString() ?? ''}\n`}
      </div>
    </div>
  )
}

const roleName: Record<string, string> = {
  user: 'you',
  assistant: 'assistant',
}

function ToolRenderer({
  part,
  isActive,
}: {
  part: UIMessage['parts'][number] & {
    type: string
    toolCallId?: string
    state?: string
  }
  isActive: boolean
}) {
  const [isOpen, setIsOpen] = useState(isActive)

  useEffect(() => {
    if (isActive) {
      setIsOpen(true)
    } else if (!isActive) {
      setIsOpen(false)
    }
  }, [isActive])

  if (!part.type.startsWith('tool-') || !('input' in part)) {
    return null
  }

  const { toolCallId, state } = part
  const toolName = part.type.replace('tool-', '')
  const input = part.input as unknown
  const output = part.output as unknown
  const errorText =
    'errorText' in part ? (part.errorText as string | undefined) : undefined

  const toolState =
    (state as
      | 'input-streaming'
      | 'input-available'
      | 'output-available'
      | 'output-error') ?? 'input-available'

  const getToolIcon = () => {
    switch (toolName) {
      case 'searchDocs':
        return <Search className='size-4 text-muted-foreground' />
      case 'webSearch':
        return <Globe className='size-4 text-muted-foreground' />
      case 'getPageContent':
        return <FileText className='size-4 text-muted-foreground' />
      case 'scrape':
        return <Download className='size-4 text-muted-foreground' />
      case 'search':
        return <Globe2 className='size-4 text-muted-foreground' />
      default:
        return undefined
    }
  }

  const renderVisualizer = () => {
    switch (toolName) {
      case 'searchDocs':
        return (
          <SearchDocsVisualizer
            state={toolState}
            input={input as { query?: string; tag?: string; locale?: string }}
            output={output as SearchDocsOutput | undefined}
          />
        )
      case 'getPageContent':
        return (
          <GetPageContentVisualizer
            state={toolState}
            input={input as { path?: string }}
            output={output as GetPageContentOutput | undefined}
          />
        )
      default:
        return null
    }
  }

  if (part.type === 'tool-provideLinks') return null

  return (
    <Tool key={toolCallId} open={isOpen} onOpenChange={setIsOpen}>
      <ToolHeader
        state={toolState}
        type={part.type as `tool-${string}`}
        icon={getToolIcon()}
      />
      <ToolContent>
        {(toolState === 'input-streaming' ||
          toolState === 'input-available' ||
          toolState === 'output-available') &&
          renderVisualizer()}
        {toolState === 'output-error' && (
          <ToolOutput errorText={errorText} output={undefined} />
        )}
      </ToolContent>
    </Tool>
  )
}

function Message({
  message,
  isLoading,
  status,
  ...props
}: {
  message: UIMessage
  isLoading: boolean
  status: string
} & ComponentProps<'div'>) {
  let markdown = ''
  let links: z.infer<typeof ProvideLinksToolSchema>['links'] = []

  for (const part of message.parts ?? []) {
    if (part.type === 'text') {
      markdown += part.text
      continue
    }

    if (part.type === 'tool-provideLinks' && part.input) {
      links = (part.input as z.infer<typeof ProvideLinksToolSchema>).links
    }
  }

  const parts = message.parts ?? []
  const isStreaming = status === 'streaming'

  return (
    <div {...props}>
      <p
        className={cn(
          'mb-1 font-medium text-fd-muted-foreground text-sm',
          message.role === 'assistant' && 'text-fd-primary'
        )}
      >
        {roleName[message.role] ?? 'unknown'}
      </p>
      <div className='prose text-sm'>
        {parts.map((part, idx) => {
          if (part.type.startsWith('tool-') && 'input' in part) {
            const isPartActive = isStreaming && parts.length - 1 === idx
            return (
              <ToolRenderer
                key={`tool-${part.toolCallId ?? idx}`}
                part={part}
                isActive={isPartActive}
              />
            )
          }
          return null
        })}
        {markdown && <Markdown text={markdown} />}
      </div>
      <div className='mt-2 empty:hidden'>
        {links && links.length > 0 && (
          <ProvideLinksVisualizer input={{ links }} output={{ links }} />
        )}
      </div>
    </div>
  )
}

export function AISearchTrigger() {
  const [open, setOpen] = useState(false)
  const chat = useChat({
    id: 'search',
    transport: new DefaultChatTransport({
      api: '/api/chat',
    }),
  })

  const onKeyPress = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && open) {
      setOpen(false)
      e.preventDefault()
    }

    if (e.key === '/' && (e.metaKey || e.ctrlKey) && !open) {
      setOpen(true)
      e.preventDefault()
    }
  }

  // biome-ignore lint/correctness/useExhaustiveDependencies: biome doesn't understand the effect
  useEffect(() => {
    const listener = (e: KeyboardEvent) => onKeyPress(e)
    window.addEventListener('keydown', listener)
    return () => window.removeEventListener('keydown', listener)
  }, [])

  return (
    <Context value={useMemo(() => ({ chat, open, setOpen }), [chat, open])}>
      <style>
        {`
        @keyframes ask-ai-open {
          from {
            translate: 100% 0;
          }
        }
        
        @keyframes ask-ai-close {
          to {
            translate: 100% 0;
            opacity: 0;
          }
        }`}
      </style>
      <Presence present={open}>
        <div
          className={cn(
            'fixed inset-y-2 z-30 flex flex-col rounded-2xl border bg-fd-popover p-2 text-fd-popover-foreground shadow-lg max-sm:inset-x-2 sm:end-2 sm:w-[460px]',
            open
              ? 'animate-[ask-ai-open_300ms]'
              : 'animate-[ask-ai-close_300ms]'
          )}
        >
          <Header />
          <List
            className='flex-1 overscroll-contain px-3 py-4'
            style={{
              maskImage:
                'linear-gradient(to bottom, transparent, white 1rem, white calc(100% - 1rem), transparent 100%)',
            }}
          >
            <div className='flex flex-col gap-4'>
              {chat.messages
                .filter((msg) => msg.role !== 'system')
                .map((item, idx) => (
                  <Message
                    key={item.id}
                    message={item}
                    isLoading={
                      chat.status === 'streaming' &&
                      chat.messages.length - 1 === idx
                    }
                    status={chat.status}
                  />
                ))}
            </div>
          </List>
          <div className='rounded-xl border bg-fd-card text-fd-card-foreground has-focus-visible:ring-2 has-focus-visible:ring-fd-ring'>
            <SearchAIInput />
            <div className='flex items-center gap-1.5 p-1 empty:hidden'>
              <SearchAIActions />
            </div>
          </div>
        </div>
      </Presence>
      <button
        className={cn(
          'fixed bottom-4 z-20 flex h-10 w-24 items-center gap-2 gap-3 rounded-2xl border bg-fd-secondary px-2 font-medium text-fd-muted-foreground text-sm shadow-lg transition-[translate,opacity]',
          'end-[calc(var(--removed-body-scroll-bar-size,0px)+var(--fd-layout-offset)+1rem)]',
          open && 'translate-y-10 opacity-0'
        )}
        onClick={() => setOpen(true)}
        type='button'
      >
        <MessageCircleIcon className='size-4.5' />
        Ask AI
      </button>
    </Context>
  )
}
