import type { UIMessageStreamWriter } from "ai";
import { tool } from "ai";
import { initAdvancedSearch } from "fumadocs-core/search/server";
import { z } from "zod";

import { categories } from "@/lib/constants";
import { source } from "@/lib/source";

const server = initAdvancedSearch({
  language: "english",
  indexes: async () => {
    const pages = source.getPages();
    const indexes = await Promise.all(
      pages.map(async (page) => {
        const { structuredData } = await page.data.load();
        return {
          id: page.url,
          title: page.data.title,
          description: page.data.description,
          structuredData,
          url: page.url,
          tag: page.path.split("/")[0],
        };
      }),
    );
    return indexes;
  },
});

const Tag = z.union([
  z.literal("all"),
  ...Object.keys(categories).map((key) => z.literal(key)),
]);

export const createSearchDocsTool = (writer: UIMessageStreamWriter) =>
  tool({
    description: "Search the documentation using the internal search server.",
    inputSchema: z.object({
      query: z.string().describe("The query to search for."),
      tag: Tag.default("all").describe(
        "Optional tag filter, e.g. a top-level section.",
      ),
      locale: z
        .string()
        .optional()
        .describe("Optional locale for i18n setups."),
      limit: z
        .number()
        .int()
        .min(1)
        .max(50)
        .default(10)
        .describe(
          "Maximum number of results to return (default: 10, max: 50).",
        ),
    }),
    execute: async ({ query, tag: tagParam, locale, limit }) => {
      const tag = tagParam === "all" ? undefined : tagParam;
      const results = await server.search(query, {
        tag,
        locale,
      });

      const seen = new Set<string>();
      const deduped = results.filter((result) => {
        if (!result.url || seen.has(result.url)) {
          return false;
        }
        seen.add(result.url);
        return true;
      });

      const trimmed = deduped.slice(0, limit).map((doc) => {
        const pageInfo = source.getPageByHref(doc.url);
        const page = pageInfo?.page;

        return {
          ...doc,
          pageTitle: page?.data.title,
          pageDescription: page?.data.description,
        };
      });

      trimmed.forEach((doc, index) => {
        const title = doc.pageTitle ?? doc.url;
        writer.write({
          type: "source-url",
          sourceId: `search-doc-${index}-${doc.url}`,
          url: doc.url,
          title,
        });
      });

      if (trimmed.length === 0) {
        return `No documentation found for query "${query}".`;
      }

      const summary = trimmed
        .map((doc, index) => {
          const title = doc.pageTitle ?? doc.url;
          const description = doc.pageDescription
            ? ` — ${doc.pageDescription}`
            : "";
          return `${index + 1}. ${title} (${doc.url})${description}`;
        })
        .join("\n");

      return `Found ${trimmed.length} documentation pages for "${query}":\n${summary}`;
    },
  });
