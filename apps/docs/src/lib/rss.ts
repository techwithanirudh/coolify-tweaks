import { Feed } from "feed";

import { title } from "@/lib/layout.shared";
import { source } from "@/lib/source";
import { url } from "./url";

export async function getRSS() {
  const feed = new Feed({
    title,
    id: url("/rss.xml"),
    link: url("/rss.xml"),
    language: "en",
    image: url("/banner.png"),
    favicon: url("/icon.png"),
    copyright: `All rights reserved ${new Date().getFullYear()}, ${title}`,
  });

  const pages = await Promise.all(
    source.getPages().map(async (page) => {
      const { lastModified } = await page.data.load();
      return {
        page,
        lastModified,
      };
    }),
  );

  for (const { page, lastModified } of pages) {
    feed.addItem({
      id: page.url,
      title: page.data.title,
      description: page.data.description,
      link: url(page.url),
      date: lastModified ? new Date(lastModified) : new Date(),
      author: [
        {
          name: title,
        },
      ],
    });
  }

  return feed.rss2();
}
