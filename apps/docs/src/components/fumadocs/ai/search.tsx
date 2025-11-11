"use client";

import type { ProvideLinksToolSchema } from "@/lib/ai/qa-schema";
import type { UIMessage, UseChatHelpers } from "@ai-sdk/react";
import type { ComponentProps, SyntheticEvent } from "react";
import type { z } from "zod";
import {
  createContext,
  use,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { buttonVariants } from "fumadocs-ui/components/ui/button";
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
} from "lucide-react";

import { cn } from "@repo/ui";
import { Presence } from "@repo/ui/presence";

import type { GetPageContentOutput } from "./tools/get-page-content";
import type { SearchDocsOutput } from "./tools/search-docs";
import {
  Tool,
  ToolContent,
  ToolHeader,
  ToolOutput,
} from "@/components/fumadocs/ai/tool";
import { Markdown } from "./markdown";
import { GetPageContentVisualizer } from "./tools/get-page-content";
import { ProvideLinksVisualizer } from "./tools/provide-links";
import { SearchDocsVisualizer } from "./tools/search-docs";

const Context = createContext<{
  open: boolean;
  setOpen: (open: boolean) => void;
  chat: UseChatHelpers<UIMessage>;
} | null>(null);

function useChatContext() {
  const context = use(Context);
  if (!context) throw new Error("useChatContext must be used within Context");
  return context.chat;
}

function Header() {
  const context = use(Context);
  if (!context) throw new Error("Header must be used within Context");
  const { setOpen } = context;

  return (
    <div className="sticky top-0 flex items-start gap-2">
      <div className="bg-fd-card text-fd-card-foreground flex-1 rounded-xl p-3">
        <p className="text-sm font-medium">Ask AI</p>
      </div>
      <button
        type="button"
        aria-label="Close"
        tabIndex={-1}
        className={cn(
          buttonVariants({
            size: "icon-sm",
            color: "secondary",
            className: "rounded-full",
          }),
        )}
        onClick={() => setOpen(false)}
      >
        <X />
      </button>
    </div>
  );
}

function SearchAIActions() {
  const { messages, status, setMessages, regenerate } = useChatContext();
  const isLoading = status === "streaming";

  if (messages.length === 0) return null;

  return (
    <>
      {!isLoading && messages.at(-1)?.role === "assistant" && (
        <button
          type="button"
          className={cn(
            buttonVariants({
              color: "secondary",
              size: "sm",
              className: "gap-1.5 rounded-full",
            }),
          )}
          onClick={() => regenerate()}
        >
          <RefreshCw className="size-4" />
          Retry
        </button>
      )}
      <button
        type="button"
        className={cn(
          buttonVariants({
            color: "secondary",
            size: "sm",
            className: "rounded-full",
          }),
        )}
        onClick={() => setMessages([])}
      >
        Clear Chat
      </button>
    </>
  );
}

const StorageKeyInput = "__ai_search_input";
function SearchAIInput(props: ComponentProps<"form">) {
  const { status, sendMessage, stop } = useChatContext();
  const [input, setInput] = useState(
    () => localStorage.getItem(StorageKeyInput) ?? "",
  );
  const isLoading = status === "streaming" || status === "submitted";
  const onStart = (e?: SyntheticEvent) => {
    e?.preventDefault();
    void sendMessage({ text: input });
    setInput("");
  };

  localStorage.setItem(StorageKeyInput, input);

  useEffect(() => {
    if (isLoading) document.getElementById("nd-ai-input")?.focus();
  }, [isLoading]);

  return (
    <form
      {...props}
      className={cn("flex items-start pe-2", props.className)}
      onSubmit={onStart}
    >
      <Input
        value={input}
        placeholder={isLoading ? "AI is answering..." : "Ask a question"}
        autoFocus
        className="p-3"
        disabled={status === "streaming" || status === "submitted"}
        onChange={(e) => {
          setInput(e.target.value);
        }}
        onKeyDown={(event) => {
          if (!event.shiftKey && event.key === "Enter") {
            onStart(event);
          }
        }}
      />
      {isLoading ? (
        <button
          key="bn"
          type="button"
          className={cn(
            buttonVariants({
              color: "secondary",
              className: "mt-2 gap-2 rounded-full transition-all",
            }),
          )}
          onClick={stop}
        >
          <Loader2 className="text-fd-muted-foreground size-4 animate-spin" />
          Abort Answer
        </button>
      ) : (
        <button
          key="bn"
          type="submit"
          className={cn(
            buttonVariants({
              color: "secondary",
              className: "mt-2 rounded-full transition-all",
            }),
          )}
          disabled={input.length === 0}
        >
          <Send className="size-4" />
        </button>
      )}
    </form>
  );
}

function List(props: Omit<ComponentProps<"div">, "dir">) {
  const containerRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef({ lastHeight: 0, isUserScrolled: false });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    function handleResize() {
      if (!container) return;
      const currentHeight = container.scrollHeight;
      const scrollTop = container.scrollTop;
      const clientHeight = container.clientHeight;
      const isNearBottom = scrollTop + clientHeight >= currentHeight - 100;
      const heightIncreased = currentHeight > stateRef.current.lastHeight;

      if (
        heightIncreased &&
        (isNearBottom || !stateRef.current.isUserScrolled)
      ) {
        container.scrollTo({
          top: container.scrollHeight,
          behavior: "instant",
        });
      }

      stateRef.current.lastHeight = currentHeight;
    }

    function handleScroll() {
      if (!container) return;
      const scrollTop = container.scrollTop;
      const clientHeight = container.clientHeight;
      const scrollHeight = container.scrollHeight;
      stateRef.current.isUserScrolled =
        scrollTop + clientHeight < scrollHeight - 100;
    }

    const observer = new ResizeObserver(handleResize);
    observer.observe(container.firstElementChild ?? container);
    handleResize();

    container.addEventListener("scroll", handleScroll);

    return () => {
      observer.disconnect();
      container.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      {...props}
      className={cn(
        "fd-scroll-container flex min-w-0 flex-col overflow-y-auto",
        props.className,
      )}
    >
      {props.children}
    </div>
  );
}

function Input(props: ComponentProps<"textarea">) {
  const ref = useRef<HTMLDivElement>(null);
  const id = useId();
  const shared = cn("col-start-1 row-start-1", props.className);

  return (
    <div className="grid flex-1">
      <textarea
        id={id}
        {...props}
        className={cn(
          "placeholder:text-fd-muted-foreground resize-none bg-transparent focus-visible:outline-none",
          shared,
        )}
      />
      <div ref={ref} className={cn(shared, "invisible break-all")}>
        {`${props.value?.toString() ?? ""}\n`}
      </div>
    </div>
  );
}

const roleName: Record<string, string> = {
  user: "you",
  assistant: "assistant",
};

function ToolRenderer({
  part,
  isActive,
}: {
  part: UIMessage["parts"][number] & {
    type: string;
    toolCallId?: string;
    state?: string;
  };
  isActive: boolean;
}) {
  const [isOpen, setIsOpen] = useState(isActive);

  useEffect(() => {
    setIsOpen(isActive);
  }, [isActive]);

  if (!part.type.startsWith("tool-") || !("input" in part)) {
    return null;
  }

  const { toolCallId, state } = part;
  const toolName = part.type.replace("tool-", "");
  const input = part.input;
  const output = part.output;
  const errorText = "errorText" in part ? part.errorText : undefined;

  const getToolIcon = () => {
    switch (toolName) {
      case "searchDocs":
        return <Search className="text-muted-foreground size-4" />;
      case "webSearch":
        return <Globe className="text-muted-foreground size-4" />;
      case "getPageContent":
        return <FileText className="text-muted-foreground size-4" />;
      case "scrape":
        return <Download className="text-muted-foreground size-4" />;
      case "search":
        return <Globe2 className="text-muted-foreground size-4" />;
      default:
        return undefined;
    }
  };

  const renderVisualizer = () => {
    switch (toolName) {
      case "searchDocs":
        return (
          <SearchDocsVisualizer
            state={state}
            input={input as { query?: string; tag?: string; locale?: string }}
            output={output as SearchDocsOutput | undefined}
          />
        );
      case "getPageContent":
        return (
          <GetPageContentVisualizer
            state={state}
            input={input as { path?: string }}
            output={output as GetPageContentOutput | undefined}
          />
        );
      default:
        return null;
    }
  };

  if (part.type === "tool-provideLinks") return null;

  return (
    <Tool key={toolCallId} open={isOpen} onOpenChange={setIsOpen}>
      <ToolHeader
        state={state}
        type={part.type as `tool-${string}`}
        icon={getToolIcon()}
      />
      <ToolContent>
        {(state === "input-streaming" ||
          state === "input-available" ||
          state === "output-available") &&
          renderVisualizer()}
        {state === "output-error" && (
          <ToolOutput errorText={errorText} output={undefined} />
        )}
      </ToolContent>
    </Tool>
  );
}

function Message({
  message,
  status,
  ...props
}: {
  message: UIMessage;
  status: string;
} & ComponentProps<"div">) {
  let markdown = "";
  let links: z.infer<typeof ProvideLinksToolSchema>["links"] = [];

  for (const part of message.parts) {
    if (part.type === "text") {
      markdown += part.text;
      continue;
    }

    if (part.type === "tool-provideLinks" && part.input) {
      links = (part.input as z.infer<typeof ProvideLinksToolSchema>).links;
    }
  }

  const parts = message.parts;
  const isStreaming = status === "streaming";

  return (
    <div {...props}>
      <p
        className={cn(
          "text-fd-muted-foreground mb-1 text-sm font-medium",
          message.role === "assistant" && "text-fd-primary",
        )}
      >
        {roleName[message.role] ?? "unknown"}
      </p>
      <div className="prose text-sm">
        {parts.map((part, idx) => {
          if (part.type.startsWith("tool-") && "input" in part) {
            const isPartActive = isStreaming && parts.length - 1 === idx;
            return (
              <ToolRenderer
                key={`tool-${part.toolCallId || idx}`}
                part={part}
                isActive={isPartActive}
              />
            );
          }
          return null;
        })}
        {markdown && <Markdown text={markdown} />}
      </div>
      <div className="mt-2 empty:hidden">
        {links && links.length > 0 && (
          <ProvideLinksVisualizer input={{ links }} output={{ links }} />
        )}
      </div>
    </div>
  );
}

export function AISearchTrigger() {
  const [open, setOpen] = useState(false);
  const chat = useChat({
    id: "search",
    transport: new DefaultChatTransport({
      api: "/api/chat",
    }),
  });

  const onKeyPress = (e: KeyboardEvent) => {
    if (e.key === "Escape" && open) {
      setOpen(false);
      e.preventDefault();
    }

    if (e.key === "/" && (e.metaKey || e.ctrlKey) && !open) {
      setOpen(true);
      e.preventDefault();
    }
  };

  useEffect(() => {
    const listener = (e: KeyboardEvent) => onKeyPress(e);
    window.addEventListener("keydown", listener);
    return () => window.removeEventListener("keydown", listener);
  }, []);

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
            "bg-fd-popover text-fd-popover-foreground fixed inset-y-2 z-30 flex flex-col rounded-2xl border p-2 shadow-lg max-sm:inset-x-2 sm:end-2 sm:w-[460px]",
            open
              ? "animate-[ask-ai-open_300ms]"
              : "animate-[ask-ai-close_300ms]",
          )}
        >
          <Header />
          <List
            className="flex-1 overscroll-contain px-3 py-4"
            style={{
              maskImage:
                "linear-gradient(to bottom, transparent, white 1rem, white calc(100% - 1rem), transparent 100%)",
            }}
          >
            <div className="flex flex-col gap-4">
              {chat.messages
                .filter((msg) => msg.role !== "system")
                .map((item) => (
                  <Message key={item.id} message={item} status={chat.status} />
                ))}
            </div>
          </List>
          <div className="bg-fd-card text-fd-card-foreground has-focus-visible:ring-fd-ring rounded-xl border has-focus-visible:ring-2">
            <SearchAIInput />
            <div className="flex items-center gap-1.5 p-1 empty:hidden">
              <SearchAIActions />
            </div>
          </div>
        </div>
      </Presence>
      <button
        className={cn(
          "bg-fd-secondary text-fd-muted-foreground fixed bottom-4 z-20 flex h-10 w-24 items-center gap-2 gap-3 rounded-2xl border px-2 text-sm font-medium shadow-lg transition-[translate,opacity]",
          "end-[calc(var(--removed-body-scroll-bar-size,0px)+var(--fd-layout-offset)+1rem)]",
          open && "translate-y-10 opacity-0",
        )}
        onClick={() => setOpen(true)}
        type="button"
      >
        <MessageCircleIcon className="size-4.5" />
        Ask AI
      </button>
    </Context>
  );
}
