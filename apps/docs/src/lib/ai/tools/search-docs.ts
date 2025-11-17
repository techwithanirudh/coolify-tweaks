import { tool } from "ai";
import { initAdvancedSearch } from "fumadocs-core/search/server";
import { z } from "zod";

import { categories } from "@/lib/constants";
import { source } from "@/lib/source";

const server = initAdvancedSearch({
  language: "english",
  indexes: source.getPages().map((page) => ({
    id: page.url,
    title: page.data.title,
    description: page.data.description,
    structuredData: page.data.structuredData,
    url: page.url,
    tag: page.slugs[0],
  })),
});

const Tag = z.union([
  z.literal("all"),
  ...Object.keys(categories).map((key) => z.literal(key)),
]);

export const searchDocs = tool({
  description: "Search the documentation using the internal search server.",
  inputSchema: z.object({
    query: z.string().describe("The query to search for."),
    tag: Tag.default("all").describe(
      "Optional tag filter, e.g. a top-level section.",
    ),
    locale: z.string().optional().describe("Optional locale for i18n setups."),
    limit: z
      .number()
      .int()
      .min(1)
      .max(50)
      .default(10)
      .describe("Maximum number of results to return (default: 10, max: 50)."),
  }),
  execute: async ({ query, tag: tagParam, locale, limit }) => {
    const tag = tagParam === "all" ? undefined : tagParam;
    const results = await server.search(query, {
      tag,
      locale,
    });

    return {
      success: true,
      data: results.slice(0, limit),
      total: results.length,
    };
  },
});
