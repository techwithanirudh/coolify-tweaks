import { title } from "@/lib/layout.shared";
import { baseUrl, createMetadata } from "@/lib/metadata";
import { source } from "@/lib/source";
import { url } from "@/lib/url";

import "@/styles/globals.css";

import type { Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { Body } from "./layout.client";
import { Providers } from "./providers";

import "katex/dist/katex.css";

import { NextProvider } from "fumadocs-core/framework/next";
import { Banner } from "fumadocs-ui/components/banner";
import { TreeContextProvider } from "fumadocs-ui/contexts/tree";

const geist = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
});

const mono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata = createMetadata({
  title: {
    template: "%s | Coolify Tweaks",
    default: "Coolify Tweaks",
  },
  description:
    "Archived. Opinionated tweaks for older Coolify versions (pre-v4.3): better spacing, layout, and colors.",
  metadataBase: baseUrl,
  alternates: {
    types: {
      "application/rss+xml": [
        {
          title,
          url: url("/rss.xml"),
        },
      ],
    },
  },
});

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0A0A0A" },
    { media: "(prefers-color-scheme: light)", color: "#fff" },
  ],
};

export default function Layout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geist.variable} ${mono.variable}`}
      suppressHydrationWarning
    >
      <Body tree={source.getPageTree()}>
        <NextProvider>
          <TreeContextProvider tree={source.getPageTree()}>
            <Providers>
              <Banner variant="rainbow">
                <span className="truncate px-4">
                  <span className="sm:hidden">
                    Archived: only for older Coolify.
                  </span>
                  <span className="max-sm:hidden">
                    Coolify Tweaks is archived. Coolify v4.3+ has a redesigned
                    UI and built-in themes, so this is only for older versions.
                  </span>{" "}
                  <a
                    href="/docs/style#deprecated"
                    className="font-medium underline underline-offset-4"
                  >
                    Read more
                  </a>
                </span>
              </Banner>
              {children}
            </Providers>
          </TreeContextProvider>
        </NextProvider>
      </Body>
    </html>
  );
}
