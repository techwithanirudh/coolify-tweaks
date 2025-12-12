"use client";

import { type UIMessage, type UseChatHelpers, useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { buttonVariants } from "fumadocs-ui/components/ui/button";
import {
  ArrowUpIcon,
  MessageCircleIcon,
  RefreshCw,
  SquareIcon,
  TrashIcon,
  X,
} from "lucide-react";
import {
  type ComponentProps,
  createContext,
  type ReactNode,
  type SyntheticEvent,
  use,
  useEffect,
  useEffectEvent,
  useMemo,
  useRef,
  useState,
} from "react";

import type { MyUIMessage } from "@/app/api/chat/types";
import { cn } from "@repo/ui";
import { Presence } from "@repo/ui/presence";

import { Markdown } from "./markdown";
import { MessageMetadata } from "./message-metadata";

const Context = createContext<{
  open: boolean;
  setOpen: (open: boolean) => void;
  chat: UseChatHelpers<UIMessage>;
} | null>(null);

function useChatContext() {
  return use(Context)!.chat;
}

function Header() {
  const { setOpen, chat } = use(Context)!;

  return (
    <div className="sticky top-0 flex items-start gap-2">
      <div className="flex flex-1 items-center justify-between rounded-xl bg-secondary px-3 py-2 text-secondary-foreground">
        <p className="font-medium text-sm">Ask AI</p>
        <div className="flex items-center gap-1.5">
          <button
            className={cn(
              buttonVariants({
                color: "secondary",
                size: "icon-xs",
                className: "[&_svg]:size-3.5",
              }),
            )}
            onClick={() => chat.setMessages([])}
            type="button"
          >
            <TrashIcon />
          </button>
        </div>
      </div>
      <button
        aria-label="Close"
        className={cn(
          buttonVariants({
            size: "icon-sm",
            color: "secondary",
            className: "rounded-full",
          }),
        )}
        onClick={() => setOpen(false)}
        tabIndex={-1}
        type="button"
      >
        <X />
      </button>
    </div>
  );
}

function SearchAIActions() {
  const { messages, status, regenerate } = useChatContext();
  const isLoading = status === "streaming";

  return (
    <button
      className={cn(
        buttonVariants({
          color: "secondary",
          size: "icon-sm",
          className:
            "gap-1.5 rounded-t-md rounded-br-md rounded-bl-lg transition-opacity duration-200 [&_svg]:size-4",
        }),
        !isLoading &&
          messages?.length > 0 &&
          messages.at(-1)?.role === "assistant"
          ? "opacity-100"
          : "opacity-0",
      )}
      onClick={() => regenerate()}
      type="button"
    >
      <RefreshCw />
    </button>
  );
}

const StorageKeyInput = "__ai_search_input";
function SearchAIInput(props: ComponentProps<"form">) {
  const { status, sendMessage, stop } = useChatContext();
  const [input, setInput] = useState(
    () => localStorage.getItem(StorageKeyInput) ?? "",
  );
  const isLoading = status === "streaming" || status === "submitted";
  const onStart = async (e?: SyntheticEvent) => {
    e?.preventDefault();
    await sendMessage({ text: input });
    setInput("");
  };

  localStorage.setItem(StorageKeyInput, input);

  useEffect(() => {
    if (isLoading) {
      document.getElementById("nd-ai-input")?.focus();
    }
  }, [isLoading]);

  return (
    <form
      {...props}
      className={cn("flex items-start pe-2", props.className)}
      onSubmit={onStart}
    >
      <Input
        autoFocus
        className={cn("p-3", isLoading && "text-fd-muted-foreground")}
        disabled={status === "streaming" || status === "submitted"}
        onChange={(e) => {
          setInput(e.target.value);
        }}
        onKeyDown={(event) => {
          if (!event.shiftKey && event.key === "Enter") {
            onStart(event);
          }
        }}
        placeholder={isLoading ? "Generating..." : "Ask a question"}
        value={input}
      />
      {isLoading ? (
        <button
          className={cn(
            buttonVariants({
              color: "secondary",
              size: "icon-sm",
              className:
                "mt-2 rounded-b-md rounded-tl-md rounded-tr-lg transition-all [&_svg]:size-3.5",
            }),
          )}
          key="bn"
          onClick={stop}
          type="button"
        >
          <SquareIcon className="fill-fd-foreground" />
        </button>
      ) : (
        <button
          className={cn(
            buttonVariants({
              color: "secondary",
              size: "icon-sm",
              className:
                "mt-2 rounded-b-md rounded-tl-md rounded-tr-lg transition-all [&_svg]:size-4",
            }),
          )}
          disabled={input.length === 0}
          key="bn"
          type="submit"
        >
          <ArrowUpIcon />
        </button>
      )}
    </form>
  );
}

function List(props: Omit<ComponentProps<"div">, "dir">) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) {
      return;
    }
    function callback() {
      const container = containerRef.current;
      if (!container) {
        return;
      }

      const isNearBottom =
        container.scrollHeight - container.scrollTop - container.clientHeight <
        100;

      if (isNearBottom) {
        container.scrollTo({
          top: container.scrollHeight,
          behavior: "instant",
        });
      }
    }

    const observer = new ResizeObserver(callback);
    callback();

    const element = containerRef.current?.firstElementChild;

    if (element) {
      observer.observe(element);
    }

    return () => {
      observer.disconnect();
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
  const shared = cn("col-start-1 row-start-1", props.className);

  return (
    <div className="grid flex-1">
      <textarea
        id="nd-ai-input"
        {...props}
        className={cn(
          "resize-none bg-transparent placeholder:text-fd-muted-foreground focus-visible:outline-none",
          shared,
        )}
      />
      <div className={cn(shared, "invisible break-all")} ref={ref}>
        {`${props.value?.toString() ?? ""}\n`}
      </div>
    </div>
  );
}

const roleName: Record<string, string> = {
  user: "you",
  assistant: "assistant",
};

function Message({
  message,
  isInProgress,
  ...props
}: {
  message: MyUIMessage;
  isInProgress: boolean;
} & ComponentProps<"div">) {
  const parts = (message.parts ?? []) as MyUIMessage["parts"];

  return (
    <div {...props}>
      <p
        className={cn(
          "mb-1 font-medium text-fd-muted-foreground text-sm",
          message.role === "assistant" && "text-fd-primary",
        )}
      >
        {roleName[message.role] ?? "unknown"}
      </p>
      <div className="flex flex-col gap-2">
        <MessageMetadata inProgress={isInProgress} parts={parts} />
        {parts.map((part, idx) => {
          if (part.type !== "text") {
            return null;
          }
          return (
            <div
              className="prose text-sm"
              key={`${message.id}-text-${idx}`}
            >
              <Markdown text={part.text} />
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function AISearch({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const chat = useChat({
    id: "search",
    transport: new DefaultChatTransport({
      api: "/api/chat",
    }),
  });

  return (
    <Context value={useMemo(() => ({ chat, open, setOpen }), [chat, open])}>
      {children}
    </Context>
  );
}

export function AISearchTrigger() {
  const { open, setOpen } = use(Context)!;

  return (
    <button
      className={cn(
        buttonVariants({
          variant: "secondary",
        }),
        "fixed end-4 bottom-4 z-20 w-24 gap-3 rounded-2xl text-fd-muted-foreground shadow-lg transition-all",
        open && "translate-y-10 opacity-0",
      )}
      onClick={() => setOpen(true)}
      type="button"
    >
      <MessageCircleIcon className="size-4.5" />
      Ask AI
    </button>
  );
}

export function AISearchPanel() {
  const { open, setOpen } = use(Context)!;
  const chat = useChatContext();

  const onKeyPress = useEffectEvent((e: KeyboardEvent) => {
    if (e.key === "Escape" && open) {
      setOpen(false);
      e.preventDefault();
    }

    if (e.key === "/" && (e.metaKey || e.ctrlKey) && !open) {
      setOpen(true);
      e.preventDefault();
    }
  });

  useEffect(() => {
    window.addEventListener("keydown", onKeyPress);
    return () => window.removeEventListener("keydown", onKeyPress);
  }, []);

  return (
    <>
      <style>
        {`
        @keyframes ask-ai-open {
          from {
            width: 0px;
          }
          to {
            width: var(--ai-chat-width);
          }
        }
        @keyframes ask-ai-close {
          from {
            width: var(--ai-chat-width);
          }
          to {
            width: 0px;
          }
        }`}
      </style>
      <Presence present={open}>
        <button
          aria-label="Close AI search panel"
          className="fixed inset-0 z-30 bg-fd-overlay backdrop-blur-xs data-[state=closed]:animate-fd-fade-out data-[state=open]:animate-fd-fade-in lg:hidden"
          data-state={open ? "open" : "closed"}
          onClick={() => setOpen(false)}
          type="button"
        />
      </Presence>
      <Presence present={open}>
        <div
          className={cn(
            "z-30 overflow-hidden bg-fd-popover text-fd-popover-foreground",
            "max-lg:fixed max-lg:inset-x-2 max-lg:top-4 max-lg:rounded-2xl max-lg:border max-lg:shadow-xl",
            "fixed inset-y-2 z-30 flex flex-col rounded-2xl border bg-fd-popover text-fd-popover-foreground shadow-xl max-sm:inset-x-2 sm:end-2 sm:w-[460px]",
            open ? "animate-fd-dialog-in" : "animate-fd-dialog-out",
          )}
        >
          <div className="flex size-full flex-col p-2 xl:p-4">
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
                  .map((item, idx) => (
                    <Message
                      isInProgress={
                        chat.messages.length - 1 === idx &&
                        (chat.status === "streaming" ||
                          chat.status === "submitted")
                      }
                      key={item.id}
                      message={item}
                    />
                  ))}
              </div>
            </List>
            <div className="rounded-xl border bg-fd-card text-fd-card-foreground has-focus-visible:ring-2 has-focus-visible:ring-fd-ring">
              <SearchAIInput />
              <div className="flex items-center gap-1.5 p-2">
                <SearchAIActions />
              </div>
            </div>
          </div>
        </div>
      </Presence>
    </>
  );
}
