"use client";

import Link from "next/link";
import { Check, Copy, Github, MailIcon } from "lucide-react";

import { Button } from "@repo/ui/button";
import { useCopyToClipboard } from "@repo/ui/hooks/use-copy-to-clipboard";

import { owner, repo } from "@/lib/github";
import { Love } from "./love";

export function Footer() {
  const { isCopied, copyToClipboard } = useCopyToClipboard({ timeout: 2000 });
  const email = "hello@techwithanirudh.com";

  return (
    <div className="flex w-full flex-col items-start justify-start pt-10">
      <div className="flex h-auto flex-col items-stretch justify-between self-stretch pt-0 pr-0 pb-8 md:flex-row">
        <div className="flex h-auto flex-col items-start justify-start gap-4 p-4 md:p-8">
          <div className="flex items-center justify-start gap-3 self-stretch">
            <div className="text-center text-xl leading-4 font-semibold">
              Coolify Tweaks
            </div>
          </div>
          <div className="text-muted-foreground text-sm">
            A style layer for refined spacing, typography, and colors
          </div>
          <Button variant="ghost" size="icon-sm" asChild>
            <a
              href={`https://github.com/${owner}/${repo}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Github className="size-5" />
            </a>
          </Button>
        </div>

        <div className="flex flex-col flex-wrap items-start justify-start gap-6 self-stretch p-4 sm:flex-row sm:justify-between md:gap-8 md:p-8">
          <div className="flex min-w-[120px] flex-1 flex-col items-start justify-start gap-3">
            <div className="text-muted-foreground text-sm">Resources</div>
            <div className="flex flex-col items-start justify-start gap-2">
              <a
                className="cursor-pointer text-sm transition-opacity hover:opacity-80"
                href={`https://github.com/${owner}/${repo}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub Repository
              </a>
              <Link
                className="cursor-pointer text-sm transition-opacity hover:opacity-80"
                href="/docs/style"
              >
                Documentation
              </Link>
              <Link
                className="cursor-pointer text-sm transition-opacity hover:opacity-80"
                href="/docs/style/screenshots"
              >
                Screenshots
              </Link>
            </div>
          </div>

          <div className="flex min-w-[120px] flex-1 flex-col items-start justify-start gap-3">
            <div className="text-muted-foreground text-sm">Contact</div>
            <div className="flex flex-col items-start justify-start gap-2">
              <div className="group/contact flex items-center gap-2">
                <button
                  onClick={() => copyToClipboard(email)}
                  className="bg-primary/80 hover:bg-primary relative flex size-4 cursor-pointer items-center justify-center rounded transition-colors"
                  aria-label="Copy email"
                >
                  {isCopied ? (
                    <Check className="text-primary-foreground size-2.5" />
                  ) : (
                    <>
                      <MailIcon className="text-primary-foreground absolute size-2.5 transition-all duration-300 group-hover/contact:scale-0 group-hover/contact:opacity-0" />
                      <Copy className="text-primary-foreground size-2.5 scale-0 opacity-0 transition-all duration-300 group-hover/contact:scale-100 group-hover/contact:opacity-100" />
                    </>
                  )}
                </button>
                <div
                  className="cursor-pointer text-sm transition-opacity group-hover/contact:opacity-80"
                  onClick={() => copyToClipboard(email)}
                >
                  {email}
                </div>
              </div>
              <div className="text-muted-foreground text-sm">
                Have questions or feedback? Feel free to reach out or{" "}
                <a
                  href={`https://github.com/${owner}/${repo}/issues`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary/80 hover:text-primary underline underline-offset-4"
                >
                  open an issue on GitHub
                </a>
                .
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-dashed border-border flex flex-col items-center justify-between gap-4 self-stretch border-t px-4 py-4 sm:flex-row md:px-8">
        <div className="flex flex-col gap-1">
          <div className="text-muted-foreground text-sm">
            © 2025 Coolify Tweaks. All rights reserved.
          </div>
          <div className="text-muted-foreground/70 text-xs">
            Coolify is trademark of coolLabs Technologies Bt. Coolify Tweaks is
            not affiliated with or endorsed by coolLabs.
          </div>
        </div>
        <div className="text-muted-foreground inline-flex items-center gap-1.5 text-sm">
          Made with <Love />
        </div>
      </div>
    </div>
  );
}
