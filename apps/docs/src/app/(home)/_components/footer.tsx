"use client";

import { Github, MailIcon, Copy, Check } from "lucide-react";
import { Button } from "@repo/ui/button";
import { owner, repo } from "@/lib/github";
import Link from "next/link";
import { Love } from "./love";
import { useCopyToClipboard } from "@repo/ui/hooks/use-copy-to-clipboard";

export function Footer() {
  const { isCopied, copyToClipboard } = useCopyToClipboard({ timeout: 2000 });
  const email = "hello@techwithanirudh.com";

  return (
    <div className="w-full pt-10 flex flex-col justify-start items-start">
      <div className="self-stretch h-auto flex flex-col md:flex-row justify-between items-stretch pr-0 pb-8 pt-0">
        <div className="h-auto p-4 md:p-8 flex flex-col justify-start items-start gap-4">
          <div className="self-stretch flex justify-start items-center gap-3">
            <div className="text-center text-xl font-semibold leading-4">Coolify Tweaks</div>
          </div>
          <div className="text-muted-foreground text-sm">
            A style layer for refined spacing, typography, and colors
          </div>
          <Button
            variant="ghost"
            size="icon-sm"
            asChild
          >
            <a
              href={`https://github.com/${owner}/${repo}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Github className="size-5" />
            </a>
          </Button>
        </div>

        <div className="self-stretch p-4 md:p-8 flex flex-col sm:flex-row flex-wrap justify-start sm:justify-between items-start gap-6 md:gap-8">
          <div className="flex flex-col justify-start items-start gap-3 flex-1 min-w-[120px]">
            <div className="text-muted-foreground text-sm">Resources</div>
            <div className="flex flex-col justify-start items-start gap-2">
              <a className="text-sm cursor-pointer hover:opacity-80 transition-opacity" href={`https://github.com/${owner}/${repo}`} target="_blank" rel="noopener noreferrer">
                GitHub Repository
              </a>
              <Link className="text-sm cursor-pointer hover:opacity-80 transition-opacity" href="/docs/style">
                Documentation
              </Link>
              <Link className="text-sm cursor-pointer hover:opacity-80 transition-opacity" href="/docs/style/screenshots">
                Screenshots
              </Link>
            </div>
          </div>

          <div className="flex flex-col justify-start items-start gap-3 flex-1 min-w-[120px]">
            <div className="text-muted-foreground text-sm">Contact</div>
            <div className="flex flex-col justify-start items-start gap-2">
              <div className="flex items-center gap-2 group/contact">
                <button
                  onClick={() => copyToClipboard(email)}
                  className="size-4 bg-primary/80 rounded flex items-center justify-center cursor-pointer hover:bg-primary transition-colors relative"
                  aria-label="Copy email"
                >
                  {isCopied ? (
                    <Check className="size-2.5 text-primary-foreground" />
                  ) : (
                    <>
                      <MailIcon className="size-2.5 text-primary-foreground group-hover/contact:opacity-0 group-hover/contact:scale-0 transition-all duration-300 absolute" />
                      <Copy className="size-2.5 text-primary-foreground opacity-0 scale-0 group-hover/contact:opacity-100 group-hover/contact:scale-100 transition-all duration-300" />
                    </>
                  )}
                </button>
                <div className="text-sm cursor-pointer group-hover/contact:opacity-80 transition-opacity" onClick={() => copyToClipboard(email)}>
                  {email}
                </div>
              </div>
              <div className="text-sm text-muted-foreground">
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

      <div className="self-stretch flex flex-col sm:flex-row justify-between items-center py-4 px-4 md:px-8 gap-4 bg-dashed  border-t border-border">
        <div className="text-sm text-muted-foreground">
          © 2025 Coolify Tweaks. All rights reserved.
        </div>
        <div className="text-sm text-muted-foreground inline-flex items-center gap-1.5">
          Made with <Love />
        </div>
      </div>
    </div>
  );
}
