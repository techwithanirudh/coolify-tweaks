import type { Metadata } from "next";

import type { Page } from "./source";
import { env } from "@/env";
import { title } from "@/lib/layout.shared";

export function createMetadata(override: Metadata): Metadata {
  return {
    ...override,
    openGraph: {
      title: override.title ?? undefined,
      description: override.description ?? undefined,
      url: "http://coolify-tweaks.techwithanirudh.com",
      images: "/banner.png",
      siteName: title,
      ...override.openGraph,
    },
    twitter: {
      card: "summary_large_image",
      creator: "@AnirudhWith",
      title: override.title ?? undefined,
      description: override.description ?? undefined,
      images: "/banner.png",
      ...override.twitter,
    },
    keywords: [
      "coolify",
      "tweaks",
      "style",
      "theme",
      "css",
      "userstyle",
      "usercss",
      "userstyles",
      "coolify tweaks",
      "coolify tweaks style",
      "coolify tweaks theme",
      "coolify tweaks css",
      "coolify tweaks userstyle",
      "coolify tweaks usercss",
      "coolify v4",
      "coolify v5",
    ],
  };
}

export function getPageImage(page: Page) {
  const segments = [...page.slugs, "image.webp"];
  return {
    segments,
    url: `/og/${segments.join("/")}`,
  };
}

export const baseUrl =
  env.NODE_ENV === "development" || !env.NEXT_PUBLIC_DOCS_URL
    ? new URL("http://localhost:3000")
    : new URL(env.NEXT_PUBLIC_DOCS_URL);
